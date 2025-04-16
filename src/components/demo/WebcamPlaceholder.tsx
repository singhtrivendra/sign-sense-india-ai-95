
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Camera, Hand, Play, Video, Pause } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { initializeHandGestureModel, recognizeHandGesture, captureVideoFrame } from "@/utils/handGestureRecognition";

export default function WebcamPlaceholder() {
  const [status, setStatus] = useState<"initial" | "loading" | "ready" | "active" | "error">("initial");
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  
  const { toast } = useToast();

  // Clean up function to handle component unmount
  useEffect(() => {
    return () => {
      // Stop media stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Clear any running intervals
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  const handleStart = async () => {
    setStatus("loading");
    
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      setStatus("ready");
      toast({
        title: "Camera access granted",
        description: "The webcam is now ready to use for sign detection.",
      });
      
      // Start loading the model
      setIsModelLoading(true);
      const modelInitialized = await initializeHandGestureModel();
      setIsModelLoading(false);
      
      if (modelInitialized) {
        setIsModelReady(true);
        toast({
          title: "Sign recognition model loaded",
          description: "The model is ready to detect hand gestures.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Model initialization failed",
          description: "Could not load the sign recognition model. Please try again.",
        });
      }
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setStatus("error");
      toast({
        variant: "destructive",
        title: "Camera access denied",
        description: "Please allow camera access to use the sign language detection feature.",
      });
    }
  };

  const handleActivate = () => {
    if (!isModelReady) {
      toast({
        variant: "destructive",
        title: "Model not ready",
        description: "Please wait for the sign recognition model to load.",
      });
      return;
    }
    
    setStatus("active");
    setIsPaused(false);
    
    // Start sign detection at regular intervals
    detectionIntervalRef.current = window.setInterval(async () => {
      if (videoRef.current && !isPaused) {
        const imageData = captureVideoFrame(videoRef.current);
        
        if (imageData) {
          const recognizedSign = await recognizeHandGesture(imageData);
          
          if (recognizedSign && recognizedSign !== detectedSign) {
            setDetectedSign(recognizedSign);
            
            toast({
              title: "Sign Detected",
              description: `Detected sign: "${recognizedSign}"`,
            });
          }
        }
      }
    }, 1000);
  };
  
  const togglePause = () => {
    setIsPaused(!isPaused);
    
    toast({
      title: isPaused ? "Detection resumed" : "Detection paused",
      description: isPaused ? "Sign detection is now active" : "Sign detection is paused",
    });
  };
  
  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    setStatus("ready");
    setDetectedSign(null);
    
    toast({
      title: "Detection stopped",
      description: "Sign language detection has been stopped.",
    });
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-black/5 border shadow-lg">
      <div className="aspect-video relative">
        {status === "initial" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-light/10 text-center p-8">
            <Video className="h-16 w-16 text-blue mb-4" />
            <h3 className="text-2xl font-medium mb-2">Sign Language Detection Demo</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Try our AI-powered sign language recognition system. Click the button below to start your camera.
            </p>
            <Button onClick={handleStart} className="rounded-full" size="lg">
              <Camera className="mr-2 h-5 w-5" />
              Start Camera
            </Button>
          </div>
        )}
        
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-light/10">
            <div className="h-12 w-12 rounded-full border-4 border-t-blue border-blue/20 animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Requesting camera access...</p>
          </div>
        )}
        
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 p-8">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Camera access denied</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser settings to use the sign language detection feature.
              </AlertDescription>
            </Alert>
            <Button onClick={handleStart} className="mt-6" variant="outline">
              Try Again
            </Button>
          </div>
        )}
        
        {(status === "ready" || status === "active") && (
          <>
            <div className={`absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10 ${isPaused ? 'opacity-80' : 'opacity-30'}`}></div>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            ></video>
            
            {/* Hand tracking points visualization - would be replaced by actual model outputs */}
            {status === "active" && !isPaused && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    {/* Simplified hand tracking points visualization */}
                    <div className="h-40 w-40 border-2 border-dashed border-blue rounded-full animate-pulse opacity-50"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Detected sign overlay */}
        {detectedSign && status === "active" && (
          <div className="absolute bottom-4 left-4 right-4 z-30 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Hand className="h-5 w-5 mr-2 text-blue" />
                <span>Detected Sign:</span>
              </div>
              <span className="font-bold text-blue">{detectedSign}</span>
            </div>
          </div>
        )}
        
        {/* Model loading indicator */}
        {isModelLoading && (
          <div className="absolute top-4 right-4 z-30 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white flex items-center">
            <div className="h-4 w-4 rounded-full border-2 border-t-blue border-blue/20 animate-spin mr-2"></div>
            <span className="text-sm">Loading AI model...</span>
          </div>
        )}
      </div>
      
      {/* Controls */}
      {status === "ready" && (
        <div className="p-4 bg-white border-t">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Camera Ready</h4>
              <p className="text-sm text-muted-foreground">
                {isModelReady 
                  ? "Position your hands in frame and click Start" 
                  : "Waiting for AI model to load..."}
              </p>
            </div>
            <Button 
              onClick={handleActivate} 
              className="rounded-full" 
              size="lg"
              disabled={!isModelReady}
            >
              <Play className="mr-2 h-4 w-4" />
              Start Detection
            </Button>
          </div>
        </div>
      )}
      
      {status === "active" && (
        <div className="p-4 bg-white border-t">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-blue">Detection Active</h4>
              <p className="text-sm text-muted-foreground">Make signs in front of the camera</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={togglePause} variant="outline" className="rounded-full" size="sm">
                {isPaused ? (
                  <><Play className="h-4 w-4 mr-1" /> Resume</>
                ) : (
                  <><Pause className="h-4 w-4 mr-1" /> Pause</>
                )}
              </Button>
              <Button onClick={stopDetection} variant="destructive" className="rounded-full" size="sm">
                Stop
              </Button>
              {!isPaused && (
                <div className="flex items-center ml-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium">Live</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
