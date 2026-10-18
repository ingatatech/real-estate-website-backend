-- Insert article categories with hardcoded IDs to match frontend
INSERT INTO public.article_categories (id, name, slug, is_active, created_at, updated_at)
VALUES
  ('1', 'Property Market Updates', 'property-market-updates', true, NOW(), NOW()),
  ('2', 'Buying Guides', 'buying-guides', true, NOW(), NOW()),
  ('3', 'Renting Guides', 'renting-guides', true, NOW(), NOW()),
  ('4', 'Selling Guides', 'selling-guides', true, NOW(), NOW()),
  ('5', 'Property Investment', 'property-investment', true, NOW(), NOW()),
  ('6', 'Property Management', 'property-management', true, NOW(), NOW()),
  ('7', 'Homeownership', 'homeownership', true, NOW(), NOW()),
  ('8', 'Real Estate Trends', 'real-estate-trends', true, NOW(), NOW()),
  ('9', 'Company Announcements', 'company-announcements', true, NOW(), NOW()),
  ('10', 'New Developments', 'new-developments', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();
