-- POS System Database Schema

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  employee_id UUID REFERENCES employees(id) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  cash_received DECIMAL(10, 2),
  change_amount DECIMAL(10, 2),
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transaction items table
CREATE TABLE IF NOT EXISTS transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  item_id UUID REFERENCES inventory_items(id),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add loyalty_points column to customers table if it doesn't exist
ALTER TABLE customers ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0;

-- Add tax_rate column to inventory_items table if it doesn't exist
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5, 4) DEFAULT 0.0875;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_customer_id ON transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_employee_id ON transactions(employee_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction_id ON transaction_items(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_items_item_id ON transaction_items(item_id);

-- POS Registers Table
CREATE TABLE pos_registers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  location_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'inactive',
  register_type VARCHAR(50) NOT NULL DEFAULT 'main',
  ip_address VARCHAR(255),
  printer_connected BOOLEAN DEFAULT TRUE,
  card_reader_connected BOOLEAN DEFAULT TRUE,
  cash_drawer_connected BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_user_id UUID
);

-- POS Cash Drawers Table
CREATE TABLE pos_cash_drawers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  register_id UUID NOT NULL REFERENCES pos_registers(id),
  employee_id UUID NOT NULL,
  opening_amount DECIMAL(10, 2) NOT NULL,
  closing_amount DECIMAL(10, 2),
  expected_amount DECIMAL(10, 2) NOT NULL,
  difference DECIMAL(10, 2),
  status VARCHAR(50) NOT NULL DEFAULT 'open',
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- POS Transactions Table
CREATE TABLE pos_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_number VARCHAR(255) NOT NULL UNIQUE,
  customer_id UUID,
  employee_id UUID NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  payment_method VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL DEFAULT 'pending',
  location_id VARCHAR(255),
  register_id VARCHAR(255),
  shift_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- POS Transaction Items Table
CREATE TABLE pos_transaction_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES pos_transactions(id) ON DELETE CASCADE,
  inventory_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store Settings Table
CREATE TABLE store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(255),
  state VARCHAR(255),
  zip VARCHAR(20),
  country VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  website VARCHAR(255),
  tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) NOT NULL DEFAULT 'USD',
  logo_url TEXT,
  receipt_header TEXT,
  receipt_footer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to decrease inventory quantity
CREATE OR REPLACE FUNCTION decrease_inventory_quantity(
  inventory_id_param UUID,
  quantity_param INTEGER
) RETURNS VOID AS $$
BEGIN
  UPDATE inventory_items
  SET 
    quantity_in_stock = GREATEST(quantity_in_stock - quantity_param, 0),
    updated_at = NOW()
  WHERE id = inventory_id_param;
END;
$$ LANGUAGE plpgsql;
