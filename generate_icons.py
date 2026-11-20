import os
import zlib
import struct
import math

def make_png(width, height, get_pixel):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # filter type 0 (None)
        for x in range(width):
            r, g, b, a = get_pixel(x, y, width, height)
            raw_data.extend([int(max(0, min(255, r))),
                             int(max(0, min(255, g))),
                             int(max(0, min(255, b))),
                             int(max(0, min(255, a)))])
    
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(bytes(raw_data), 9))
    png += chunk(b'IEND', b'')
    return png

def sdf_round_box(px, py, rx0, ry0, rx1, ry1, r):
    # Center and half dimensions
    cx = (rx0 + rx1) * 0.5
    cy = (ry0 + ry1) * 0.5
    hx = (rx1 - rx0) * 0.5
    hy = (ry1 - ry0) * 0.5
    
    dx = abs(px - cx) - (hx - r)
    dy = abs(py - cy) - (hy - r)
    
    outside_dist = math.sqrt(max(dx, 0.0)**2 + max(dy, 0.0)**2)
    inside_dist = min(max(dx, dy), 0.0)
    return outside_dist + inside_dist - r

def render_sitetrack_icon(size, is_foreground_only=False, is_adaptive=False):
    # Scale factors
    # For adaptive foreground, safe zone is 66% so scale down cluster
    scale = 0.42 if is_adaptive else 0.56
    
    w_cluster = scale
    h_cluster = scale * 1.08
    
    cx = 0.5
    cy = 0.5
    
    bar_w = w_cluster * 0.26
    gap = (w_cluster - 3 * bar_w) * 0.5
    radius = bar_w * 0.45
    
    # 3 bars definition in normalized coords:
    # Left bar
    lb_x0 = cx - w_cluster * 0.5
    lb_x1 = lb_x0 + bar_w
    lb_y0 = cy - h_cluster * 0.5 + h_cluster * 0.12
    lb_y1 = lb_y0 + h_cluster * 0.76
    
    # Center bar (tallest)
    cb_x0 = lb_x1 + gap
    cb_x1 = cb_x0 + bar_w
    cb_y0 = cy - h_cluster * 0.5
    cb_y1 = cb_y0 + h_cluster
    
    # Right bar
    rb_x0 = cb_x1 + gap
    rb_x1 = rb_x0 + bar_w
    rb_y0 = lb_y0
    rb_y1 = lb_y1
    
    bars = [
        (lb_x0, lb_y0, lb_x1, lb_y1),
        (cb_x0, cb_y0, cb_x1, cb_y1),
        (rb_x0, rb_y0, rb_x1, rb_y1),
    ]

    def get_pixel(x, y, W, H):
        u = (x + 0.5) / W
        v = (y + 0.5) / H
        
        # Subpixel supersampling 2x2 for smooth edges
        sub_samples = [
            (-0.25, -0.25), (0.25, -0.25),
            (-0.25, 0.25), (0.25, 0.25)
        ]
        
        total_fg_alpha = 0.0
        
        for sx, sy in sub_samples:
            su = (x + 0.5 + sx) / W
            sv = (y + 0.5 + sy) / H
            
            # Distance to closest bar
            min_d = 1000.0
            for rx0, ry0, rx1, ry1 in bars:
                d = sdf_round_box(su, sv, rx0, ry0, rx1, ry1, radius)
                if d < min_d:
                    min_d = d
            
            # Antialiasing threshold
            pixel_size = 1.0 / min(W, H)
            alpha = max(0.0, min(1.0, 0.5 - min_d / pixel_size))
            total_fg_alpha += alpha
            
        fg_alpha = total_fg_alpha / 4.0
        
        # Gradient on bars: #38BDF8 (top) to #2563EB (bottom)
        # top color: rgb(56, 189, 248)
        # bottom color: rgb(37, 99, 235)
        t = max(0.0, min(1.0, (v - (cy - h_cluster * 0.5)) / h_cluster))
        fg_r = 56 * (1.0 - t) + 37 * t
        fg_g = 189 * (1.0 - t) + 99 * t
        fg_b = 248 * (1.0 - t) + 235 * t
        
        if is_foreground_only:
            return (fg_r, fg_g, fg_b, fg_alpha * 255)
        
        # Background: sleek dark slate #0F172A to #1E293B
        # Center subtle glow
        dist_from_center = math.sqrt((u - 0.5)**2 + (v - 0.5)**2)
        glow = max(0.0, 1.0 - dist_from_center * 1.8)
        
        bg_r = 15 + glow * 15
        bg_g = 23 + glow * 18
        bg_b = 42 + glow * 25
        
        # Composite foreground over background
        out_r = fg_r * fg_alpha + bg_r * (1.0 - fg_alpha)
        out_g = fg_g * fg_alpha + bg_g * (1.0 - fg_alpha)
        out_b = fg_b * fg_alpha + bg_b * (1.0 - fg_alpha)
        
        return (out_r, out_g, out_b, 255)

    return make_png(size, size, get_pixel)

def main():
    print("Generating Sitetrack launcher icons and splash assets...")
    
    # 1. Standard Android launcher icons
    android_sizes = {
        'android/app/src/main/res/mipmap-mdpi/ic_launcher.png': 48,
        'android/app/src/main/res/mipmap-hdpi/ic_launcher.png': 72,
        'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png': 96,
        'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png': 144,
        'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png': 192,
    }
    
    for path, size in android_sizes.items():
        os.makedirs(os.path.dirname(path), exist_ok=True)
        data = render_sitetrack_icon(size, is_foreground_only=False, is_adaptive=False)
        with open(path, 'wb') as f:
            f.write(data)
        print(f"Generated {path} ({size}x{size})")

    # 2. Adaptive launcher foreground icons
    adaptive_sizes = {
        'android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png': 108,
        'android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png': 162,
        'android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png': 216,
        'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png': 324,
        'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png': 432,
    }
    
    for path, size in adaptive_sizes.items():
        os.makedirs(os.path.dirname(path), exist_ok=True)
        data = render_sitetrack_icon(size, is_foreground_only=True, is_adaptive=True)
        with open(path, 'wb') as f:
            f.write(data)
        print(f"Generated {path} ({size}x{size})")

    # 3. Splash Screen Launch Image (centered transparent 3-pillar logo)
    splash_paths = [
        'android/app/src/main/res/drawable/launch_image.png',
        'android/app/src/main/res/drawable-v21/launch_image.png'
    ]
    splash_data = render_sitetrack_icon(256, is_foreground_only=True, is_adaptive=False)
    for path in splash_paths:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'wb') as f:
            f.write(splash_data)
        print(f"Generated {path} (256x256)")

    # 4. Web icons & Favicons
    web_icons = {
        'web/favicon.png': 64,
        'web/icons/Icon-192.png': 192,
        'web/icons/Icon-maskable-192.png': 192,
        'web/icons/Icon-512.png': 512,
        'web/icons/Icon-maskable-512.png': 512,
    }
    for path, size in web_icons.items():
        if os.path.exists(os.path.dirname(path)):
            data = render_sitetrack_icon(size, is_foreground_only=False, is_adaptive=False)
            with open(path, 'wb') as f:
                f.write(data)
            print(f"Generated {path} ({size}x{size})")

    print("All icons successfully generated!")

if __name__ == '__main__':
    main()
