-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gbt_rewards ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION auth.user_role() RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.user_shop_id() RETURNS UUID AS $$
  SELECT shop_id FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.is_admin() RETURNS BOOLEAN AS $$
  SELECT auth.user_role() = 'admin';
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.is_manager() RETURNS BOOLEAN AS $$
  SELECT auth.user_role() IN ('manager', 'admin');
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.is_technician() RETURNS BOOLEAN AS $$
  SELECT auth.user_role() IN ('technician', 'manager', 'admin');
$$ LANGUAGE SQL SECURITY DEFINER;

-- Users table policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id OR auth.is_admin());

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id OR auth.is_admin());

CREATE POLICY "Admins can insert users" ON users
  FOR INSERT WITH CHECK (auth.is_admin());

CREATE POLICY "Admins can delete users" ON users
  FOR DELETE USING (auth.is_admin());

-- Shops table policies
CREATE POLICY "Users can view shops" ON shops
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage shops" ON shops
  FOR ALL USING (auth.is_admin());

CREATE POLICY "Managers can update own shop" ON shops
  FOR UPDATE USING (auth.is_manager() AND id = auth.user_shop_id());

-- Customers table policies
CREATE POLICY "Users can view customers in their shop" ON customers
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      created_by = auth.uid() OR 
      shop_id = auth.user_shop_id() OR
      auth.is_admin()
    )
  );

CREATE POLICY "Users can create customers" ON customers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update customers in their shop" ON customers
  FOR UPDATE USING (shop_id = auth.user_shop_id() OR auth.is_admin());

CREATE POLICY "Managers can delete customers in their shop" ON customers
  FOR DELETE USING (
    (auth.is_manager() AND shop_id = auth.user_shop_id()) OR 
    auth.is_admin()
  );

-- Tickets table policies
CREATE POLICY "Users can view relevant tickets" ON tickets
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      created_by = auth.uid() OR 
      shop_id = auth.user_shop_id() OR
      assigned_to = auth.uid() OR
      auth.is_admin()
    )
  );

CREATE POLICY "Users can create tickets" ON tickets
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update relevant tickets" ON tickets
  FOR UPDATE USING (
    shop_id = auth.user_shop_id() OR 
    assigned_to = auth.uid() OR
    auth.is_admin()
  );

CREATE POLICY "Managers can delete tickets in their shop" ON tickets
  FOR DELETE USING (
    (auth.is_manager() AND shop_id = auth.user_shop_id()) OR 
    auth.is_admin()
  );

-- Invoices table policies
CREATE POLICY "Users can view relevant invoices" ON invoices
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      created_by = auth.uid() OR 
      shop_id = auth.user_shop_id() OR
      auth.is_admin()
    )
  );

CREATE POLICY "Users can create invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update invoices in their shop" ON invoices
  FOR UPDATE USING (shop_id = auth.user_shop_id() OR auth.is_admin());

CREATE POLICY "Managers can delete invoices in their shop" ON invoices
  FOR DELETE USING (
    (auth.is_manager() AND shop_id = auth.user_shop_id()) OR 
    auth.is_admin()
  );

-- Inventory table policies
CREATE POLICY "Users can view inventory" ON inventory
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Managers can create inventory" ON inventory
  FOR INSERT WITH CHECK (auth.is_manager());

CREATE POLICY "Technicians can update inventory in their shop" ON inventory
  FOR UPDATE USING (
    (auth.is_technician() AND shop_id = auth.user_shop_id()) OR
    auth.is_admin()
  );

CREATE POLICY "Managers can delete inventory in their shop" ON inventory
  FOR DELETE USING (
    (auth.is_manager() AND shop_id = auth.user_shop_id()) OR 
    auth.is_admin()
  );

-- Appointments table policies
CREATE POLICY "Users can view relevant appointments" ON appointments
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      created_by = auth.uid() OR 
      shop_id = auth.user_shop_id() OR
      assigned_to = auth.uid() OR
      auth.is_admin()
    )
  );

CREATE POLICY "Users can create appointments" ON appointments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update relevant appointments" ON appointments
  FOR UPDATE USING (
    shop_id = auth.user_shop_id() OR 
    assigned_to = auth.uid() OR
    auth.is_admin()
  );

CREATE POLICY "Managers can delete appointments in their shop" ON appointments
  FOR DELETE USING (
    (auth.is_manager() AND shop_id = auth.user_shop_id()) OR 
    auth.is_admin()
  );

-- Subscriptions table policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (user_id = auth.uid() OR auth.is_admin());

CREATE POLICY "Users can create own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (user_id = auth.uid() OR auth.is_admin());

CREATE POLICY "Admins can delete subscriptions" ON subscriptions
  FOR DELETE USING (auth.is_admin());

-- Payments table policies
CREATE POLICY "Users can view relevant payments" ON payments
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND (
      user_id = auth.uid() OR 
      (shop_id = auth.user_shop_id() AND auth.is_manager()) OR
      auth.is_admin()
    )
  );

CREATE POLICY "Users can create payments" ON payments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update payments" ON payments
  FOR UPDATE USING (auth.is_admin());

CREATE POLICY "Admins can delete payments" ON payments
  FOR DELETE USING (auth.is_admin());

-- Analytics table policies
CREATE POLICY "Managers can view analytics for their shop" ON analytics
  FOR SELECT USING (
    (auth.is_manager() AND shop_id = auth.user_shop_id()) OR 
    auth.is_admin()
  );

CREATE POLICY "Admins can manage analytics" ON analytics
  FOR ALL USING (auth.is_admin());

-- Settings table policies
CREATE POLICY "Users can view settings" ON settings
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (auth.is_admin());

-- Promo codes table policies
CREATE POLICY "Users can view promo codes" ON promo_codes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage promo codes" ON promo_codes
  FOR ALL USING (auth.is_admin());

-- GBT Rewards table policies
CREATE POLICY "Users can view own rewards" ON gbt_rewards
  FOR SELECT USING (user_id = auth.uid() OR auth.is_admin());

CREATE POLICY "Users can create own rewards" ON gbt_rewards
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own rewards" ON gbt_rewards
  FOR UPDATE USING (user_id = auth.uid() OR auth.is_admin());

CREATE POLICY "Admins can delete rewards" ON gbt_rewards
  FOR DELETE USING (auth.is_admin());
