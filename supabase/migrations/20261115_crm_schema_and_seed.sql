-- ==============================================================
-- Supabase Schema & Sample Data for CRM Dashboard (/dashboard/crm)
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/kikcqdtiacofeegglzzk/sql/new
-- ==============================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.crm_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_code TEXT NOT NULL UNIQUE,
  account TEXT NOT NULL,
  stage TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1,
  health TEXT NOT NULL,
  value NUMERIC(12, 2) NOT NULL,
  contact_person TEXT,
  expected_close_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  meeting_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_pipeline_stats (
  id SERIAL PRIMARY KEY,
  period TEXT NOT NULL,
  month_num INTEGER NOT NULL,
  year INTEGER NOT NULL,
  qualified_leads INTEGER NOT NULL,
  discovery_calls INTEGER NOT NULL,
  proposals_sent INTEGER NOT NULL,
  closed_deals INTEGER NOT NULL,
  pipeline_value NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.crm_kpi_summary (
  id SERIAL PRIMARY KEY,
  pipeline_value NUMERIC(12, 2) NOT NULL DEFAULT 284500.00,
  pipeline_value_prev NUMERIC(12, 2) NOT NULL DEFAULT 254200.00,
  qualified_lead_rate NUMERIC(5, 2) NOT NULL DEFAULT 28.4,
  qualified_lead_rate_prev NUMERIC(5, 2) NOT NULL DEFAULT 30.9,
  open_opportunities INTEGER NOT NULL DEFAULT 42,
  open_opportunities_prev INTEGER NOT NULL DEFAULT 35,
  lead_to_deal_rate NUMERIC(5, 2) NOT NULL DEFAULT 16.8,
  lead_to_deal_rate_prev NUMERIC(5, 2) NOT NULL DEFAULT 13.6,
  proposal_sent INTEGER NOT NULL DEFAULT 12,
  proposal_goal INTEGER NOT NULL DEFAULT 18,
  discovery_calls_booked INTEGER NOT NULL DEFAULT 184,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_pipeline_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_kpi_summary ENABLE ROW LEVEL SECURITY;

-- 3. Public Read Policies
DROP POLICY IF EXISTS "Allow public read on crm_opportunities" ON public.crm_opportunities;
CREATE POLICY "Allow public read on crm_opportunities" ON public.crm_opportunities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on crm_meetings" ON public.crm_meetings;
CREATE POLICY "Allow public read on crm_meetings" ON public.crm_meetings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on crm_pipeline_stats" ON public.crm_pipeline_stats;
CREATE POLICY "Allow public read on crm_pipeline_stats" ON public.crm_pipeline_stats FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on crm_kpi_summary" ON public.crm_kpi_summary;
CREATE POLICY "Allow public read on crm_kpi_summary" ON public.crm_kpi_summary FOR SELECT USING (true);

-- 4. Insert CRM KPI Summary
INSERT INTO public.crm_kpi_summary (id, pipeline_value, pipeline_value_prev, qualified_lead_rate, qualified_lead_rate_prev, open_opportunities, open_opportunities_prev, lead_to_deal_rate, lead_to_deal_rate_prev, proposal_sent, proposal_goal, discovery_calls_booked)
VALUES (1, 284500, 254200, 28.4, 30.9, 42, 35, 16.8, 13.6, 12, 18, 184)
ON CONFLICT (id) DO UPDATE SET
  pipeline_value = EXCLUDED.pipeline_value,
  qualified_lead_rate = EXCLUDED.qualified_lead_rate,
  open_opportunities = EXCLUDED.open_opportunities,
  lead_to_deal_rate = EXCLUDED.lead_to_deal_rate,
  updated_at = NOW();

-- 5. Insert Pipeline Monthly Stats
INSERT INTO public.crm_pipeline_stats (period, month_num, year, qualified_leads, discovery_calls, proposals_sent, closed_deals, pipeline_value)
VALUES
  ('Jan', 1, 2026, 34, 14, 8, 4, 195000),
  ('Feb', 2, 2026, 38, 16, 10, 5, 210000),
  ('Mar', 3, 2026, 31, 13, 7, 4, 188000),
  ('Apr', 4, 2026, 47, 20, 13, 7, 245000),
  ('May', 5, 2026, 42, 18, 11, 6, 230000),
  ('Jun', 6, 2026, 51, 22, 15, 8, 268000),
  ('Jul', 7, 2026, 44, 19, 12, 6, 240000),
  ('Aug', 8, 2026, 40, 17, 10, 5, 225000),
  ('Sep', 9, 2026, 58, 25, 17, 9, 295000),
  ('Oct', 10, 2026, 46, 19, 12, 7, 254200),
  ('Nov', 11, 2026, 43, 18, 12, 7, 284500),
  ('Dec', 12, 2026, 49, 21, 14, 8, 310000)
ON CONFLICT DO NOTHING;

-- 6. Insert Meetings
INSERT INTO public.crm_meetings (title, company, time_slot, meeting_date, status)
VALUES
  ('Product demo with Tim', 'Weblabs Studio', '09:00 - 09:45', '2026-11-16', 'Scheduled'),
  ('Security architecture review', 'Omnia Cloud', '11:00 - 11:45', '2026-11-16', 'Scheduled'),
  ('Final proposal terms alignment', 'Kestrel Aero', '14:00 - 14:30', '2026-11-16', 'Scheduled'),
  ('Quarterly partnership sync', 'Quantum Dynamics', '16:00 - 16:45', '2026-11-17', 'Scheduled'),
  ('Discovery & technical kickoff', 'Halcyon Robotics', '10:00 - 10:45', '2026-11-18', 'Scheduled')
ON CONFLICT DO NOTHING;

-- 7. Insert Opportunities
INSERT INTO public.crm_opportunities (opportunity_code, account, stage, priority, health, value, contact_person, expected_close_date)
VALUES
  ('OP-1842', 'Asteron Bioworks', 'Proposal Sent', 1, 'On Track', 42000, 'Sarah Jenkins', '2026-12-15'),
  ('OP-1841', 'BlueHaven Systems', 'Discovery', 1, 'On Hold', 18500, 'Michael Chen', '2026-12-20'),
  ('OP-1840', 'Cinder Health', 'Negotiation', 1, 'At Risk', 63000, 'Dr. Rebecca Alva', '2026-11-30'),
  ('OP-1839', 'Drift Manufacturing', 'Qualified', 2, 'At Risk', 26400, 'Tom Bradley', '2027-01-10'),
  ('OP-1838', 'Everline Freight', 'Proposal Sent', 1, 'Needs Review', 58900, 'Marcus Vance', '2026-12-05'),
  ('OP-1837', 'Fieldstone Capital', 'Discovery', 1, 'On Track', 31200, 'Elena Rostova', '2026-12-18'),
  ('OP-1836', 'Gilded Solar', 'Negotiation', 2, 'On Track', 19800, 'David Kim', '2026-12-01'),
  ('OP-1835', 'Halcyon Robotics', 'Proposal Sent', 1, 'On Track', 74500, 'Alicia Thorne', '2026-12-22'),
  ('OP-1834', 'Ironclad Security', 'Qualified', 3, 'Needs Review', 52000, 'Greg Miller', '2027-01-15'),
  ('OP-1833', 'Juniper Analytics', 'Discovery', 1, 'On Track', 37600, 'Hannah Patel', '2026-12-28'),
  ('OP-1832', 'Kestrel Aero', 'Negotiation', 1, 'On Track', 88000, 'Capt. Robert Price', '2026-12-10'),
  ('OP-1831', 'Luminary Media', 'Proposal Sent', 2, 'On Track', 22400, 'Chloe Bennett', '2026-12-14'),
  ('OP-1830', 'Meridian Logistics', 'Discovery', 1, 'Needs Review', 45000, 'Oliver Scott', '2027-01-05'),
  ('OP-1829', 'Nexus Biotech', 'Negotiation', 1, 'On Track', 68000, 'Dr. Sanjay Gupta', '2026-12-08'),
  ('OP-1828', 'Omnia Cloud', 'Proposal Sent', 1, 'On Track', 92500, 'Valerie Adams', '2026-12-19'),
  ('OP-1827', 'Pioneer Retail Group', 'Qualified', 2, 'On Hold', 34000, 'James Wright', '2027-01-20'),
  ('OP-1826', 'Quantum Dynamics', 'Negotiation', 1, 'On Track', 115000, 'Arthur Pendelton', '2026-12-31'),
  ('OP-1825', 'Redline Energy', 'Discovery', 2, 'At Risk', 54000, 'Fiona Gallagher', '2027-01-08'),
  ('OP-1824', 'Solace Health Systems', 'Proposal Sent', 1, 'On Track', 29500, 'Nathan Drake', '2026-12-12'),
  ('OP-1823', 'Terravault Systems', 'Qualified', 3, 'Needs Review', 48200, 'Simon Bauer', '2027-01-25'),
  ('OP-1822', 'Vantage AI Labs', 'Negotiation', 1, 'On Track', 71000, 'Lucas Meyer', '2026-12-23'),
  ('OP-1821', 'Waveform Digital', 'Discovery', 2, 'On Track', 39500, 'Maya Lin', '2027-01-12'),
  ('OP-1820', 'Zenith Financial', 'Proposal Sent', 1, 'On Track', 83000, 'Julian Sterling', '2026-12-17'),
  ('OP-1819', 'Apex Global Logistics', 'Qualified', 2, 'On Track', 62000, 'Brian Cooper', '2027-01-18'),
  ('OP-1818', 'Beacon Software', 'Discovery', 1, 'Needs Review', 27500, 'Lisa Ray', '2026-12-29'),
  ('OP-1817', 'Cipher Networks', 'Negotiation', 1, 'On Track', 49000, 'Kevin Zhang', '2026-12-09'),
  ('OP-1816', 'Dynamic Grid Power', 'Proposal Sent', 1, 'At Risk', 76000, 'Patrick Murphy', '2026-12-03'),
  ('OP-1815', 'Echo Mobile Services', 'Qualified', 3, 'On Hold', 18000, 'Grace Hopper', '2027-02-01'),
  ('OP-1814', 'Fusion Power Group', 'Negotiation', 1, 'On Track', 95000, 'Dr. Charles Xavier', '2026-12-21'),
  ('OP-1813', 'Horizon Transport', 'Discovery', 2, 'On Track', 53500, 'Danielle Brooks', '2027-01-14')
ON CONFLICT (opportunity_code) DO UPDATE SET
  stage = EXCLUDED.stage,
  health = EXCLUDED.health,
  value = EXCLUDED.value;
