
import { ArrowRight, Book, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="section bg-blue-light/30">
      <div className="container">
        <div className="rounded-2xl bg-gradient-to-br from-blue/90 to-blue-dark p-8 md:p-12 shadow-lg text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-white">Ready to explore Indian Sign Language?</h2>
              <p className="text-white/80 text-lg">
                Begin your journey into the world of Indian Sign Language with our comprehensive resources and interactive tools.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary" className="rounded-full text-blue">
                  <Link to="/learn">
                    <Book className="mr-2 h-4 w-4" />
                    Learn Signs
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 rounded-full">
                  <Link to="/demo">
                    <Video className="mr-2 h-4 w-4" />
                    Try Demo
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
                <h3 className="text-xl font-medium mb-2">For Students</h3>
                <p className="text-white/70 mb-4">Learn Indian Sign Language at your own pace with our comprehensive resources.</p>
                <Link to="/learn" className="flex items-center text-white group">
                  <span>Start Learning</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
                <h3 className="text-xl font-medium mb-2">For Developers</h3>
                <p className="text-white/70 mb-4">Integrate our API or contribute to the open-source project.</p>
                <Link to="/docs" className="flex items-center text-white group">
                  <span>View Documentation</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
