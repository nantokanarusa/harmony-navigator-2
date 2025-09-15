-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY definer
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_name, record_mode, created_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'user_name', null),
    'quick', -- default record mode
    now()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

-- Trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
