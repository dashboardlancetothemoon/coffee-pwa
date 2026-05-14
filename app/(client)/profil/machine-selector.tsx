"use client";

import { useState, useTransition } from "react";
import { updateMachinePreference } from "@/lib/actions/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { CoffeeMachine } from "@/types/database";
import { MACHINE_CATEGORY_LABELS } from "@/lib/schemas/machine";

interface Props {
  machines: CoffeeMachine[];
  currentMachineId: string | null;
}

export function MachineSelector({ machines, currentMachineId }: Props) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(currentMachineId ?? "");
  const [isPending, startTransition] = useTransition();

  const filtered = machines.filter((m) =>
    `${m.brand} ${m.model}`.toLowerCase().includes(search.toLowerCase())
  );

  const selectedMachine = machines.find((m) => m.id === selectedId);
  const hasChanged = selectedId !== (currentMachineId ?? "");

  function handleSave() {
    const formData = new FormData();
    formData.set("machine_id", selectedId);
    startTransition(async () => {
      const result = await updateMachinePreference(formData);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Machine mise à jour");
        setSearch("");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Rechercher une machine…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {search && (
        <div className="border rounded-xl overflow-hidden divide-y max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              Aucune machine trouvée.
            </p>
          ) : (
            filtered.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedId(m.id);
                  setSearch("");
                }}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors ${
                  selectedId === m.id ? "bg-muted" : ""
                }`}
              >
                <span className="font-medium">
                  {m.brand} {m.model}
                </span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {MACHINE_CATEGORY_LABELS[m.category]}
                </span>
              </button>
            ))
          )}
        </div>
      )}

      {selectedMachine && !search && (
        <p className="text-sm text-muted-foreground px-1">
          Sélectionnée : {selectedMachine.brand} {selectedMachine.model}
        </p>
      )}

      {hasChanged && (
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Enregistrement…" : "Enregistrer ma machine"}
        </Button>
      )}
    </div>
  );
}
