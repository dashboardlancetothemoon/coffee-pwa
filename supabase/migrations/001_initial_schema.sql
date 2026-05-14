-- ── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE machine_category AS ENUM (
  'espresso_auto',
  'espresso_manuel',
  'capsule',
  'filtre',
  'piston',
  'moka'
);

CREATE TYPE coffee_category AS ENUM (
  'espresso',
  'allonge',
  'lacte',
  'filtre'
);

-- ── Tables ──────────────────────────────────────────────────────────────────

CREATE TABLE coffee_machines (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand       TEXT NOT NULL,
  model       TEXT NOT NULL,
  category    machine_category NOT NULL,
  parameters  JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE coffee_types (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  category          coffee_category NOT NULL,
  ideal_parameters  JSONB NOT NULL DEFAULT '{}',
  description       TEXT NOT NULL DEFAULT '',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  machine_id  UUID REFERENCES coffee_machines(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Auto-update updated_at ───────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER coffee_machines_updated_at
  BEFORE UPDATE ON coffee_machines
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER coffee_types_updated_at
  BEFORE UPDATE ON coffee_types
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ── Auto-create profile on signup ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE coffee_machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE coffee_types    ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;

-- coffee_machines: anyone authenticated can read; only service_role can write
CREATE POLICY "machines_read" ON coffee_machines
  FOR SELECT TO authenticated USING (true);

-- coffee_types: anyone authenticated can read; only service_role can write
CREATE POLICY "coffee_types_read" ON coffee_types
  FOR SELECT TO authenticated USING (true);

-- profiles: users can read/update their own row
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
