export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toCoffeeType, toMachine } from "@/types/database";
import { computeRecipe } from "@/lib/recommendation";
import { z } from "zod";

const QuerySchema = z.object({
  coffee_type_id: z.string().uuid(),
  machine_id: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const parsed = QuerySchema.safeParse({
    coffee_type_id: searchParams.get("coffee_type_id"),
    machine_id: searchParams.get("machine_id"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Paramètres invalides : coffee_type_id et machine_id (UUID) requis." },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const [{ data: coffeeRaw, error: e1 }, { data: machineRaw, error: e2 }] =
    await Promise.all([
      supabase
        .from("coffee_types")
        .select("*")
        .eq("id", parsed.data.coffee_type_id)
        .single(),
      supabase
        .from("coffee_machines")
        .select("*")
        .eq("id", parsed.data.machine_id)
        .single(),
    ]);

  if (e1 || !coffeeRaw)
    return NextResponse.json({ error: "Type de café introuvable." }, { status: 404 });
  if (e2 || !machineRaw)
    return NextResponse.json({ error: "Machine introuvable." }, { status: 404 });

  const recipe = computeRecipe(toCoffeeType(coffeeRaw), toMachine(machineRaw));

  return NextResponse.json(recipe);
}
