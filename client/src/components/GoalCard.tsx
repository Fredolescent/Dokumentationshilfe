import { format, differenceInDays, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar, Check, Pencil, Trash2, Copy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Goal } from "@shared/schema";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onToggleStatus: (goalId: string) => void;
  onCopy: (text: string, label: string) => void;
}

function getDaysUntilDue(dueDate: string | null): number | null {
  if (!dueDate) return null;
  try {
    return differenceInDays(parseISO(dueDate), new Date());
  } catch {
    return null;
  }
}

export default function GoalCard({ goal, onEdit, onDelete, onToggleStatus, onCopy }: GoalCardProps) {
  const daysUntil = getDaysUntilDue(goal.dueDate);
  const isOverdue = daysUntil !== null && daysUntil < 0;
  const isDueSoon = daysUntil !== null && daysUntil >= 0 && daysUntil <= 7;
  const isCompleted = goal.status === "completed";

  return (
    <Card
      className={`p-4 ${
        isOverdue && !isCompleted
          ? "border-l-4 border-l-destructive"
          : isDueSoon && !isCompleted
          ? "border-l-4 border-l-chart-3 border-l-dashed"
          : ""
      }`}
      data-testid={`goal-card-${goal.id}`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-lg">{goal.title}</h4>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={isCompleted ? "default" : "secondary"}
              className={isCompleted ? "bg-chart-2 hover:bg-chart-2/80" : ""}
              data-testid={`status-${goal.status}`}
            >
              {isCompleted ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Erreicht
                </>
              ) : (
                "Offen"
              )}
            </Badge>
          </div>
        </div>

        {goal.dueDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Fällig: {format(parseISO(goal.dueDate), "dd.MM.yyyy", { locale: de })}
            </span>
            {daysUntil !== null && !isCompleted && (
              <Badge
                variant="outline"
                className={
                  isOverdue
                    ? "border-destructive text-destructive"
                    : isDueSoon
                    ? "border-chart-3 text-chart-3"
                    : ""
                }
              >
                {isOverdue
                  ? `${Math.abs(daysUntil)} Tage überfällig`
                  : isDueSoon
                  ? `in ${daysUntil} ${daysUntil === 1 ? "Tag" : "Tagen"}`
                  : `in ${daysUntil} Tagen`}
              </Badge>
            )}
          </div>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <div>
            <span className="font-medium text-foreground">Beschreibung:</span>
            <p className="mt-1">{goal.description}</p>
          </div>
          <div>
            <span className="font-medium text-foreground">Maßnahme:</span>
            <p className="mt-1">{goal.measure}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCopy(goal.title, "Titel")}
            data-testid="button-copy-title"
          >
            <Copy className="h-3 w-3 mr-1" />
            Titel
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCopy(goal.description, "Beschreibung")}
            data-testid="button-copy-description"
          >
            <Copy className="h-3 w-3 mr-1" />
            Beschreibung
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCopy(goal.measure, "Maßnahme")}
            data-testid="button-copy-measure"
          >
            <Copy className="h-3 w-3 mr-1" />
            Maßnahme
          </Button>
          <div className="flex-1" />
          <Button
            size="sm"
            variant={isCompleted ? "outline" : "default"}
            onClick={() => onToggleStatus(goal.id)}
            data-testid="button-toggle-status"
          >
            {isCompleted ? "Wieder öffnen" : "Als erreicht markieren"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(goal)}
            data-testid="button-edit-goal"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(goal.id)}
            data-testid="button-delete-goal"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
