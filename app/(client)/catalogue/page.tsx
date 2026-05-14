export const runtime = 'edge';
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { COFFEE_CATEGORY_LABELS } from "@/lib/schemas/coffee-type";
import { toCoffeeType } from "@/types/database";
import type { CoffeeCategory } from "@/types/database";

export default async function CataloguePage() {
  const supabase = await createClient();

  const [{ data: typesRaw }, { data: profile }] = await Promise.all([
    supabase.from("coffee_types").select("*").order("name"),
    supabase
      .from("profiles")
      .select("machine_id")
      .single(),
  ]);

  const types = (typesRaw ?? []).map(toCoffeeType);
  const hasMachine = !!profile?.machine_id;

  const grouped = types.reduce<Record<string, typeof types>>((acc, t) => {
    const key = t.category;
    acc[key] = [...(acc[key] ?? []), t];
    return acc;
  }, {});

  const categoryOrder: CoffeeCategory[] = ["espresso", "allonge", "lacte", "filtre"];

  return (
    <div className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Cafés</h1>

      {!hasMachine && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          Aucune machine sélectionnée.{" "}
          <Link href="/profil" className="underline font-medium">
            Choisir ma machine →
          </Link>
        </div>
      )}

      {types.length === 0 ? (
        <p className="text-muted-foreground text-sm mt-4">
          Aucun café disponible pour l&apos;instant.
        </p>
      ) : (
        <div className="flex flex-col gap-6 mt-4">
          {categoryOrder
            .filter((cat) => grouped[cat]?.length)
            .map((cat) => (
              <section key={cat}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {COFFEE_CATEGORY_LABELS[cat]}
                </h2>
                <div className="flex flex-col gap-2">
                  {grouped[cat].map((t) => (
                    <Link
                      key={t.id}
                      href={`/recette/${t.id}`}
                      className="flex items-start justify-between rounded-xl border bg-card px-4 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <p className="font-medium leading-snug">{t.name}</p>
                        {t.description && (
                          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                            {t.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="ml-3 shrink-0 mt-0.5 text-xs">
                        {t.ideal_parameters.dose_g}g
                      </Badge>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
        </div>
      )}
    </div>
  );
}
