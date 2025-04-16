
import { Card, CardContent } from "@/components/ui/card";
import { Book, Code2, FileCode2, Webhook, Server, Video } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const docs = [
  {
    icon: Book,
    title: "ISL Dictionary",
    description: "Complete reference of Indian Sign Language signs and their meanings.",
    content: "Access our comprehensive collection of ISL signs organized by categories and alphabets."
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Learn ISL through our detailed video lessons and demonstrations.",
    content: "Step-by-step video guides for learning Indian Sign Language basics to advanced concepts."
  },
  {
    icon: Code2,
    title: "API Reference",
    description: "Technical documentation for integrating SignSense API.",
    content: "Complete API specifications, endpoints, authentication, and usage examples."
  },
  {
    icon: Server,
    title: "Sign Detection",
    description: "Documentation for real-time sign detection features.",
    content: "Learn how to implement and use our sign detection capabilities in your applications."
  },
  {
    icon: FileCode2,
    title: "Implementation Guide",
    description: "Detailed instructions for SignSense implementation.",
    content: "Step-by-step guide for setting up and integrating SignSense in your projects."
  },
  {
    icon: Webhook,
    title: "Integration Samples",
    description: "Example code and use cases for common scenarios.",
    content: "Ready-to-use code samples and integration patterns for different platforms."
  }
];

export default function Documentation() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="mb-4">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive guide to using SignSense and Indian Sign Language resources.
        </p>
      </div>

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertTitle>Getting Started</AlertTitle>
        <AlertDescription>
          Begin with our quickstart guide to understand the basics of Indian Sign Language and how to use SignSense effectively.
        </AlertDescription>
      </Alert>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-light/5">
            <CardContent className="p-6">
              <div className="rounded-lg bg-blue-light/80 dark:bg-blue-light/10 p-3 mb-4 inline-block">
                <doc.icon className="h-6 w-6 text-blue dark:text-blue-light" />
              </div>
              <h3 className="text-xl font-medium mb-2">{doc.title}</h3>
              <p className="text-muted-foreground mb-4">{doc.description}</p>
              <p className="text-sm text-muted-foreground">{doc.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
