-- Usage events table to track individual usage events
CREATE TABLE IF NOT EXISTS usage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type VARCHAR(255) NOT NULL,
  metadata JSONB,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on user_id and event_type for faster queries
CREATE INDEX IF NOT EXISTS usage_events_user_id_event_type_idx ON usage_events(user_id, event_type);
CREATE INDEX IF NOT EXISTS usage_events_created_at_idx ON usage_events(created_at);

-- Usage summaries table to store aggregated usage data by month
CREATE TABLE IF NOT EXISTS usage_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  metrics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create unique index on user_id, year, and month
CREATE UNIQUE INDEX IF NOT EXISTS usage_summaries_user_year_month_idx ON usage_summaries(user_id, year, month);

-- Feature usage table to track feature usage
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature VARCHAR(255) NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on user_id and feature
CREATE INDEX IF NOT EXISTS feature_usage_user_id_feature_idx ON feature_usage(user_id, feature);

-- Storage usage table to track storage usage
CREATE TABLE IF NOT EXISTS storage_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_size_mb NUMERIC(10, 2) NOT NULL DEFAULT 0,
  file_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create unique index on user_id
CREATE UNIQUE INDEX IF NOT EXISTS storage_usage_user_id_idx ON storage_usage(user_id);

-- Plan feature limits table to store limits for each plan
CREATE TABLE IF NOT EXISTS plan_feature_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_name VARCHAR(255) NOT NULL UNIQUE,
  max_work_orders INTEGER,
  max_api_calls INTEGER,
  max_storage_mb INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Usage alerts table to store alerts for users approaching limits
CREATE TABLE IF NOT EXISTS usage_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index on user_id and is_read
CREATE INDEX IF NOT EXISTS usage_alerts_user_id_is_read_idx ON usage_alerts(user_id, is_read);

-- Insert default plan feature limits
INSERT INTO plan_feature_limits (plan_name, max_work_orders, max_api_calls, max_storage_mb)
VALUES
  ('starter', 100, 1000, 500),
  ('professional', 1000, 10000, 5000),
  ('enterprise', NULL, 100000, 50000),
  ('franchise', NULL, NULL, NULL)
ON CONFLICT (plan_name) DO UPDATE
SET
  max_work_orders = EXCLUDED.max_work_orders,
  max_api_calls = EXCLUDED.max_api_calls,
  max_storage_mb = EXCLUDED.max_storage_mb,
  updated_at = NOW();
