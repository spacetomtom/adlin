/*
  # Create Meeting Room Reservation System Tables

  1. New Tables (if they don't exist)
    - `rooms`: Stores meeting room information
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `capacity` (integer)
      - `equipements` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `reservations`: Stores room reservations
      - `id` (uuid, primary key)
      - `room_id` (uuid, foreign key)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `title` (text)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (since user authentication is not required)
*/

-- Create rooms table if it doesn't exist
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  capacity integer NOT NULL,
  equipements jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create reservations table if it doesn't exist
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES rooms(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Enable RLS safely using DO blocks
DO $$
BEGIN
  ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create policies safely using DO blocks
DO $$
BEGIN
  CREATE POLICY "Allow public read access to rooms"
    ON rooms
    FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Allow public read access to reservations"
    ON reservations
    FOR SELECT
    TO public
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE POLICY "Allow public insert access to reservations"
    ON reservations
    FOR INSERT
    TO public
    WITH CHECK (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Insert sample rooms data safely
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM rooms LIMIT 1) THEN
    INSERT INTO rooms (name, description, capacity, equipements)
    VALUES 
      ('Salle #1', 'Salle #1', 5, '[{"name": "TV"}, {"name": "Retro Projecteur"}]'),
      ('Salle #2', 'Salle #2', 10, '[{"name": "Retro Projecteur"}]'),
      ('Salle Okjsdkso', 'Salle Okjsdkso', 11, '[]'),
      ('Salle de ouf', 'Salle de ouf', 10, '[{"name": "TV"}, {"name": "Retro Projecteur"}]'),
      ('Salle nulle', 'Salle nulle', 26, '[{"name": "TV"}, {"name": "Retro Projecteur"}]');
  END IF;
END $$;