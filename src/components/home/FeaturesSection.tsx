import { Brain, Eye, Laptop, SquareCode, Users, VideoIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Learn Indian Sign Language",
    description: "Explore a comprehensive dictionary of Indian Sign Language signs with visual examples.",
    icon: Eye,
  },
  {
    title: "Real-time Recognition",
    description: "Experience AI-powered recognition of signs through your webcam with instant feedback.",
    icon: VideoIcon,
  },
  {
    title: "Educational Resources",
    description: "Access tutorials, guides, and structured learning paths for all skill levels.",
    icon: Laptop,
  },
  {
    title: "Advanced AI Technology",
    description: "Powered by state-of-the-art computer vision and machine learning algorithms.",
    icon: Brain,
  },
  {
    title: "Community-Driven",
    description: "Join a growing community of signers, educators, and developers.",
    icon: Users,
  },
  {
    title: "Open-Source Project",
    description: "Contribute to the development and improvement of sign language recognition technology.",
    icon: SquareCode,
  },
];

export default function FeaturesSection() {
  return (
    <section className="section bg-muted/30 dark:bg-muted/5">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="mb-4">Empowering Communication</h2>
          <p className="text-lg text-muted-foreground">
            SignSense combines cutting-edge AI with educational resources to make Indian Sign Language more accessible for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-light/5"
            >
              <CardContent className="p-6">
                <div className="rounded-lg bg-blue-light/80 dark:bg-blue-light/10 p-3 mb-4">
                  <feature.icon className="h-6 w-6 text-blue dark:text-blue-light" />
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
