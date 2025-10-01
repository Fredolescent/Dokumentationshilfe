import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface ActivityArea {
  id: string;
  name: string;
}

export interface Activity {
  id: string;
  areaId: string;
  title: string;
  description: string;
  measure: string;
}

interface ActivitySelectionProps {
  areas: ActivityArea[];
  activities: Activity[];
  onSelectActivity: (activity: Activity) => void;
}

export default function ActivitySelection({
  areas,
  activities,
  onSelectActivity,
}: ActivitySelectionProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Tätigkeit auswählen</h3>
      
      {areas.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Keine Tätigkeitsbereiche vorhanden.</p>
          <p className="text-sm mt-1">Gehe zur Verwaltung um Bereiche hinzuzufügen.</p>
        </div>
      )}

      {areas.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          {areas.map((area) => {
            const areaActivities = activities.filter((a) => a.areaId === area.id);
            
            return (
              <AccordionItem key={area.id} value={area.id} data-testid={`accordion-area-${area.id}`}>
                <AccordionTrigger className="text-left font-medium">
                  {area.name}
                </AccordionTrigger>
                <AccordionContent>
                  {areaActivities.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">
                      Keine Tätigkeiten in diesem Bereich.
                    </p>
                  ) : (
                    <div className="space-y-2 pt-2">
                      {areaActivities.map((activity) => (
                        <Button
                          key={activity.id}
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-3 px-4"
                          onClick={() => onSelectActivity(activity)}
                          data-testid={`button-activity-${activity.id}`}
                        >
                          <div className="flex flex-col items-start gap-1">
                            <span className="font-medium">{activity.title}</span>
                            <span className="text-xs text-muted-foreground line-clamp-2">
                              {activity.description}
                            </span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </Card>
  );
}
