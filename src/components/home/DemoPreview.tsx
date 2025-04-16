
import { ArrowRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DemoVideo from "@/components/demo/DemoVideo";

export default function DemoPreview() {
  return (
    <section className="section bg-gradient-to-b from-background to-blue-light/20">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-xl">
              <DemoVideo />
            </div>
          </div>
          
          <div className="space-y-6 lg:order-first text-center lg:text-left">
            <div className="badge inline-block">Interactive Experience</div>
            <h2 className="mb-4">Experience AI Sign Language Recognition</h2>
            <p className="text-lg text-muted-foreground">
              Try our cutting-edge AI technology that recognizes Indian Sign Language in real-time through your webcam. 
              Get instant feedback and practice your signing skills with our interactive demo.
            </p>
            <Button asChild size="lg" className="rounded-full bg-blue hover:bg-blue-dark text-white">
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
