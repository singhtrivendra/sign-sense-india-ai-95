
import { Card, CardContent } from "@/components/ui/card";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="mb-4">About SignSense</h1>
        <p className="text-lg text-muted-foreground">
          Making Indian Sign Language accessible through AI technology.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-16">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-medium mb-4">Our Mission</h3>
            <p className="text-muted-foreground mb-4">
              SignSense aims to bridge communication gaps by leveraging AI technology
              to make Indian Sign Language more accessible to everyone.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-medium mb-4">Open Source</h3>
            <p className="text-muted-foreground mb-4">
              We believe in the power of community. Our project is open source,
              welcoming contributions from developers worldwide.
            </p>
            <Button variant="outline" className="gap-2">
              <Github className="h-4 w-4" />
              View on GitHub
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
