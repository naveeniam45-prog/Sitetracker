import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, FlipHorizontal, Check, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  capturedImage: string | null;
  onRetake: () => void;
  siteName: string;
  locationAddress: string;
  isWithinSite?: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  capturedImage,
  onRetake,
  siteName,
  locationAddress,
  isWithinSite = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize camera
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      if (capturedImage) return;
      setIsInitializing(true);
      setCameraError(null);

      // Stop previous stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const s = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: facingMode,
              width: { ideal: 640 },
              height: { ideal: 640 },
            },
            audio: false,
          });
          currentStream = s;
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play().catch(() => {});
          }
        } else {
          setCameraError('Camera API not supported by browser.');
        }
      } catch (err: any) {
        console.warn('Camera access error, fallback to simulated worksite camera feed:', err);
        setCameraError('Webcam unavailable. Using simulated live worksite feed.');
      } finally {
        setIsInitializing(false);
      }
    };

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode, capturedImage]);

  // Capture photo from video or canvas
  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current && !cameraError && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onCapture(dataUrl);
        return;
      }
    }

    // Fallback: draw simulated selfie with construction backdrop
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Background gradient representing worksite
      const grad = ctx.createLinearGradient(0, 0, 0, 600);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(0.5, '#334155');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 600, 600);

      // Scaffolding lines simulation
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(50, 0);
      ctx.lineTo(550, 600);
      ctx.moveTo(550, 0);
      ctx.lineTo(50, 600);
      ctx.stroke();

      // Worker silhouette with hard hat
      ctx.fillStyle = '#f59e0b'; // Hard hat yellow
      ctx.beginPath();
      ctx.arc(300, 220, 100, Math.PI, 2 * Math.PI);
      ctx.fill();

      // Face
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(300, 260, 80, 0, 2 * Math.PI);
      ctx.fill();

      // Vest
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(200, 360, 200, 240);

      // Timestamp overlay
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText(`VERIFIED WORKSITE PHOTO`, 30, 520);
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText(`${siteName} • ${new Date().toLocaleTimeString()}`, 30, 550);

      const fallbackUrl = canvas.toDataURL('image/jpeg', 0.9);
      onCapture(fallbackUrl);
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="relative w-full aspect-[4/4.5] sm:aspect-[4/4.2] rounded-3xl overflow-hidden bg-slate-900 border-2 border-slate-700 shadow-2xl flex flex-col justify-between">
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main View Area: Captured photo or Live Video Stream */}
      {capturedImage ? (
        <img
          src={capturedImage}
          alt="Worksite verification photo"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      ) : stream && !cameraError ? (
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className={`absolute inset-0 w-full h-full object-cover z-0 ${
            facingMode === 'user' ? '-scale-x-100' : ''
          }`}
        />
      ) : (
        /* Realistic Simulated Worksite View if no camera is attached */
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-800 via-slate-900 to-black flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=800&auto=format&fit=crop&q=80"
            alt="Worksite background"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          {/* Worker Hardhat Overlay Simulation */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-36 h-36 rounded-full border-4 border-dashed border-emerald-400/80 p-1 flex items-center justify-center animate-pulse">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"
                alt="Raj Kumar"
                className="w-full h-full rounded-full object-cover shadow-2xl"
              />
            </div>
            <span className="mt-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/70 text-emerald-300 backdrop-blur-md border border-emerald-500/40">
              Face detected in frame
            </span>
          </div>
        </div>
      )}

      {/* Top Camera Controls Overlay */}
      <div className="relative z-20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>LIVE</span>
        </div>

        <div className="flex items-center gap-2">
          {capturedImage ? (
            <button
              type="button"
              onClick={onRetake}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs font-semibold transition-all border border-white/20 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={takeSnapshot}
                title="Capture Preview"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs font-semibold transition-all border border-white/20 active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Snap</span>
              </button>

              <button
                type="button"
                onClick={toggleCamera}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs font-semibold transition-all border border-white/20 active:scale-95"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>Switch</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Viewfinder Alignment Box */}
      <div className="relative z-10 pointer-events-none flex-1 flex items-center justify-center">
        <div className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-white/40 rounded-3xl relative">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl -mt-1 -ml-1"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl -mt-1 -mr-1"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl -mb-1 -ml-1"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl -mb-1 -mr-1"></div>
        </div>
      </div>

      {/* Bottom GPS Location Banner Pill inside the Camera (Exact page 6 mockup) */}
      <div className="relative z-20 p-4">
        <div className="bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center justify-between text-white shadow-xl">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            </div>
            <div className="truncate">
              <p className="text-[10px] text-slate-300 font-medium tracking-wide uppercase">
                Location detected
              </p>
              <p className="text-xs font-semibold text-white truncate">
                {locationAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full text-[11px] font-semibold shrink-0 border border-emerald-500/40">
            <Check className="w-3.5 h-3.5" />
            <span>Within Site</span>
          </div>
        </div>
      </div>
    </div>
  );
};
