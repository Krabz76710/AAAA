/*
  # Création de la table des profils utilisateurs (Version finale)
  
  Ce script vérifie l'existence des éléments avant de les créer
  pour éviter les erreurs de doublons.
*/

-- Créer le type enum seulement s'il n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type_enum') THEN
        CREATE TYPE user_type_enum AS ENUM ('individual', 'company');
    END IF;
END $$;

-- Créer la table profiles seulement si elle n'existe pas
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type user_type_enum NOT NULL,
  profile_data jsonb DEFAULT '{}',
  documents jsonb DEFAULT '[]',
  profile_completion integer DEFAULT 0 CHECK (profile_completion >= 0 AND profile_completion <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activer RLS seulement si pas déjà activé
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE tablename = 'profiles' 
        AND rowsecurity = true
    ) THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Créer les politiques seulement si elles n'existent pas
DO $$
BEGIN
    -- Politique de lecture
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can read own profile'
    ) THEN
        CREATE POLICY "Users can read own profile"
          ON profiles
          FOR SELECT
          TO authenticated
          USING (auth.uid() = id);
    END IF;

    -- Politique de création
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can create own profile'
    ) THEN
        CREATE POLICY "Users can create own profile"
          ON profiles
          FOR INSERT
          TO authenticated
          WITH CHECK (auth.uid() = id);
    END IF;

    -- Politique de mise à jour
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can update own profile'
    ) THEN
        CREATE POLICY "Users can update own profile"
          ON profiles
          FOR UPDATE
          TO authenticated
          USING (auth.uid() = id)
          WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Créer la fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer le trigger seulement s'il n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_profiles_updated_at'
    ) THEN
        CREATE TRIGGER update_profiles_updated_at
          BEFORE UPDATE ON profiles
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Créer la fonction de gestion des nouveaux utilisateurs
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, profile_data)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'user_type', 'individual')::user_type_enum,
    COALESCE(new.raw_user_meta_data - 'user_type', '{}')
  );
  RETURN new;
END;
$$ language plpgsql security definer;

-- Créer le trigger pour les nouveaux utilisateurs seulement s'il n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- Créer les index seulement s'ils n'existent pas
CREATE INDEX IF NOT EXISTS profiles_user_type_idx ON profiles(user_type);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles(created_at);
CREATE INDEX IF NOT EXISTS profiles_profile_completion_idx ON profiles(profile_completion);

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Migration terminée avec succès ! Table profiles créée ou mise à jour.';
END $$;