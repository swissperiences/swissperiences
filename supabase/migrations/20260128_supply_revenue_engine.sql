-- Migration: Supply Chain & Revenue Engine (v1)
-- Description: Creates tables for inventory and partners with financial tracking capabilities.

-- 1. Property Inventory with Yield Management
CREATE TABLE IF NOT EXISTS admin_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    pillar_score INTEGER CHECK (pillar_score >= 1 AND pillar_score <= 5),
    management_fee_rate DECIMAL(5,2) DEFAULT 30.00, -- 30% default fee
    nightly_rate_base DECIMAL(10,2),
    status TEXT DEFAULT 'scouting', -- scouting, active, maintenance, inactive
    owner_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Partner Network with Curation Margins
CREATE TABLE IF NOT EXISTS admin_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    service_type TEXT NOT NULL, -- Private Chef, Guide, Logistics, etc.
    commission_rate DECIMAL(5,2) DEFAULT 20.00, -- 20% curation premium
    base_cost_estimate TEXT,
    region TEXT,
    ethos_verified BOOLEAN DEFAULT FALSE,
    contact_details JSONB,
    last_service_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_partners ENABLE ROW LEVEL SECURITY;

-- Note: Policies should be set to allow authenticated admin access only.
-- CREATE POLICY admin_access_inventory ON admin_inventory USING (auth.role() = 'authenticated');
-- CREATE POLICY admin_access_partners ON admin_partners USING (auth.role() = 'authenticated');

-- 3. SEED DATA (Growth Strategy)
INSERT INTO admin_inventory (name, location, status, management_fee_rate, pillar_score)
VALUES 
('Villars Sky Loft', 'Villars-sur-Ollon', 'active', 30.00, 5),
('Verbier Sanctuary', 'Verbier', 'scouting', 35.00, 5),
('Zermatt Glass House', 'Zermatt', 'scouting', 35.00, 4);

INSERT INTO admin_partners (name, service_type, region, commission_rate, ethos_verified)
VALUES 
('Marc Leroux', 'Private Chef', 'Valais', 20.00, true),
('Elena Fischer', 'Mountain Guide', 'Bernese Oberland', 15.00, true),
('Swiss Transfer Pro', 'Logistics', 'Geneva', 10.00, false);
