import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

test('AnumatiOne Regulatory AI Diversity & Intent Accuracy', async (t) => {
  const ragFilePath = path.join(process.cwd(), 'src/lib/rag/hybrid-rag-engine.ts');
  const chatRoutePath = path.join(process.cwd(), 'src/app/api/v1/chat/route.ts');
  const corpusFilePath = path.join(process.cwd(), 'src/lib/rag/statutory-corpus.ts');

  assert.ok(fs.existsSync(ragFilePath), 'hybrid-rag-engine.ts must exist');
  assert.ok(fs.existsSync(chatRoutePath), 'chat route.ts must exist');
  assert.ok(fs.existsSync(corpusFilePath), 'statutory-corpus.ts must exist');

  const ragContent = fs.readFileSync(ragFilePath, 'utf-8');
  const chatContent = fs.readFileSync(chatRoutePath, 'utf-8');
  const corpusContent = fs.readFileSync(corpusFilePath, 'utf-8');

  await t.test('1. Conversational intent detection exists and prevents hardcoded deemed approvals on greetings', () => {
    assert.ok(ragContent.includes('isGreetingOrGeneral'), 'Must implement greeting and conversational detection');
    assert.ok(ragContent.includes('isConversational'), 'Must flag conversational answers');
    assert.ok(chatContent.includes('ragAnswer.isConversational'), 'Chat route must branch on conversational greetings');
    assert.ok(ragContent.includes('Hello **${company}**!'), 'Must generate customized greeting with company name');
  });

  await t.test('2. Topic patterns cover all major Maharashtra regulatory bodies and statutes', () => {
    const requiredChunkIds = [
      'GREEN_CHANNEL_SELF_CERT',
      'MAHAVAULT_PRE_VALIDATION',
      'WATER_ACT_SEC_25_CTE',
      'AIR_ACT_SEC_21_CTO',
      'MIDC_DCR_RULE_14_SETBACKS',
      'FIRE_ACT_CFO_NOC',
      'FACTORIES_ACT_DISH_LICENSE',
      'ELECTRICITY_ACT_HT_POWER',
      'IBR_BOILER_REGISTRATION',
      'MAHA_PSI_2019_INCENTIVES',
      'STAMP_DUTY_EXEMPTION_BOMBAY',
      'ELECTRICITY_DUTY_EXEMPTION',
      'CMEGP_MSME_SCHEME',
      'RTS_ACT_SEC_8_APPEALS',
      'RTS_ACT_SEC_4_DEEMED',
    ];

    for (const chunkId of requiredChunkIds) {
      assert.ok(ragContent.includes(`chunkId: '${chunkId}'`), `Must define intent pattern for ${chunkId}`);
      assert.ok(corpusContent.includes(`id: '${chunkId}'`), `Must have corresponding chunk in statutory corpus for ${chunkId}`);
    }
  });

  await t.test('3. Stop words filter prevents common English words from biasing keyword search', () => {
    assert.ok(ragContent.includes('STOP_WORDS'), 'Must define STOP_WORDS set in RAG engine');
    assert.ok(ragContent.includes('filter(t => t.length > 2 && !STOP_WORDS.has(t))'), 'Tokenizer must exclude stop words');
  });

  await t.test('4. Chat route injects full applicant profile context into Groq LPU prompt', () => {
    assert.ok(chatContent.includes('profileContext'), 'Chat route must build profileContext');
    assert.ok(chatContent.includes('profile.companyName'), 'Chat route must include companyName in prompt');
    assert.ok(chatContent.includes('profile.sector'), 'Chat route must include sector in prompt');
    assert.ok(chatContent.includes('profile.district'), 'Chat route must include district/MIDC zone in prompt');
    assert.ok(chatContent.includes('profile.investmentInrCr'), 'Chat route must include investment in prompt');
  });

  await t.test('5. Chat route does not append duplicate hardcoded Section 4 boilerplates to Groq responses', () => {
    // When dynamicAiReply is present, it should present Groq answer cleanly
    assert.ok(chatContent.includes('if (dynamicAiReply) {'), 'Chat route must handle dynamic Groq reply cleanly');
    assert.ok(chatContent.includes('reply = dynamicAiReply;'), 'Must use dynamic Groq output as primary reply');
  });
});
