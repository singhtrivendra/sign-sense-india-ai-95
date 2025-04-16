
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Database, MessagesSquare, Share2, Video, Hand, Brain, ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Video,
    title: "Video Input",
    description: "User performs sign language gestures through a webcam or uploads a video.",
    content: "Our system accepts video input from various sources including webcams, uploaded videos, and mobile cameras. The input is processed at 30 frames per second to ensure smooth gesture tracking. For optimal performance, we recommend good lighting conditions and a clear background."
  },
  {
    icon: Hand,
    title: "Hand Detection",
    description: "Computer vision algorithms detect and track hand movements in real-time.",
    content: "Using advanced computer vision techniques, our system identifies and tracks hand positions, shapes, and movements. We employ a custom-trained neural network optimized specifically for Indian Sign Language hand configurations. Our model can track up to 21 key points on each hand with high precision even in challenging lighting conditions."
  },
  {
    icon: MessagesSquare,
    title: "Feature Extraction",
    description: "Key points and motion patterns are extracted from the hand movements.",
    content: "Once hands are detected, our system extracts spatial and temporal features that characterize the sign. These include hand shape configurations, movement trajectories, relative positions between hands, and changes in orientation over time. These features are normalized to account for differences in signing styles and physical characteristics between users."
  },
  {
    icon: Brain,
    title: "AI Classification",
    description: "Deep learning models classify the gestures and predict the corresponding sign.",
    content: "Our custom-trained deep learning models analyze the extracted features to classify signs. We use a combination of convolutional neural networks (CNNs) and recurrent neural networks (RNNs) to capture both spatial and temporal aspects of signing. The system is trained on a dataset of over 10,000 sign examples covering common Indian Sign Language vocabulary."
  }
];

const technicalDetails = [
  {
    title: "Neural Network Architecture",
    description: "Our system uses a hybrid 3D-CNN and LSTM network architecture specifically designed for sign language recognition. This approach combines spatial feature extraction with temporal sequence modeling."
  },
  {
    title: "Model Training",
    description: "Models are trained on a diverse dataset of over 10,000 Indian Sign Language examples performed by 50+ signers to ensure robustness across different signing styles."
  },
  {
    title: "Real-time Processing",
    description: "Optimized inference pipeline achieves 30+ FPS on modern hardware, enabling smooth real-time sign detection with minimal latency."
  },
  {
    title: "Accuracy Metrics",
    description: "Current models achieve 92% accuracy on common signs and 85% on complex sentences in controlled environments. Continuous improvement through ongoing training."
  }
];

const faqs = [
  {
    question: "How accurate is the sign language recognition?",
    answer: "Our system achieves 92% accuracy for individual signs in good lighting conditions. For continuous signing or complex sentences, accuracy is around 85%. Performance may vary based on environmental factors like lighting and background."
  },
  {
    question: "Does it work with all Indian Sign Language variants?",
    answer: "The system is primarily trained on standardized Indian Sign Language as documented by the Indian Sign Language Research and Training Centre (ISLRTC). It covers most regional variations, but some localized signs might not be recognized."
  },
  {
    question: "What hardware requirements are needed?",
    answer: "For optimal performance, we recommend a device with at least 4GB RAM and a modern CPU. For mobile devices, iPhone 8+ or Android phones with Snapdragon 765G equivalent or better processors are recommended."
  },
  {
    question: "Is an internet connection required?",
    answer: "Our standard implementation processes video in the cloud and requires an internet connection. We also offer an offline mode with a smaller sign vocabulary that can run entirely on the device without internet."
  }
];

export default function HowItWorks() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="mb-4">How SignSense Works</h1>
        <p className="text-lg text-muted-foreground">
          Discover the technology behind our sign language recognition system.
        </p>
      </div>

      <Alert className="mb-12">
        <Info className="h-4 w-4" />
        <AlertTitle>State-of-the-art Technology</AlertTitle>
        <AlertDescription>
          SignSense uses advanced computer vision and deep learning algorithms to recognize and interpret Indian Sign Language in real-time.
        </AlertDescription>
      </Alert>

      {/* Processing Flow Diagram */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-center mb-12">Sign Language Processing Pipeline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Card */}
              <div className="rounded-xl bg-blue-light/10 p-8 text-center h-full flex flex-col items-center">
                <div className="rounded-full bg-blue-light/30 p-4 mb-4">
                  <step.icon className="h-8 w-8 text-blue" />
                </div>
                <h3 className="text-xl font-medium mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-center">{step.description}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                  onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                >
                  {expandedStep === index ? "Less Details" : "More Details"}
                  {expandedStep === index ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {/* Connecting Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="h-0.5 w-8 bg-blue"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 rotate-45 h-2 w-2 border-t-2 border-r-2 border-blue"></div>
                </div>
              )}
              
              {/* Expanded Details */}
              {expandedStep === index && (
                <div className="mt-4 p-4 bg-muted/20 rounded-lg">
                  <p>{step.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="technical" className="mb-16">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="technical" className="mt-8">
          <div className="grid gap-8 md:grid-cols-2">
            {technicalDetails.map((detail, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium mb-2">{detail.title}</h3>
                  <p className="text-muted-foreground">{detail.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="faq" className="mt-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border rounded-lg overflow-hidden"
              >
                <button 
                  className="flex justify-between items-center w-full p-4 text-left font-medium"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  {faq.question}
                  {expandedFaq === index ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="p-4 bg-muted/20 border-t">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
