
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { getProductRecommendations } from "@/ai/flows/product-recommendations";
import { Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type RecommendationModalProps = {
  productName: string;
  children: React.ReactNode;
};

export function RecommendationModal({ productName, children }: RecommendationModalProps) {
  const [open, setOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && recommendations.length === 0) {
      setLoading(true);
      try {
        const result = await getProductRecommendations({ productName });
        setRecommendations(result.recommendedProducts);
      } catch (e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Error de IA",
            description: "No se pudieron obtener las recomendaciones. Inténtalo de nuevo más tarde."
        });
        setOpen(false); // Close modal on error
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            <span>Sugerencias para ti</span>
          </DialogTitle>
          <DialogDescription>
            Basado en &quot;{productName}&quot;, también te podría gustar:
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 min-h-[120px] flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span>Buscando recomendaciones...</span>
            </div>
          )}
          {!loading && recommendations.length > 0 && (
            <ul className="space-y-2 list-disc list-inside w-full">
              {recommendations.map((item, index) => (
                <li key={index} className="text-foreground">{item}</li>
              ))}
            </ul>
          )}
          {!loading && recommendations.length === 0 && (
            <p className="text-muted-foreground">No se encontraron recomendaciones por ahora.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
