import { createAdminClient } from "@/lib/supabase/server";
import { CoffeeTypeForm } from "../coffee-type-form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toCoffeeType } from "@/types/database";

export default async function EditCoffeeTypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAdminClient();
  const { data } = await supabase
    .from("coffee_types")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  const coffeeType = toCoffeeType(data);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/coffee-types"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Types de café
        </Link>
        <h1 className="text-2xl font-semibold mt-2">{coffeeType.name}</h1>
      </div>
      <CoffeeTypeForm mode="edit" coffeeTypeId={id} coffeeType={coffeeType} />
    </div>
  );
}
