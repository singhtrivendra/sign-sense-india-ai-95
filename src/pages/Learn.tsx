
import { useState, useEffect, useCallback, memo } from "react";
import { SignItem, useSignAPI } from "@/services/api";
import SignCard from "@/components/learn/SignCard";
import AlphabetFilter from "@/components/learn/AlphabetFilter";
import SearchAndFilters from "@/components/learn/SearchAndFilters";
import { useToast } from "@/components/ui/use-toast";
import { Book, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Memoize SignCard component for better performance
const MemoizedSignCard = memo(SignCard);

export default function Learn() {
  const [selectedLetter, setSelectedLetter] = useState("A");
  const [signs, setSigns] = useState<SignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const { fetchSigns } = useSignAPI();
  const { toast } = useToast();

  // Memoize the fetchSigns function to avoid unnecessary re-renders
  const loadSigns = useCallback(async () => {
    setLoading(true);
    try {
      console.log("Fetching signs for letter:", selectedLetter);
      const data = await fetchSigns(selectedLetter);
      setSigns(data);
    } catch (error) {
      console.error("Error loading signs:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load sign data. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedLetter, fetchSigns, toast]);

  useEffect(() => {
    loadSigns();
  }, [loadSigns]);

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    setSearchTerm("");
    setSelectedCategory("All Categories");
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Move filtering logic out of render for better performance
  const filteredSigns = useCallback(() => {
    return signs.filter((sign) => {
      const matchesSearch = searchTerm
        ? sign.title.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesCategory =
        selectedCategory === "All Categories" || sign.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [signs, searchTerm, selectedCategory]);

  const displaySigns = filteredSigns();

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-4">Indian Sign Language Dictionary</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore our comprehensive collection of Indian Sign Language signs.
          Browse by letter, search by name, or filter by category.
        </p>
      </div>

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertTitle>Integrated with Indian Sign Language</AlertTitle>
        <AlertDescription>
          This dictionary is powered by data from the official Indian Sign Language website. 
          Browse through our collection of signs organized alphabetically.
        </AlertDescription>
      </Alert>

      <AlphabetFilter
        selectedLetter={selectedLetter}
        onLetterSelect={handleLetterSelect}
      />

      <SearchAndFilters
        onSearch={handleSearch}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
        searchTerm={searchTerm}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg bg-card shadow animate-pulse h-72"
            ></div>
          ))}
        </div>
      ) : displaySigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displaySigns.map((sign) => (
            <MemoizedSignCard key={sign.id} sign={sign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Book className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No signs found</h3>
          <p className="text-muted-foreground">
            We couldn't find any signs matching your search criteria. Try
            adjusting your filters or search term.
          </p>
        </div>
      )}
    </div>
  );
}
