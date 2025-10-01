import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import HelpDialog from "../HelpDialog";

export default function HelpDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)} data-testid="button-open-help">
        <HelpCircle className="h-4 w-4 mr-2" />
        Hilfe öffnen
      </Button>
      <HelpDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
