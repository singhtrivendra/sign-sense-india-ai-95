
import { ArrowRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function DemoPreview() {
  return (
    <section className="section bg-gradient-to-b from-background to-blue-light/20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-xl">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Video className="h-16 w-16 mb-4 animate-pulse-slow" />
                <h3 className="text-2xl font-medium">Live Demo</h3>
                <p className="text-white/70 mt-2">Try our sign language recognition in real-time</p>
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Mock webcam interface elements */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                  <div className="flex items-center justify-between">
                    <span>Ready to detect signs</span>
                    <span className="px-2 py-1 bg-blue/80 rounded text-xs">Try Live Demo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 lg:order-first text-center lg:text-left">
            <div className="badge inline-block">Interactive Experience</div>
            <h2 className="mb-4">Experience AI Sign Language Recognition</h2>
            <p className="text-lg text-muted-foreground">
              Try our cutting-edge AI technology that recognizes Indian Sign Language in real-time through your webcam. 
              Get instant feedback and practice your signing skills with our interactive demo.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/demo">
                Try Live Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
