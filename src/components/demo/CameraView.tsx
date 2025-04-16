
import React, { useRef, useState, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw, Hand, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { initializeHandGestureModel, recognizeHandGesture, captureVideoFrame } from '@/utils/handGestureRecognition';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CameraView = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [modelError, setModelError] = useState<string | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
        toast('Camera started successfully');
        
        // Start drawing the grid once camera is on
        startGridDrawing();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access your camera. Please check your permissions.');
      toast('Failed to access camera');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    // Stop detection if it's running
    stopDetection();
    
    // Stop grid drawing
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
      toast('Camera stopped');
    }
  };

  const toggleCamera = () => {
    if (isStreaming) {
      stopCamera();
    } else {
      startCamera();
    }
  };
  
  const drawGrid = () => {
    if (!canvasRef.current || !videoRef.current || !isStreaming) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Match canvas size to video
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    
    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    const cellWidth = canvas.width / 3;
    for (let x = 0; x <= canvas.width; x += cellWidth) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    const cellHeight = canvas.height / 3;
    for (let y = 0; y <= canvas.height; y += cellHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Draw hand position area (center grid cell)
    ctx.strokeStyle = 'rgba(0, 123, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.rect(cellWidth, cellHeight, cellWidth, cellHeight);
    ctx.stroke();
    
    // Add text instruction
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Position hand gesture here', canvas.width / 2, canvas.height - 20);
    
    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(drawGrid);
  };
  
  const startGridDrawing = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(drawGrid);
  };

  useEffect(() => {
    return () => {
      if (isStreaming) {
        stopCamera();
      }
      
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isStreaming]);

  const loadSignLanguageModel = async () => {
    if (isModelReady || isModelLoading) return;
    
    setIsModelLoading(true);
    setModelError(null);
    try {
      const modelInitialized = await initializeHandGestureModel();
      setIsModelReady(modelInitialized);
      if (modelInitialized) {
        toast('Sign language model loaded successfully');
      } else {
        setModelError('Failed to load sign language model. Please check your connection and try again.');
        toast('Failed to load sign language model');
      }
    } catch (err) {
      console.error('Error loading sign language model:', err);
      setModelError('Error initializing sign language detection model.');
      toast('Error initializing sign language detection');
    } finally {
      setIsModelLoading(false);
    }
  };

  const startDetection = () => {
    if (!isStreaming || !videoRef.current) {
      toast('Camera must be started before detection');
      return;
    }
    
    if (!isModelReady) {
      loadSignLanguageModel().then((success) => {
        if (success) {
          startDetectionProcess();
        }
      });
    } else {
      startDetectionProcess();
    }
  };

  const startDetectionProcess = () => {
    setIsDetecting(true);
    setDetectedSign(null);
    
    // Clear any existing interval
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    // Start detection loop
    detectionIntervalRef.current = window.setInterval(async () => {
      if (videoRef.current && isStreaming) {
        try {
          // Capture current video frame
          const imageData = captureVideoFrame(videoRef.current);
          
          if (imageData) {
            // Process the frame with the model
            const sign = await recognizeHandGesture(imageData);
            
            // If a sign is detected and it's different from the last one
            if (sign && sign !== detectedSign) {
              setDetectedSign(sign);
              toast(`Detected sign: "${sign}"`);
            }
          }
        } catch (error) {
          console.error('Error in sign detection:', error);
        }
      }
    }, 1000); // Check every second
    
    toast('Sign detection started');
  };

  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    setIsDetecting(false);
    setDetectedSign(null);
    if (isDetecting) {
      toast('Sign detection stopped');
    }
  };

  useEffect(() => {
    // Automatically load the model when component mounts
    if (!isModelReady && !isModelLoading) {
      loadSignLanguageModel();
    }
    
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <Card className="w-full overflow-hidden bg-slate-900 relative">
        <div className="relative aspect-video w-full">
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white p-4 text-center z-10">
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
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800 text-white z-10">
              <div className="text-center">
                <Camera className="mx-auto h-12 w-12 mb-2 text-slate-400" />
                <p className="mb-4">Click the button below to start your camera</p>
              </div>
            </div>
          )}
          
          {isStreaming && detectedSign && isDetecting && (
            <div className="absolute top-4 left-4 right-4 z-10 animate-fade-in">
              <Alert className="bg-blue-dark/80 text-white border-blue-light">
                <Hand className="h-4 w-4" />
                <AlertTitle>Sign Detected</AlertTitle>
                <AlertDescription>
                  Recognized: <span className="font-bold">{detectedSign}</span>
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {isModelLoading && (
            <div className="absolute bottom-4 left-4 z-10">
              <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                Loading sign language model...
              </div>
            </div>
          )}
          
          {isDetecting && !detectedSign && isModelReady && (
            <div className="absolute bottom-4 right-4 z-10">
              <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <div className="w-2 h-2 bg-blue rounded-full mr-2 animate-pulse"></div>
                Waiting for signs...
              </div>
            </div>
          )}
          
          {modelError && (
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-red-500/80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {modelError}
              </div>
            </div>
          )}
          
          <video 
            ref={videoRef}
            autoPlay 
            playsInline
            className={`w-full h-full object-cover ${isStreaming ? 'opacity-100' : 'opacity-0'}`}
            style={{ transform: "scaleX(-1)" }} // Mirror the camera
          />
          
          <canvas 
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ transform: "scaleX(-1)" }} // Mirror the grid to match video
          />
        </div>
        
        <div className="p-4 flex justify-between">
          <Button 
            onClick={toggleCamera}
            disabled={isLoading}
            variant={isStreaming ? "destructive" : "default"}
            className={`${isStreaming ? '' : 'bg-blue hover:bg-blue-dark'} text-white`}
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

          {isStreaming && (
            <Button
              onClick={isDetecting ? stopDetection : startDetection}
              disabled={isLoading || isModelLoading}
              variant={isDetecting ? "outline" : "default"}
              className={isDetecting ? "border-blue text-blue hover:bg-blue/10" : "bg-green-600 hover:bg-green-700 text-white"}
            >
              {isModelLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Loading Model...
                </>
              ) : (
                <>
                  <Hand className="mr-2 h-4 w-4" />
                  {isDetecting ? 'Stop Detection' : 'Start Detection'}
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CameraView;
