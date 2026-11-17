import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, FlipHorizontal, Check, MapPin, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  capturedImage: string | null;
  onRetake: () => void;
  siteName: string;
  locationAddress: string;
  isWithinSite?: boolean;
  isLocationOn?: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  capturedImage,
  onRetake,
  siteName,
  locationAddress,
  isWithinSite = true,
  isLocationOn = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Stop current active media stream tracks
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Request real camera access with robust fallbacks
  const startCamera = useCallback(async () => {
    if (capturedImage) return;
    setIsInitializing(true);
    setCameraError(null);

    // Stop existing stream if switching
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let s: MediaStream | null = null;
        try {
          s = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
        } catch (constraintErr) {
          console.warn('Ideal constraints failed, attempting basic video:', constraintErr);
          s = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        setStream(s);
        setCameraError(null);
      } else {
        setCameraError('Browser blocked camera access or camera API is unsupported.');
      }
    } catch (err: any) {
      console.warn('Camera access unavailable:', err);
      const msg = err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError'
        ? 'Camera permission was denied. Tap "Open Device Camera" below.'
        : 'Unable to access camera feed. Tap "Open Device Camera" below.';
      setCameraError(msg);
    } finally {
      setIsInitializing(false);
    }
  }, [facingMode, capturedImage, stream]);

  // Attach stream to video element whenever stream changes or video element mounts
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay failed, awaiting user interaction:', err);
      });
    }
  }, [stream]);

  // Start camera on mount or lens toggle
  useEffect(() => {
    startCamera();
    return () => {
      stopStream();
    };
  }, [facingMode]);

  // Native device camera file input fallback (works 100% on iOS Safari and Android Chrome)
  const handleOpenDeviceCamera = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onCapture(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Clean snapshot from live video or canvas
  const takeSnapshot = (e?: React.MouseEvent) => {
    e?.stopPropagation();

    if (videoRef.current && canvasRef.current && stream && !cameraError) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 640;
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

    // If stream is not active, trigger device camera directly
    handleOpenDeviceCamera();
  };

  const toggleCamera = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const showLocationPill = isWithinSite && isLocationOn;

  return (
    <div 
      onClick={() => {
        if (!stream || cameraError) {
          startCamera();
        }
      }}
      className="relative w-full aspect-[4/4.5] sm:aspect-[4/4.2] rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-700 shadow-2xl flex flex-col justify-between cursor-pointer select-none"
    >
      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden native camera capture input for 100% reliable mobile capture */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileCapture}
        className="hidden"
      />

      {/* Video Element (ALWAYS mounted in DOM so ref and srcObject bind seamlessly) */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-300 ${
          stream && !cameraError && !capturedImage ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${facingMode === 'user' ? '-scale-x-100' : ''}`}
      />

      {/* Captured Image View */}
      {capturedImage && (
        <img
          src={capturedImage}
          alt="Worksite captured photo"
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      )}

      {/* Clean Camera Standby / Permission View (When stream is inactive and no photo captured) */}
      {!stream && !capturedImage && (
        <div className="absolute inset-0 z-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 mb-3 shadow-inner">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-sm font-bold text-white mb-1">
            {cameraError ? 'Camera Permission Required' : 'Live Camera Viewfinder'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mb-4">
            {cameraError || 'Tap anywhere or click below to open your camera.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                startCamera();
              }}
              disabled={isInitializing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isInitializing ? 'Opening Camera...' : 'Open Live Camera'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenDeviceCamera}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>Use Device Camera</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Camera Controls Overlay */}
      <div className="relative z-20 p-4 flex items-center justify-between pointer-events-auto">
        {/* Top-Left: Show Location Pill ONLY when Location is On; otherwise NOTHING */}
        {showLocationPill ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold backdrop-blur-md shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Within Site</span>
          </div>
        ) : (
          <div />
        )}

        {/* Top-Right: Retake or Flip + Snap */}
        <div className="flex items-center gap-2">
          {capturedImage ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRetake();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs font-semibold transition-all border border-white/20 active:scale-95 shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={takeSnapshot}
                title="Capture Photo"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white backdrop-blur-md text-xs font-semibold transition-all shadow-md active:scale-95"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Snap</span>
              </button>

              <button
                type="button"
                onClick={toggleCamera}
                title="Switch Camera"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md text-xs font-semibold transition-all border border-white/15 active:scale-95 shadow-md"
              >
                <FlipHorizontal className="w-3.5 h-3.5" />
                <span>Flip</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Viewfinder Face Alignment Guide (Transparent Center) */}
      {!capturedImage && (
        <div className="relative z-10 pointer-events-none flex-1 flex items-center justify-center">
          <div className="w-52 h-52 sm:w-60 sm:h-60 border-2 border-white/30 rounded-3xl relative">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl -mt-1 -ml-1"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl -mt-1 -mr-1"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl -mb-1 -ml-1"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl -mb-1 -mr-1"></div>
          </div>
        </div>
      )}

      {/* Circular Camera Shutter Button Overlay */}
      {!capturedImage && (
        <div className="relative z-20 pb-2 flex justify-center items-center pointer-events-auto">
          <button
            type="button"
            onClick={takeSnapshot}
            className="w-14 h-14 rounded-full border-4 border-white/80 bg-white/20 hover:bg-white/40 active:scale-90 flex items-center justify-center transition-all shadow-2xl backdrop-blur-xs group"
            title="Take photo"
          >
            <div className="w-10 h-10 rounded-full bg-white group-hover:scale-95 transition-transform shadow-md"></div>
          </button>
        </div>
      )}

      {/* Bottom Worksite Location Banner (Clean, No Coordinates) */}
      <div className="relative z-20 p-4 pt-1 pointer-events-auto">
        <div className="bg-black/75 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center justify-between text-white shadow-xl">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
              showLocationPill ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
            }`}>
              <MapPin className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-[10px] text-slate-300 font-medium tracking-wide uppercase">
                {showLocationPill ? 'Location detected' : 'Location pending'}
              </p>
              <p className="text-xs font-semibold text-white truncate">
                {siteName} • {locationAddress}
              </p>
            </div>
          </div>

          {showLocationPill && (
            <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 border border-emerald-500/40">
              <Check className="w-3.5 h-3.5" />
              <span>Within Site</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
