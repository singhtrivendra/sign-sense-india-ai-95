
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

const blogPosts = [
  {
    title: "Understanding Indian Sign Language Basics",
    date: "2024-04-15",
    author: "Dr. Sarah Johnson",
    excerpt: "Learn the fundamental aspects of Indian Sign Language and how it differs from other sign languages.",
    category: "Education"
  },
  {
    title: "The Impact of AI in Sign Language Recognition",
    date: "2024-04-10",
    author: "Tech Team",
    excerpt: "Exploring how artificial intelligence is revolutionizing sign language interpretation and accessibility.",
    category: "Technology"
  },
  {
    title: "SignSense: Breaking Communication Barriers",
    date: "2024-04-05",
    author: "Development Team",
    excerpt: "The story behind SignSense and our mission to make sign language more accessible.",
    category: "Company News"
  }
];

export default function Blog() {
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="mb-4">Blog & Updates</h1>
        <p className="text-lg text-muted-foreground">
          Latest news, articles, and updates about SignSense and Indian Sign Language.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.date).toLocaleDateString()}
                <User className="h-4 w-4 ml-2" />
                {post.author}
              </div>
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <div className="inline-block bg-blue-light/20 px-2 py-1 rounded-full text-xs text-blue-600 dark:text-blue-400">
                {post.category}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{post.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
