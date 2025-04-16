
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "Thank you for contacting us. We will get back to you soon.",
      });
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have questions about SignSense or want to collaborate? Reach out to us.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Get in Touch</h3>
          <p className="text-muted-foreground mb-6">
            We're always looking to connect with educators, developers, and organizations 
            interested in accessibility and sign language technologies.
          </p>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-2">Email</h4>
              <p className="text-primary">contact@signsense.org</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Location</h4>
              <p>Mumbai, Maharashtra, India</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Social Media</h4>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  LinkedIn
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Your Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                name="email" 
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help you?"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message here..."
                rows={5}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send className="ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
