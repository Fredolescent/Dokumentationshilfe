import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Person {
  id: string;
  name: string;
}

interface PersonSelectorProps {
  persons: Person[];
  selectedPersonId: string | null;
  onSelectPerson: (personId: string) => void;
}

export default function PersonSelector({
  persons,
  selectedPersonId,
  onSelectPerson,
}: PersonSelectorProps) {
  if (persons.length === 0) {
    return (
      <Card className="p-8 text-center">
        <User className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground">
          Noch keine Personen vorhanden
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Gehe zur Verwaltung um Personen hinzuzufügen
        </p>
      </Card>
    );
  }

  return (
    <ScrollArea className="max-h-[500px] pr-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {persons.map((person) => (
          <Button
            key={person.id}
            variant={selectedPersonId === person.id ? "default" : "outline"}
            className="h-auto py-3 px-4 text-sm font-medium whitespace-normal text-center justify-center"
            onClick={() => onSelectPerson(person.id)}
            data-testid={`button-person-${person.id}`}
          >
            {person.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
}
