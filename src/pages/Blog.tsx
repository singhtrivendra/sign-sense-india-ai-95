
import { useState } from "react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Calendar, User, Search, Tag, ArrowRight, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = ["All", "Education", "Technology", "Research", "Company News"];

const blogPosts = [
  {
    id: 1,
    title: "Understanding Indian Sign Language Basics",
    date: "2024-04-15",
    author: "Dr. Sarah Johnson",
    excerpt: "Learn the fundamental aspects of Indian Sign Language and how it differs from other sign languages around the world.",
    category: "Education",
    tags: ["beginners", "basics", "tutorial"],
    image: "https://placehold.co/800x450/D3E4FD/33C3F0?text=Indian+Sign+Language+Basics",
    content: "Indian Sign Language (ISL) is a visual-gestural language that serves as the primary means of communication for the Deaf community in India. Unlike spoken languages that use sound, ISL uses hand shapes, facial expressions, and body movements to convey meaning. It is a complete language with its own grammar and syntax, distinct from spoken Hindi, English, or other Indian languages. ISL is not a universal language - it differs from American Sign Language (ASL), British Sign Language (BSL), and other sign languages around the world. Each sign language has evolved within its own Deaf community and is influenced by the local culture and needs. In this article, we explore the basic elements of Indian Sign Language and how beginners can start learning this rich and expressive language..."
  },
  {
    id: 2,
    title: "The Impact of AI in Sign Language Recognition",
    date: "2024-04-10",
    author: "Tech Team",
    excerpt: "Exploring how artificial intelligence is revolutionizing sign language interpretation and accessibility.",
    category: "Technology",
    tags: ["AI", "machine learning", "accessibility"],
    image: "https://placehold.co/800x450/E5DEFF/6E59A5?text=AI+in+Sign+Language",
    content: "Artificial Intelligence is transforming how sign language is recognized and interpreted, creating new possibilities for deaf-hearing communication. Modern AI systems use computer vision to track hand movements, body posture, and facial expressions - all crucial components of sign language. Deep learning models trained on thousands of signing examples can now recognize signs with increasing accuracy. This technology is enabling real-time translation applications that can convert sign language to text or speech, and vice versa. The benefits of these advances extend beyond simple translation. AI-powered sign language recognition is being integrated into educational tools, making learning more accessible for deaf students. It's also finding applications in public spaces like airports and hospitals, where critical information needs to be accessible to everyone..."
  },
  {
    id: 3,
    title: "SignSense: Breaking Communication Barriers",
    date: "2024-04-05",
    author: "Development Team",
    excerpt: "The story behind SignSense and our mission to make sign language more accessible to everyone.",
    category: "Company News",
    tags: ["SignSense", "accessibility", "mission"],
    image: "https://placehold.co/800x450/FDE1D3/F97316?text=SignSense+Mission",
    content: "At SignSense, our journey began with a simple but powerful question: how can we use technology to bridge the communication gap between deaf and hearing communities? This question led to the development of our sign language recognition platform. Our team combines expertise in computer vision, machine learning, linguistics, and deaf culture to create technology that truly serves the deaf community. We believe technology should adapt to humans, not the other way around. That's why we've developed a system that recognizes natural signing, rather than requiring users to modify their signing for a computer. Our development process has been collaborative from day one, with deaf consultants and beta testers providing invaluable feedback at every stage..."
  },
  {
    id: 4,
    title: "Research Advances in Indian Sign Language Pattern Recognition",
    date: "2024-03-28",
    author: "Research Team",
    excerpt: "Recent breakthroughs in computer vision algorithms for recognizing the unique patterns of Indian Sign Language.",
    category: "Research",
    tags: ["research", "computer vision", "technical"],
    image: "https://placehold.co/800x450/F2FCE2/8B5CF6?text=ISL+Pattern+Recognition",
    content: "Our research team has been exploring novel approaches to recognizing the unique characteristics of Indian Sign Language. Unlike some other sign languages, ISL makes extensive use of both hands and incorporates a wide range of facial expressions as grammatical markers. This complexity presents unique challenges for computer vision systems. Recent advances in our pattern recognition algorithms have focused on better handling of partially occluded signs, where one hand may temporarily block the other from view. We've also made progress in recognizing subtle facial expressions that can completely change the meaning of otherwise identical hand movements. Our latest models incorporate spatial-temporal graph convolutional networks that better capture the sequential nature of signing, showing a 15% improvement in recognition accuracy compared to our previous approach..."
  },
  {
    id: 5,
    title: "Teaching Children Indian Sign Language Through Interactive Technology",
    date: "2024-03-20",
    author: "Education Team",
    excerpt: "How SignSense is being used in schools to make learning sign language fun and engaging for children.",
    category: "Education",
    tags: ["children", "education", "interactive"],
    image: "https://placehold.co/800x450/FFDEE2/D946EF?text=Children+Learning+ISL",
    content: "Learning a new language is always easier when it's fun, and sign language is no exception. Our education team has been working with schools across India to integrate SignSense technology into interactive learning experiences for children. Through gamified applications that respond to children's signing in real-time, we're making the learning process engaging and rewarding. Children love seeing animated characters respond to their signs, creating an immediate feedback loop that accelerates learning. Teachers have reported that this approach not only helps deaf children develop stronger language skills but also encourages hearing children to learn sign language, fostering greater inclusion in mixed classrooms. The applications include levels for different age groups, starting with simple vocabulary for young children and progressing to more complex grammatical concepts for older students..."
  },
  {
    id: 6,
    title: "SignSense API: Now Available for Developers",
    date: "2024-03-15",
    author: "Developer Relations",
    excerpt: "Announcing the public release of our SignSense API for developers who want to integrate sign language recognition into their applications.",
    category: "Technology",
    tags: ["API", "developers", "integration"],
    image: "https://placehold.co/800x450/D3E4FD/0EA5E9?text=SignSense+API",
    content: "We're excited to announce that the SignSense API is now available for developers! After extensive beta testing and refinement, we're opening our technology to the broader developer community. The API provides access to our state-of-the-art sign language recognition capabilities through simple REST endpoints. Developers can now integrate sign language recognition directly into their applications without needing expertise in computer vision or machine learning. The API supports both image and video input, allowing for both still sign recognition and continuous signing interpretation. Our comprehensive documentation includes code samples in multiple programming languages, making it easy to get started regardless of your technology stack. We're offering free tier access for non-commercial and educational projects, with paid plans available for commercial applications..."
  }
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<number | null>(null);

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="mb-4">Blog & Updates</h1>
        <p className="text-lg text-muted-foreground">
          Latest news, articles, and updates about SignSense and Indian Sign Language.
        </p>
      </div>

      {selectedPost === null ? (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search articles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex overflow-x-auto py-2 md:py-0 gap-2 no-scrollbar">
              {categories.map((category) => (
                <Badge 
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 whitespace-nowrap ${
                    selectedCategory === category 
                      ? "bg-blue hover:bg-blue/90" 
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search term or selecting a different category.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                      <User className="h-4 w-4 ml-2" />
                      {post.author}
                    </div>
                    <h3 className="text-xl font-semibold line-clamp-2">{post.title}</h3>
                    <Badge className="mt-2 bg-blue-light/20 text-blue-600 dark:text-blue-400 border-none">
                      {post.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-muted/50">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button 
                      variant="outline" 
                      className="w-full mt-4 group"
                      onClick={() => setSelectedPost(post.id)}
                    >
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            className="mb-6"
            onClick={() => setSelectedPost(null)}
          >
            ← Back to all articles
          </Button>
          
          {(() => {
            const post = blogPosts.find(p => p.id === selectedPost);
            if (!post) return null;
            
            return (
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <div className="rounded-xl overflow-hidden mb-8">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <Badge className="text-sm px-3 py-1">{post.category}</Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-xl font-medium text-muted-foreground mb-8">{post.excerpt}</p>
                
                <div className="space-y-4">
                  {post.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t">
                  <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogPosts
                      .filter(p => p.id !== post.id && p.category === post.category)
                      .slice(0, 2)
                      .map(relatedPost => (
                        <Card key={relatedPost.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2 line-clamp-2">{relatedPost.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto mt-2"
                              onClick={() => setSelectedPost(relatedPost.id)}
                            >
                              Read more
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </article>
            );
          })()}
        </div>
      )}
    </div>
  );
}
