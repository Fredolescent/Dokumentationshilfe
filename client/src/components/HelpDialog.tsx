import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Anleitung zur Dokumentationshilfe</DialogTitle>
          <DialogDescription>
            Diese Anwendung unterstützt bei der schnellen und einheitlichen Dokumentation.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="font-semibold text-base mb-3">So funktioniert's</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Gib deinen Namen als dokumentierende Person ein.</li>
                <li>Wähle die beschäftigte Person über die Personenkarten aus.</li>
                <li>Nutze die Tabs für verschiedene Dokumentationsarten</li>
              </ol>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">Arbeitsverhalten dokumentieren</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Wähle passende Kategorien aus den verschiedenen Bereichen.</li>
                <li>Klicke auf "Dokumentation erstellen".</li>
                <li>Kopiere die generierte Dokumentation mit einem Klick.</li>
                <li>"Zurücksetzen" löscht alle Auswahlen.</li>
              </ol>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">Tätigkeiten dokumentieren</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Wähle zunächst einen Bereich aus.</li>
                <li>Wähle dann eine konkrete Tätigkeit.</li>
                <li>"Dokumentation erstellen" erzeugt Titel, Beschreibung und Maßnahme.</li>
                <li>Kopiere einzelne Felder mit den entsprechenden Buttons.</li>
              </ol>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">Ziele verwalten</h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Wähle eine Person aus.</li>
                <li>Klicke auf "Neues Ziel" um ein Ziel hinzuzufügen.</li>
                <li>Gib Titel, Beschreibung, Maßnahme und optional ein Fälligkeitsdatum an.</li>
                <li>Fällige Ziele werden farblich hervorgehoben.</li>
                <li>Markiere erreichte Ziele als "Erreicht".</li>
              </ol>
            </section>

            <section>
              <h3 className="font-semibold text-base mb-3">Datensicherheit</h3>
              <p className="text-muted-foreground">
                Alle Daten werden sicher auf dem Server gespeichert. Sichere regelmäßig wichtige
                Informationen durch Export-Funktionen.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
