import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const goalFormSchema = z.object({
  title: z.string().min(1, "Titel ist erforderlich"),
  description: z.string().min(1, "Beschreibung ist erforderlich"),
  measure: z.string().min(1, "Maßnahme ist erforderlich"),
  dueDate: z.string().optional(),
});

export type GoalFormData = z.infer<typeof goalFormSchema>;

interface GoalFormProps {
  initialData?: Partial<GoalFormData>;
  onSubmit: (data: GoalFormData) => void;
  onCancel?: () => void;
}

export default function GoalForm({ initialData, onSubmit, onCancel }: GoalFormProps) {
  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      measure: initialData?.measure || "",
      dueDate: initialData?.dueDate || "",
    },
  });

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titel</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Z.B. Verbesserung der Konzentration"
                    {...field}
                    data-testid="input-goal-title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beschreibung</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Beschreiben Sie das Ziel..."
                    rows={3}
                    {...field}
                    data-testid="input-goal-description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="measure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maßnahme</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Welche Maßnahmen werden ergriffen?"
                    rows={3}
                    {...field}
                    data-testid="input-goal-measure"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fälligkeitsdatum (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    data-testid="input-goal-due-date"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" data-testid="button-submit-goal">
              {initialData ? "Aktualisieren" : "Erstellen"}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                data-testid="button-cancel-goal"
              >
                Abbrechen
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Card>
  );
}
