-- Create admin_tasks table for project roadmap
CREATE TABLE IF NOT EXISTS public.admin_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Operations', -- Operations, Growth, Assets
    status TEXT DEFAULT 'pending', -- pending, done
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initial seed for tasks
INSERT INTO public.admin_tasks (title, category, status) VALUES
('Define nightly rates for Villars Loft', 'Operations', 'pending'),
('Set pricing tiers for Day Journeys', 'Operations', 'pending'),
('Consolidate Inbound CRM', 'Operations', 'done'),
('Verify Stripe Webhook reliability', 'Growth', 'pending'),
('Finalize SEO for Portuguese pages', 'Growth', 'pending'),
('Send direct links to 5 beta testers', 'Growth', 'pending'),
('Post launch video on Instagram', 'Growth', 'pending'),
('Cover: High Alpine Lake (Horizontal)', 'Assets', 'pending'),
('Day 1: Lavaux Vineyards (Sunny)', 'Assets', 'pending'),
('Day 1: Sunset over peaks (Gold hour)', 'Assets', 'pending');

-- Create admin_concepts table for R&D Lab
CREATE TABLE IF NOT EXISTS public.admin_concepts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    date_target TEXT,
    description TEXT,
    assets_req TEXT,
    status TEXT DEFAULT 'idea', -- idea, planned, active
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Initial seed for concepts
INSERT INTO public.admin_concepts (title, date_target, description, assets_req) VALUES
('Spring Awakening', 'May 2026', 'Alpine flowers, waking up the mountains, first hikes without snow.', 'Drone shots of green valleys + snowy peaks.'),
('Autumn Creative Retreat', 'Oct 2026', 'Photography & Content Creation workshop. Golden larch trees focus.', 'Videography workshop modules.'),
('Deep Winter Silence', 'Jan 2027', 'Snowshoeing, fondue in hidden chalet, absolute silence protocol.', 'Cozy apartment vibes + fireplace.');

-- RLS Policies
ALTER TABLE public.admin_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_concepts ENABLE ROW LEVEL SECURITY;

-- Allow authenticated read/write (assuming user is admin)
CREATE POLICY "Admin full access tasks" ON public.admin_tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access concepts" ON public.admin_concepts FOR ALL TO authenticated USING (true);
