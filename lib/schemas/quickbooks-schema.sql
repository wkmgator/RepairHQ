-- QuickBooks Integration Tables
CREATE TABLE IF NOT EXISTS quickbooks_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL,
  qb_company_id TEXT NOT NULL,
  company_name TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  token_type TEXT DEFAULT 'Bearer',
  scope TEXT,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, company_id)
);

-- Add QuickBooks employee ID to employees table
ALTER TABLE employees 
ADD COLUMN IF NOT EXISTS quickbooks_employee_id TEXT,
ADD COLUMN IF NOT EXISTS quickbooks_synced_at TIMESTAMP WITH TIME ZONE;

-- Add QuickBooks customer ID to customers table  
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS quickbooks_customer_id TEXT,
ADD COLUMN IF NOT EXISTS quickbooks_synced_at TIMESTAMP WITH TIME ZONE;

-- Add QuickBooks time activity ID to time entries
ALTER TABLE time_entries
ADD COLUMN IF NOT EXISTS quickbooks_time_activity_id TEXT,
ADD COLUMN IF NOT EXISTS quickbooks_synced_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quickbooks_integrations_user_company 
ON quickbooks_integrations(user_id, company_id);

CREATE INDEX IF NOT EXISTS idx_quickbooks_integrations_active 
ON quickbooks_integrations(is_active);

CREATE INDEX IF NOT EXISTS idx_employees_quickbooks_id 
ON employees(quickbooks_employee_id) WHERE quickbooks_employee_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_customers_quickbooks_id 
ON customers(quickbooks_customer_id) WHERE quickbooks_customer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_time_entries_quickbooks_sync 
ON time_entries(quickbooks_synced_at) WHERE quickbooks_time_activity_id IS NOT NULL;

-- RLS Policies
ALTER TABLE quickbooks_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own QuickBooks integrations" 
ON quickbooks_integrations FOR ALL 
USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_quickbooks_integration_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_quickbooks_integrations_updated_at
  BEFORE UPDATE ON quickbooks_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_quickbooks_integration_updated_at();
