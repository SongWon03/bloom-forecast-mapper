-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  reports INTEGER NOT NULL DEFAULT 0,
  last_report TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create sightings table  
CREATE TABLE public.sightings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  region_name TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lon FLOAT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('cherry', 'forsythia', 'azalea')),
  stage TEXT NOT NULL CHECK (stage IN ('bud', 'bloom')),
  date DATE NOT NULL,
  photo_url TEXT,
  memo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create predictions table
CREATE TABLE public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_code TEXT NOT NULL,
  region_name TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lon FLOAT NOT NULL,
  species TEXT NOT NULL CHECK (species IN ('cherry', 'forsythia', 'azalea')),
  predicted_date DATE NOT NULL,
  confidence_low DATE NOT NULL,
  confidence_high DATE NOT NULL,
  model_version TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(region_code, species)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sightings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Sightings policies
CREATE POLICY "Users can view all sightings" ON public.sightings FOR SELECT USING (true);
CREATE POLICY "Users can create their own sightings" ON public.sightings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sightings" ON public.sightings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sightings" ON public.sightings FOR DELETE USING (auth.uid() = user_id);

-- Predictions policies (read-only for users)
CREATE POLICY "Anyone can view predictions" ON public.predictions FOR SELECT USING (true);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('sighting-photos', 'sighting-photos', true);

-- Storage policies
CREATE POLICY "Anyone can view sighting photos" ON storage.objects FOR SELECT USING (bucket_id = 'sighting-photos');
CREATE POLICY "Authenticated users can upload sighting photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'sighting-photos' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own sighting photos" ON storage.objects FOR UPDATE USING (bucket_id = 'sighting-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own sighting photos" ON storage.objects FOR DELETE USING (bucket_id = 'sighting-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nickname)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nickname', 'User'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update user points and reports
CREATE OR REPLACE FUNCTION public.update_user_stats(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET 
    reports = (SELECT COUNT(*) FROM public.sightings WHERE user_id = user_id_param),
    points = (SELECT COUNT(*) FROM public.sightings WHERE user_id = user_id_param) * 10,
    last_report = (SELECT MAX(created_at) FROM public.sightings WHERE user_id = user_id_param),
    updated_at = now()
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update user stats after sighting insert
CREATE OR REPLACE FUNCTION public.handle_sighting_insert()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.update_user_stats(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_sighting_created AFTER INSERT ON public.sightings FOR EACH ROW EXECUTE FUNCTION public.handle_sighting_insert();