-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =============================================
-- USERS & AUTHENTICATION
-- =============================================

-- Stores additional user profile information beyond auth.users
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  business_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  role TEXT DEFAULT 'owner',
  avatar_url TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan TEXT DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
  is_trial_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- LOCATIONS & STORES
-- =============================================

-- Stores/locations for multi-location businesses
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  phone TEXT,
  email TEXT,
  tax_rate DECIMAL(5,2) DEFAULT 0.00,
  is_default BOOLEAN DEFAULT FALSE,
  timezone TEXT DEFAULT 'America/New_York',
  business_hours JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CUSTOMERS
-- =============================================

-- Main customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  notes TEXT,
  loyalty_points INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0.00,
  last_visit TIMESTAMP WITH TIME ZONE,
  source TEXT, -- How the customer found your business
  tax_exempt BOOLEAN DEFAULT FALSE,
  tax_exempt_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT customers_email_phone_check CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Customer devices for repair history
CREATE TABLE IF NOT EXISTS customer_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  device_type TEXT NOT NULL, -- phone, tablet, computer, etc.
  brand TEXT, -- Apple, Samsung, etc.
  model TEXT, -- iPhone 12, Galaxy S21, etc.
  color TEXT,
  serial_number TEXT,
  imei TEXT,
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INVENTORY
-- =============================================

-- Inventory categories
CREATE TABLE IF NOT EXISTS inventory_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES inventory_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'US',
  website TEXT,
  notes TEXT,
  payment_terms TEXT,
  account_number TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Main inventory items table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  category_id UUID REFERENCES inventory_categories(id) ON DELETE SET NULL,
  supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  barcode TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  max_stock_level INTEGER,
  cost_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_rate DECIMAL(5,2) DEFAULT 0.00,
  tax_exempt BOOLEAN DEFAULT FALSE,
  location TEXT, -- Physical location in store (shelf, bin, etc.)
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_serialized BOOLEAN DEFAULT FALSE,
  is_service BOOLEAN DEFAULT FALSE, -- For non-physical items like labor
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sku)
);

-- Inventory transactions (stock movements)
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL, -- purchase, sale, adjustment, transfer, etc.
  quantity INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reference_id UUID, -- Can link to POS transaction, purchase order, etc.
  reference_type TEXT, -- pos_transaction, purchase_order, etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Serialized inventory items (for tracking individual items with serial numbers)
CREATE TABLE IF NOT EXISTS serialized_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  serial_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_stock', -- in_stock, sold, defective, etc.
  purchase_date DATE,
  purchase_order_id UUID,
  sold_date DATE,
  sales_transaction_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(inventory_id, serial_number)
);

-- Purchase orders
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
  po_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, ordered, partial, received, cancelled
  order_date DATE,
  expected_date DATE,
  received_date DATE,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  shipping_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, po_number)
);

-- Purchase order items
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  quantity_ordered INTEGER NOT NULL DEFAULT 0,
  quantity_received INTEGER NOT NULL DEFAULT 0,
  unit_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- REPAIR TICKETS
-- =============================================

-- Repair tickets/work orders
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  device_id UUID REFERENCES customer_devices(id) ON DELETE SET NULL,
  ticket_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, in_progress, waiting_for_parts, completed, cancelled
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  issue_description TEXT NOT NULL,
  diagnosis TEXT,
  technician_notes TEXT,
  customer_notes TEXT,
  device_password TEXT,
  device_condition TEXT,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  actual_completion TIMESTAMP WITH TIME ZONE,
  estimated_cost DECIMAL(10,2),
  labor_cost DECIMAL(10,2) DEFAULT 0.00,
  parts_cost DECIMAL(10,2) DEFAULT 0.00,
  tax_amount DECIMAL(10,2) DEFAULT 0.00,
  total_cost DECIMAL(10,2) DEFAULT 0.00,
  deposit_amount DECIMAL(10,2) DEFAULT 0.00,
  warranty_period INTEGER, -- Days
  warranty_expires_at TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ticket_number)
);

-- Ticket status history
CREATE TABLE IF NOT EXISTS ticket_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket parts/items used
CREATE TABLE IF NOT EXISTS ticket_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_warranty BOOLEAN DEFAULT FALSE,
  serial_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ticket labor charges
CREATE TABLE IF NOT EXISTS ticket_labor (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  hours DECIMAL(5,2) DEFAULT 1.00,
  rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  technician_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- POINT OF SALE (POS)
-- =============================================

-- POS registers
CREATE TABLE IF NOT EXISTS pos_registers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- POS transactions
CREATE TABLE IF NOT EXISTS pos_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  register_id UUID REFERENCES pos_registers(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  transaction_number TEXT NOT NULL,
  transaction_type TEXT NOT NULL DEFAULT 'sale', -- sale, refund, void
  payment_method TEXT NOT NULL, -- cash, card, check, etc.
  payment_status TEXT NOT NULL DEFAULT 'completed', -- pending, completed, failed, refunded
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  change_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, transaction_number)
);

-- POS transaction items
CREATE TABLE IF NOT EXISTS pos_transaction_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES pos_transactions(id) ON DELETE CASCADE,
  inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_refunded BOOLEAN DEFAULT FALSE,
  refund_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cash drawer management
CREATE TABLE IF NOT EXISTS cash_drawers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  register_id UUID NOT NULL REFERENCES pos_registers(id) ON DELETE CASCADE,
  opened_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  closed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  opening_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  expected_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  actual_amount DECIMAL(10,2),
  difference DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'open', -- open, closed
  notes TEXT,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cash drawer transactions
CREATE TABLE IF NOT EXISTS cash_drawer_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cash_drawer_id UUID NOT NULL REFERENCES cash_drawers(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES pos_transactions(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL, -- sale, refund, payout, deposit, etc.
  amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  performed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- APPOINTMENTS
-- =============================================

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, confirmed, in_progress, completed, cancelled, no_show
  type TEXT NOT NULL DEFAULT 'repair', -- repair, consultation, pickup, delivery, etc.
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reminder_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INVOICES
-- =============================================

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES pos_transactions(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  balance_due DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  notes TEXT,
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, invoice_number)
);

-- Invoice items
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1.00,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Invoice payments
CREATE TABLE IF NOT EXISTS invoice_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES pos_transactions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  payment_method TEXT NOT NULL, -- cash, card, check, etc.
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Customers indexes
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_store_id ON customers(store_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(first_name, last_name);

-- Inventory indexes
CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_store_id ON inventory(store_id);
CREATE INDEX IF NOT EXISTS idx_inventory_category_id ON inventory(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_supplier_id ON inventory(supplier_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_barcode ON inventory(barcode);
CREATE INDEX IF NOT EXISTS idx_inventory_name ON inventory USING gin(name gin_trgm_ops);

-- Tickets indexes
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_store_id ON tickets(store_id);
CREATE INDEX IF NOT EXISTS idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_number ON tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);

-- POS indexes
CREATE INDEX IF NOT EXISTS idx_pos_transactions_user_id ON pos_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_store_id ON pos_transactions(store_id);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_customer_id ON pos_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_ticket_id ON pos_transactions(ticket_id);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_transaction_number ON pos_transactions(transaction_number);
CREATE INDEX IF NOT EXISTS idx_pos_transactions_created_at ON pos_transactions(created_at);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update inventory quantity after POS transaction
CREATE OR REPLACE FUNCTION update_inventory_after_pos_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- For new transactions (sales)
  IF TG_OP = 'INSERT' AND NEW.transaction_type = 'sale' THEN
    -- Insert inventory transaction records and update inventory quantities
    INSERT INTO inventory_transactions (
      inventory_id, 
      user_id, 
      store_id, 
      transaction_type, 
      quantity, 
      previous_quantity, 
      new_quantity, 
      reference_id, 
      reference_type
    )
    SELECT 
      pti.inventory_id,
      NEW.user_id,
      NEW.store_id,
      'sale',
      -pti.quantity,
      i.quantity,
      i.quantity - pti.quantity,
      NEW.id,
      'pos_transaction'
    FROM pos_transaction_items pti
    JOIN inventory i ON pti.inventory_id = i.id
    WHERE pti.transaction_id = NEW.id;
    
    -- Update inventory quantities
    UPDATE inventory i
    SET 
      quantity = i.quantity - pti.quantity,
      updated_at = NOW()
    FROM pos_transaction_items pti
    WHERE pti.transaction_id = NEW.id AND i.id = pti.inventory_id;
    
  -- For refunds
  ELSIF TG_OP = 'UPDATE' AND NEW.transaction_type = 'refund' AND OLD.transaction_type = 'sale' THEN
    -- Insert inventory transaction records for refunded items
    INSERT INTO inventory_transactions (
      inventory_id, 
      user_id, 
      store_id, 
      transaction_type, 
      quantity, 
      previous_quantity, 
      new_quantity, 
      reference_id, 
      reference_type
    )
    SELECT 
      pti.inventory_id,
      NEW.user_id,
      NEW.store_id,
      'refund',
      pti.quantity,
      i.quantity,
      i.quantity + pti.quantity,
      NEW.id,
      'pos_transaction'
    FROM pos_transaction_items pti
    JOIN inventory i ON pti.inventory_id = i.id
    WHERE pti.transaction_id = NEW.id AND pti.is_refunded = TRUE;
    
    -- Update inventory quantities for refunded items
    UPDATE inventory i
    SET 
      quantity = i.quantity + pti.quantity,
      updated_at = NOW()
    FROM pos_transaction_items pti
    WHERE pti.transaction_id = NEW.id AND i.id = pti.inventory_id AND pti.is_refunded = TRUE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for POS transactions
CREATE TRIGGER trigger_update_inventory_after_pos_transaction
AFTER INSERT OR UPDATE ON pos_transactions
FOR EACH ROW
EXECUTE FUNCTION update_inventory_after_pos_transaction();

-- Function to update customer total_spent and last_visit
CREATE OR REPLACE FUNCTION update_customer_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.payment_status = 'completed' AND OLD.payment_status != 'completed') THEN
    -- Update customer total_spent and last_visit
    UPDATE customers
    SET 
      total_spent = total_spent + NEW.total_amount,
      last_visit = NOW(),
      updated_at = NOW()
    WHERE id = NEW.customer_id;
    
    -- Update loyalty points if applicable
    IF NEW.customer_id IS NOT NULL THEN
      UPDATE customers
      SET 
        loyalty_points = loyalty_points + FLOOR(NEW.total_amount / 10), -- 1 point per $10 spent
        updated_at = NOW()
      WHERE id = NEW.customer_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for customer stats
CREATE TRIGGER trigger_update_customer_stats
AFTER INSERT OR UPDATE ON pos_transactions
FOR EACH ROW
WHEN (NEW.customer_id IS NOT NULL)
EXECUTE FUNCTION update_customer_stats();

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE serialized_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_labor ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_registers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_drawers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_drawer_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
-- User profiles policy
CREATE POLICY user_profiles_policy ON user_profiles
  USING (id = auth.uid() OR EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
  ));

-- Stores policy
CREATE POLICY stores_policy ON stores
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM user_profiles up 
    WHERE up.id = auth.uid() AND up.role IN ('admin', 'owner')
  ));

-- Customers policy
CREATE POLICY customers_policy ON customers
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM stores s 
    WHERE s.id = customers.store_id AND s.user_id = auth.uid()
  ));

-- Inventory policy
CREATE POLICY inventory_policy ON inventory
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM stores s 
    WHERE s.id = inventory.store_id AND s.user_id = auth.uid()
  ));

-- Tickets policy
CREATE POLICY tickets_policy ON tickets
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM stores s 
    WHERE s.id = tickets.store_id AND s.user_id = auth.uid()
  ) OR assigned_to = auth.uid());

-- POS transactions policy
CREATE POLICY pos_transactions_policy ON pos_transactions
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM stores s 
    WHERE s.id = pos_transactions.store_id AND s.user_id = auth.uid()
  ));

-- =============================================
-- SAMPLE DATA
-- =============================================

-- Insert sample inventory categories
INSERT INTO inventory_categories (id, user_id, name, description)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'auth-user-id', 'Screen Parts', 'All screen replacement parts'),
  ('22222222-2222-2222-2222-222222222222', 'auth-user-id', 'Batteries', 'All battery replacement parts'),
  ('33333333-3333-3333-3333-333333333333', 'auth-user-id', 'Charging Ports', 'Charging port replacement parts'),
  ('44444444-4444-4444-4444-444444444444', 'auth-user-id', 'Accessories', 'Phone cases, screen protectors, etc.'),
  ('55555555-5555-5555-5555-555555555555', 'auth-user-id', 'Tools', 'Repair tools and equipment')
ON CONFLICT DO NOTHING;

-- Insert sample inventory items
INSERT INTO inventory (id, user_id, category_id, name, description, sku, barcode, quantity, min_stock_level, cost_price, price, tax_rate)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'auth-user-id', '11111111-1111-1111-1111-111111111111', 'iPhone 12 Screen', 'OEM quality replacement screen', 'SCR-IP12-BLK', '123456789012', 10, 3, 45.00, 89.99, 8.25),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'auth-user-id', '22222222-2222-2222-2222-222222222222', 'iPhone 12 Battery', 'OEM quality replacement battery', 'BAT-IP12', '223456789012', 15, 5, 25.00, 49.99, 8.25),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'auth-user-id', '33333333-3333-3333-3333-333333333333', 'Samsung S21 Charging Port', 'OEM quality charging port', 'CP-SS21', '323456789012', 8, 2, 15.00, 39.99, 8.25),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'auth-user-id', '44444444-4444-4444-4444-444444444444', 'Tempered Glass Screen Protector', 'Universal screen protector', 'ACC-GLASS-UNI', '423456789012', 50, 10, 2.00, 14.99, 8.25),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'auth-user-id', '55555555-5555-5555-5555-555555555555', 'Precision Screwdriver Set', '24-piece repair toolkit', 'TOOL-SCRW-24', '523456789012', 5, 1, 15.00, 29.99, 8.25)
ON CONFLICT DO NOTHING;

-- Insert sample customers
INSERT INTO customers (id, user_id, first_name, last_name, email, phone, address, city, state, zip_code)
VALUES
  ('11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'auth-user-id', 'John', 'Doe', 'john.doe@example.com', '555-123-4567', '123 Main St', 'Anytown', 'CA', '90210'),
  ('22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'auth-user-id', 'Jane', 'Smith', 'jane.smith@example.com', '555-987-6543', '456 Oak Ave', 'Somewhere', 'NY', '10001'),
  ('33333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'auth-user-id', 'Bob', 'Johnson', 'bob.johnson@example.com', '555-555-5555', '789 Pine Rd', 'Nowhere', 'TX', '75001')
ON CONFLICT DO NOTHING;

-- Insert sample customer devices
INSERT INTO customer_devices (id, customer_id, device_type, brand, model, color, serial_number)
VALUES
  ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'phone', 'Apple', 'iPhone 12', 'Black', 'IMEI123456789'),
  ('bbbbbbbb-1111-1111-1111-111111111111', '22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'phone', 'Samsung', 'Galaxy S21', 'Blue', 'IMEI987654321'),
  ('cccccccc-1111-1111-1111-111111111111', '33333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'tablet', 'Apple', 'iPad Pro', 'Silver', 'SN123456789ABC')
ON CONFLICT DO NOTHING;

-- Insert sample tickets
INSERT INTO tickets (id, user_id, customer_id, device_id, ticket_number, status, priority, issue_description, estimated_cost)
VALUES
  ('ticket-111-111-111-111', 'auth-user-id', '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-1111-1111-1111-111111111111', 'TK-10001', 'pending', 'medium', 'Cracked screen needs replacement', 99.99),
  ('ticket-222-222-222-222', 'auth-user-id', '22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-1111-1111-1111-111111111111', 'TK-10002', 'in_progress', 'high', 'Battery drains quickly', 59.99),
  ('ticket-333-333-333-333', 'auth-user-id', '33333333-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccccccc-1111-1111-1111-111111111111', 'TK-10003', 'waiting_for_parts', 'urgent', 'Device not charging', 49.99)
ON CONFLICT DO NOTHING;

-- Insert sample POS registers
INSERT INTO pos_registers (id, user_id, name, description)
VALUES
  ('register-111-111-111-111', 'auth-user-id', 'Main Register', 'Front desk main register'),
  ('register-222-222-222-222', 'auth-user-id', 'Back Office', 'Back office register')
ON CONFLICT DO NOTHING;

-- Insert sample POS transactions
INSERT INTO pos_transactions (id, user_id, register_id, customer_id, transaction_number, payment_method, subtotal, tax_amount, total_amount)
VALUES
  ('pos-tx-111-111-111-111', 'auth-user-id', 'register-111-111-111-111', '11111111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TX-10001', 'card', 89.99, 7.42, 97.41),
  ('pos-tx-222-222-222-222', 'auth-user-id', 'register-111-111-111-111', '22222222-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TX-10002', 'cash', 64.98, 5.36, 70.34)
ON CONFLICT DO NOTHING;

-- Insert sample POS transaction items
INSERT INTO pos_transaction_items (id, transaction_id, inventory_id, name, quantity, unit_price, tax_rate, tax_amount, total_price)
VALUES
  ('pos-item-111-111-111-111', 'pos-tx-111-111-111-111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'iPhone 12 Screen', 1, 89.99, 8.25, 7.42, 89.99),
  ('pos-item-222-222-222-222', 'pos-tx-222-222-222-222', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'iPhone 12 Battery', 1, 49.99, 8.25, 4.12, 49.99),
  ('pos-item-333-333-333-333', 'pos-tx-222-222-222-222', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Tempered Glass Screen Protector', 1, 14.99, 8.25, 1.24, 14.99)
ON CONFLICT DO NOTHING;
