import { Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reverseName } from "@/lib/nameUtils";

interface Activity {
  title: string;
  description: string;
  measure: string;
}

interface ActivityOutputProps {
  activity: Activity;
  personName: string;
  documentingPerson: string;
  onCopy: (text: string, label: string) => void;
}

export default function ActivityOutput({
  activity,
  personName,
  documentingPerson,
  onCopy,
}: ActivityOutputProps) {
  const reversedDocumentingPerson = reverseName(documentingPerson || "[Name nicht angegeben]");
  const formattedDescription = `${documentingPerson || "[Name nicht angegeben]"} (GL): ${personName} (BE) ${activity.description}`;

  return (
    <div className="sticky bottom-0 z-50 bg-background border-t shadow-lg">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <Card className="p-6">
          <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Titel</h3>
              <p className="text-base" data-testid="text-activity-title">{activity.title}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCopy(activity.title, "Titel")}
              data-testid="button-copy-title"
            >
              <Copy className="h-3 w-3 mr-1" />
              Kopieren
            </Button>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Dokumentiert von</h3>
                <p className="text-base" data-testid="text-documenting-person">{reversedDocumentingPerson}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCopy(reversedDocumentingPerson, "Dokumentiert von")}
                data-testid="button-copy-documenting-person"
              >
                <Copy className="h-3 w-3 mr-1" />
                Kopieren
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Beschreibung</h3>
                <p className="text-base" data-testid="text-activity-description">{formattedDescription}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCopy(formattedDescription, "Beschreibung")}
                data-testid="button-copy-description"
              >
                <Copy className="h-3 w-3 mr-1" />
                Kopieren
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Maßnahme</h3>
                <p className="text-base" data-testid="text-activity-measure">{activity.measure}</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCopy(activity.measure, "Maßnahme")}
                data-testid="button-copy-measure"
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
