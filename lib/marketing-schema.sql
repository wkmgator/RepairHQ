-- Marketing Campaigns Table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- email, sms, push, etc.
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, active, paused, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  target_audience JSONB, -- criteria for targeting customers
  content JSONB, -- email/sms content, templates, etc.
  metrics JSONB, -- open rates, click rates, conversion rates, etc.
  created_by UUID REFERENCES auth.users(id)
);

-- Campaign Recipients Table
CREATE TABLE IF NOT EXISTS campaign_recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES marketing_campaigns(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, sent, delivered, opened, clicked, converted, failed, unsubscribed
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB -- additional data like device info, location, etc.
);

-- Email Templates Table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL, -- HTML content
  plain_text TEXT, -- Plain text version
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category VARCHAR(50), -- transactional, promotional, etc.
  tags TEXT[], -- for categorization
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE
);

-- SMS Templates Table
CREATE TABLE IF NOT EXISTS sms_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL, -- SMS content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category VARCHAR(50), -- transactional, promotional, etc.
  tags TEXT[], -- for categorization
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE
);

-- Customer Segments Table
CREATE TABLE IF NOT EXISTS customer_segments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL, -- segmentation criteria
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE,
  customer_count INTEGER DEFAULT 0 -- cached count of customers in this segment
);

-- Marketing Automations Table
CREATE TABLE IF NOT EXISTS marketing_automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  trigger_type VARCHAR(50) NOT NULL, -- event, schedule, etc.
  trigger_config JSONB NOT NULL, -- configuration for the trigger
  actions JSONB NOT NULL, -- sequence of actions to perform
  status VARCHAR(50) NOT NULL DEFAULT 'draft', -- draft, active, paused
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT TRUE
);

-- Marketing Events Table
CREATE TABLE IF NOT EXISTS marketing_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- page_view, purchase, abandoned_cart, etc.
  event_data JSONB NOT NULL, -- event details
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(50),
  user_agent TEXT,
  url TEXT,
  referrer TEXT
);

-- Customer Communication Preferences
CREATE TABLE IF NOT EXISTS customer_communication_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  email_marketing BOOLEAN DEFAULT TRUE,
  sms_marketing BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  email_transactional BOOLEAN DEFAULT TRUE,
  sms_transactional BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_status ON marketing_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_status ON campaign_recipients(status);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign_id ON campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_customer_id ON campaign_recipients(customer_id);
CREATE INDEX IF NOT EXISTS idx_marketing_events_customer_id ON marketing_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_marketing_events_event_type ON marketing_events(event_type);
CREATE INDEX IF NOT EXISTS idx_customer_communication_preferences_customer_id ON customer_communication_preferences(customer_id);
