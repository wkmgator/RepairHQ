-- =============================================
-- RepairHQ Complete Database Schema Migration
-- Version: 1.0.0
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- AUDIT & LOGGING TABLES
-- =============================================

-- System audit log for tracking all database changes
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL, -- INSERT, UPDATE, DELETE
  user_id UUID REFERENCES auth.users(id),
  record_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application logs for tracking system events
CREATE TABLE IF NOT EXISTS application_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL, -- ERROR, WARN, INFO, DEBUG
  category TEXT NOT NULL, -- auth, payment, inventory, etc.
  message TEXT NOT NULL,
  metadata JSONB,
  user_id UUID REFERENCES auth.users(id),
  store_id UUID REFERENCES stores(id),
  error_stack TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics for monitoring
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,2),
  metric_unit TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- BACKUP TRACKING
-- =============================================

CREATE TABLE IF NOT EXISTS backup_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  backup_type TEXT NOT NULL, -- full, incremental, snapshot
  status TEXT NOT NULL, -- started, completed, failed
  size_bytes BIGINT,
  duration_seconds INTEGER,
  tables_backed_up TEXT[],
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_record_id ON audit_log(record_id);

-- Application logs indexes
CREATE INDEX IF NOT EXISTS idx_application_logs_level ON application_logs(level);
CREATE INDEX IF NOT EXISTS idx_application_logs_category ON application_logs(category);
CREATE INDEX IF NOT EXISTS idx_application_logs_created_at ON application_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_application_logs_user_id ON application_logs(user_id);

-- Performance metrics indexes
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_created_at ON performance_metrics(created_at);

-- =============================================
-- AUDIT TRIGGER FUNCTION
-- =============================================

CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (
      table_name,
      operation,
      user_id,
      record_id,
      new_data,
      ip_address,
      user_agent
    ) VALUES (
      TG_TABLE_NAME,
      TG_OP,
      auth.uid(),
      NEW.id,
      to_jsonb(NEW),
      inet_client_addr(),
      current_setting('application.user_agent', true)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (
      table_name,
      operation,
      user_id,
      record_id,
      old_data,
      new_data,
      ip_address,
      user_agent
    ) VALUES (
      TG_TABLE_NAME,
      TG_OP,
      auth.uid(),
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW),
      inet_client_addr(),
      current_setting('application.user_agent', true)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (
      table_name,
      operation,
      user_id,
      record_id,
      old_data,
      ip_address,
      user_agent
    ) VALUES (
      TG_TABLE_NAME,
      TG_OP,
      auth.uid(),
      OLD.id,
      to_jsonb(OLD),
      inet_client_addr(),
      current_setting('application.user_agent', true)
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- APPLY AUDIT TRIGGERS TO CRITICAL TABLES
-- =============================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS audit_trigger_customers ON customers;
DROP TRIGGER IF EXISTS audit_trigger_inventory ON inventory;
DROP TRIGGER IF EXISTS audit_trigger_tickets ON tickets;
DROP TRIGGER IF EXISTS audit_trigger_pos_transactions ON pos_transactions;
DROP TRIGGER IF EXISTS audit_trigger_invoices ON invoices;

-- Create audit triggers
CREATE TRIGGER audit_trigger_customers
  AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_trigger_inventory
  AFTER INSERT OR UPDATE OR DELETE ON inventory
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_trigger_tickets
  AFTER INSERT OR UPDATE OR DELETE ON tickets
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_trigger_pos_transactions
  AFTER INSERT OR UPDATE OR DELETE ON pos_transactions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_trigger_invoices
  AFTER INSERT OR UPDATE OR DELETE ON invoices
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =============================================
-- DATA RETENTION POLICIES
-- =============================================

-- Function to clean old logs
CREATE OR REPLACE FUNCTION clean_old_logs()
RETURNS void AS $$
BEGIN
  -- Delete audit logs older than 2 years
  DELETE FROM audit_log WHERE created_at < NOW() - INTERVAL '2 years';
  
  -- Delete application logs older than 90 days (except errors)
  DELETE FROM application_logs 
  WHERE created_at < NOW() - INTERVAL '90 days' 
  AND level != 'ERROR';
  
  -- Delete error logs older than 1 year
  DELETE FROM application_logs 
  WHERE created_at < NOW() - INTERVAL '1 year' 
  AND level = 'ERROR';
  
  -- Delete performance metrics older than 30 days
  DELETE FROM performance_metrics 
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- MONITORING VIEWS
-- =============================================

-- View for monitoring table sizes
CREATE OR REPLACE VIEW table_sizes AS
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- View for monitoring active connections
CREATE OR REPLACE VIEW active_connections AS
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query_start,
  state_change,
  query
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start DESC;

-- View for monitoring slow queries
CREATE OR REPLACE VIEW slow_queries AS
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  min_time,
  max_time
FROM pg_stat_statements
WHERE mean_time > 1000 -- queries taking more than 1 second
ORDER BY mean_time DESC
LIMIT 50;

-- =============================================
-- GRANT PERMISSIONS
-- =============================================

-- Grant permissions for monitoring views
GRANT SELECT ON table_sizes TO authenticated;
GRANT SELECT ON active_connections TO authenticated;
GRANT SELECT ON slow_queries TO authenticated;

-- =============================================
-- ROW LEVEL SECURITY FOR NEW TABLES
-- =============================================

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_history ENABLE ROW LEVEL SECURITY;

-- Audit log policy (only admins can view)
CREATE POLICY audit_log_policy ON audit_log
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Application logs policy (users can see their own logs, admins see all)
CREATE POLICY application_logs_policy ON application_logs
  FOR ALL
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Performance metrics policy (admins only)
CREATE POLICY performance_metrics_policy ON performance_metrics
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Backup history policy (admins only)
CREATE POLICY backup_history_policy ON backup_history
  FOR ALL
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));
