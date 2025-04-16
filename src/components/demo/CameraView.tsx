
import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const CameraView = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        toast.success('Camera started successfully');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access your camera. Please check your permissions.');
      toast.error('Failed to access camera');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      toast.info('Camera stopped');
    }
  };

  const toggleCamera = () => {
    if (isStreaming) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  useEffect(() => {
    return () => {
      if (isStreaming) {
        stopCamera();
      }
    };
  }, [isStreaming]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <Card className="w-full overflow-hidden bg-slate-900 relative">
        <div className="relative aspect-video w-full">
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white p-4 text-center">
              <div>
                <CameraOff className="mx-auto h-12 w-12 mb-2 text-slate-400" />
                <p className="mb-4">{error}</p>
                <Button onClick={startCamera} variant="secondary">
                  Try Again
                </Button>
              </div>
            </div>
          )}
          
          {!isStreaming && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white">
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 mb-2 text-slate-400" />
                <p className="mb-4">Click the button below to start your camera</p>
              </div>
            </div>
          )}
          
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            className={`w-full h-full object-cover ${isStreaming ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        
        <div className="p-4 flex justify-center">
          <Button 
            onClick={toggleCamera}
            disabled={isLoading}
            className={`${isStreaming ? 'bg-red-500 hover:bg-red-600' : 'bg-blue hover:bg-blue-dark'} text-white`}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                {isStreaming ? (
                  <>
                    <CameraOff className="mr-2 h-4 w-4" />
                    Stop Camera
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CameraView;
