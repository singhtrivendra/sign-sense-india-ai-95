
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { SignItem } from "@/services/api";
import { Info, Play, ExternalLink } from "lucide-react";
import { useState, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SignCardProps {
  sign: SignItem;
}

// Use memo to prevent unnecessary re-renders of card components
const SignCard = memo(({ sign }: SignCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="relative aspect-video bg-muted">
            <img
              src={sign.imageUrl}
              alt={`Sign for ${sign.title}`}
              className="object-cover w-full h-full"
              loading="lazy" // Add lazy loading
            />
            {sign.videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="icon"
                  variant="secondary"
                  className="rounded-full bg-black/50 hover:bg-black/70 text-white"
                >
                  <Play className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-1">{sign.title}</h3>
              {sign.category && (
                <Badge variant="secondary" className="mb-2">
                  {sign.category}
                </Badge>
              )}
            </div>
            <Badge variant="outline" className="bg-blue-light/50">
              {sign.letter}
            </Badge>
          </div>
          <p className="text-muted-foreground line-clamp-2 mt-2">
            {sign.description || "No description available."}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="text-blue"
          >
            <Info className="h-4 w-4 mr-2" />
            Details
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://indiansignlanguage.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Source
            </a>
          </Button>
        </CardFooter>
      </Card>

      {/* Only render dialog when open to save memory */}
      {dialogOpen && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  {sign.title}
                  {sign.category && (
                    <Badge variant="outline" className="ml-2">
                      {sign.category}
                    </Badge>
                  )}
                </div>
                <Badge variant="secondary">{sign.letter}</Badge>
              </DialogTitle>
              <DialogDescription>
                Sign language representation and usage
              </DialogDescription>
            </DialogHeader>
            
            <div className="relative aspect-video bg-muted rounded-md overflow-hidden mb-4">
              <img
                src={sign.imageUrl}
                alt={`Sign for ${sign.title}`}
                className="object-cover w-full h-full"
              />
              {sign.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-black/50 hover:bg-black/70 text-white"
                  >
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-muted-foreground mb-4">
                {sign.description || "No description available."}
              </p>
              
              <div className="flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://indiansignlanguage.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Indian Sign Language
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
});

SignCard.displayName = "SignCard";

export default SignCard;
