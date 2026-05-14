export const runtime = 'edge';
import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { COFFEE_CATEGORY_LABELS } from "@/lib/schemas/coffee-type";
import { DeleteCoffeeTypeButton } from "./delete-button";
import { toCoffeeType } from "@/types/database";

export default async function CoffeeTypesPage() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("coffee_types")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return <p className="text-destructive">Erreur : {error.message}</p>;
  }

  const types = (data ?? []).map(toCoffeeType);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Types de café</h1>
        <Link href="/admin/coffee-types/new" className={buttonVariants()}>
          + Ajouter
        </Link>
      </div>

      {types.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucun type de café.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Dose / Ratio</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {COFFEE_CATEGORY_LABELS[t.category]}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {t.ideal_parameters.dose_g}g / 1:{t.ideal_parameters.ratio}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/coffee-types/${t.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" })
                      )}
                    >
                      Modifier
                    </Link>
                    <DeleteCoffeeTypeButton id={t.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
