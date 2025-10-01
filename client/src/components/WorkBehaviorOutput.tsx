import { Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Selection {
  categoryId: string;
  category: string;
  choice: string;
  order: number;
}

interface WorkBehaviorOutputProps {
  selections: Selection[];
  personName: string;
  documentingPerson: string;
  categories: Array<{ id: string; category: string; choices: string[] }>;
  onCopy: (text: string, label: string) => void;
}

export default function WorkBehaviorOutput({
  selections,
  personName,
  documentingPerson,
  categories,
  onCopy,
}: WorkBehaviorOutputProps) {
  // Remove emoji and number from category name
  const cleanCategoryName = (categoryName: string): string => {
    // Remove emoji and number prefix (e.g., "🧠 1. Konzentration" -> "Konzentration")
    // Match emoji (any non-ASCII char) followed by optional space, then number with dot and space
    return categoryName.replace(/^[^\x00-\x7F\s]*\s*\d+\.\s*/, '').trim();
  };

  // Determine if a choice is positive or negative based on its index
  const isPositive = (categoryId: string, choice: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return true;
    const index = category.choices.indexOf(choice);
    return index === 0; // First choice is positive, second is negative
  };

  // Build header with +/- symbol (only first selection)
  const firstSelection = selections[0];
  const headerSymbol = firstSelection ? (isPositive(firstSelection.categoryId, firstSelection.choice) ? "+" : "-") : "";
  const cleanedCategoryName = firstSelection ? cleanCategoryName(firstSelection.category) : "";
  const header = firstSelection ? `${cleanedCategoryName} ${headerSymbol}` : "";

  // Build the documentation text with grammatically correct German
  const textParts = selections.map(s => s.choice.replace(/\.+$/, '').trim()); // Remove trailing periods
  
  let concatenatedText = "";
  if (textParts.length === 1) {
    concatenatedText = textParts[0];
  } else if (textParts.length === 2) {
    concatenatedText = `${textParts[0]} und ${textParts[1]}`;
  } else if (textParts.length > 2) {
    const allButLast = textParts.slice(0, -1);
    const last = textParts[textParts.length - 1];
    concatenatedText = `${allButLast.join(', ')} und ${last}`;
  }
  
  const documentationText = `${documentingPerson || "[Name nicht angegeben]"} (GL): ${personName} (BE) ${concatenatedText}.`;

  return (
    <div className="sticky bottom-0 z-50 bg-background border-t shadow-lg">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Überschrift</h3>
                <div className="space-y-1" data-testid="text-behavior-headers">
                  {firstSelection && (
                    <div className="text-base">
                      {cleanedCategoryName} {headerSymbol}
                    </div>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCopy(header, "Überschrift")}
                data-testid="button-copy-headers"
              >
                <Copy className="h-3 w-3 mr-1" />
                Kopieren
              </Button>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Dokumentationstext</h3>
                  <p className="text-base" data-testid="text-behavior-documentation">
                    {documentationText}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCopy(documentationText, "Dokumentationstext")}
                  data-testid="button-copy-text"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Kopieren
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
