// Mirrors the Supabase CLI output format so the generic types resolve correctly.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ── Convenience interfaces (used in app code, not in Database generic) ──────

export type MachineCategory =
  | "espresso_auto"
  | "espresso_manuel"
  | "capsule"
  | "filtre"
  | "piston"
  | "moka";

export type CoffeeCategory = "espresso" | "allonge" | "lacte" | "filtre";

export interface MachineParameters {
  pression_max_bars?: number;
  temperature_min_c?: number;
  temperature_max_c?: number;
  dose_min_g?: number;
  dose_max_g?: number;
  granulometrie_reglable: boolean;
  buse_vapeur: boolean;
  reservoir_ml?: number;
  notes?: string;
}

export interface CoffeeIdealParameters {
  dose_g: number;
  ratio: number;
  mouture: string;
  temperature_c: number;
  pression_bars?: number;
  temps_extraction_s?: number;
  lait_ml?: number;
}

// Typed convenience types for app components
export interface CoffeeMachine {
  id: string;
  brand: string;
  model: string;
  category: MachineCategory;
  parameters: MachineParameters;
  created_at: string;
  updated_at: string;
}

export interface CoffeeType {
  id: string;
  name: string;
  category: CoffeeCategory;
  ideal_parameters: CoffeeIdealParameters;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  machine_id: string | null;
  created_at: string;
}

// ── Database generic — must match Supabase CLI output exactly ───────────────
// Row types use primitives + Json (not custom interfaces) so they extend
// Record<string, unknown> and satisfy the GenericTable constraint.

export type Database = {
  public: {
    Tables: {
      coffee_machines: {
        Row: {
          id: string;
          brand: string;
          model: string;
          category: Database["public"]["Enums"]["machine_category"];
          parameters: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          brand: string;
          model: string;
          category: Database["public"]["Enums"]["machine_category"];
          parameters?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          brand?: string;
          model?: string;
          category?: Database["public"]["Enums"]["machine_category"];
          parameters?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      coffee_types: {
        Row: {
          id: string;
          name: string;
          category: Database["public"]["Enums"]["coffee_category"];
          ideal_parameters: Json;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: Database["public"]["Enums"]["coffee_category"];
          ideal_parameters?: Json;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: Database["public"]["Enums"]["coffee_category"];
          ideal_parameters?: Json;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          machine_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          machine_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          machine_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      machine_category: MachineCategory;
      coffee_category: CoffeeCategory;
    };
    CompositeTypes: { [_ in never]: never };
  };
};

// Helper to cast JSONB responses to typed objects
export function asMachineParams(json: Json): MachineParameters {
  return json as unknown as MachineParameters;
}

export function asCoffeeParams(json: Json): CoffeeIdealParameters {
  return json as unknown as CoffeeIdealParameters;
}

// Cast a raw supabase row to the typed interface
export function toMachine(row: Database["public"]["Tables"]["coffee_machines"]["Row"]): CoffeeMachine {
  return {
    ...row,
    parameters: asMachineParams(row.parameters ?? {}),
  };
}

export function toCoffeeType(row: Database["public"]["Tables"]["coffee_types"]["Row"]): CoffeeType {
  return {
    ...row,
    description: row.description ?? "",
    ideal_parameters: asCoffeeParams(row.ideal_parameters ?? {}),
  };
}
