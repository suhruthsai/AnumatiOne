import test from 'node:test';
import assert from 'node:assert';

function sampleLognormalTime(baseDays, varianceDays) {
  if (baseDays <= 0) return 0;
  const cv = Math.min(1.2, Math.max(0.15, varianceDays / baseDays));
  const sigma = Math.sqrt(Math.log(1 + cv * cv));
  const mu = Math.log(baseDays) - (sigma * sigma) / 2;

  // Box-Muller
  let u1 = 0, u2 = 0;
  while (u1 === 0) u1 = Math.random();
  while (u2 === 0) u2 = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  const sampled = Math.exp(mu + sigma * z);
  return Math.max(Math.round(baseDays * 0.25), Math.min(Math.round(baseDays * 4.5), Math.round(sampled)));
}

test('Monte Carlo Log-Normal duration distribution is non-negative and right-skewed', () => {
  const baseDays = 30;
  const varianceDays = 10;
  const samples = [];

  for (let i = 0; i < 2000; i++) {
    const s = sampleLognormalTime(baseDays, varianceDays);
    samples.push(s);
    assert.ok(s > 0, 'Approval duration must be strictly positive');
  }

  samples.sort((a, b) => a - b);
  const median = samples[Math.floor(samples.length * 0.5)];
  const p95 = samples[Math.floor(samples.length * 0.95)];

  // Median should be close to baseDays (~30)
  assert.ok(median >= 22 && median <= 38, `Median ${median} should be near baseDays (30)`);
  // 95th percentile should be higher due to regulatory right-tail skew
  assert.ok(p95 > median, `p95 (${p95}) must be strictly greater than median (${median})`);
});

test('Minimax strategy minimizes the worst-case makespan', () => {
  const strategies = [
    { id: 'GREEDY_PARALLEL', p50: 70, worstCase: 110, resilience: 68 },
    { id: 'CRITICAL_PATH_FIRST', p50: 74, worstCase: 95, resilience: 88 },
    { id: 'RISK_HEDGING_CONCURRENT', p50: 75, worstCase: 92, resilience: 94 },
    { id: 'SLACK_MAXIMIZING', p50: 82, worstCase: 99, resilience: 82 },
  ];

  // Minimax selects min(worstCase)
  const minimax = strategies.reduce((best, curr) => curr.worstCase < best.worstCase ? curr : best, strategies[0]);

  assert.strictEqual(minimax.id, 'RISK_HEDGING_CONCURRENT');
  assert.strictEqual(minimax.worstCase, 92);
  assert.strictEqual(minimax.resilience, 94);
});
