/*
  # MedChain AI Friend Database Schema

  ## Overview
  This migration creates the complete database structure for the MedChain AI Friend application,
  a personal health assistant that analyzes medical records and provides AI-powered health guidance.

  ## New Tables

  ### 1. `profiles`
  Stores extended user profile information beyond basic authentication.
  - `id` (uuid, primary key) - Links to auth.users
  - `full_name` (text) - User's full name
  - `age` (integer) - User's age
  - `gender` (text) - User's gender
  - `height` (numeric) - Height in cm
  - `weight` (numeric) - Weight in kg
  - `wallet_address` (text, unique) - MedChain wallet address for blockchain integration
  - `health_goals` (text) - User's health goals and preferences
  - `created_at` (timestamptz) - Profile creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `health_reports`
  Stores uploaded medical reports and their AI analysis.
  - `id` (uuid, primary key) - Unique report identifier
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `file_name` (text) - Original PDF filename
  - `file_path` (text) - Storage path reference
  - `extracted_text` (text) - Extracted text from PDF
  - `ai_analysis` (jsonb) - AI-generated health insights and metrics
  - `uploaded_at` (timestamptz) - Upload timestamp
  - `analyzed_at` (timestamptz) - Analysis completion timestamp

  ### 3. `chat_conversations`
  Stores AI health coach chat history for context and memory.
  - `id` (uuid, primary key) - Unique conversation identifier
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `message` (text) - User or AI message content
  - `role` (text) - Either 'user' or 'assistant'
  - `created_at` (timestamptz) - Message timestamp

  ### 4. `health_recommendations`
  Stores personalized AI-generated recommendations.
  - `id` (uuid, primary key) - Unique recommendation identifier
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `report_id` (uuid, foreign key) - Links to health_reports
  - `category` (text) - Type: diet, exercise, lifestyle, preventive
  - `recommendations` (jsonb) - Structured recommendation data
  - `created_at` (timestamptz) - Recommendation generation timestamp

  ## Security

  All tables have Row Level Security (RLS) enabled with policies that ensure:
  - Users can only access their own data
  - All operations require authentication
  - No data leakage between users

  ## Important Notes

  1. This app uses Supabase Auth for user management (email/password)
  2. The wallet_address field enables future blockchain integration with MedChain DApp
  3. JSONB fields allow flexible storage of AI-generated insights
  4. Chat history enables AI to maintain context across conversations
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  age integer,
  gender text,
  height numeric,
  weight numeric,
  wallet_address text UNIQUE,
  health_goals text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create health_reports table
CREATE TABLE IF NOT EXISTS health_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  extracted_text text,
  ai_analysis jsonb,
  uploaded_at timestamptz DEFAULT now(),
  analyzed_at timestamptz
);

-- Create chat_conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);

-- Create health_recommendations table
CREATE TABLE IF NOT EXISTS health_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id uuid REFERENCES health_reports(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('diet', 'exercise', 'lifestyle', 'preventive')),
  recommendations jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_health_reports_user_id ON health_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_health_recommendations_user_id ON health_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_health_recommendations_report_id ON health_recommendations(report_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_recommendations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Health reports policies
CREATE POLICY "Users can view own health reports"
  ON health_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health reports"
  ON health_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health reports"
  ON health_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health reports"
  ON health_reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Chat conversations policies
CREATE POLICY "Users can view own chat conversations"
  ON chat_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON chat_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat conversations"
  ON chat_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Health recommendations policies
CREATE POLICY "Users can view own health recommendations"
  ON health_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health recommendations"
  ON health_recommendations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health recommendations"
  ON health_recommendations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own health recommendations"
  ON health_recommendations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();