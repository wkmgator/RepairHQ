-- Multi-Location Management Schema

-- Locations table (enhanced)
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('store', 'warehouse', 'franchise', 'kiosk')),
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'US',
  zip_code VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  manager_id UUID REFERENCES employees(id),
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT false,
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  coordinates JSONB, -- {lat: number, lng: number}
  business_hours JSONB NOT NULL DEFAULT '{}', -- Business hours for each day
  settings JSONB NOT NULL DEFAULT '{}', -- Location-specific settings
  franchise_info JSONB, -- Franchise-specific information
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory transfers table
CREATE TABLE IF NOT EXISTS inventory_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location_id UUID NOT NULL REFERENCES locations(id),
  to_location_id UUID NOT NULL REFERENCES locations(id),
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_transit', 'completed', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]', -- Array of transfer items
  notes TEXT,
  tracking_number VARCHAR(100),
  estimated_arrival TIMESTAMP WITH TIME ZONE,
  actual_arrival TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transfer audit logs
CREATE TABLE IF NOT EXISTS transfer_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id UUID NOT NULL REFERENCES inventory_transfers(id) ON DELETE CASCADE,
  action VARCHAR(50) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Location permissions table
CREATE TABLE IF NOT EXISTS location_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'employee', 'viewer')),
  permissions JSONB NOT NULL DEFAULT '[]', -- Array of permission strings
  granted_by UUID NOT NULL REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, location_id)
);

-- Territories table
CREATE TABLE IF NOT EXISTS territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  boundaries JSONB NOT NULL, -- GeoJSON polygon
  assigned_location_id UUID REFERENCES locations(id),
  population INTEGER NOT NULL DEFAULT 0,
  market_potential DECIMAL(15,2) NOT NULL DEFAULT 0,
  competition_level VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (competition_level IN ('low', 'medium', 'high')),
  demographics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Franchise onboarding table
CREATE TABLE IF NOT EXISTS franchise_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  step VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  order_number INTEGER NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  checklist JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Royalty calculations table
CREATE TABLE IF NOT EXISTS royalty_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  franchise_id UUID NOT NULL REFERENCES locations(id),
  month VARCHAR(7) NOT NULL, -- YYYY-MM format
  gross_revenue DECIMAL(15,2) NOT NULL DEFAULT 0,
  royalty_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  royalty_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  marketing_fee_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  marketing_fee DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_due DECIMAL(15,2) NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  paid_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(franchise_id, month)
);

-- Location analytics cache table
CREATE TABLE IF NOT EXISTS location_analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(location_id, date)
);

-- Resellers Table
CREATE TABLE IF NOT EXISTS resellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  upline_reseller_id UUID REFERENCES resellers(id) ON DELETE SET NULL,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 10.00, -- Percentage
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'suspended')),
  payout_details JSONB, -- Store PayPal email, bank info (encrypted or reference)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES resellers(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, -- User who signed up
  referred_customer_id UUID REFERENCES customers(id) ON DELETE SET NULL, -- If referral is tied to a customer action
  conversion_type VARCHAR(100) NOT NULL, -- e.g., 'signup', 'first_purchase', 'subscription_start'
  conversion_details JSONB, -- Details about the conversion (e.g., order_id, subscription_plan)
  commission_earned DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  commission_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'rejected', 'cancelled')),
  payout_id UUID REFERENCES commission_payouts(id) ON DELETE SET NULL, -- Link to the payout record
  notes TEXT, -- Admin notes for approval/rejection
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to referrals for now" ON referrals FOR ALL USING (true) WITH CHECK (true); -- Loosen for dev, tighten later


-- Commission Payouts Table
CREATE TABLE IF NOT EXISTS commission_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES resellers(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payout_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  payment_method VARCHAR(100), -- e.g., 'PayPal', 'Bank Transfer'
  transaction_reference VARCHAR(255), -- e.g., PayPal transaction ID, bank transfer ref
  notes TEXT, -- Admin notes about the payout
  processed_by UUID REFERENCES auth.users(id), -- Admin who processed it
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE commission_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access to payouts for now" ON commission_payouts FOR ALL USING (true) WITH CHECK (true); -- Loosen for dev


-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_locations_user_id ON locations(user_id);
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);
CREATE INDEX IF NOT EXISTS idx_locations_active ON locations(is_active);
CREATE INDEX IF NOT EXISTS idx_inventory_transfers_from_location ON inventory_transfers(from_location_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transfers_to_location ON inventory_transfers(to_location_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transfers_status ON inventory_transfers(status);
CREATE INDEX IF NOT EXISTS idx_location_permissions_user ON location_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_location_permissions_location ON location_permissions(location_id);
CREATE INDEX IF NOT EXISTS idx_territories_assigned_location ON territories(assigned_location_id);
CREATE INDEX IF NOT EXISTS idx_franchise_onboarding_franchise ON franchise_onboarding(franchise_id);
CREATE INDEX IF NOT EXISTS idx_royalty_calculations_franchise ON royalty_calculations(franchise_id);
CREATE INDEX IF NOT EXISTS idx_royalty_calculations_month ON royalty_calculations(month);
CREATE INDEX IF NOT EXISTS idx_location_analytics_location_date ON location_analytics_cache(location_id, date);
CREATE INDEX IF NOT EXISTS idx_resellers_user_id ON resellers(user_id);
CREATE INDEX IF NOT EXISTS idx_resellers_referral_code ON resellers(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_reseller_id ON referrals(reseller_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON referrals(commission_status);
CREATE INDEX IF NOT EXISTS idx_referrals_payout_id ON referrals(payout_id);
CREATE INDEX IF NOT EXISTS idx_commission_payouts_reseller_id ON commission_payouts(reseller_id);
CREATE INDEX IF NOT EXISTS idx_commission_payouts_status ON commission_payouts(status);


-- RLS Policies
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfer_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchise_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE royalty_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE resellers ENABLE ROW LEVEL SECURITY;


-- Policies for locations
CREATE POLICY "Users can view their own locations" ON locations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own locations" ON locations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own locations" ON locations
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own locations" ON locations
  FOR DELETE USING (user_id = auth.uid());

-- Policies for inventory transfers
CREATE POLICY "Users can view transfers for their locations" ON inventory_transfers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM locations 
      WHERE (id = from_location_id OR id = to_location_id) 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create transfers for their locations" ON inventory_transfers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM locations 
      WHERE (id = from_location_id OR id = to_location_id) 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update transfers for their locations" ON inventory_transfers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM locations 
      WHERE (id = from_location_id OR id = to_location_id) 
      AND user_id = auth.uid()
    )
  );

-- Policies for Resellers
CREATE POLICY "Resellers can view their own profile" ON resellers
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can manage all reseller profiles" ON resellers
  FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'); -- Adjust 'public.users' if your user profile table is different

-- Policies for Referrals (Example - needs refinement for production)
-- CREATE POLICY "Resellers can view their own referrals" ON referrals
--   FOR SELECT USING (reseller_id = (SELECT id FROM resellers WHERE user_id = auth.uid()));
-- CREATE POLICY "Admins can manage all referrals" ON referrals
--   FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Policies for Commission Payouts (Example - needs refinement for production)
-- CREATE POLICY "Resellers can view their own payouts" ON commission_payouts
--   FOR SELECT USING (reseller_id = (SELECT id FROM resellers WHERE user_id = auth.uid()));
-- CREATE POLICY "Admins can manage all payouts" ON commission_payouts
--   FOR ALL USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');


-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_inventory_transfers_updated_at
  BEFORE UPDATE ON inventory_transfers
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_territories_updated_at
  BEFORE UPDATE ON territories
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_franchise_onboarding_updated_at
  BEFORE UPDATE ON franchise_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_royalty_calculations_updated_at
  BEFORE UPDATE ON royalty_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_resellers_updated_at
  BEFORE UPDATE ON resellers
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_referrals_updated_at
  BEFORE UPDATE ON referrals
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_commission_payouts_updated_at
  BEFORE UPDATE ON commission_payouts
  FOR EACH ROW
  EXECUTE FUNCTION update_timestamp_column();
