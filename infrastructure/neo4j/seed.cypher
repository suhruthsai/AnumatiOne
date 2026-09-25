// ==========================================
// ApprovalOS Regulatory Knowledge Graph Seed
// ==========================================

// Clean existing data for clean setup
MATCH (n) DETACH DELETE n;

// Constraints
CREATE CONSTRAINT approval_id IF NOT EXISTS FOR (a:ApprovalType) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT sector_code IF NOT EXISTS FOR (s:Sector) REQUIRE s.code IS UNIQUE;
CREATE CONSTRAINT doc_type_id IF NOT EXISTS FOR (d:DocumentType) REQUIRE d.id IS UNIQUE;
CREATE CONSTRAINT state_code IF NOT EXISTS FOR (st:State) REQUIRE st.code IS UNIQUE;

// 1. Create Sectors
CREATE (s1:Sector {code: 'PHARMA', name: 'Pharmaceuticals & Bulk Drugs', pollutionDefault: 'RED', baseRisk: 'HIGH'})
CREATE (s2:Sector {code: 'EV_MANUFACTURING', name: 'Electric Vehicles & Battery Packs', pollutionDefault: 'ORANGE', baseRisk: 'MEDIUM'})
CREATE (s3:Sector {code: 'TEXTILES', name: 'Textiles & Dyeing', pollutionDefault: 'RED', baseRisk: 'HIGH'})
CREATE (s4:Sector {code: 'CHEMICALS', name: 'Specialty Chemicals & Petrochemicals', pollutionDefault: 'RED', baseRisk: 'CRITICAL'})
CREATE (s5:Sector {code: 'FOOD_PROCESSING', name: 'Agro & Food Processing', pollutionDefault: 'GREEN', baseRisk: 'LOW'})
CREATE (s6:Sector {code: 'RENEWABLE_ENERGY', name: 'Solar & Wind Components', pollutionDefault: 'WHITE', baseRisk: 'LOW'})
CREATE (s7:Sector {code: 'ELECTRONICS', name: 'Semiconductors & Electronics Assembly', pollutionDefault: 'ORANGE', baseRisk: 'MEDIUM'});

// 2. Create State (Maharashtra Exclusive)
CREATE (st1:State {code: 'MAHARASHTRA', name: 'Maharashtra', eodbRank: 1, singleWindowPortal: 'MAITRI Maharashtra', avgClearanceDays: 42});

// 3. Create Document Types
CREATE (d1:DocumentType {id: 'PAN_CARD', name: 'Company / Promoter PAN Card', validityDays: 0, ocrSupported: true})
CREATE (d2:DocumentType {id: 'AADHAAR_CARD', name: 'Authorized Signatory Aadhaar', validityDays: 0, ocrSupported: true})
CREATE (d3:DocumentType {id: 'GSTIN_CERTIFICATE', name: 'GST Registration Certificate', validityDays: 0, ocrSupported: true})
CREATE (d4:DocumentType {id: 'LAND_SALE_DEED', name: 'Land Title Deed / Lease Agreement', validityDays: 0, ocrSupported: true})
CREATE (d5:DocumentType {id: 'FACTORY_LAYOUT_PLAN', name: 'Architectural Factory Layout Plan', validityDays: 365, ocrSupported: false})
CREATE (d6:DocumentType {id: 'PROJECT_FEASIBILITY_REPORT', name: 'Detailed Project Report (DPR)', validityDays: 365, ocrSupported: false})
CREATE (d7:DocumentType {id: 'POLLUTION_UNDERTAKING', name: 'Environmental Undertaking & Effluent Plan', validityDays: 365, ocrSupported: true})
CREATE (d8:DocumentType {id: 'FIRE_SAFETY_SCHEMATIC', name: 'Fire Hydrant & Evacuation Drawing', validityDays: 365, ocrSupported: false})
CREATE (d9:DocumentType {id: 'WATER_BALANCE_CHART', name: 'Water Sourcing & Recycling Flowchart', validityDays: 365, ocrSupported: false})
CREATE (d10:DocumentType {id: 'POWER_LOAD_CALCULATION', name: 'Connected Electrical Load SLD', validityDays: 365, ocrSupported: false});

// 4. Create Approval Types
CREATE (a1:ApprovalType {
  id: 'LAND_ALLOTMENT',
  code: 'LND-01',
  name: 'Industrial Land Allotment / Conversion',
  department: 'State Industrial Development Corporation',
  category: 'LAND_BUILDING',
  baseDays: 21,
  varianceDays: 7,
  statutoryFee: 25000,
  riskLevel: 'MEDIUM',
  canAutoApprove: false,
  inspectionRequired: true,
  issuingAuthority: 'SIDC / Revenue Dept',
  validityYears: 99
})

CREATE (a2:ApprovalType {
  id: 'EIA_EC',
  code: 'ENV-01',
  name: 'Environmental Clearance (EIA/EC)',
  department: 'MoEFCC / SEIAA',
  category: 'ENVIRONMENTAL',
  baseDays: 75,
  varianceDays: 25,
  statutoryFee: 150000,
  riskLevel: 'CRITICAL',
  canAutoApprove: false,
  inspectionRequired: true,
  issuingAuthority: 'State Environment Impact Assessment Authority',
  validityYears: 7
})

CREATE (a3:ApprovalType {
  id: 'CTE_POLLUTION',
  code: 'ENV-02',
  name: 'Consent to Establish (CTE)',
  department: 'State Pollution Control Board (SPCB)',
  category: 'ENVIRONMENTAL',
  baseDays: 30,
  varianceDays: 10,
  statutoryFee: 45000,
  riskLevel: 'HIGH',
  canAutoApprove: true,
  inspectionRequired: true,
  issuingAuthority: 'Member Secretary, SPCB',
  validityYears: 5
})

CREATE (a4:ApprovalType {
  id: 'BUILDING_PLAN',
  code: 'BLD-01',
  name: 'Factory Building Plan Approval',
  department: 'Urban Development / Municipal / Industrial Authority',
  category: 'LAND_BUILDING',
  baseDays: 20,
  varianceDays: 6,
  statutoryFee: 35000,
  riskLevel: 'MEDIUM',
  canAutoApprove: true,
  inspectionRequired: false,
  issuingAuthority: 'Chief Town Planner',
  validityYears: 3
})

CREATE (a5:ApprovalType {
  id: 'FIRE_NOC',
  code: 'SAF-01',
  name: 'Fire Safety Provisional NOC',
  department: 'State Fire and Emergency Services',
  category: 'SAFETY_LABOUR',
  baseDays: 18,
  varianceDays: 5,
  statutoryFee: 15000,
  riskLevel: 'HIGH',
  canAutoApprove: false,
  inspectionRequired: true,
  issuingAuthority: 'Director General Fire Services',
  validityYears: 1
})

CREATE (a6:ApprovalType {
  id: 'POWER_SANCTION',
  code: 'UTL-01',
  name: 'HT Power Feasibility & Sanction',
  department: 'State Electricity Distribution Co. (DISCOM)',
  category: 'UTILITIES',
  baseDays: 25,
  varianceDays: 8,
  statutoryFee: 50000,
  riskLevel: 'MEDIUM',
  canAutoApprove: true,
  inspectionRequired: true,
  issuingAuthority: 'Chief Engineer DISCOM',
  validityYears: 99
})

CREATE (a7:ApprovalType {
  id: 'WATER_SANCTION',
  code: 'UTL-02',
  name: 'Industrial Water Allocation / Sourcing NOC',
  department: 'Water Resources / Ground Water Authority (CGWA)',
  category: 'UTILITIES',
  baseDays: 22,
  varianceDays: 6,
  statutoryFee: 20000,
  riskLevel: 'MEDIUM',
  canAutoApprove: true,
  inspectionRequired: false,
  issuingAuthority: 'Regional Water Officer',
  validityYears: 5
})

CREATE (a8:ApprovalType {
  id: 'FACTORY_LICENSE',
  code: 'LAB-01',
  name: 'Factory License under Factories Act 1948',
  department: 'Directorate of Industrial Safety & Health (DISH)',
  category: 'SAFETY_LABOUR',
  baseDays: 28,
  varianceDays: 8,
  statutoryFee: 30000,
  riskLevel: 'MEDIUM',
  canAutoApprove: true,
  inspectionRequired: true,
  issuingAuthority: 'Chief Inspector of Factories',
  validityYears: 5
})

CREATE (a9:ApprovalType {
  id: 'CTO_POLLUTION',
  code: 'ENV-03',
  name: 'Consent to Operate (CTO)',
  department: 'State Pollution Control Board (SPCB)',
  category: 'ENVIRONMENTAL',
  baseDays: 30,
  varianceDays: 9,
  statutoryFee: 55000,
  riskLevel: 'HIGH',
  canAutoApprove: false,
  inspectionRequired: true,
  issuingAuthority: 'SPCB Regional Office',
  validityYears: 5
})

CREATE (a10:ApprovalType {
  id: 'BOILER_REGISTRATION',
  code: 'SAF-02',
  name: 'Industrial Boiler Registration & Steaming Certificate',
  department: 'Directorate of Boilers',
  category: 'SAFETY_LABOUR',
  baseDays: 15,
  varianceDays: 4,
  statutoryFee: 18000,
  riskLevel: 'HIGH',
  canAutoApprove: false,
  inspectionRequired: true,
  issuingAuthority: 'Chief Inspector of Boilers',
  validityYears: 1
})

CREATE (a11:ApprovalType {
  id: 'PESO_EXPLOSIVES',
  code: 'SEC-01',
  name: 'PESO Hazardous Storage & Pipeline License',
  department: 'Petroleum and Explosives Safety Organization (PESO)',
  category: 'SECTOR_SPECIFIC',
  baseDays: 40,
  varianceDays: 12,
  statutoryFee: 60000,
  riskLevel: 'CRITICAL',
  canAutoApprove: false,
  inspectionRequired: true,
  issuingAuthority: 'Joint Chief Controller of Explosives',
  validityYears: 3
});

// 5. Build Dependency Graph (DEPENDS_ON relationships)
// Approval A depends on B means B must be completed before A can start
CREATE (a3)-[:DEPENDS_ON]->(a1)  // CTE depends on Land Allotment
CREATE (a4)-[:DEPENDS_ON]->(a1)  // Building Plan depends on Land Allotment
CREATE (a5)-[:DEPENDS_ON]->(a4)  // Fire NOC depends on Building Plan
CREATE (a6)-[:DEPENDS_ON]->(a1)  // Power Sanction depends on Land Allotment
CREATE (a7)-[:DEPENDS_ON]->(a1)  // Water Sanction depends on Land Allotment
CREATE (a8)-[:DEPENDS_ON]->(a4)  // Factory License depends on Building Plan
CREATE (a8)-[:DEPENDS_ON]->(a5)  // Factory License depends on Fire NOC
CREATE (a9)-[:DEPENDS_ON]->(a3)  // CTO depends on CTE
CREATE (a9)-[:DEPENDS_ON]->(a8)  // CTO depends on Factory License
CREATE (a10)-[:DEPENDS_ON]->(a4) // Boiler Reg depends on Building Plan
CREATE (a11)-[:DEPENDS_ON]->(a4) // PESO depends on Building Plan
CREATE (a11)-[:DEPENDS_ON]->(a5); // PESO depends on Fire NOC

// Critical Path for RED sectors with Environmental Clearance:
CREATE (a3)-[:DEPENDS_ON]->(a2); // In Red category, CTE requires EIA/EC

// 6. Connect Approvals to Document Requirements (NEEDS_DOCUMENT)
CREATE (a1)-[:NEEDS_DOCUMENT]->(d1)
CREATE (a1)-[:NEEDS_DOCUMENT]->(d2)
CREATE (a1)-[:NEEDS_DOCUMENT]->(d3)
CREATE (a1)-[:NEEDS_DOCUMENT]->(d6)

CREATE (a2)-[:NEEDS_DOCUMENT]->(d4)
CREATE (a2)-[:NEEDS_DOCUMENT]->(d6)
CREATE (a2)-[:NEEDS_DOCUMENT]->(d7)
CREATE (a2)-[:NEEDS_DOCUMENT]->(d9)

CREATE (a3)-[:NEEDS_DOCUMENT]->(d4)
CREATE (a3)-[:NEEDS_DOCUMENT]->(d5)
CREATE (a3)-[:NEEDS_DOCUMENT]->(d7)
CREATE (a3)-[:NEEDS_DOCUMENT]->(d9)

CREATE (a4)-[:NEEDS_DOCUMENT]->(d4)
CREATE (a4)-[:NEEDS_DOCUMENT]->(d5)

CREATE (a5)-[:NEEDS_DOCUMENT]->(d5)
CREATE (a5)-[:NEEDS_DOCUMENT]->(d8)

CREATE (a6)-[:NEEDS_DOCUMENT]->(d4)
CREATE (a6)-[:NEEDS_DOCUMENT]->(d10)

CREATE (a7)-[:NEEDS_DOCUMENT]->(d4)
CREATE (a7)-[:NEEDS_DOCUMENT]->(d9)

CREATE (a8)-[:NEEDS_DOCUMENT]->(d4)
CREATE (a8)-[:NEEDS_DOCUMENT]->(d5)
CREATE (a8)-[:NEEDS_DOCUMENT]->(d8)

CREATE (a9)-[:NEEDS_DOCUMENT]->(d7)

CREATE (a10)-[:NEEDS_DOCUMENT]->(d5)

CREATE (a11)-[:NEEDS_DOCUMENT]->(d5)
CREATE (a11)-[:NEEDS_DOCUMENT]->(d8);

// 7. Connect Sectors to Approvals
// Pharma requires all core plus EIA/EC, Boiler, PESO
MATCH (s:Sector {code: 'PHARMA'}), (a:ApprovalType)
WHERE a.id IN ['LAND_ALLOTMENT', 'EIA_EC', 'CTE_POLLUTION', 'BUILDING_PLAN', 'FIRE_NOC', 'POWER_SANCTION', 'WATER_SANCTION', 'FACTORY_LICENSE', 'CTO_POLLUTION', 'BOILER_REGISTRATION', 'PESO_EXPLOSIVES']
CREATE (s)-[:REQUIRES]->(a);

// Chemicals requires all core plus EIA/EC, PESO
MATCH (s:Sector {code: 'CHEMICALS'}), (a:ApprovalType)
WHERE a.id IN ['LAND_ALLOTMENT', 'EIA_EC', 'CTE_POLLUTION', 'BUILDING_PLAN', 'FIRE_NOC', 'POWER_SANCTION', 'WATER_SANCTION', 'FACTORY_LICENSE', 'CTO_POLLUTION', 'PESO_EXPLOSIVES']
CREATE (s)-[:REQUIRES]->(a);

// EV Manufacturing requires core (no EIA/EC normally, no PESO unless battery raw chem)
MATCH (s:Sector {code: 'EV_MANUFACTURING'}), (a:ApprovalType)
WHERE a.id IN ['LAND_ALLOTMENT', 'CTE_POLLUTION', 'BUILDING_PLAN', 'FIRE_NOC', 'POWER_SANCTION', 'WATER_SANCTION', 'FACTORY_LICENSE', 'CTO_POLLUTION']
CREATE (s)-[:REQUIRES]->(a);

// Textiles requires core + Boiler
MATCH (s:Sector {code: 'TEXTILES'}), (a:ApprovalType)
WHERE a.id IN ['LAND_ALLOTMENT', 'CTE_POLLUTION', 'BUILDING_PLAN', 'FIRE_NOC', 'POWER_SANCTION', 'WATER_SANCTION', 'FACTORY_LICENSE', 'CTO_POLLUTION', 'BOILER_REGISTRATION']
CREATE (s)-[:REQUIRES]->(a);

// Food Processing requires core
MATCH (s:Sector {code: 'FOOD_PROCESSING'}), (a:ApprovalType)
WHERE a.id IN ['LAND_ALLOTMENT', 'CTE_POLLUTION', 'BUILDING_PLAN', 'FIRE_NOC', 'POWER_SANCTION', 'WATER_SANCTION', 'FACTORY_LICENSE', 'CTO_POLLUTION', 'BOILER_REGISTRATION']
CREATE (s)-[:REQUIRES]->(a);

// Renewable Energy & Electronics assembly (Clean/Green)
MATCH (s:Sector {code: 'RENEWABLE_ENERGY'}), (a:ApprovalType)
WHERE a.id IN ['LAND_ALLOTMENT', 'BUILDING_PLAN', 'FIRE_NOC', 'POWER_SANCTION', 'FACTORY_LICENSE']
CREATE (s)-[:REQUIRES]->(a);

MATCH (s:Sector {code: 'ELECTRONICS'}), (a:ApprovalType)
WHERE a.id IN ['LAND_ALLOTMENT', 'CTE_POLLUTION', 'BUILDING_PLAN', 'FIRE_NOC', 'POWER_SANCTION', 'WATER_SANCTION', 'FACTORY_LICENSE', 'CTO_POLLUTION']
CREATE (s)-[:REQUIRES]->(a);

// 8. State-specific Exemption & Acceleration Rules
// Gujarat exempts building plan re-scrutiny in GIDC industrial parks:
CREATE (r1:RegulatoryRule {code: 'GUJ_GIDC_EXEMPTION', title: 'GIDC Pre-Approved Industrial Zone Fast Track', daysReduced: 12})
MATCH (st:State {code: 'GUJARAT'}), (a:ApprovalType {id: 'BUILDING_PLAN'}), (r:RegulatoryRule {code: 'GUJ_GIDC_EXEMPTION'})
CREATE (st)-[:HAS_RULE]->(r)
CREATE (r)-[:ACCELERATES]->(a);

// Telangana TS-iPASS deemed approval guarantee after 15 days:
CREATE (r2:RegulatoryRule {code: 'TS_IPASS_DEEMED_APPROVAL', title: 'TS-iPASS Deemed Approval Guarantee', daysReduced: 14})
MATCH (st:State {code: 'TELANGANA'}), (a:ApprovalType {id: 'POWER_SANCTION'}), (r:RegulatoryRule {code: 'TS_IPASS_DEEMED_APPROVAL'})
CREATE (st)-[:HAS_RULE]->(r)
CREATE (r)-[:ACCELERATES]->(a);
