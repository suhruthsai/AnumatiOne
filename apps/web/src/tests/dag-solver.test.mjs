import test from 'node:test';
import assert from 'node:assert';

// Test node data
const mockApprovals = [
  {
    id: 'LAND_ALLOTMENT',
    code: 'LND-01',
    name: 'Land Allotment',
    department: 'SIDC',
    category: 'LAND_BUILDING',
    baseDays: 20,
    varianceDays: 5,
    statutoryFee: 25000,
    prerequisites: [],
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
  },
  {
    id: 'CTE_POLLUTION',
    code: 'ENV-02',
    name: 'Consent to Establish',
    department: 'SPCB',
    category: 'ENVIRONMENTAL',
    baseDays: 30,
    varianceDays: 8,
    statutoryFee: 45000,
    prerequisites: ['LAND_ALLOTMENT'],
    riskLevel: 'HIGH',
    canAutoApprove: true,
  },
  {
    id: 'BUILDING_PLAN',
    code: 'BLD-01',
    name: 'Building Plan Approval',
    department: 'Town Planning',
    category: 'LAND_BUILDING',
    baseDays: 20,
    varianceDays: 5,
    statutoryFee: 35000,
    prerequisites: ['LAND_ALLOTMENT'],
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
  },
  {
    id: 'FACTORY_LICENSE',
    code: 'LAB-01',
    name: 'Factory License',
    department: 'DISH',
    category: 'SAFETY_LABOUR',
    baseDays: 25,
    varianceDays: 6,
    statutoryFee: 30000,
    prerequisites: ['BUILDING_PLAN'],
    riskLevel: 'MEDIUM',
    canAutoApprove: true,
  },
  {
    id: 'CTO_POLLUTION',
    code: 'ENV-03',
    name: 'Consent to Operate',
    department: 'SPCB',
    category: 'ENVIRONMENTAL',
    baseDays: 25,
    varianceDays: 7,
    statutoryFee: 55000,
    prerequisites: ['CTE_POLLUTION', 'FACTORY_LICENSE'],
    riskLevel: 'HIGH',
    canAutoApprove: false,
  },
];

// Inline pure implementation of Kahn's & CPM for test verification
function testSolveDAG(approvals) {
  const nodeMap = new Map(approvals.map(a => [a.id, a]));
  const inDegree = new Map();
  const adj = new Map();

  for (const n of approvals) {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  }

  for (const n of approvals) {
    const prereqs = (n.prerequisites || []).filter(p => nodeMap.has(p));
    inDegree.set(n.id, prereqs.length);
    for (const p of prereqs) {
      adj.get(p).push(n.id);
    }
  }

  let queue = approvals.filter(n => inDegree.get(n.id) === 0).map(n => n.id);
  const lanes = [];
  const topo = [];
  const tempDeg = new Map(inDegree);

  while (queue.length > 0) {
    lanes.push(queue.map(id => nodeMap.get(id)));
    for (const id of queue) topo.push(id);

    const next = [];
    for (const u of queue) {
      for (const v of adj.get(u) || []) {
        const deg = tempDeg.get(v) - 1;
        tempDeg.set(v, deg);
        if (deg === 0) next.push(v);
      }
    }
    queue = next;
  }

  return { lanes, topo, hasCycle: topo.length !== approvals.length };
}

test('DAG Solver correctly groups approvals into parallel execution lanes', () => {
  const result = testSolveDAG(mockApprovals);

  assert.strictEqual(result.hasCycle, false, 'Graph must be acyclic');
  assert.strictEqual(result.lanes.length, 4, 'Must have 4 sequential stages');

  // Stage 0: LAND_ALLOTMENT (no prereqs)
  assert.strictEqual(result.lanes[0].length, 1);
  assert.strictEqual(result.lanes[0][0].id, 'LAND_ALLOTMENT');

  // Stage 1: CTE_POLLUTION & BUILDING_PLAN (both depend on LAND_ALLOTMENT)
  assert.strictEqual(result.lanes[1].length, 2);
  const stage1Ids = result.lanes[1].map(n => n.id).sort();
  assert.deepStrictEqual(stage1Ids, ['BUILDING_PLAN', 'CTE_POLLUTION']);

  // Stage 2: FACTORY_LICENSE (depends on BUILDING_PLAN)
  assert.strictEqual(result.lanes[2].length, 1);
  assert.strictEqual(result.lanes[2][0].id, 'FACTORY_LICENSE');

  // Stage 3: CTO_POLLUTION (depends on CTE & FACTORY_LICENSE)
  assert.strictEqual(result.lanes[3].length, 1);
  assert.strictEqual(result.lanes[3][0].id, 'CTO_POLLUTION');
});
