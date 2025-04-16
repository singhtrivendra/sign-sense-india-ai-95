
import { useToast } from "@/components/ui/use-toast";
import WebcamPlaceholder from "@/components/demo/WebcamPlaceholder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import DemoVideo from "@/components/demo/DemoVideo";

export default function Demo() {
  const { toast } = useToast();

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-4">Live Sign Language Detection</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Experience our AI-powered sign language recognition system in action.
          Use your webcam to try detecting sign language in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <DemoVideo />
        </div>
        
        <div>
          <Tabs defaultValue="instructions">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="about">About Demo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="instructions" className="space-y-4 p-4">
              <h3 className="font-medium text-lg">How to Use</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-blue-light rounded-full h-8 w-8 flex items-center justify-center text-blue font-bold shrink-0">1</div>
                  <div>
                    <h4 className="font-medium">Allow Camera Access</h4>
                    <p className="text-sm text-muted-foreground">Click "Start Camera" and allow the browser to access your webcam.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-blue-light rounded-full h-8 w-8 flex items-center justify-center text-blue font-bold shrink-0">2</div>
                  <div>
                    <h4 className="font-medium">Position Your Hands</h4>
                    <p className="text-sm text-muted-foreground">Make sure your hands are clearly visible within the frame.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-blue-light rounded-full h-8 w-8 flex items-center justify-center text-blue font-bold shrink-0">3</div>
                  <div>
                    <h4 className="font-medium">Start Detection</h4>
                    <p className="text-sm text-muted-foreground">Click "Start Detection" to begin real-time sign language recognition.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-blue-light rounded-full h-8 w-8 flex items-center justify-center text-blue font-bold shrink-0">4</div>
                  <div>
                    <h4 className="font-medium">Perform Signs</h4>
                    <p className="text-sm text-muted-foreground">Make sign language gestures and see the system detect them.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="space-y-4 p-4">
              <h3 className="font-medium text-lg">About This Demo</h3>
              <p className="text-sm text-muted-foreground">
                This is a demonstration of our sign language recognition technology. The system uses computer vision and machine learning to detect and interpret sign language gestures in real-time using the RavenOnur/Sign-Language model.
              </p>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>AI Model Information</AlertTitle>
                <AlertDescription>
                  This demo uses the RavenOnur/Sign-Language model from Hugging Face for sign language recognition. The model is designed to recognize various sign language gestures.
                </AlertDescription>
              </Alert>
              
              <h4 className="font-medium mt-4">Supported Signs</h4>
              <p className="text-sm text-muted-foreground">
                The model can detect a range of sign language gestures including common words and phrases. Performance may vary based on lighting conditions and hand positioning.
              </p>
            </TabsContent>
          </Tabs>
          
          <Alert className="mt-6" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Privacy Notice</AlertTitle>
            <AlertDescription>
              Your webcam feed is processed locally in your browser. No video data is sent to our servers or stored.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-8">Try It Yourself</h2>
        <WebcamPlaceholder />
      </div>

      <img 
        src="/lovable-uploads/034c8736-02ed-436b-8804-fbe293120ff7.png" 
        alt="Sign Language Processing Flow"
        className="w-full max-w-4xl mx-auto rounded-xl shadow-lg mb-12"
      />
    </div>
  );
}
