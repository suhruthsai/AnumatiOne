import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

test('AnumatiOne Frontend & UI/UX Design System (Startup Telangana Model)', async (t) => {
  const landingPagePath = path.join(process.cwd(), 'src/app/page.tsx');
  const navHeaderPath = path.join(process.cwd(), 'src/components/navbar/NavigationHeader.tsx');
  const footerPath = path.join(process.cwd(), 'src/components/footer/StatePortalFooter.tsx');
  const layoutPath = path.join(process.cwd(), 'src/app/layout.tsx');
  const tailwindPath = path.join(process.cwd(), 'tailwind.config.ts');

  assert.ok(fs.existsSync(landingPagePath), 'src/app/page.tsx must exist');
  assert.ok(fs.existsSync(navHeaderPath), 'NavigationHeader.tsx must exist');
  assert.ok(fs.existsSync(footerPath), 'StatePortalFooter.tsx must exist');
  assert.ok(fs.existsSync(layoutPath), 'layout.tsx must exist');
  assert.ok(fs.existsSync(tailwindPath), 'tailwind.config.ts must exist');

  const landingContent = fs.readFileSync(landingPagePath, 'utf-8');
  const navContent = fs.readFileSync(navHeaderPath, 'utf-8');
  const footerContent = fs.readFileSync(footerPath, 'utf-8');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  const tailwindContent = fs.readFileSync(tailwindPath, 'utf-8');

  await t.test('1. Brand color tokens & layout footer integration', () => {
    assert.ok(tailwindContent.includes('#C33764'), 'Tailwind must configure brand crimson #C33764');
    assert.ok(tailwindContent.includes('#060D4A'), 'Tailwind must configure deep navy #060D4A');
    assert.ok(layoutContent.includes('StatePortalFooter'), 'layout.tsx must import and mount StatePortalFooter');
    assert.ok(footerContent.includes('1800-120-8040'), 'Footer must display citizen helpline 1800-120-8040');
    assert.ok(footerContent.includes('Maharashtra State Innovation Society'), 'Footer must state official MSIS authority');
  });

  await t.test('2. Top Citizen Accessibility Toolbar & Header Navigation', () => {
    assert.ok(navContent.includes('Toll-Free:'), 'Header must include toll-free helpline');
    assert.ok(navContent.includes('1800-120-8040'), 'Header must display 1800-120-8040');
    assert.ok(navContent.includes('Font:'), 'Header must provide font size controls');
    assert.ok(navContent.includes('A+'), 'Header must provide A+ font zoom');
    assert.ok(navContent.includes('#C33764'), 'Header must feature signature crimson accent');
    assert.ok(navContent.includes('/portal/clearances'), 'Header must link to Clearances Guide');
    assert.ok(navContent.includes('/portal/grievances'), 'Header must link to RTS Appeals');
  });

  await t.test('3. Signature Telangana-style Gradient Hero & Value Proposition', () => {
    assert.ok(landingContent.includes('#C33764'), 'Hero banner must feature gradient with #C33764');
    assert.ok(landingContent.includes('The Engine of India’s Growth'), 'Must display state headline');
    assert.ok(landingContent.includes('Single-Window Clearance'), 'Must highlight single-window clearance');
    assert.ok(landingContent.includes('28 Clearances'), 'Must state 28 unified clearances');
    assert.ok(landingContent.includes('48-Hour Green Channel'), 'Must highlight 48-Hour Green Channel');
    assert.ok(landingContent.includes('Explore Clearances Directory'), 'Must feature primary CTA button');
  });

  await t.test('4. Key Ecosystem Stat Counter Widgets', () => {
    assert.ok(landingContent.includes('11,839'), 'Must display registered units counter (11,839+)');
    assert.ok(landingContent.includes('5,000'), 'Must display clearances dispatched counter (5,000+)');
    assert.ok(landingContent.includes('5,981'), 'Must display women-led/MSMEs counter (5,981+)');
    assert.ok(landingContent.includes('74'), 'Must display MIDC industrial parks counter (74+)');
  });

  await t.test('5. "The Land of Opportunity" & 5 Strategic Pillars', () => {
    assert.ok(landingContent.includes('The Land of Opportunity'), 'Must feature "The Land of Opportunity" section');
    assert.ok(landingContent.includes('Physical Infrastructure'), 'Must feature Pillar 1: Physical Infrastructure');
    assert.ok(landingContent.includes('Regulatory Easing'), 'Must feature Pillar 2: Regulatory Easing');
    assert.ok(landingContent.includes('Human Capital & Safety'), 'Must feature Pillar 3: Human Capital & Safety');
    assert.ok(landingContent.includes('Grassroots Innovation'), 'Must feature Pillar 4: Grassroots Innovation');
    assert.ok(landingContent.includes('Fiscal Subsidies'), 'Must feature Pillar 5: Fiscal Subsidies');
  });

  await t.test('6. "Empowering Enterprises with..." 5 Circular Highlights', () => {
    assert.ok(landingContent.includes('Empowering Enterprises & Industries with'), 'Must feature Empowering section');
    assert.ok(landingContent.includes('28 Govt Clearances'), 'Must include 28 Govt Clearances badge');
    assert.ok(landingContent.includes('48h Green Channel'), 'Must include 48h Green Channel badge');
    assert.ok(landingContent.includes('MIDC Land & Estates'), 'Must include MIDC Land badge');
    assert.ok(landingContent.includes('PSI 2019 Subsidies'), 'Must include PSI Subsidies badge');
    assert.ok(landingContent.includes('2-Tier RTS Appeals'), 'Must include RTS Appeals badge');
  });

  await t.test('7. "We Host the Giants" Premier Industrial Belts', () => {
    assert.ok(landingContent.includes('We Host the Giants'), 'Must feature "We Host the Giants" section');
    assert.ok(landingContent.includes('Chakan & Talegaon'), 'Must feature Chakan Pune auto hub');
    assert.ok(landingContent.includes('AURIC Smart City'), 'Must feature AURIC Chhatrapati Sambhajinagar');
    assert.ok(landingContent.includes('MIHAN Cargo & SEZ'), 'Must feature MIHAN Nagpur SEZ');
    assert.ok(landingContent.includes('TTC & Turbhe'), 'Must feature Turbhe Navi Mumbai');
    assert.ok(landingContent.includes('Dindori Agro Park'), 'Must feature Dindori Nashik agro hub');
  });

  await t.test('8. "Happening Maharashtra" Live Orders, Circulars & Filterable Feed', () => {
    assert.ok(landingContent.includes('Happening Maharashtra'), 'Must feature Happening Maharashtra feed');
    assert.ok(landingContent.includes('Mandatory Online IoT Telemetry'), 'Must include MPCB OCEMS circular');
    assert.ok(landingContent.includes('Package Scheme of Incentives (PSI 2019)'), 'Must include PSI 2019 order');
    assert.ok(landingContent.includes('Joint Multi-Departmental Inspections'), 'Must include DISH joint inspection SOP');
  });
});
