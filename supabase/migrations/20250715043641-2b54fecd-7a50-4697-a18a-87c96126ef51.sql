-- Add foreign key relationship between sightings and profiles
ALTER TABLE public.sightings 
ADD CONSTRAINT fk_sightings_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add admin role system
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role public.user_role NOT NULL DEFAULT 'user';

-- Create admin user management function
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = user_id_param
      AND role = 'admin'
  )
$$;

-- Update RLS policies for admin access to sightings
CREATE POLICY "Admins can delete any sighting"
ON public.sightings
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Update profiles policies for admin management
CREATE POLICY "Admins can update any profile"
ON public.profiles  
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()) OR auth.uid() = user_id);