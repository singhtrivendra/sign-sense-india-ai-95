
import { ArrowRight, BrainCircuit, HandMetal, Image, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    title: "Video Input",
    description: "User performs sign language gestures through a webcam or uploads a video.",
    icon: Video,
    color: "bg-blue-light text-blue",
  },
  {
    title: "Hand Detection",
    description: "Computer vision algorithms detect and track hand movements in real-time.",
    icon: HandMetal,
    color: "bg-blue-light/70 text-blue",
  },
  {
    title: "Feature Extraction",
    description: "Key points and motion patterns are extracted from the hand movements.",
    icon: Image,
    color: "bg-blue-light/50 text-blue",
  },
  {
    title: "AI Classification",
    description: "Deep learning models classify the gestures and predict the corresponding sign.",
    icon: BrainCircuit,
    color: "bg-blue-light/30 text-blue",
  },
];

export default function HowItWorksPreview() {
  return (
    <section className="section">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">How SignSense Works</h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered recognition system processes sign language gestures through several sophisticated steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative group rounded-xl border bg-card p-6 hover:shadow-lg transition-all dark:bg-card/50 dark:hover:bg-card/80 text-center">
              <div className={`rounded-full p-4 mb-4 ${step.color} dark:bg-blue-light/20`}>
                <step.icon className="h-8 w-8 dark:text-blue-light" />
              </div>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link to="/how-it-works">
              Learn More About The Technology
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
