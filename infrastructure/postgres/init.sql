-- =========================================================
-- ApprovalOS PostgreSQL Core Schema Initialization
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Organizations
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('CITIZEN_ENTREPRENEUR', 'DEPARTMENT_OFFICER', 'HOD', 'DISTRICT_COLLECTOR', 'ADMIN')),
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Business Profiles
CREATE TABLE IF NOT EXISTS business_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    cin_or_llpin VARCHAR(50),
    pan_number VARCHAR(10),
    gstin VARCHAR(15),
    sector VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    district VARCHAR(100) NOT NULL,
    land_type VARCHAR(50) NOT NULL,
    land_area_acres NUMERIC(10, 2) NOT NULL,
    built_up_area_sqm NUMERIC(12, 2) NOT NULL,
    investment_inr_cr NUMERIC(12, 2) NOT NULL,
    power_required_kva NUMERIC(10, 2) NOT NULL,
    water_required_kld NUMERIC(10, 2) NOT NULL,
    expected_employees INTEGER NOT NULL,
    pollution_category VARCHAR(20) NOT NULL,
    is_msme BOOLEAN DEFAULT FALSE,
    hazardous_chemicals BOOLEAN DEFAULT FALSE,
    boiler_installed BOOLEAN DEFAULT FALSE,
    effluent_discharge BOOLEAN DEFAULT FALSE,
    trust_score NUMERIC(5, 2) DEFAULT 75.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Applications
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_number VARCHAR(64) UNIQUE NOT NULL,
    profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
    approval_node_id VARCHAR(50) NOT NULL,
    approval_name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    sla_days INTEGER NOT NULL,
    submission_date TIMESTAMP WITH TIME ZONE,
    sla_deadline TIMESTAMP WITH TIME ZONE,
    assigned_officer_id UUID REFERENCES users(id),
    risk_score NUMERIC(5, 2) DEFAULT 35.0,
    is_green_channel BOOLEAN DEFAULT FALSE,
    is_escalated BOOLEAN DEFAULT FALSE,
    escalation_level VARCHAR(30) DEFAULT 'NONE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Document Records
CREATE TABLE IF NOT EXISTS document_vault (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES business_profiles(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    storage_path TEXT NOT NULL,
    ocr_extracted_data JSONB,
    pre_validation_status VARCHAR(20) DEFAULT 'VALID',
    pre_validation_score NUMERIC(5, 2),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Inspections
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    mode VARCHAR(30) DEFAULT 'PHYSICAL' CHECK (mode IN ('PHYSICAL', 'REMOTE_VIDEO')),
    is_joint_inspection BOOLEAN DEFAULT TRUE,
    departments_involved TEXT[],
    assigned_officers TEXT[],
    status VARCHAR(30) DEFAULT 'SCHEDULED' CHECK (status IN ('SCHEDULED', 'COMPLETED', 'WAIVED', 'CANCELLED')),
    geo_latitude NUMERIC(10, 6),
    geo_longitude NUMERIC(10, 6),
    inspection_report_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SLA Tracking & Escalation Records
CREATE TABLE IF NOT EXISTS sla_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    sla_start TIMESTAMP WITH TIME ZONE NOT NULL,
    sla_end TIMESTAMP WITH TIME ZONE NOT NULL,
    time_spent_hours NUMERIC(10, 2) DEFAULT 0,
    breach_warning_sent BOOLEAN DEFAULT FALSE,
    breached BOOLEAN DEFAULT FALSE,
    escalation_history JSONB DEFAULT '[]'::jsonb
);

-- 7. Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    actor_id UUID REFERENCES users(id),
    payload JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Admin & Officer Users
INSERT INTO users (id, email, phone, full_name, role, department)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'entrepreneur@approvalos.gov.in', '+919876543210', 'Aakash Singhania', 'CITIZEN_ENTREPRENEUR', NULL),
  ('22222222-2222-2222-2222-222222222222', 'officer.spcb@approvalos.gov.in', '+919876543211', 'Dr. Ramesh Sharma', 'DEPARTMENT_OFFICER', 'State Pollution Control Board'),
  ('33333333-3333-3333-3333-333333333333', 'collector@approvalos.gov.in', '+919876543212', 'Pooja Iyer, IAS', 'DISTRICT_COLLECTOR', 'District Administration')
ON CONFLICT (email) DO NOTHING;
