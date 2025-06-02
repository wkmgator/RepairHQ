-- Advanced POS System Database Schema

-- Split Payments Table
CREATE TABLE IF NOT EXISTS pos_split_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES pos_transactions(id) ON DELETE CASCADE,
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  reference_number VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Layaway System
CREATE TABLE IF NOT EXISTS pos_layaways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  remaining_balance DECIMAL(10, 2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  items JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pos_layaway_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layaway_id UUID NOT NULL REFERENCES pos_layaways(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reference_number VARCHAR(255),
  notes TEXT
);

-- Gift Cards System
CREATE TABLE IF NOT EXISTS pos_gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_number VARCHAR(50) UNIQUE NOT NULL,
  initial_balance DECIMAL(10, 2) NOT NULL,
  current_balance DECIMAL(10, 2) NOT NULL,
  customer_id UUID REFERENCES customers(id),
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pos_gift_card_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_card_id UUID NOT NULL REFERENCES pos_gift_cards(id),
  transaction_id UUID REFERENCES pos_transactions(id),
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'purchase', 'redemption', 'refund'
  balance_after DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Credit System
CREATE TABLE IF NOT EXISTS pos_credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'credit', 'debit'
  reason TEXT,
  reference_transaction_id UUID REFERENCES pos_transactions(id),
  balance_after DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tax Rates System
CREATE TABLE IF NOT EXISTS pos_tax_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  rate DECIMAL(5, 4) NOT NULL, -- e.g., 0.0875 for 8.75%
  location_id VARCHAR(255),
  categories TEXT[], -- Array of applicable categories
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupons and Discounts
CREATE TABLE IF NOT EXISTS pos_coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  discount_type VARCHAR(50) NOT NULL, -- 'percentage', 'fixed_amount'
  discount_value DECIMAL(10, 2) NOT NULL,
  minimum_purchase DECIMAL(10, 2) DEFAULT 0,
  maximum_discount DECIMAL(10, 2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  start_date DATE,
  expiry_date DATE,
  applicable_categories TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Receipt Templates
CREATE TABLE IF NOT EXISTS pos_receipt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  template_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Returns System
CREATE TABLE IF NOT EXISTS pos_returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_transaction_id UUID NOT NULL REFERENCES pos_transactions(id),
  return_amount DECIMAL(10, 2) NOT NULL,
  reason TEXT NOT NULL,
  return_method VARCHAR(50) NOT NULL, -- 'original', 'cash', 'store_credit', 'gift_card'
  items JSONB NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  processed_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exchanges System
CREATE TABLE IF NOT EXISTS pos_exchanges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_transaction_id UUID NOT NULL REFERENCES pos_transactions(id),
  original_items JSONB NOT NULL,
  exchange_items JSONB NOT NULL,
  price_difference DECIMAL(10, 2) NOT NULL,
  reason TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  processed_by UUID REFERENCES employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory Alerts
CREATE TABLE IF NOT EXISTS inventory_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES inventory_items(id),
  alert_type VARCHAR(50) NOT NULL, -- 'low_stock', 'out_of_stock', 'expired'
  message TEXT NOT NULL,
  severity VARCHAR(50) NOT NULL DEFAULT 'info', -- 'info', 'warning', 'error'
  acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_by UUID REFERENCES employees(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Loyalty Tiers
CREATE TABLE IF NOT EXISTS customer_loyalty_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  minimum_points INTEGER NOT NULL,
  point_multiplier DECIMAL(3, 2) NOT NULL DEFAULT 1.0,
  benefits JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add loyalty tier to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS loyalty_tier VARCHAR(50) DEFAULT 'bronze';
ALTER TABLE customers ADD COLUMN IF NOT EXISTS store_credit DECIMAL(10, 2) DEFAULT 0;

-- POS Performance Metrics
CREATE TABLE IF NOT EXISTS pos_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  register_id UUID REFERENCES pos_registers(id),
  employee_id UUID REFERENCES employees(id),
  transactions_count INTEGER DEFAULT 0,
  total_sales DECIMAL(12, 2) DEFAULT 0,
  total_tax DECIMAL(10, 2) DEFAULT 0,
  total_discounts DECIMAL(10, 2) DEFAULT 0,
  average_transaction_value DECIMAL(10, 2) DEFAULT 0,
  items_sold INTEGER DEFAULT 0,
  returns_count INTEGER DEFAULT 0,
  returns_amount DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, register_id, employee_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pos_split_payments_transaction_id ON pos_split_payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_pos_layaways_customer_id ON pos_layaways(customer_id);
CREATE INDEX IF NOT EXISTS idx_pos_layaways_status ON pos_layaways(status);
CREATE INDEX IF NOT EXISTS idx_pos_layaways_due_date ON pos_layaways(due_date);
CREATE INDEX IF NOT EXISTS idx_pos_gift_cards_card_number ON pos_gift_cards(card_number);
CREATE INDEX IF NOT EXISTS idx_pos_gift_cards_customer_id ON pos_gift_cards(customer_id);
CREATE INDEX IF NOT EXISTS idx_pos_gift_cards_status ON pos_gift_cards(status);
CREATE INDEX IF NOT EXISTS idx_pos_credit_transactions_customer_id ON pos_credit_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_pos_tax_rates_location_id ON pos_tax_rates(location_id);
CREATE INDEX IF NOT EXISTS idx_pos_coupons_code ON pos_coupons(code);
CREATE INDEX IF NOT EXISTS idx_pos_coupons_active ON pos_coupons(active);
CREATE INDEX IF NOT EXISTS idx_pos_returns_original_transaction_id ON pos_returns(original_transaction_id);
CREATE INDEX IF NOT EXISTS idx_pos_exchanges_original_transaction_id ON pos_exchanges(original_transaction_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_item_id ON inventory_alerts(item_id);
CREATE INDEX IF NOT EXISTS idx_inventory_alerts_acknowledged ON inventory_alerts(acknowledged);
CREATE INDEX IF NOT EXISTS idx_pos_performance_metrics_date ON pos_performance_metrics(date);
CREATE INDEX IF NOT EXISTS idx_pos_performance_metrics_register_id ON pos_performance_metrics(register_id);

-- Functions for inventory management
CREATE OR REPLACE FUNCTION update_inventory_quantity(
  item_id UUID,
  quantity_change INTEGER,
  location_id VARCHAR DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
  UPDATE inventory_items
  SET 
    quantity_in_stock = GREATEST(quantity_in_stock + quantity_change, 0),
    updated_at = NOW()
  WHERE id = item_id;
  
  -- Log inventory movement
  INSERT INTO inventory_movements (
    item_id,
    movement_type,
    quantity,
    location_id,
    created_at
  ) VALUES (
    item_id,
    CASE WHEN quantity_change > 0 THEN 'stock_in' ELSE 'stock_out' END,
    ABS(quantity_change),
    location_id,
    NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate loyalty points
CREATE OR REPLACE FUNCTION calculate_loyalty_points(
  customer_id_param UUID,
  purchase_amount DECIMAL
) RETURNS INTEGER AS $$
DECLARE
  tier_multiplier DECIMAL := 1.0;
  base_points INTEGER;
BEGIN
  -- Get customer's tier multiplier
  SELECT point_multiplier INTO tier_multiplier
  FROM customer_loyalty_
