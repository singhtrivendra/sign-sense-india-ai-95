import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const SCRAPER_API_KEY = '8f5f7c7fbd1c86ef67af1cbe4e423f57';
const BASE_URL = 'https://api.scraperapi.com';

export type SignItem = {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl?: string;
  description?: string;
  category?: string;
  letter: string;
};

export async function fetchSignsForLetter(letter: string): Promise<SignItem[]> {
  const signData = {
    'A': [
      { id: 'a1', title: 'Abbreviation', imageUrl: '/signs/abbreviation.jpg', category: 'Common', description: 'Sign for shortening a word or phrase', letter: 'A' },
      { id: 'a2', title: 'Abeyance', imageUrl: '/signs/abeyance.jpg', category: 'Legal', description: 'Sign representing temporary inactivity', letter: 'A' },
      { id: 'a3', title: 'About', imageUrl: '/signs/about.jpg', category: 'Common', description: 'Sign for expressing information regarding something', letter: 'A' },
      { id: 'a4', title: 'Above', imageUrl: '/signs/above.jpg', category: 'Direction', description: 'Sign indicating higher position', letter: 'A' },
      // ... more A signs
    ],
    'B': [
      { id: 'b1', title: 'Banking', imageUrl: '/signs/banking.jpg', category: 'Finance', description: 'Sign related to financial transactions', letter: 'B' },
      { id: 'b2', title: 'Before', imageUrl: '/signs/before.jpg', category: 'Time', description: 'Sign indicating prior occurrence', letter: 'B' },
    ],
    // ... other letters
  };

  return signData[letter] || [];
}

function parseSignsFromHTML(html: string, letter: string): SignItem[] {
  // In a real implementation, we would parse the HTML here
  // For now, we'll return mock data
  return getMockSignsForLetter(letter);
}

function getMockSignsForLetter(letter: string): SignItem[] {
  const categories = ['Common', 'Greeting', 'Question', 'Action', 'Object', 'Emotion'];
  
  // Generate between 5-15 mock signs for the given letter
  const count = Math.floor(Math.random() * 10) + 5;
  
  return Array.from({ length: count }, (_, i) => {
    const id = `${letter.toLowerCase()}-${i + 1}`;
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    return {
      id,
      title: `${letter}${getRandomWord(3, 8)}`,
      imageUrl: `https://placehold.co/400x300/D3E4FD/33C3F0?text=${letter}+Sign+${i + 1}`,
      videoUrl: i % 3 === 0 ? `https://example.com/videos/${id}.mp4` : undefined,
      description: `This is the sign for ${letter}${getRandomWord(3, 8)}. ${getRandomSentence()}`,
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
