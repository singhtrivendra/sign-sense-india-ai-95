
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Book, Code2, FileCode2, Webhook, Server, Video, ChevronDown, ChevronRight, Search, Filter } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const docCategories = [
  "All Documents",
  "Beginners Guide",
  "API Reference",
  "Implementation",
  "Video Tutorials",
  "Research Papers"
];

const documentationItems = [
  {
    icon: Book,
    title: "ISL Dictionary Guide",
    description: "Complete reference of Indian Sign Language signs and their meanings.",
    content: "Access our comprehensive collection of ISL signs organized by categories and alphabets. This guide provides detailed information about each sign including its meaning, usage contexts, and variations across different regions of India.",
    category: "Beginners Guide",
    tags: ["dictionary", "reference", "beginners"]
  },
  {
    icon: Video,
    title: "Video Tutorials: Basics",
    description: "Learn ISL through our detailed video lessons and demonstrations.",
    content: "Step-by-step video guides for learning Indian Sign Language basics. These tutorials cover fundamental hand shapes, movements, and common phrases to help beginners start communicating effectively using ISL.",
    category: "Video Tutorials",
    tags: ["video", "tutorial", "beginners"]
  },
  {
    icon: Code2,
    title: "API Reference v1.0",
    description: "Technical documentation for integrating SignSense API.",
    content: "Complete API specifications, endpoints, authentication methods, and usage examples. This reference includes detailed information about request formats, response structures, error handling, and rate limits for the SignSense API v1.0.",
    category: "API Reference",
    tags: ["api", "technical", "integration"]
  },
  {
    icon: Server,
    title: "Sign Detection Models",
    description: "Documentation for real-time sign detection features.",
    content: "Learn how to implement and use our sign detection capabilities in your applications. This guide covers model architecture, performance considerations, hardware requirements, and integration patterns for different platforms.",
    category: "Implementation",
    tags: ["detection", "technical", "models"]
  },
  {
    icon: FileCode2,
    title: "Implementation Guide",
    description: "Detailed instructions for SignSense implementation.",
    content: "Step-by-step guide for setting up and integrating SignSense in your projects. This document walks through the entire implementation process from initial setup to advanced configurations, including code samples for common scenarios.",
    category: "Implementation",
    tags: ["implementation", "technical", "guide"]
  },
  {
    icon: Webhook,
    title: "Integration Samples",
    description: "Example code and use cases for common scenarios.",
    content: "Ready-to-use code samples and integration patterns for different platforms including web, mobile, and embedded systems. These examples demonstrate best practices for implementing SignSense in various technology stacks.",
    category: "Implementation",
    tags: ["samples", "code", "integration"]
  },
  {
    icon: Book,
    title: "Research: ISL Recognition Advances",
    description: "Latest research papers on Indian Sign Language recognition.",
    content: "A collection of peer-reviewed research papers on advances in Indian Sign Language recognition using computer vision and machine learning. These papers provide insights into cutting-edge techniques and algorithms used in our system.",
    category: "Research Papers",
    tags: ["research", "academic", "technical"]
  },
  {
    icon: Video,
    title: "Video Tutorials: Advanced",
    description: "Advanced video lessons for complex sign language concepts.",
    content: "Comprehensive video lessons covering advanced Indian Sign Language concepts, complex expressions, and regional variations. These tutorials are designed for intermediate to advanced learners who want to deepen their ISL skills.",
    category: "Video Tutorials",
    tags: ["video", "tutorial", "advanced"]
  }
];

export default function Documentation() {
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Documents");
  const [activeTab, setActiveTab] = useState("browse");

  const filteredDocs = documentationItems.filter(doc => {
    const matchesSearch = searchTerm.trim() === "" || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All Documents" || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-8">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="browse">Browse Documents</TabsTrigger>
          <TabsTrigger value="search">Search &amp; Filter</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search documentation..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 pr-10 border rounded-md w-full appearance-none cursor-pointer bg-background"
              >
                {docCategories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
            </div>
          </div>
          
          {filteredDocs.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No documents found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search term or selecting a different category.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocs.map((doc, index) => (
                <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="rounded-lg bg-blue-light/80 dark:bg-blue-light/10 p-3 mb-4 inline-block">
                      {React.createElement(doc.icon, { className: "h-6 w-6 text-blue dark:text-blue-light" })}
                    </div>
                    <h3 className="text-xl font-medium mb-2">{doc.title}</h3>
                    <p className="text-muted-foreground mb-4">{doc.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {doc.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="bg-blue-light/10">{tag}</Badge>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedDoc(index)}
                    >
                      View Document
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="browse">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {documentationItems.map((doc, index) => (
              <Card 
                key={index} 
                className={`transition-all duration-300 hover:shadow-lg ${selectedDoc === index ? "ring-2 ring-blue" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="rounded-lg bg-blue-light/80 dark:bg-blue-light/10 p-3 mb-4 inline-block">
                    {React.createElement(doc.icon, { className: "h-6 w-6 text-blue dark:text-blue-light" })}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{doc.title}</h3>
                  <p className="text-muted-foreground mb-4">{doc.description}</p>
                  <Badge className="bg-blue-light/20 text-blue border-none mb-4">{doc.category}</Badge>
                  <Button 
                    variant={selectedDoc === index ? "default" : "outline"} 
                    className="w-full"
                    onClick={() => setSelectedDoc(index)}
                  >
                    {selectedDoc === index ? "Selected" : "View Details"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {selectedDoc !== null && (
        <Card className="mt-8 border-blue">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-light/80 dark:bg-blue-light/10 p-3">
                {React.createElement(documentationItems[selectedDoc].icon, { className: "h-6 w-6 text-blue dark:text-blue-light" })}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{documentationItems[selectedDoc].title}</h2>
                <Badge className="mt-1">{documentationItems[selectedDoc].category}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{documentationItems[selectedDoc].description}</p>
            <div className="bg-muted/20 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Content</h3>
              <p>{documentationItems[selectedDoc].content}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Related Tags</h3>
              <div className="flex flex-wrap gap-2">
                {documentationItems[selectedDoc].tags.map((tag, i) => (
                  <Badge key={i} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setSelectedDoc(null)}
            >
              Back to documents
            </Button>
            <Button>Download PDF</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
