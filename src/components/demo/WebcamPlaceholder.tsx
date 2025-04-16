import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Camera, Hand, Play, Video, Pause, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { initializeHandGestureModel, recognizeHandGesture, captureVideoFrame, debugCameraAccess } from "@/utils/handGestureRecognition";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function WebcamPlaceholder() {
  const [status, setStatus] = useState<"initial" | "loading" | "ready" | "active" | "error">("initial");
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [cameraAttempts, setCameraAttempts] = useState(0);
  const [attemptingPlay, setAttemptingPlay] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    debugCameraAccess().then(result => {
      console.log("Camera debug result:", result);
      if (result.devices) {
        setAvailableCameras(result.devices);
      }
    });
    
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, []);

  const loadAIModel = async () => {
    try {
      setIsModelLoading(true);
      const modelInitialized = await initializeHandGestureModel();
      
      if (modelInitialized) {
        setIsModelReady(true);
        toast({
          title: "Demo mode activated",
          description: "Using simulated sign detection for demonstration purposes.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Model initialization failed",
          description: "Using fallback demo mode for sign detection.",
        });
      }
      
      setIsModelReady(true);
    } catch (error) {
      console.error("Error in loadAIModel:", error);
    } finally {
      setIsModelLoading(false);
    }
  };

  const handleStart = async () => {
    setStatus("loading");
    setCameraError(null);
    setCameraAttempts(prev => prev + 1);
    
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      let constraints;
      if (cameraAttempts > 2) {
        constraints = { video: true, audio: false };
        console.log("Using basic video constraints");
      } else if (cameraAttempts > 1) {
        constraints = {
          audio: false,
          video: {
            facingMode: 'user',
            width: { ideal: 320 },
            height: { ideal: 240 }
          }
        };
        console.log("Using lower resolution constraints");
      } else {
        constraints = {
          audio: false,
          video: {
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          }
        };
        console.log("Using standard constraints");
      }
      
      console.log("Requesting camera with constraints:", constraints);
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log("Camera stream obtained successfully:", stream);
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          videoRef.current.autoplay = true;
          videoRef.current.muted = true;
          videoRef.current.playsInline = true;
          
          videoRef.current.onloadedmetadata = async () => {
            console.log("Video metadata loaded");
            if (videoRef.current) {
              try {
                setAttemptingPlay(true);
                await videoRef.current.play();
                setAttemptingPlay(false);
                console.log("Camera video stream started successfully");
                setStatus("ready");
                toast({
                  title: "Camera access granted",
                  description: "The webcam is now ready to use for sign detection.",
                });
              } catch (playError) {
                setAttemptingPlay(false);
                console.error("Error playing video:", playError);
                setCameraError(`Error playing video: ${playError instanceof Error ? playError.message : 'Unknown error'}`);
                toast({
                  title: "Camera needs manual activation",
                  description: "Please click the video area if camera doesn't start automatically.",
                  variant: "destructive"
                });
              }
            }
          };
          
          videoRef.current.onerror = (event) => {
            console.error("Video element error occurred", event);
            setCameraError(`Video error: ${event instanceof Event ? 'Unknown error' : event}`);
            setStatus("error");
            toast({
              variant: "destructive",
              title: "Camera error",
              description: "There was a problem accessing your camera.",
            });
          };
        } else {
          throw new Error("Video reference is not available");
        }
      } catch (streamError) {
        console.error("Error getting camera stream:", streamError);
        throw streamError;
      }
      
      await loadAIModel();
    } catch (error) {
      console.error('Error accessing camera:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown camera error';
      setCameraError(errorMessage);
      setStatus("error");
      
      const errorStr = String(error).toLowerCase();
      let errorDescription = "Please allow camera access to use the sign language detection feature.";
      
      if (errorStr.includes("denied") || errorStr.includes("permission")) {
        errorDescription = "Camera permission was denied. Please allow camera access in your browser settings.";
      } else if (errorStr.includes("not found") || errorStr.includes("notfound")) {
        errorDescription = "No camera was found on your device. Please ensure a camera is connected.";
      } else if (errorStr.includes("in use") || errorStr.includes("inuse")) {
        errorDescription = "Your camera is being used by another application. Please close other apps that might be using the camera.";
      } else if (errorStr.includes("constraint") || errorStr.includes("failed")) {
        errorDescription = "Your camera doesn't support the requested resolution. Please try again with different settings.";
      }
      
      toast({
        variant: "destructive",
        title: "Camera access problem",
        description: errorDescription,
      });
    }
  };

  const handleActivate = () => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      toast({
        variant: "destructive",
        title: "Camera not ready",
        description: "Please make sure camera is initialized before starting detection.",
      });
      return;
    }
    
    setStatus("active");
    setIsPaused(false);
    
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    detectionIntervalRef.current = window.setInterval(async () => {
      if (videoRef.current && !isPaused && videoRef.current.readyState >= 2) {
        try {
          const imageData = captureVideoFrame(videoRef.current);
          
          if (imageData) {
            const recognizedSign = await recognizeHandGesture(imageData);
            
            if (recognizedSign && recognizedSign !== detectedSign) {
              setDetectedSign(recognizedSign);
              
              toast({
                title: "Sign Detected",
                description: `Detected sign: "${recognizedSign}" (demo mode)`,
              });
              
              const audio = new Audio();
              audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBhxQo%2BTxtng0DwhLiuD43JdaKw8QWaf48Linux0NEcX2x4uShKRhWc6Hf4rp8RiAdU6fo98qtZCoYQp%2Fx%2BeS0gkAQMID27%2BO2gk0hK3n58%2BO2j1MoL3f89%2BO8klAoKHP%2B%2FfLLolctHGn%2F%2FvTarGYxGV3%2F%2F%2FLmsngxFVT%2F%2F%2FnntHomD07%2F%2F%2F7vuHUkC0P%2B%2F%2F%2F5wX4jBjr8%2Fv%2F%2B%2BcaGIgRB%2FP%2F%2F%2F%2F";
              audio.volume = 0.2;
              audio.play().catch(err => console.log("Audio feedback not supported"));
            }
          }
        } catch (error) {
          console.error('Error during sign detection:', error);
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
    <>
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
              <p className="mt-4 text-muted-foreground">
                {attemptingPlay ? "Starting camera stream..." : "Requesting camera access..."}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {cameraAttempts > 1 ? 
                  "Trying with different camera settings..." :
                  "If this takes too long, check your browser permissions"
                }
              </p>
              <Button 
                onClick={() => setShowTroubleshooting(true)} 
                variant="outline" 
                size="sm" 
                className="mt-6"
              >
                Camera Troubleshooting
              </Button>
            </div>
          )}
          
          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/5 p-8">
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Camera access issue</AlertTitle>
                <AlertDescription>
                  {cameraError || "Please allow camera access in your browser settings to use the sign language detection feature."}
                </AlertDescription>
              </Alert>
              <div className="flex gap-2 mt-6">
                <Button onClick={handleStart} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button onClick={() => setShowTroubleshooting(true)} variant="secondary">
                  Camera Troubleshooting
                </Button>
              </div>
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
                autoPlay
                style={{ transform: "scaleX(-1)" }}
                onClick={() => {
                  if (videoRef.current) {
                    console.log("Manual play attempt after click");
                    videoRef.current.play().catch(e => 
                      console.log("Play attempt on click failed:", e)
                    );
                  }
                }}
              ></video>
              
              {/* Enhanced hand tracking visualization */}
            </>
          )}
          
          {detectedSign && status === "active" && (
            <div className="absolute top-4 left-4 right-4 z-20 animate-fade-in">
              <Alert className="bg-blue-dark/80 text-white border-blue-light">
                <Hand className="h-4 w-4" />
                <AlertTitle>Sign Detected</AlertTitle>
                <AlertDescription>
                  Recognized: <span className="font-bold">{detectedSign}</span>
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          {status === "active" && !isPaused && isModelReady && !detectedSign && (
            <div className="absolute bottom-4 right-4 z-20">
              <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <div className="w-2 h-2 bg-blue rounded-full mr-2 animate-pulse"></div>
                Waiting for signs...
              </div>
            </div>
          )}
          
          {isModelLoading && (
            <div className="absolute bottom-4 left-4 z-20">
              <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                Loading detection model...
              </div>
            </div>
          )}
        </div>
        
        {status === "ready" && (
          <div className="p-4 bg-white border-t">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h4 className="font-medium">Camera Ready</h4>
                <p className="text-sm text-muted-foreground">
                  {isModelReady 
                    ? "Position your hands in frame and click Start" 
                    : "Using simulated sign detection for demonstration purposes."}
                </p>
              </div>
              <div className="flex gap-2">
                {videoRef.current && videoRef.current.srcObject && !videoRef.current.paused ? (
                  <Button 
                    onClick={handleActivate} 
                    className="rounded-full" 
                    size="lg"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Detection
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowTroubleshooting(true)}
                    variant="outline"
                    className="rounded-full"
                    size="sm"
                  >
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Camera Issues?
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {status === "active" && (
          <div className="p-4 bg-white border-t">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-blue">Detection Active</h4>
                <p className="text-sm text-muted-foreground">
                  {isModelReady 
                    ? "Make signs in front of the camera" 
                    : "Using simulated sign detection for demonstration purposes."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={togglePause} variant="outline" className="rounded-full" size="sm">
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-1" /> Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-1" /> Pause
                    </>
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

      <Dialog open={showTroubleshooting} onOpenChange={setShowTroubleshooting}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Camera Troubleshooting</DialogTitle>
            <DialogDescription>
              Follow these steps to resolve camera access issues
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {availableCameras.length > 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Cameras detected: {availableCameras.length}</AlertTitle>
                <AlertDescription>
                  Your device has cameras available, but the browser may need permission to access them.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No cameras detected</AlertTitle>
                <AlertDescription>
                  Your browser couldn't detect any cameras. Please check if your camera is connected and working.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <h4 className="font-medium">Steps to Fix:</h4>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>Look for the camera icon in your browser's address bar and click it</li>
                <li>Make sure camera access is set to "Allow" for this website</li>
                <li>Try refreshing the page after allowing camera access</li>
                <li>Close other applications that might be using your camera</li>
                <li>If using a mobile device, check your device settings for camera permissions</li>
                <li>Try using a different browser (Chrome or Firefox recommended)</li>
                <li><strong>NEW:</strong> Try restarting your browser completely</li>
                <li><strong>NEW:</strong> If on mobile, try switching between front and back cameras</li>
              </ol>
            </div>
            
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Additional Tips:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Make sure your camera is properly connected and working with other apps</li>
                <li>Check if you have antivirus/security software blocking camera access</li>
                <li>Some browsers require HTTPS for camera access</li>
              </ul>
            </div>
            
            {cameraError && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription className="text-xs break-all">
                  {cameraError}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={() => { 
                setShowTroubleshooting(false);
                setTimeout(() => handleStart(), 500);
              }}
              className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try With Different Settings
              </Button>
              
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="w-full"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
