
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Camera, Hand, Play, Video } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

export default function WebcamPlaceholder() {
  const [status, setStatus] = useState<"initial" | "loading" | "ready" | "active" | "error">("initial");
  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleStart = () => {
    setStatus("loading");
    // Simulate loading
    setTimeout(() => {
      if (Math.random() > 0.2) {
        setStatus("ready");
        toast({
          title: "Camera access granted",
          description: "The webcam is now ready to use for sign detection.",
        });
      } else {
        setStatus("error");
        toast({
          variant: "destructive",
          title: "Camera access denied",
          description: "Please allow camera access to use the sign language detection feature.",
        });
      }
    }, 1500);
  };

  const handleActivate = () => {
    setStatus("active");
    // Simulate sign detection
    const signs = ["Hello", "Thank you", "Please", "Yes", "No", "Help", "Good", "Sorry"];
    
    let detectionInterval = setInterval(() => {
      const randomSign = signs[Math.floor(Math.random() * signs.length)];
      setDetectedSign(randomSign);
      
      toast({
        title: "Sign Detected",
        description: `Detected sign: "${randomSign}"`,
      });
    }, 5000);
    
    // Clear interval after 20 seconds
    setTimeout(() => {
      clearInterval(detectionInterval);
    }, 20000);
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
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60 z-10"></div>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster="https://placehold.co/800x450/D3E4FD/33C3F0?text=Camera+Feed"
            ></video>
            
            {/* Simulated hand tracking points */}
            {status === "active" && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    {/* Thumb */}
                    <div className="absolute top-[-100px] left-[-20px] h-3 w-3 bg-blue rounded-full"></div>
                    <div className="absolute top-[-80px] left-[-30px] h-3 w-3 bg-blue rounded-full"></div>
                    <div className="absolute top-[-60px] left-[-40px] h-3 w-3 bg-blue rounded-full"></div>
                    
                    {/* Index */}
                    <div className="absolute top-[-110px] left-[0px] h-3 w-3 bg-blue rounded-full"></div>
                    <div className="absolute top-[-90px] left-[0px] h-3 w-3 bg-blue rounded-full"></div>
                    <div className="absolute top-[-70px] left-[0px] h-3 w-3 bg-blue rounded-full"></div>
                    
                    {/* Middle */}
                    <div className="absolute top-[-120px] left-[20px] h-3 w-3 bg-blue rounded-full"></div>
                    <div className="absolute top-[-100px] left-[20px] h-3 w-3 bg-blue rounded-full"></div>
                    <div className="absolute top-[-80px] left-[20px] h-3 w-3 bg-blue rounded-full"></div>
                    
                    {/* Ring */}
                    <div className="absolute top-[-110px] left-[40px] h-3 w-3 bg-blue rounded-full"></div>
                    <div className="absolute top-[-90px] left-[40px] h-3 w-3 bg-blue rounded-full"></div>
                    <div className="absolute top-[-70px] left-[40px] h-3 w-3 bg-blue rounded-full"></div>
                    
                    {/* Pinky */}
                    <div className="absolute top-[-100px] left-[60px] h-3 w-3 bg-blue rounded-full"></div>
                    <div className="absolute top-[-80px] left-[60px] h-3 w-3 bg-blue rounded-full"></div>
                    <div className="absolute top-[-60px] left-[60px] h-3 w-3 bg-blue rounded-full"></div>
                    
                    {/* Palm */}
                    <div className="absolute top-[-50px] left-[10px] h-3 w-3 bg-blue rounded-full"></div>
                    <div className="absolute top-[-40px] left-[-10px] h-3 w-3 bg-blue rounded-full"></div>
                    <div className="absolute top-[-40px] left-[30px] h-3 w-3 bg-blue rounded-full"></div>
                    
                    {/* Connect points with lines */}
                    <svg className="absolute top-[-130px] left-[-50px] w-[150px] h-[100px]" viewBox="0 0 150 100" fill="none" stroke="#33C3F0" strokeWidth="1" strokeLinecap="round">
                      {/* Example connections - in a real app, these would be dynamic */}
                      <path d="M30 80 L20 60 L10 40" />
                      <path d="M50 80 L50 60 L50 40" />
                      <path d="M70 80 L70 60 L70 30" />
                      <path d="M90 80 L90 60 L90 40" />
                      <path d="M110 80 L110 60 L110 40" />
                      <path d="M30 80 L60 90 L90 80" />
                    </svg>
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
      </div>
      
      {/* Controls */}
      {status === "ready" && (
        <div className="p-4 bg-white border-t">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Camera Ready</h4>
              <p className="text-sm text-muted-foreground">Position your hands in frame and click Start</p>
            </div>
            <Button onClick={handleActivate} className="rounded-full" size="lg">
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
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
