-- Sample machines (run manually in Supabase SQL editor as service_role)
-- These are bypassed by RLS since we use service_role here.

INSERT INTO coffee_machines (brand, model, category, parameters) VALUES
(
  'DeLonghi', 'Magnifica Start',
  'espresso_auto',
  '{
    "pression_max_bars": 15,
    "temperature_min_c": 88,
    "temperature_max_c": 96,
    "dose_min_g": 6,
    "dose_max_g": 14,
    "granulometrie_reglable": true,
    "buse_vapeur": true,
    "reservoir_ml": 1800
  }'
),
(
  'Nespresso', 'Vertuo Next',
  'capsule',
  '{
    "pression_max_bars": 19,
    "temperature_min_c": 83,
    "temperature_max_c": 83,
    "dose_min_g": null,
    "dose_max_g": null,
    "granulometrie_reglable": false,
    "buse_vapeur": false,
    "reservoir_ml": 1500,
    "notes": "Capsules propriétaires Vertuo uniquement"
  }'
),
(
  'Bialetti', 'Moka Express 3 tasses',
  'moka',
  '{
    "pression_max_bars": 2,
    "temperature_min_c": 90,
    "temperature_max_c": 95,
    "dose_min_g": 15,
    "dose_max_g": 18,
    "granulometrie_reglable": false,
    "buse_vapeur": false,
    "reservoir_ml": 100
  }'
),
(
  'Hario', 'V60 02',
  'filtre',
  '{
    "pression_max_bars": 0,
    "temperature_min_c": 88,
    "temperature_max_c": 96,
    "dose_min_g": 12,
    "dose_max_g": 30,
    "granulometrie_reglable": false,
    "buse_vapeur": false,
    "reservoir_ml": null,
    "notes": "Verser à la main, température eau au choix"
  }'
);

-- Sample coffee types
INSERT INTO coffee_types (name, category, ideal_parameters, description) VALUES
(
  'Espresso',
  'espresso',
  '{
    "dose_g": 9,
    "ratio": 2,
    "mouture": "fine",
    "temperature_c": 93,
    "pression_bars": 9,
    "temps_extraction_s": 25,
    "lait_ml": 0
  }',
  'Court et concentré, 18–25 ml en tasse. Crème noisette persistante.'
),
(
  'Lungo',
  'allonge',
  '{
    "dose_g": 9,
    "ratio": 4,
    "mouture": "fine",
    "temperature_c": 93,
    "pression_bars": 9,
    "temps_extraction_s": 40,
    "lait_ml": 0
  }',
  'Espresso allongé, 36–40 ml. Plus amer, léger en corps.'
),
(
  'Cappuccino',
  'lacte',
  '{
    "dose_g": 9,
    "ratio": 2,
    "mouture": "fine",
    "temperature_c": 93,
    "pression_bars": 9,
    "temps_extraction_s": 25,
    "lait_ml": 120
  }',
  'Espresso + mousse de lait veloutée, 1/3 café - 1/3 lait - 1/3 mousse.'
),
(
  'Café filtre',
  'filtre',
  '{
    "dose_g": 15,
    "ratio": 15,
    "mouture": "moyenne",
    "temperature_c": 93,
    "pression_bars": 0,
    "temps_extraction_s": 180,
    "lait_ml": 0
  }',
  'Extraction par percolation, 200–250 ml. Doux et aromatique.'
);
