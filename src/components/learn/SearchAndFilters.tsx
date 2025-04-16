
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Common",
  "Greeting",
  "Question",
  "Action",
  "Object",
  "Emotion",
];

interface SearchAndFiltersProps {
  onSearch: (term: string) => void;
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  searchTerm: string;
}

export default function SearchAndFilters({
  onSearch,
  onCategoryChange,
  selectedCategory,
  searchTerm,
}: SearchAndFiltersProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  
  const handleSearch = () => {
    onSearch(localSearchTerm);
  };
  
  const handleClear = () => {
    setLocalSearchTerm("");
    onSearch("");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-card shadow-sm rounded-lg p-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="search">Search Signs</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by sign name..."
              className="pl-8"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            {localSearchTerm && (
              <button
                onClick={handleClear}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select 
            value={selectedCategory} 
            onValueChange={onCategoryChange}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
