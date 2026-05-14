export const runtime = 'edge';
import { createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MACHINE_CATEGORY_LABELS } from "@/lib/schemas/machine";
import { DeleteMachineButton } from "./delete-button";
import { cn } from "@/lib/utils";
import { toMachine } from "@/types/database";

export default async function MachinesPage() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from("coffee_machines")
    .select("*")
    .order("brand", { ascending: true });

  if (error) {
    return <p className="text-destructive">Erreur : {error.message}</p>;
  }

  const machines = (data ?? []).map(toMachine);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Machines</h1>
        <Link href="/admin/machines/new" className={buttonVariants()}>
          + Ajouter
        </Link>
      </div>

      {machines.length === 0 ? (
        <p className="text-muted-foreground text-sm">Aucune machine.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Marque</TableHead>
              <TableHead>Modèle</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.brand}</TableCell>
                <TableCell>{m.model}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {MACHINE_CATEGORY_LABELS[m.category]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/machines/${m.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" })
                      )}
                    >
                      Modifier
                    </Link>
                    <DeleteMachineButton id={m.id} />
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
