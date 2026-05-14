import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Publicly readable — anon RLS policy allows reads without auth.
// Called by the signup page to populate the machine search.
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("coffee_machines")
    .select("id, brand, model, category, parameters")
    .order("brand");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
  });
}
