import { z } from "zod";

export const CoffeeCategorySchema = z.enum([
  "espresso",
  "allonge",
  "lacte",
  "filtre",
]);

export const CoffeeIdealParametersSchema = z.object({
  dose_g: z.coerce.number().min(1).max(50),
  ratio: z.coerce.number().min(1).max(30),
  mouture: z.string().min(1, "Mouture requise").max(50),
  temperature_c: z.coerce.number().min(60).max(100),
  pression_bars: z.coerce.number().min(0).max(30).optional(),
  temps_extraction_s: z.coerce.number().min(0).max(600).optional(),
  lait_ml: z.coerce.number().min(0).max(500).optional(),
});

export const CoffeeTypeFormSchema = z.object({
  name: z.string().min(1, "Nom requis").max(100),
  category: CoffeeCategorySchema,
  ideal_parameters: CoffeeIdealParametersSchema,
  description: z.string().max(500).default(""),
});

export type CoffeeTypeFormValues = z.infer<typeof CoffeeTypeFormSchema>;

export const COFFEE_CATEGORY_LABELS: Record<
  z.infer<typeof CoffeeCategorySchema>,
  string
> = {
  espresso: "Espresso",
  allonge: "Allongé",
  lacte: "Lacté",
  filtre: "Filtre",
};
