import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { toCoffeeType, toMachine } from "@/types/database";
import { computeRecipe } from "@/lib/recommendation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}min ${s}s` : `${m}min`;
}

export default async function RecettePage({
  params,
}: {
  params: Promise<{ coffeeId: string }>;
}) {
  const { coffeeId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const [{ data: coffeeRaw }, { data: profile }] = await Promise.all([
    supabase.from("coffee_types").select("*").eq("id", coffeeId).single(),
    supabase
      .from("profiles")
      .select("machine_id")
      .eq("id", user.id)
      .single(),
  ]);

  if (!coffeeRaw) notFound();

  const coffeeType = toCoffeeType(coffeeRaw);

  // No machine selected yet
  if (!profile?.machine_id) {
    return (
      <div className="px-4 py-6 max-w-lg mx-auto">
        <Link href="/catalogue" className="text-sm text-muted-foreground hover:text-foreground">
          ← Retour
        </Link>
        <h1 className="text-2xl font-semibold mt-4 mb-2">{coffeeType.name}</h1>
        <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-4 py-4 text-sm text-amber-800 dark:text-amber-300">
          <p className="font-medium mb-1">Aucune machine sélectionnée</p>
          <p>
            Pour voir la recette optimisée,{" "}
            <Link href="/profil" className="underline font-medium">
              choisissez votre machine dans le profil.
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const { data: machineRaw } = await supabase
    .from("coffee_machines")
    .select("*")
    .eq("id", profile.machine_id)
    .single();

  if (!machineRaw) notFound();

  const machine = toMachine(machineRaw);
  const recipe = computeRecipe(coffeeType, machine);
  const { parameters: p, steps, estimated_time_s, warnings } = recipe;

  return (
    <div className="px-4 py-6 max-w-lg mx-auto pb-8">
      <Link href="/catalogue" className="text-sm text-muted-foreground hover:text-foreground">
        ← Cafés
      </Link>

      {/* Header */}
      <div className="mt-4 mb-5">
        <h1 className="text-2xl font-semibold">{coffeeType.name}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {machine.brand} {machine.model}
        </p>
        {coffeeType.description && (
          <p className="text-sm text-muted-foreground mt-2">{coffeeType.description}</p>
        )}
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-4 py-3 flex flex-col gap-1">
          {warnings.map((w, i) => (
            <p key={i} className="text-sm text-amber-800 dark:text-amber-300">
              ⚠ {w}
            </p>
          ))}
        </div>
      )}

      {/* Parameters grid */}
      <section className="mb-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Paramètres
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <Param label="Dose" value={`${p.dose_g} g`} />
          <Param label="Eau" value={`${p.water_ml} ml`} />
          <Param label="Ratio" value={`1:${p.ratio}`} />
          <Param label="Température" value={`${p.temperature_c} °C`} />
          {p.pression_bars != null && (
            <Param label="Pression" value={`${p.pression_bars} bars`} />
          )}
          {p.temps_extraction_s != null && (
            <Param label="Extraction" value={formatTime(p.temps_extraction_s)} />
          )}
          {p.lait_ml != null && p.lait_ml > 0 && (
            <Param label="Lait" value={`${p.lait_ml} ml`} />
          )}
          <Param label="Mouture" value={p.mouture} fullWidth />
        </div>
      </section>

      {/* Steps */}
      <section className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Étapes
          </h2>
          <Badge variant="secondary">{formatTime(estimated_time_s)} estimé</Badge>
        </div>
        <ol className="flex flex-col gap-3">
          {steps.map((step) => (
            <li key={step.order} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mt-0.5">
                {step.order}
              </span>
              <div>
                <p className="font-medium leading-snug">{step.label}</p>
                {step.detail && (
                  <p className="text-sm text-muted-foreground mt-0.5">{step.detail}</p>
                )}
                {step.duration_s != null && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ⏱ {formatTime(step.duration_s)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Param({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-card px-4 py-3 ${fullWidth ? "col-span-2" : ""}`}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold leading-snug mt-0.5">{value}</p>
    </div>
  );
}
