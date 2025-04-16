
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Hand } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-light/40 to-background pt-16 pb-24 md:py-32">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-background">
              <span className="text-blue">AI-Powered</span>
              <span className="mx-1">•</span>
              <span>Indian Sign Language Recognition</span>
            </div>
            <h1 className="font-bold tracking-tight">
              Breaking Barriers with <span className="text-blue">Sign</span>Sense
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              An educational platform empowering communication through advanced AI recognition of Indian Sign Language. Learn, practice, and connect.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="rounded-full">
                <Link to="/learn">
                  Learn Sign Language
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to="/demo">Try Live Demo</Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video overflow-hidden rounded-xl bg-blue-light/30 shadow-xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Hand className="h-16 w-16 text-blue mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-medium">Sign Language Recognition</h3>
                  <p className="text-muted-foreground mt-2">Interactive AI-powered experience</p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-blue/20 blur-xl" />
            <div className="absolute -top-6 -left-6 h-16 w-16 rounded-full bg-blue/30 blur-lg" />
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 transform">
        <div className="h-96 w-96 rounded-full bg-blue/10 blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 transform">
        <div className="h-64 w-64 rounded-full bg-blue/10 blur-3xl" />
      </div>
    </section>
  );
}
