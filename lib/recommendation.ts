import type {
  CoffeeMachine,
  CoffeeType,
  MachineParameters,
  CoffeeIdealParameters,
  MachineCategory,
} from "@/types/database";

export interface RecipeStep {
  order: number;
  label: string;
  detail?: string;
  duration_s?: number;
}

export interface RecipeResult {
  parameters: {
    dose_g: number;
    ratio: number;
    water_ml: number;
    temperature_c: number;
    pression_bars: number | null;
    mouture: string;
    temps_extraction_s: number | null;
    lait_ml: number | null;
  };
  steps: RecipeStep[];
  estimated_time_s: number;
  warnings: string[];
}

// ── Public API ────────────────────────────────────────────────────────────────

export function computeRecipe(
  coffeeType: CoffeeType,
  machine: CoffeeMachine
): RecipeResult {
  const ideal = coffeeType.ideal_parameters;
  const params = machine.parameters;
  const warnings: string[] = [];

  const adjusted = adjustParameters(ideal, params, machine.category, warnings);
  const steps = generateSteps(coffeeType, machine, adjusted);
  const estimated_time_s = estimateTime(steps);

  return { parameters: adjusted, steps, estimated_time_s, warnings };
}

// ── Parameter adjustment ─────────────────────────────────────────────────────

function adjustParameters(
  ideal: CoffeeIdealParameters,
  params: MachineParameters,
  category: MachineCategory,
  warnings: string[]
): RecipeResult["parameters"] {
  // Capsule: fixed parameters, nothing adjustable
  if (category === "capsule") {
    warnings.push(
      "Machine à capsules : les paramètres sont gérés automatiquement."
    );
    return {
      dose_g: ideal.dose_g,
      ratio: ideal.ratio,
      water_ml: Math.round(ideal.dose_g * ideal.ratio),
      temperature_c: ideal.temperature_c,
      pression_bars: ideal.pression_bars ?? null,
      mouture: "capsule (non réglable)",
      temps_extraction_s: ideal.temps_extraction_s ?? null,
      lait_ml: ideal.lait_ml ?? null,
    };
  }

  // Dose — clamp to machine range
  let dose_g = ideal.dose_g;
  if (params.dose_min_g != null && dose_g < params.dose_min_g) {
    warnings.push(
      `Dose ajustée au minimum machine (${params.dose_min_g} g au lieu de ${ideal.dose_g} g).`
    );
    dose_g = params.dose_min_g;
  }
  if (params.dose_max_g != null && dose_g > params.dose_max_g) {
    warnings.push(
      `Dose ajustée au maximum machine (${params.dose_max_g} g au lieu de ${ideal.dose_g} g).`
    );
    dose_g = params.dose_max_g;
  }

  // Temperature — clamp to machine range
  let temperature_c = ideal.temperature_c;
  if (params.temperature_min_c != null && temperature_c < params.temperature_min_c) {
    warnings.push(
      `Température ajustée au minimum machine (${params.temperature_min_c} °C).`
    );
    temperature_c = params.temperature_min_c;
  }
  if (params.temperature_max_c != null && temperature_c > params.temperature_max_c) {
    warnings.push(
      `Température ajustée au maximum machine (${params.temperature_max_c} °C).`
    );
    temperature_c = params.temperature_max_c;
  }

  // Pressure — clamp to machine max
  let pression_bars: number | null = ideal.pression_bars ?? null;
  if (
    pression_bars != null &&
    params.pression_max_bars != null &&
    pression_bars > params.pression_max_bars
  ) {
    warnings.push(
      `Pression limitée au maximum machine (${params.pression_max_bars} bars).`
    );
    pression_bars = params.pression_max_bars;
  }
  // Moka / piston / filtre don't use pressure
  if (["moka", "piston", "filtre"].includes(category)) {
    pression_bars = null;
  }

  // Grind — warn if not adjustable
  let mouture = ideal.mouture;
  if (!params.granulometrie_reglable && category !== "filtre") {
    mouture += " (vérifier le préréglage)";
    warnings.push("La mouture n'est pas réglable sur cette machine.");
  }

  // Milk — warn if steamer absent
  const lait_ml = ideal.lait_ml ?? null;
  if (lait_ml && lait_ml > 0 && !params.buse_vapeur) {
    warnings.push(
      "Pas de buse vapeur : chauffez le lait séparément (microondes ou casserole)."
    );
  }

  const water_ml = Math.round(dose_g * ideal.ratio);

  return {
    dose_g,
    ratio: ideal.ratio,
    water_ml,
    temperature_c,
    pression_bars,
    mouture,
    temps_extraction_s: ideal.temps_extraction_s ?? null,
    lait_ml,
  };
}

// ── Step generation ───────────────────────────────────────────────────────────

function generateSteps(
  coffeeType: CoffeeType,
  machine: CoffeeMachine,
  p: RecipeResult["parameters"]
): RecipeStep[] {
  const steps: RecipeStep[] = [];
  const cat = machine.category;
  const isLacte = coffeeType.category === "lacte";
  let order = 1;

  const add = (label: string, detail?: string, duration_s?: number) => {
    steps.push({ order: order++, label, detail, duration_s });
  };

  // ── Espresso machines (auto + manuel) ───────────────────────────────────────
  if (cat === "espresso_auto" || cat === "espresso_manuel") {
    if (cat === "espresso_auto") {
      add("Allumer la machine", "Laisser chauffer jusqu'au signal de prêt.", 120);
      add(
        "Purger la buse vapeur",
        "Faire couler 2–3 secondes d'eau pour purger.",
        5
      );
    } else {
      add("Allumer la machine et chauffer", undefined, 180);
      add(
        "Préchauffer la tasse et le porte-filtre",
        "Faire passer de l'eau chaude sans café.",
        30
      );
    }

    add(
      `Doser ${p.dose_g} g de café`,
      `Mouture : ${p.mouture}.`,
    );

    if (cat === "espresso_manuel") {
      add("Tasser le café", "Appuyer fermement et uniformément.");
    }

    add(
      "Lancer l'extraction",
      p.pression_bars
        ? `${p.pression_bars} bars — viser ${p.temps_extraction_s ?? 25} secondes.`
        : `Viser ${p.temps_extraction_s ?? 25} secondes.`,
      p.temps_extraction_s ?? 25
    );
  }

  // ── Capsule ──────────────────────────────────────────────────────────────────
  else if (cat === "capsule") {
    add("Insérer la capsule", "Vérifier qu'elle est bien positionnée.");
    add("Placer la tasse sous le bec.");
    add("Appuyer sur le programme correspondant.", undefined, p.temps_extraction_s ?? 30);
  }

  // ── Moka ─────────────────────────────────────────────────────────────────────
  else if (cat === "moka") {
    add(
      "Remplir la chambre d'eau",
      `Eau froide jusqu'à la valve de sécurité (≈ ${p.water_ml} ml).`
    );
    add(`Remplir le filtre avec ${p.dose_g} g de café`, `Mouture : ${p.mouture}. Ne pas tasser.`);
    add("Assembler la cafetière et mettre sur feu doux–moyen.");
    add(
      "Retirer du feu dès la fin de la montée",
      "Stopper quand le café commence à crachoter.",
      p.temps_extraction_s ?? 300
    );
  }

  // ── Piston (French press) ────────────────────────────────────────────────────
  else if (cat === "piston") {
    add(`Verser ${p.dose_g} g de café moulu`, `Mouture : ${p.mouture}.`);
    add(
      `Ajouter ${p.water_ml} ml d'eau à ${p.temperature_c} °C`,
      "Verser en cercles pour mouiller uniformément.",
      30
    );
    add("Remuer doucement et couvrir.");
    add(
      "Infuser",
      `Laisser infuser ${Math.round((p.temps_extraction_s ?? 240) / 60)} minutes.`,
      p.temps_extraction_s ?? 240
    );
    add("Presser le piston lentement", "Descendre sur 20–30 secondes.", 25);
    add("Servir immédiatement pour éviter la sur-extraction.");
  }

  // ── Filtre ───────────────────────────────────────────────────────────────────
  else if (cat === "filtre") {
    add("Placer le filtre papier et le rincer à l'eau chaude.", undefined, 15);
    add(`Verser ${p.dose_g} g de café moulu`, `Mouture : ${p.mouture}.`);
    add(
      "Bloom : verser 2× la dose en eau",
      `${Math.round(p.dose_g * 2)} ml à ${p.temperature_c} °C. Attendre 30 s.`,
      30
    );
    add(
      `Verser le reste de l'eau en 2–3 fois`,
      `Total : ${p.water_ml} ml. Verser en spirales.`,
      p.temps_extraction_s ? p.temps_extraction_s - 30 : 150
    );
  }

  // ── Lait (toutes machines) ───────────────────────────────────────────────────
  if (isLacte && p.lait_ml && p.lait_ml > 0) {
    if (machine.parameters.buse_vapeur) {
      add(
        `Émulsionner ${p.lait_ml} ml de lait froid`,
        "Plonger la buse sous la surface, puis incliner pour créer un vortex.",
        30
      );
      add("Tapoter le pichet et mélanger, puis verser sur l'espresso.");
    } else {
      add(
        `Chauffer ${p.lait_ml} ml de lait`,
        "Microondes 60 s ou casserole à feu doux. Fouetter pour mousser.",
        60
      );
      add("Verser le lait sur l'espresso.");
    }
  }

  return steps;
}

// ── Time estimation ───────────────────────────────────────────────────────────

function estimateTime(steps: RecipeStep[]): number {
  return steps.reduce((acc, s) => acc + (s.duration_s ?? 10), 0);
}
