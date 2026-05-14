"use client";

import { Button } from "@/components/ui/button";
import { deleteMachine } from "@/lib/actions/machines";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteMachineButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Supprimer cette machine ?")) return;
    const result = await deleteMachine(id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Machine supprimée");
      router.refresh();
    }
  }

  return (
    <Button size="sm" variant="destructive" onClick={handleDelete}>
      Supprimer
    </Button>
  );
}
