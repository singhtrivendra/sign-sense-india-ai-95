import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Camera, Hand, Play, Video, Pause } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { initializeHandGestureModel, recognizeHandGesture, captureVideoFrame } from "@/utils/handGestureRecognition";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function WebcamPlaceholder() {
  const [status, setStatus] = useState<"initial" | "loading" | "ready" | "active" | "error">("initial");
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  
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
      
      // In either case, we're using demo mode
      setIsModelReady(true);
    } catch (error) {
      console.error("Error in loadAIModel:", error);
    } finally {
      setIsModelLoading(false);
    }
  };

  const handleStart = async () => {
    setStatus("loading");
    
    try {
      // Request camera access with explicit constraints for better compatibility
      const constraints = {
        audio: false,
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };
      
      // Force refresh any existing streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Make sure video autoplay works properly
        videoRef.current.autoplay = true;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        
        // Add event listeners to handle video loading
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("Camera video stream started successfully");
                setStatus("ready");
                toast({
                  title: "Camera access granted",
                  description: "The webcam is now ready to use for sign detection.",
                });
              })
              .catch(playError => {
                console.error("Error playing video:", playError);
                toast({
                  title: "Camera needs manual activation",
                  description: "Please click the video area if camera doesn't start automatically.",
                });
              });
          }
        };
        
        videoRef.current.onerror = () => {
          console.error("Video element error occurred");
          setStatus("error");
          toast({
            variant: "destructive",
            title: "Camera error",
            description: "There was a problem accessing your camera.",
          });
        };
      }
      
      // Start loading the model regardless - even if video fails at first
      await loadAIModel();
      
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
    
    // Start sign detection at more frequent intervals for better responsiveness
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    detectionIntervalRef.current = window.setInterval(async () => {
      if (videoRef.current && !isPaused && videoRef.current.readyState >= 2) {
        try {
          const imageData = captureVideoFrame(videoRef.current);
          
          if (imageData) {
            // Use our demo recognition function
            const recognizedSign = await recognizeHandGesture(imageData);
            
            if (recognizedSign && recognizedSign !== detectedSign) {
              setDetectedSign(recognizedSign);
              
              // Provide visual and audio feedback for better user experience
              toast({
                title: "Sign Detected",
                description: `Detected sign: "${recognizedSign}" (demo mode)`,
              });
              
              // Play a subtle sound effect for detection feedback
              const audio = new Audio();
              audio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBhxQo%2BTxtng0DwhLiuD43JdaKw8QWaf48Linux0NEcX2x4uShKRhWc6Hf4rp8RiAdU6fo98qtZCoYQp%2Fx%2BeS0gkAQMID27%2BO2gk0hK3n58%2BO2j1MoL3f89%2BO8klAoKHP%2B%2FfLLolctHGn%2F%2FvTarGYxGV3%2F%2F%2FLmsngxFVT%2F%2F%2FnntHomD07%2F%2F%2F7vuHUkC0P%2B%2F%2F%2F5wX4jBjr8%2Fv%2F%2B%2BcaGIgRB%2FP%2F%2F%2F%2B%2FJEAE6%2BP%2F%2F%2F%2F";
              audio.volume = 0.2;
              audio.play().catch(err => console.log("Audio feedback not supported"));
            }
          }
        } catch (error) {
          console.error('Error during sign detection:', error);
        }
      }
    }, 1000); // Check every 1 second for more responsive detection
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
              <div className="flex gap-2 mt-6">
                <Button onClick={handleStart} variant="outline">
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
                style={{ transform: "scaleX(-1)" }} /* Mirror the camera for more intuitive interaction */
                onClick={() => {
                  // Attempt to play the video on user interaction if autoplay failed
                  if (videoRef.current) {
                    videoRef.current.play().catch(e => 
                      console.log("Play attempt on click failed:", e)
                    );
                  }
                }}
              ></video>
              
              {/* Enhanced hand tracking visualization */}
              {status === "active" && !isPaused && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      {/* Main detection area */}
                      <div className="h-48 w-48 border-2 border-dashed border-blue rounded-full animate-pulse opacity-60"></div>
                      
                      {/* Hand tracking points visualization */}
                      <div className="absolute top-0 left-0 w-full h-full">
                        {/* Simulate finger tracking points */}
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i}
                            className="absolute h-3 w-3 bg-green-500 rounded-full shadow-lg"
                            style={{
                              top: `${20 + Math.sin(Date.now() / 1000 + i) * 15}%`,
                              left: `${25 + i * 12 + Math.cos(Date.now() / 1200 + i) * 5}%`,
                              animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite alternate`
                            }}
                          />
                        ))}
                        
                        {/* Palm center point */}
                        <div 
                          className="absolute h-5 w-5 bg-blue rounded-full shadow-lg"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            animation: 'pulse 2s infinite'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Processing indicator */}
                  <div className="absolute bottom-8 right-8 flex items-center bg-black/50 text-white p-2 rounded-lg text-sm">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                    <span>Processing gestures...</span>
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Detected sign overlay - Enhanced with animation */}
          {detectedSign && status === "active" && (
            <div className="absolute bottom-4 left-4 right-4 z-30 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white"
                 style={{animation: "fadeIn 0.3s ease-out"}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Hand className="h-5 w-5 mr-2 text-primary" />
                  <span>Detected Sign:</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-primary text-lg">{detectedSign}</span>
                  <div className="ml-2 h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
          
          {/* No sign detected status - only show after initial detection */}
          {!detectedSign && status === "active" && !isPaused && (
            <div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-sm flex items-center">
              <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse mr-2"></div>
              <span>Waiting for hand gesture...</span>
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

      {/* Camera troubleshooting dialog */}
      <Dialog open={showTroubleshooting} onOpenChange={setShowTroubleshooting}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Camera Troubleshooting</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <h3 className="font-medium">Common Issues & Solutions</h3>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Browser Permissions</AlertTitle>
              <AlertDescription>
                Make sure you've allowed camera access in your browser. Look for the camera icon in your address bar.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h4 className="font-medium">Steps to Fix:</h4>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Check if your browser supports webcams (most modern browsers do)</li>
                <li>Look for the camera icon in your address bar and ensure it's allowed</li>
                <li>Try refreshing the page</li>
                <li>Make sure no other app is using your camera</li>
                <li>On mobile devices, ensure the site has camera permission in device settings</li>
              </ol>
            </div>
            
            <div className="mt-4">
              <Button onClick={() => { 
                setShowTroubleshooting(false);
                setTimeout(() => handleStart(), 500);
              }}
              className="w-full">
                Try Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
