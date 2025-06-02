-- Advanced Reporting Tables
CREATE TABLE IF NOT EXISTS financial_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type VARCHAR(50) NOT NULL, -- 'profit_loss', 'cash_flow', 'tax_report'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  data JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  generated_by UUID REFERENCES auth.users(id)
);

CREATE TABLE IF NOT EXISTS kpi_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(15,2) NOT NULL,
  metric_date DATE NOT NULL,
  location_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advanced Inventory Tables
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  payment_terms VARCHAR(100),
  lead_time_days INTEGER DEFAULT 7,
  rating DECIMAL(3,2) DEFAULT 5.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number VARCHAR(50) UNIQUE NOT NULL,
  supplier_id UUID REFERENCES suppliers(id),
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'received', 'cancelled'
  order_date DATE NOT NULL,
  expected_delivery DATE,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  inventory_item_id UUID,
  quantity INTEGER NOT NULL,
  unit_cost DECIMAL(10,2) NOT NULL,
  total_cost DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS parts_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id UUID,
  compatible_device_model VARCHAR(255) NOT NULL,
  device_brand VARCHAR(100) NOT NULL,
  compatibility_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer Portal Tables
CREATE TABLE IF NOT EXISTS customer_portal_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  ticket_id UUID,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounting Integration Tables
CREATE TABLE IF NOT EXISTS accounting_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(50) NOT NULL, -- 'quickbooks', 'xero', 'freshbooks'
  external_id VARCHAR(255),
  entity_type VARCHAR(50), -- 'customer', 'invoice', 'payment'
  entity_id UUID NOT NULL,
  sync_status VARCHAR(50) DEFAULT 'pending',
  last_synced TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Tables
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID,
  carrier VARCHAR(50) NOT NULL, -- 'ups', 'fedex', 'dhl'
  tracking_number VARCHAR(255) UNIQUE,
  service_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'created',
  shipping_cost DECIMAL(10,2),
  estimated_delivery DATE,
  actual_delivery DATE,
  recipient_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketing Tables
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'social'
  status VARCHAR(50) DEFAULT 'draft',
  target_audience JSONB,
  content JSONB,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  metrics JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mobile App Tables
CREATE TABLE IF NOT EXISTS mobile_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  device_id VARCHAR(255),
  app_version VARCHAR(50),
  platform VARCHAR(50), -- 'ios', 'android'
  push_token VARCHAR(255),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS field_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID,
  technician_id UUID REFERENCES auth.users(id),
  photo_url VARCHAR(500),
  photo_type VARCHAR(50), -- 'before', 'during', 'after', 'damage'
  description TEXT,
  gps_coordinates POINT,
  taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI/ML Tables
CREATE TABLE IF NOT EXISTS ai_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_type VARCHAR(100) NOT NULL,
  input_data JSONB NOT NULL,
  prediction_result JSONB NOT NULL,
  confidence_score DECIMAL(5,4),
  model_version VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IoT Tables
CREATE TABLE IF NOT EXISTS iot_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(255) UNIQUE NOT NULL,
  device_type VARCHAR(100) NOT NULL,
  location_id UUID,
  status VARCHAR(50) DEFAULT 'active',
  last_heartbeat TIMESTAMP WITH TIME ZONE,
  configuration JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS iot_sensor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(255) REFERENCES iot_devices(device_id),
  sensor_type VARCHAR(100) NOT NULL,
  value DECIMAL(10,4) NOT NULL,
  unit VARCHAR(20),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Multi-Location Tables
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255),
  manager_id UUID REFERENCES auth.users(id),
  timezone VARCHAR(100) DEFAULT 'UTC',
  business_hours JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Tables
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  role VARCHAR(100) NOT NULL,
  permissions JSONB,
  location_id UUID REFERENCES locations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_financial_reports_type_period ON financial_reports(report_type, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_kpi_metrics_date ON kpi_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON audit_logs(user_id, action, created_at);
CREATE INDEX IF NOT EXISTS idx_iot_sensor_data_device_time ON iot_sensor_data(device_id, timestamp);
