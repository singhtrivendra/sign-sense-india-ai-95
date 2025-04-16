
import { Card, CardContent } from "@/components/ui/card";
import { Book, Code2, FileCode2 } from "lucide-react";

const docs = [
  {
    icon: Book,
    title: "Getting Started",
    description: "Learn how to set up and integrate SignSense into your projects."
  },
  {
    icon: Code2,
    title: "API Reference",
    description: "Comprehensive API documentation for developers."
  },
  {
    icon: FileCode2,
    title: "Examples",
    description: "Sample code and implementation examples."
  }
];

export default function Documentation() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="mb-4">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Everything you need to integrate and use SignSense.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {docs.map((doc, index) => (
          <Card key={index} className="transition-all duration-300 hover:shadow-lg dark:hover:shadow-blue-light/5">
            <CardContent className="p-6">
              <div className="rounded-lg bg-blue-light/80 dark:bg-blue-light/10 p-3 mb-4 inline-block">
                <doc.icon className="h-6 w-6 text-blue dark:text-blue-light" />
              </div>
              <h3 className="text-xl font-medium mb-2">{doc.title}</h3>
              <p className="text-muted-foreground">{doc.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
