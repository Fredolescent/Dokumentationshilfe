import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface WorkBehaviorCategory {
  id: string;
  category: string;
  choices: string[];
}

export interface Selection {
  categoryId: string;
  category: string;
  choice: string;
  order: number;
}

interface WorkBehaviorSelectionProps {
  categories: WorkBehaviorCategory[];
  onSelectionsChange: (selections: Selection[]) => void;
}

export default function WorkBehaviorSelection({
  categories,
  onSelectionsChange,
}: WorkBehaviorSelectionProps) {
  const [selections, setSelections] = useState<Map<string, Selection>>(new Map());

  useEffect(() => {
    onSelectionsChange(Array.from(selections.values()));
  }, [selections, onSelectionsChange]);

  const handleChoiceClick = (category: WorkBehaviorCategory, choice: string) => {
    setSelections((prev) => {
      const newSelections = new Map(prev);
      const key = category.id;
      const existingSelection = newSelections.get(key);

      if (existingSelection?.choice === choice) {
        // Deselect: remove and recalculate order numbers
        newSelections.delete(key);
        
        // Recalculate order numbers for remaining selections
        const sortedSelections = Array.from(newSelections.values())
          .sort((a, b) => a.order - b.order);
        
        newSelections.clear();
        sortedSelections.forEach((sel, index) => {
          newSelections.set(sel.categoryId, {
            ...sel,
            order: index + 1,
          });
        });
      } else if (existingSelection) {
        // Replace: switching between positive/negative in same category - keep existing order
        newSelections.set(key, {
          categoryId: category.id,
          category: category.category,
          choice,
          order: existingSelection.order,
        });
      } else {
        // New selection: add with next order number
        newSelections.set(key, {
          categoryId: category.id,
          category: category.category,
          choice,
          order: newSelections.size + 1,
        });
      }
      
      return newSelections;
    });
  };

  const isSelected = (categoryId: string, choice: string) => {
    return selections.get(categoryId)?.choice === choice;
  };

  const getSelectionOrder = (categoryId: string, choice: string) => {
    const selection = selections.get(categoryId);
    if (selection?.choice === choice) {
      return selection.order;
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {categories.map((category) => (
        <Card key={category.id} className="p-6" data-testid={`category-${category.id}`}>
          <h3 className="font-semibold mb-4">{category.category}</h3>
          <div className="grid grid-cols-2 gap-3">
            {category.choices.map((choice, index) => {
              const selected = isSelected(category.id, choice);
              const order = getSelectionOrder(category.id, choice);
              const isPositive = index === 0; // First choice is positive, second is negative

              return (
                <div
                  key={choice}
                  className={`relative p-3 rounded-md cursor-pointer transition-colors hover-elevate active-elevate-2 ${
                    selected
                      ? isPositive
                        ? "bg-chart-2/20 border-2 border-chart-2"
                        : "bg-destructive/20 border-2 border-destructive"
                      : "bg-muted border-2 border-transparent"
                  }`}
                  onClick={() => handleChoiceClick(category, choice)}
                  data-testid={`choice-${category.id}-${choice}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={selected ? "font-medium" : ""}>{choice}</span>
                    {selected && (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary text-primary-foreground" data-testid={`order-${order}`}>
                          {order}
                        </Badge>
                        <Check className={`h-5 w-5 ${isPositive ? "text-chart-2" : "text-destructive"}`} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
