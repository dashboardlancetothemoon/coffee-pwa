export const runtime = 'edge';
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Publicly readable — anon RLS policy allows reads without auth.
export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("coffee_types")
    .select("id, name, category, ideal_parameters, description")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
  });
}
