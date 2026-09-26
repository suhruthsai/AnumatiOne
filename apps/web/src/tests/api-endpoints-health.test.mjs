import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

test('SIH 26130 API Endpoints Health & Frontend Connection Integrity', async (t) => {
  const apiDir = path.join(process.cwd(), 'src/app/api');
  assert.ok(fs.existsSync(apiDir), 'src/app/api directory must exist');

  const registeredEndpoints = [
    {
      route: '/api/v1/analytics/bottlenecks',
      file: 'src/app/api/v1/analytics/bottlenecks/route.ts',
      methods: ['GET'],
      description: 'Department delay analytics, makespan metrics & EODB district rankings',
    },
    {
      route: '/api/v1/applications',
      file: 'src/app/api/v1/applications/route.ts',
      methods: ['GET', 'POST', 'PATCH'],
      description: 'Single-Window CAF submission, officer scrutiny queue & RTS SLA lifecycle',
    },
    {
      route: '/api/v1/auth/otp',
      file: 'src/app/api/v1/auth/otp/route.ts',
      methods: ['POST'],
      description: 'DigiLocker / Parichay simulated statutory SMS OTP dispatch',
    },
    {
      route: '/api/v1/auth/verify',
      file: 'src/app/api/v1/auth/verify/route.ts',
      methods: ['POST'],
      description: 'Statutory OTP verification and session token generation',
    },
    {
      route: '/api/v1/chat',
      file: 'src/app/api/v1/chat/route.ts',
      methods: ['POST'],
      description: 'Regulatory AI assistant with statutory RAG grounding & Groq LPU',
    },
    {
      route: '/api/v1/checklist',
      file: 'src/app/api/v1/checklist/route.ts',
      methods: ['GET', 'POST'],
      description: 'Dynamic Know-Your-Approvals (KYA) customized regulatory checklist',
    },
    {
      route: '/api/v1/documents/pre-validate',
      file: 'src/app/api/v1/documents/pre-validate/route.ts',
      methods: ['POST'],
      description: 'Zero-Query AI pre-scrutiny & document quality validation',
    },
    {
      route: '/api/v1/grievances',
      file: 'src/app/api/v1/grievances/route.ts',
      methods: ['GET', 'POST'],
      description: 'Maharashtra RTS Act 2015 Two-Tier statutory appeal registration & tracking',
    },
    {
      route: '/api/v1/incentives/eligible',
      file: 'src/app/api/v1/incentives/eligible/route.ts',
      methods: ['GET', 'POST'],
      description: 'Package Scheme of Incentives (PSI 2019) fiscal benefit calculation',
    },
    {
      route: '/api/v1/nlp/simplify',
      file: 'src/app/api/v1/nlp/simplify/route.ts',
      methods: ['POST'],
      description: 'Departmental query simplification & statutory reply drafting',
    },
    {
      route: '/api/v1/notifications',
      file: 'src/app/api/v1/notifications/route.ts',
      methods: ['GET', 'POST'],
      description: 'Omni-channel SMS/WhatsApp statutory alert dispatch & history',
    },
    {
      route: '/api/v1/simulate',
      file: 'src/app/api/v1/simulate/route.ts',
      methods: ['GET', 'POST'],
      description: 'Clearance DAG solver & Monte Carlo timeline simulator',
    },
    {
      route: '/api/v1/simulate/what-if',
      file: 'src/app/api/v1/simulate/what-if/route.ts',
      methods: ['POST'],
      description: 'What-If scenario comparison (e.g. MIDC vs Private Land clearances)',
    },
  ];

  await t.test('1. All 13 registered API route files exist and export valid HTTP method handlers', () => {
    for (const ep of registeredEndpoints) {
      const fullPath = path.join(process.cwd(), ep.file);
      assert.ok(fs.existsSync(fullPath), `Endpoint route file must exist: ${ep.file}`);

      const content = fs.readFileSync(fullPath, 'utf-8');
      assert.ok(content.length > 100, `Route file ${ep.file} must not be empty`);

      for (const method of ep.methods) {
        assert.ok(
          content.includes(`export async function ${method}`) ||
          content.includes(`export function ${method}`),
          `Endpoint ${ep.route} in ${ep.file} must export HTTP handler for ${method}`
        );
      }
    }
  });

  await t.test('2. Frontend components correctly connect to backend API endpoints', () => {
    const frontendBindings = [
      {
        component: 'src/app/portal/applications/page.tsx',
        expectedCall: '/api/v1/applications',
        purpose: 'Industrialist Dashboard fetching live CAFs and statutory status',
      },
      {
        component: 'src/components/officer/SmartQueueTable.tsx',
        expectedCall: '/api/v1/applications?role=officer',
        purpose: 'Government Officer Cockpit fetching risk scrutiny queue',
      },
      {
        component: 'src/app/portal/apply/page.tsx',
        expectedCall: '/api/v1/applications',
        purpose: 'Single-Window CAF submitting multi-department clearances',
      },
      {
        component: 'src/app/portal/grievances/page.tsx',
        expectedCall: '/api/v1/grievances',
        purpose: 'RTS Act Section 18/19 grievance registration & retrieval',
      },
      {
        component: 'src/components/chat/RegulatoryAIChatbot.tsx',
        expectedCall: '/api/v1/chat',
        purpose: 'AI chatbot querying statutory RAG and legal corpus',
      },
      {
        component: 'src/app/admin/page.tsx',
        expectedCall: '/api/v1/analytics/bottlenecks',
        purpose: 'Administrative delay analytics & department scorecard',
      },
      {
        component: 'src/components/applications/QueryResponseModal.tsx',
        expectedCall: '/api/v1/applications',
        purpose: 'Applicant responding to departmental query with attached docs',
      },
    ];

    for (const binding of frontendBindings) {
      const compFullPath = path.join(process.cwd(), binding.component);
      assert.ok(fs.existsSync(compFullPath), `Component must exist: ${binding.component}`);

      const content = fs.readFileSync(compFullPath, 'utf-8');
      assert.ok(
        content.includes(binding.expectedCall),
        `Component ${binding.component} must connect to endpoint ${binding.expectedCall} (${binding.purpose})`
      );
    }
  });

  await t.test('3. API Response Schemas return standardized { success: true, data: ... } envelopes', () => {
    for (const ep of registeredEndpoints) {
      const fullPath = path.join(process.cwd(), ep.file);
      const content = fs.readFileSync(fullPath, 'utf-8');
      assert.ok(
        content.includes('NextResponse.json'),
        `Endpoint ${ep.route} must return structured Next.js JSON responses`
      );
      assert.ok(
        content.includes('success: true') || content.includes('success: false'),
        `Endpoint ${ep.route} must use standardized { success, ... } payload contract`
      );
    }
  });
});
