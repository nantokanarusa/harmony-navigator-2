-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE records ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_settings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON profiles FOR DELETE USING (auth.uid() = id);

-- Records policies
CREATE POLICY "records_select_own" ON records FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "records_insert_own" ON records FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "records_update_own" ON records FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "records_delete_own" ON records FOR DELETE USING (auth.uid() = profile_id);

-- Value settings policies
CREATE POLICY "value_settings_select_own" ON value_settings FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "value_settings_insert_own" ON value_settings FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "value_settings_update_own" ON value_settings FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "value_settings_delete_own" ON value_settings FOR DELETE USING (auth.uid() = profile_id);
