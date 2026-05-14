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
import { COFFEE_CATEGORY_LABELS } from "@/lib/schemas/coffee-type";
import { createCoffeeType, updateCoffeeType } from "@/lib/actions/coffee-types";
import type { CoffeeType } from "@/types/database";

type FormErrors = Record<string, string[] | undefined>;

type Props =
  | { mode: "create"; coffeeType?: undefined; coffeeTypeId?: undefined }
  | { mode: "edit"; coffeeTypeId: string; coffeeType: CoffeeType };

export function CoffeeTypeForm({ mode, coffeeTypeId, coffeeType }: Props) {
  const action =
    mode === "create" ? createCoffeeType : updateCoffeeType.bind(null, coffeeTypeId!);

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
  const ip = coffeeType?.ideal_parameters;

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-lg">
      {rootError && (
        <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
          {rootError}
        </p>
      )}

      <Field label="Nom" name="name" defaultValue={coffeeType?.name} error={err.name} />

      <div className="flex flex-col gap-1.5">
        <Label>Catégorie</Label>
        <Select name="category" defaultValue={coffeeType?.category ?? "espresso"}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(COFFEE_CATEGORY_LABELS) as [string, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={coffeeType?.description ?? ""}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
        />
      </div>

      <fieldset className="border rounded-md p-4 flex flex-col gap-3">
        <legend className="text-sm font-medium px-1">Paramètres idéaux</legend>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Dose (g)" name="dose_g" type="number" defaultValue={ip?.dose_g} error={err.dose_g} />
          <Field label="Ratio (1:x)" name="ratio" type="number" defaultValue={ip?.ratio} error={err.ratio} />
          <Field label="Mouture" name="mouture" defaultValue={ip?.mouture} error={err.mouture} />
          <Field label="Température (°C)" name="temperature_c" type="number" defaultValue={ip?.temperature_c} />
          <Field label="Pression (bars)" name="pression_bars" type="number" defaultValue={ip?.pression_bars} />
          <Field label="Extraction (s)" name="temps_extraction_s" type="number" defaultValue={ip?.temps_extraction_s} />
          <Field label="Lait (ml)" name="lait_ml" type="number" defaultValue={ip?.lait_ml} />
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
