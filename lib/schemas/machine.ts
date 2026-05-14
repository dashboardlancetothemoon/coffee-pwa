import { z } from "zod";

export const MachineCategorySchema = z.enum([
  "espresso_auto",
  "espresso_manuel",
  "capsule",
  "filtre",
  "piston",
  "moka",
]);

export const MachineParametersSchema = z.object({
  pression_max_bars: z.coerce.number().min(0).max(30).optional(),
  temperature_min_c: z.coerce.number().min(0).max(120).optional(),
  temperature_max_c: z.coerce.number().min(0).max(120).optional(),
  dose_min_g: z.coerce.number().min(0).max(100).optional(),
  dose_max_g: z.coerce.number().min(0).max(100).optional(),
  granulometrie_reglable: z.boolean(),
  buse_vapeur: z.boolean(),
  reservoir_ml: z.coerce.number().min(0).max(10000).optional(),
  notes: z.string().max(500).optional(),
});

export const MachineFormSchema = z.object({
  brand: z.string().min(1, "Marque requise").max(100),
  model: z.string().min(1, "Modèle requis").max(100),
  category: MachineCategorySchema,
  parameters: MachineParametersSchema,
});

export type MachineFormValues = z.infer<typeof MachineFormSchema>;

export const MACHINE_CATEGORY_LABELS: Record<
  z.infer<typeof MachineCategorySchema>,
  string
> = {
  espresso_auto: "Espresso automatique",
  espresso_manuel: "Espresso manuel",
  capsule: "Capsule",
  filtre: "Filtre",
  piston: "Piston (French press)",
  moka: "Moka",
};
