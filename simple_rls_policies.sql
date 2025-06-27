-- First, disable RLS temporarily to clear any issues
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE session_members DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view sessions they are members of" ON sessions;
DROP POLICY IF EXISTS "Users can create sessions" ON sessions;
DROP POLICY IF EXISTS "Hosts can update their own sessions" ON sessions;
DROP POLICY IF EXISTS "Hosts can delete their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can view members of sessions they are in" ON session_members;
DROP POLICY IF EXISTS "Users can join sessions" ON session_members;
DROP POLICY IF EXISTS "Hosts can add members to their sessions" ON session_members;
DROP POLICY IF EXISTS "Users can leave sessions" ON session_members;
DROP POLICY IF EXISTS "Hosts can remove members from their sessions" ON session_members;

-- Re-enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_members ENABLE ROW LEVEL SECURITY;

-- Simple sessions policies
CREATE POLICY "sessions_select_policy" ON sessions
FOR SELECT USING (true);

CREATE POLICY "sessions_insert_policy" ON sessions
FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "sessions_update_policy" ON sessions
FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "sessions_delete_policy" ON sessions
FOR DELETE USING (auth.uid() = host_id);

-- Simple session_members policies
CREATE POLICY "session_members_select_policy" ON session_members
FOR SELECT USING (true);

CREATE POLICY "session_members_insert_policy" ON session_members
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "session_members_delete_policy" ON session_members
FOR DELETE USING (auth.uid() = user_id); 