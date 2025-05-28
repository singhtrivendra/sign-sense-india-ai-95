
import { Link } from "react-router-dom";
import { Hand, Github, Twitter, Linkedin, Mail } from "lucide-react";

const SOCIAL_LINKS = {
  github: "https://github.com/singhtrivendra",
  twitter: "https://x.com/SinghTrivendra7",
  linkedin: "https://www.linkedin.com/in/trivendra-singh-919bb6255/",
  email: "mailto:trivendrasingh0711@gmail.com"
};

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 dark:bg-muted/5">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Hand className="h-6 w-6 text-blue" />
              <span className="text-xl font-poppins font-bold">SignSense</span>
            </Link>
            <p className="text-muted-foreground">
              Making Indian Sign Language accessible through AI recognition technology.
            </p>
            <div className="flex gap-4">
              <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-muted-foreground hover:text-blue">
                <Github className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-blue">
                <Twitter className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-blue">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href={SOCIAL_LINKS.email} aria-label="Email" className="text-muted-foreground hover:text-blue">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/learn" className="text-muted-foreground hover:text-blue transition-colors">Learn Signs</Link>
              </li>
              <li>
                <Link to="/demo" className="text-muted-foreground hover:text-blue transition-colors">Live Demo</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-blue transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-blue transition-colors">Blog & Updates</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/docs" className="text-muted-foreground hover:text-blue transition-colors">Documentation</Link>
              </li>
              <li>
                <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue transition-colors">GitHub</a>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-blue transition-colors">About Project</Link>
              </li>
              <li>
                <a href="https://indiansignlanguage.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue transition-colors">ISL Website</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-lg mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-blue transition-colors">Contact Form</Link>
              </li>
              <li>
                <a href={SOCIAL_LINKS.email} className="text-muted-foreground hover:text-blue transition-colors">trivendrasingh0711@gmail.com</a>
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
