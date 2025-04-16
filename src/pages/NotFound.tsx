
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home, Hand } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-blue-light/10">
      <div className="text-center max-w-md px-4">
        <div className="rounded-full bg-blue-light/50 p-6 w-24 h-24 flex items-center justify-center mx-auto mb-8">
          <Hand className="h-12 w-12 text-blue" />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-blue">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! We couldn't find the sign for this page.
        </p>
        <Button asChild size="lg" className="rounded-full">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
