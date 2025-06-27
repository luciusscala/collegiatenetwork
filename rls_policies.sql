-- Enable RLS on tables
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_members ENABLE ROW LEVEL SECURITY;

-- Sessions table policies

-- Allow users to view sessions they are members of
CREATE POLICY "Users can view sessions they are members of" ON sessions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM session_members 
    WHERE session_members.session_id = sessions.id 
    AND session_members.user_id = auth.uid()
  )
);

-- Allow users to create sessions (they become the host)
CREATE POLICY "Users can create sessions" ON sessions
FOR INSERT WITH CHECK (auth.uid() = host_id);

-- Allow hosts to update their own sessions
CREATE POLICY "Hosts can update their own sessions" ON sessions
FOR UPDATE USING (auth.uid() = host_id);

-- Allow hosts to delete their own sessions
CREATE POLICY "Hosts can delete their own sessions" ON sessions
FOR DELETE USING (auth.uid() = host_id);

-- Session_members table policies

-- Allow users to view session members for sessions they are part of
CREATE POLICY "Users can view members of sessions they are in" ON session_members
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM session_members sm2 
    WHERE sm2.session_id = session_members.session_id 
    AND sm2.user_id = auth.uid()
  )
);

-- Allow users to join sessions (insert themselves as members)
CREATE POLICY "Users can join sessions" ON session_members
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow hosts to add other users to their sessions
CREATE POLICY "Hosts can add members to their sessions" ON session_members
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM sessions 
    WHERE sessions.id = session_members.session_id 
    AND sessions.host_id = auth.uid()
  )
);

-- Allow users to leave sessions (delete themselves)
CREATE POLICY "Users can leave sessions" ON session_members
FOR DELETE USING (auth.uid() = user_id);

-- Allow hosts to remove members from their sessions
CREATE POLICY "Hosts can remove members from their sessions" ON session_members
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM sessions 
    WHERE sessions.id = session_members.session_id 
    AND sessions.host_id = auth.uid()
  )
);

-- Optional: Allow public viewing of sessions (if you want sessions to be discoverable)
-- Uncomment the following if you want sessions to be publicly viewable
-- CREATE POLICY "Public can view sessions" ON sessions
-- FOR SELECT USING (true); 