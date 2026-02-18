-- Allow admin to read all members (for Mission Control member profile view)
DROP POLICY IF EXISTS "Admin can read all members" ON members;
CREATE POLICY "Admin can read all members"
    ON members FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM admin_emails
            WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
    );
