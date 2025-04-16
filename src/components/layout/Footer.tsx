
import { Link } from "react-router-dom";
import { Hand, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Hand className="h-6 w-6 text-blue" />
              <span className="text-xl font-poppins font-bold">SignSense</span>
            </div>
            <p className="text-muted-foreground">
              Making Indian Sign Language accessible through AI recognition technology.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com" aria-label="GitHub" className="text-muted-foreground hover:text-blue">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="text-muted-foreground hover:text-blue">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="text-muted-foreground hover:text-blue">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:contact@signsense.ai" aria-label="Email" className="text-muted-foreground hover:text-blue">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/learn" className="text-muted-foreground hover:text-blue">Learn Signs</Link>
              </li>
              <li>
                <Link to="/demo" className="text-muted-foreground hover:text-blue">Live Demo</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-blue">How It Works</Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-blue">Blog & Updates</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/docs" className="text-muted-foreground hover:text-blue">Documentation</Link>
              </li>
              <li>
                <a href="https://github.com" className="text-muted-foreground hover:text-blue">GitHub</a>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-blue">About Project</Link>
              </li>
              <li>
                <a href="https://indiansignlanguage.org" className="text-muted-foreground hover:text-blue">ISL Website</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-muted-foreground">
                <Link to="/contact" className="text-muted-foreground hover:text-blue">Contact Form</Link>
              </li>
              <li className="text-muted-foreground">
                <a href="mailto:contact@signsense.ai" className="text-muted-foreground hover:text-blue">contact@signsense.ai</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SignSense AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
