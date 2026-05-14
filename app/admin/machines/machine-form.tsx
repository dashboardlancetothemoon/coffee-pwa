"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MACHINE_CATEGORY_LABELS } from "@/lib/schemas/machine";
import { createMachine, updateMachine } from "@/lib/actions/machines";
import type { CoffeeMachine } from "@/types/database";

type FormErrors = Record<string, string[] | undefined>;

type Props =
  | { mode: "create"; machine?: undefined; machineId?: undefined }
  | { mode: "edit"; machineId: string; machine: CoffeeMachine };

export function MachineForm({ mode, machineId, machine }: Props) {
  const action =
    mode === "create" ? createMachine : updateMachine.bind(null, machineId!);

  const [state, formAction, pending] = useActionState(
    async (
      _prev: { error: FormErrors } | undefined,
      formData: FormData
    ) => {
      const result = await action(formData);
      return result as { error: FormErrors } | undefined;
    },
    undefined
  );

  const err = (state?.error ?? {}) as FormErrors;
  const rootError = err["_root"]?.[0];
  const p = machine?.parameters;

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-lg">
      {rootError && (
        <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
          {rootError}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Marque" name="brand" defaultValue={machine?.brand} error={err.brand} />
        <Field label="Modèle" name="model" defaultValue={machine?.model} error={err.model} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Catégorie</Label>
        <Select name="category" defaultValue={machine?.category ?? "espresso_auto"}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(MACHINE_CATEGORY_LABELS) as [string, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <fieldset className="border rounded-md p-4 flex flex-col gap-3">
        <legend className="text-sm font-medium px-1">Paramètres machine</legend>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Pression max (bars)" name="pression_max_bars" type="number" defaultValue={p?.pression_max_bars} />
          <Field label="Réservoir (ml)" name="reservoir_ml" type="number" defaultValue={p?.reservoir_ml} />
          <Field label="Temp. min (°C)" name="temperature_min_c" type="number" defaultValue={p?.temperature_min_c} />
          <Field label="Temp. max (°C)" name="temperature_max_c" type="number" defaultValue={p?.temperature_max_c} />
          <Field label="Dose min (g)" name="dose_min_g" type="number" defaultValue={p?.dose_min_g} />
          <Field label="Dose max (g)" name="dose_max_g" type="number" defaultValue={p?.dose_max_g} />
        </div>
        <div className="flex gap-6">
          <CheckField label="Mouture réglable" name="granulometrie_reglable" defaultChecked={p?.granulometrie_reglable ?? false} />
          <CheckField label="Buse vapeur" name="buse_vapeur" defaultChecked={p?.buse_vapeur ?? false} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            defaultValue={p?.notes ?? ""}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
          />
        </div>
      </fieldset>

      <Button type="submit" disabled={pending}>
        {pending ? "Enregistrement…" : "Enregistrer"}
      </Button>
    </form>
  );
}

function Field({ label, name, type = "text", defaultValue, error }: {
  label: string; name: string; type?: string;
  defaultValue?: string | number; error?: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} step={type === "number" ? "0.1" : undefined} defaultValue={defaultValue ?? ""} />
      {error && <p className="text-xs text-destructive">{error[0]}</p>}
    </div>
  );
}

function CheckField({ label, name, defaultChecked }: { label: string; name: string; defaultChecked: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 rounded border border-input" />
      {label}
    </label>
  );
}
