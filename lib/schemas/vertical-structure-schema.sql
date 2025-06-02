-- Add vertical field to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS vertical VARCHAR(50) DEFAULT 'general';

-- Create vertical_configurations table
CREATE TABLE IF NOT EXISTS vertical_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  vertical VARCHAR(50) NOT NULL,
  configuration JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vertical_templates table for industry-specific templates
CREATE TABLE IF NOT EXISTS vertical_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vertical VARCHAR(50) NOT NULL,
  template_type VARCHAR(50) NOT NULL, -- 'ticket', 'invoice', 'waiver', etc.
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default vertical configurations
INSERT INTO vertical_templates (vertical, template_type, name, description, template_data, is_default) VALUES
('aerospace', 'waiver', 'Aircraft Maintenance Waiver', 'Standard waiver for aircraft maintenance services', 
 '{"title": "Aircraft Maintenance Authorization", "content": "I authorize the maintenance facility to perform the requested work on my aircraft. I understand that estimates may change upon inspection and discovery of additional issues.", "signature_required": true, "witness_required": true}', true),
('aerospace', 'invoice', 'Aircraft Service Invoice', 'FAA-compliant invoice template for aircraft services',
 '{"header": "Aircraft Maintenance Services", "fields": ["tail_number", "aircraft_type", "work_performed", "parts_used", "labor_hours", "faa_compliance_notes"], "footer": "This work was performed in accordance with FAA regulations"}', true),
('electronics', 'waiver', 'Electronics Repair Waiver', 'Standard electronics repair liability waiver',
 '{"title": "Electronics Repair Authorization", "content": "I authorize the repair of my electronic device and understand that data loss may occur during the repair process.", "signature_required": true}', true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vertical_configurations_user_id ON vertical_configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_vertical_configurations_store_id ON vertical_configurations(store_id);
CREATE INDEX IF NOT EXISTS idx_vertical_configurations_vertical ON vertical_configurations(vertical);
CREATE INDEX IF NOT EXISTS idx_vertical_templates_vertical ON vertical_templates(vertical);
CREATE INDEX IF NOT EXISTS idx_vertical_templates_type ON vertical_templates(template_type);

-- Update RLS policies
ALTER TABLE vertical_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vertical_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own vertical configurations" ON vertical_configurations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view vertical templates" ON vertical_templates
  FOR SELECT USING (true);

-- Add vertical-specific custom fields to tickets
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS vertical_specific_data JSONB DEFAULT '{}';

-- Add comments
COMMENT ON TABLE vertical_configurations IS 'Store vertical-specific configurations and settings';
COMMENT ON TABLE vertical_templates IS 'Industry-specific templates for waivers, invoices, and forms';
COMMENT ON COLUMN tickets.vertical_specific_data IS 'Store vertical-specific data like tail numbers, VINs, etc.';
