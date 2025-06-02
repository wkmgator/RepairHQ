-- Extend existing tickets table or create a new one if structure is very different.
-- For this example, let's assume we add columns to the existing 'tickets' table
-- or have a related table for auto_body_specifics.

-- Option 1: Add columns to 'tickets' table (if not already too wide)
-- ALTER TABLE tickets
-- ADD COLUMN IF NOT EXISTS insurance_company VARCHAR(255),
-- ADD COLUMN IF NOT EXISTS policy_number VARCHAR(100),
-- ADD COLUMN IF NOT EXISTS claim_number VARCHAR(100),
-- ADD COLUMN IF NOT EXISTS adjuster_name VARCHAR(255),
-- ADD COLUMN IF NOT EXISTS adjuster_phone VARCHAR(20),
-- ADD COLUMN IF NOT EXISTS adjuster_email VARCHAR(255),
-- ADD COLUMN IF NOT EXISTS date_of_loss DATE,
-- ADD COLUMN IF NOT EXISTS ai_quote_details JSONB; -- To store the AutoBodyRepairQuote

-- Option 2: Create a related table (often better for specialized data)
CREATE TABLE IF NOT EXISTS auto_body_ticket_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  insurance_company VARCHAR(255),
  policy_number VARCHAR(100),
  claim_number VARCHAR(100),
  adjuster_name VARCHAR(255),
  adjuster_phone VARCHAR(20),
  adjuster_email VARCHAR(255),
  date_of_loss DATE,
  deductible NUMERIC(10, 2),
  ai_quote_input JSONB, -- Store the AutoBodyDamageInput
  ai_generated_quote JSONB, -- Store the AutoBodyRepairQuote
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_auto_body_ticket_details_ticket_id ON auto_body_ticket_details(ticket_id);

-- You might also want a table for insurance companies if you need to manage them separately
CREATE TABLE IF NOT EXISTS insurance_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
