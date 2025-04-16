
import { Button } from "@/components/ui/button";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface AlphabetFilterProps {
  selectedLetter: string;
  onLetterSelect: (letter: string) => void;
}

export default function AlphabetFilter({
  selectedLetter,
  onLetterSelect,
}: AlphabetFilterProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">Filter by Letter</h3>
      <div className="flex flex-wrap gap-2">
        {ALPHABET.map((letter) => (
          <Button
            key={letter}
            variant={selectedLetter === letter ? "default" : "outline"}
            size="sm"
            className={`w-9 h-9 p-0 font-medium ${
              selectedLetter === letter
                ? "bg-blue text-white"
                : "hover:bg-blue-light/50"
            }`}
            onClick={() => onLetterSelect(letter)}
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>
  );
}
