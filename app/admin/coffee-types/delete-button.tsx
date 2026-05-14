"use client";

import { Button } from "@/components/ui/button";
import { deleteCoffeeType } from "@/lib/actions/coffee-types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteCoffeeTypeButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Supprimer ce type de café ?")) return;
    const result = await deleteCoffeeType(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Café supprimé");
      router.refresh();
    }
  }

  return (
    <Button size="sm" variant="destructive" onClick={handleDelete}>
      Supprimer
    </Button>
  );
}
