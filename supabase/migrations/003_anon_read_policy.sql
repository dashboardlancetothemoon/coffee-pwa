-- Allow anonymous (unauthenticated) reads on machines and coffee_types.
-- This is intentional: the catalogue data is public, there's no PII.
-- Profiles remain authenticated-only.

CREATE POLICY "machines_read_anon" ON coffee_machines
  FOR SELECT TO anon USING (true);

CREATE POLICY "coffee_types_read_anon" ON coffee_types
  FOR SELECT TO anon USING (true);
