
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export type SignItem = {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  description?: string;
  category?: string;
  letter: string;
};

// Cache to store previously fetched sign data
const signCache: Record<string, SignItem[]> = {};

export async function fetchSignsForLetter(letter: string): Promise<SignItem[]> {
  // Return cached data if available
  if (signCache[letter]) {
    console.log(`Using cached data for letter ${letter}`);
    return signCache[letter];
  }

  console.log(`Fetching new data for letter ${letter}`);
  
  // Generate mock data for all letters of the alphabet
  const result = getMockSignsForLetter(letter);
  
  // Store in cache for future use
  signCache[letter] = result;
  
  return result;
}

function getMockSignsForLetter(letter: string): SignItem[] {
  // Fixed count for better performance
  const count = 8;
  const categories = ['Common', 'Greeting', 'Question', 'Action', 'Object', 'Emotion'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = `${letter.toLowerCase()}-${i + 1}`;
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const title = `${letter}${getRandomWord(3, 8)}`;
    
    return {
      id,
      title: title,
      imageUrl: `https://placehold.co/400x300/D3E4FD/33C3F0?text=${encodeURIComponent(title)}`,
      videoUrl: i % 3 === 0 ? `https://example.com/videos/${id}.mp4` : undefined,
      description: `This is the sign for ${title}. ${getRandomSentence()}`,
      category: randomCategory,
      letter,
    };
  });
}

function getRandomWord(minLength: number, maxLength: number): string {
  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'];
  
  let word = '';
  for (let i = 0; i < length; i++) {
    if (i % 2 === 0) {
      word += consonants[Math.floor(Math.random() * consonants.length)];
    } else {
      word += vowels[Math.floor(Math.random() * vowels.length)];
    }
  }
  
  return word;
}

function getRandomSentence(): string {
  const sentences = [
    'This sign is commonly used in everyday conversation.',
    'Use this sign when greeting someone or saying goodbye.',
    'This sign represents an action typically performed with hands.',
    'A popular sign used in formal settings.',
    'This sign has cultural significance in Indian Sign Language.',
    'You can use this sign to express emotion or feelings.',
    'This sign is often combined with others to form complex expressions.',
    'A basic sign that beginners should learn first.',
  ];
  
  return sentences[Math.floor(Math.random() * sentences.length)];
}

export function useSignAPI() {
  const { toast } = useToast();
  
  const fetchSigns = async (letter: string): Promise<SignItem[]> => {
    try {
      return await fetchSignsForLetter(letter);
    } catch (error) {
      console.error("Error in useSignAPI:", error);
      toast({
        title: "Error fetching signs",
        description: "There was a problem retrieving sign language data.",
        variant: "destructive"
      });
      return [];
    }
  };
  
  return { fetchSigns };
}
