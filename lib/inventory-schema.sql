-- Create inventory_transactions table if it doesn't exist
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  store_id UUID,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('add', 'remove', 'set', 'sale', 'return', 'adjustment')),
  quantity INTEGER NOT NULL,
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason VARCHAR(50),
  reference_id UUID,
  reference_type VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on item_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_item_id ON inventory_transactions(item_id);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_user_id ON inventory_transactions(user_id);

-- Create index on created_at for faster date range queries
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_at ON inventory_transactions(created_at);
