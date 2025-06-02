-- Health check queries for Supabase
-- Run these to verify the database is properly configured

-- Check if RLS is enabled on critical tables
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'customers', 'tickets', 'invoices', 'inventory')
ORDER BY tablename;

-- Check if auth schema exists and has proper functions
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_schema = 'auth'
ORDER BY routine_name;

-- Verify user roles function exists
SELECT EXISTS (
  SELECT 1 
  FROM information_schema.routines 
  WHERE routine_schema = 'auth' 
    AND routine_name = 'user_role'
) as user_role_function_exists;

-- Check if policies exist for main tables
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verify triggers are in place for updated_at columns
SELECT 
  event_object_table,
  trigger_name,
  action_timing,
  event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
  AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;
