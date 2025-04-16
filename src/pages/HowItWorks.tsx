
import { Code2, Database, MessagesSquare, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    icon: Code2,
    title: "AI Model Training",
    description: "Our advanced machine learning models are trained on diverse Indian Sign Language datasets."
  },
  {
    icon: MessagesSquare,
    title: "Recognition Pipeline",
    description: "Real-time processing of hand gestures and movements using computer vision."
  },
  {
    icon: Database,
    title: "Data Processing",
    description: "Advanced algorithms analyze spatial and temporal features of signs."
  },
  {
    icon: Share2,
    title: "Output Generation",
    description: "Accurate translation of signs into text with high confidence scores."
  }
];

export default function HowItWorks() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="mb-4">How SignSense Works</h1>
        <p className="text-lg text-muted-foreground">
          Discover the technology behind our sign language recognition system.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-16">
        {steps.map((step, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-light/5">
            <CardContent className="p-6">
              <div className="rounded-lg bg-blue-light/80 dark:bg-blue-light/10 p-3 mb-4 inline-block">
                <step.icon className="h-6 w-6 text-blue dark:text-blue-light" />
              </div>
              <h3 className="text-xl font-medium mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
