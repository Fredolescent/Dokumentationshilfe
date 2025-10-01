import { Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface OutputDisplayProps {
  content: string;
  title?: string;
  onCopy?: () => void;
}

export default function OutputDisplay({ content, title = "Generierte Dokumentation", onCopy }: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!content) {
    return null;
  }

  return (
    <Card className="p-6 bg-muted/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCopy}
          data-testid="button-copy-output"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Kopiert!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Kopieren
            </>
          )}
        </Button>
      </div>
      <div className="prose prose-sm max-w-none">
        <p className="whitespace-pre-wrap text-sm">{content}</p>
      </div>
    </Card>
  );
}
