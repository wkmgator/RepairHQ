-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  max_locations INTEGER,
  max_users INTEGER,
  max_customers INTEGER,
  max_inventory INTEGER,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verticals table
CREATE TABLE IF NOT EXISTS verticals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  group_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, group_name)
);

-- Update users table to include onboarding fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_trial_active BOOLEAN DEFAULT false;

-- Update stores table to include vertical information
ALTER TABLE stores ADD COLUMN IF NOT EXISTS vertical_group TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS vertical TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

-- Insert default plans
INSERT INTO plans (name, display_name, description, price_monthly, price_yearly, max_locations, max_users, max_customers, max_inventory, features) VALUES
('starter', 'Starter', 'Perfect for small repair shops', 29.00, 290.00, 1, 3, 500, 1000, ARRAY['Basic ticket management', 'Customer database', 'Inventory tracking', 'Basic reporting', 'Email support']),
('pro', 'Pro', 'Great for growing businesses', 79.00, 790.00, 5, 12, 2500, 5000, ARRAY['Advanced ticket management', 'Multi-location support', 'Advanced reporting', 'API access', 'Priority support', 'Custom fields']),
('enterprise', 'Enterprise', 'For established repair businesses', 199.00, 1990.00, 10, 25, 10000, 25000, ARRAY['Everything in Pro', 'Advanced analytics', 'Custom integrations', 'Dedicated support', 'Custom branding', 'Advanced security']),
('franchise', 'Franchise', 'For franchise operations', 499.00, 4990.00, NULL, NULL, NULL, NULL, ARRAY['Everything in Enterprise', 'Unlimited locations', 'Franchise management', 'Territory management', 'White-label solution', 'Custom development'])
ON CONFLICT (name) DO NOTHING;

-- Insert verticals
INSERT INTO verticals (name, group_name) VALUES
-- Electronics
('Cell Phone Repair', 'Electronics'),
('Tablet Repair', 'Electronics'),
('Laptop Repair', 'Electronics'),
('TV Repair', 'Electronics'),
('Gaming Console Repair', 'Electronics'),
('Smart Watch Repair', 'Electronics'),
('Headphone Repair', 'Electronics'),

-- Automotive
('Auto Body', 'Automotive'),
('EV Repair', 'Automotive'),
('Small Engine Repair', 'Automotive'),
('Motorcycle Repair', 'Automotive'),
('Tractor Repair', 'Automotive'),
('RV Repair', 'Automotive'),
('Marine Repair', 'Automotive'),

-- Home & Appliances
('Appliance Repair', 'Home & Appliances'),
('Dishwasher Repair', 'Home & Appliances'),
('Washer/Dryer Repair', 'Home & Appliances'),
('Refrigerator Repair', 'Home & Appliances'),
('HVAC Repair', 'Home & Appliances'),
('Vacuum Repair', 'Home & Appliances'),

-- Lifestyle
('Jewelry Repair', 'Lifestyle'),
('Watch Repair', 'Lifestyle'),
('Camera Repair', 'Lifestyle'),
('Drone Repair', 'Lifestyle'),
('Musical Instrument Repair', 'Lifestyle'),
('Sporting Goods Repair', 'Lifestyle'),

-- Commercial
('POS Repair', 'Commercial'),
('ATM Repair', 'Commercial'),
('Medical Equipment', 'Commercial'),
('Solar Systems', 'Commercial'),
('Security Systems', 'Commercial'),
('Industrial Equipment', 'Commercial')
ON CONFLICT (name, group_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_onboarding ON users(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_users_trial ON users(is_trial_active, trial_ends_at);
CREATE INDEX IF NOT EXISTS idx_stores_owner ON stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_primary ON stores(is_primary);
CREATE INDEX IF NOT EXISTS idx_stores_vertical ON stores(vertical_group, vertical);
CREATE INDEX IF NOT EXISTS idx_plans_active ON plans(is_active);
CREATE INDEX IF NOT EXISTS idx_verticals_active ON verticals(is_active);

-- Add RLS policies for new tables
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE verticals ENABLE ROW LEVEL SECURITY;

-- Plans are readable by everyone, manageable by admins only
CREATE POLICY "Plans are viewable by everyone" ON plans FOR SELECT USING (true);
CREATE POLICY "Only admins can manage plans" ON plans FOR ALL USING (auth.user_role() = 'admin');

-- Verticals are readable by everyone, manageable by admins only
CREATE POLICY "Verticals are viewable by everyone" ON verticals FOR SELECT USING (true);
CREATE POLICY "Only admins can manage verticals" ON verticals FOR ALL USING (auth.user_role() = 'admin');

-- Update stores policies to include new fields
DROP POLICY IF EXISTS "Users can view stores" ON stores;
CREATE POLICY "Users can view relevant stores" ON stores
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      owner_id = auth.uid() OR 
      auth.user_role() = 'admin'
    )
  );

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verticals_updated_at BEFORE UPDATE ON verticals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
