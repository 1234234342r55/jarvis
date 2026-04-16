// JARVIS Workout Planner — GitHub Actions version
// Node 20 built-in fetch, no npm install needed

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = '12588aad-6b64-80be-9f3c-f441c731cf2e';

const ROTATION = [
  { name: 'chest day',    templateId: '12788aad-6b64-80bf-8a88-c25ed7005d2c' },
  { name: 'Back day',     templateId: '12888aad-6b64-80ed-b62e-f0ad7cfe45e3' },
  { name: 'shoulder day', templateId: '12888aad-6b64-8023-8201-ca9d049a226b' },
  { name: 'Rest',         templateId: null },
  { name: 'arms day',     templateId: '13188aad-6b64-80b7-8a9b-ea3500d58e5d' },
  { name: 'Running',      templateId: null },
];

// --- Notion API helper ---
async function notion(method, path, body) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Notion ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

// --- Date utils ---
function getTomorrowKST() {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  kst.setUTCDate(kst.getUTCDate() + 1);
  return kst.toISOString().slice(0, 10); // YYYY-MM-DD
}

function daysBetween(fromDateStr, toDateStr) {
  const from = new Date(fromDateStr + 'T00:00:00+09:00');
  const to   = new Date(toDateStr   + 'T00:00:00+09:00');
  return Math.round((to - from) / 86400000);
}

// --- Time parser ---
function parseTime(str = '19:00') {
  const m24  = str.match(/^(\d{1,2}):(\d{2})$/);
  if (m24)  return { h: +m24[1],  m: +m24[2] };

  const mpm  = str.match(/^(\d{1,2})\s*pm$/i);
  if (mpm)  return { h: +mpm[1] === 12 ? 12 : +mpm[1] + 12, m: 0 };

  const mam  = str.match(/^(\d{1,2})\s*am$/i);
  if (mam)  return { h: +mam[1] === 12 ? 0 : +mam[1], m: 0 };

  const mnum = str.match(/^(\d{1,2})$/);
  if (mnum) return { h: +mnum[1], m: 0 };

  return { h: 19, m: 0 };
}

// --- Block cleaner (remove read-only fields) ---
function cleanBlock(block) {
  const { id, created_time, last_edited_time, created_by, last_edited_by, parent, ...clean } = block;
  return clean;
}

async function fetchBlocks(blockId) {
  const res = await notion('GET', `/blocks/${blockId}/children?page_size=100`);
  const blocks = [];
  for (const block of res.results) {
    const cleaned = cleanBlock(block);
    if (block.has_children) {
      const nested = await notion('GET', `/blocks/${block.id}/children?page_size=100`);
      cleaned[block.type].children = nested.results.map(cleanBlock);
    }
    blocks.push(cleaned);
  }
  return blocks;
}

// --- Main ---
async function main() {
  // 1. Get last workout
  const db = await notion('POST', `/databases/${DATABASE_ID}/query`, {
    sorts: [{ property: 'Date', direction: 'descending' }],
    page_size: 1,
  });

  if (!db.results.length) throw new Error('No workouts found in database');

  const last = db.results[0];
  const lastDateStart = last.properties['Date']?.date?.start;
  const lastDateStr   = lastDateStart.slice(0, 10);
  const lastName      = last.properties['Name']?.title?.[0]?.plain_text ?? '';

  console.log(`Last workout: "${lastName}" on ${lastDateStr}`);

  // 2. Calculate tomorrow's workout
  const lastPos = ROTATION.findIndex(r => r.name.toLowerCase() === lastName.toLowerCase());
  if (lastPos === -1) throw new Error(`Unknown workout in rotation: "${lastName}"`);

  const tomorrowStr  = getTomorrowKST();
  const daysElapsed  = daysBetween(lastDateStr, tomorrowStr);
  const nextPos      = (lastPos + daysElapsed) % ROTATION.length;
  const workout      = ROTATION[nextPos];

  console.log(`Tomorrow (${tomorrowStr}): ${workout.name} [rotation pos ${nextPos + 1}]`);

  // 3. Rest / Running — no page needed
  if (!workout.templateId) {
    console.log(`${workout.name} day — no Notion page created. Rest well, sir.`);
    return;
  }

  // 4. Build datetime strings
  const { h, m } = parseTime(process.env.WORKOUT_TIME);
  const pad   = n => String(n).padStart(2, '0');
  const start = `${tomorrowStr}T${pad(h)}:${pad(m)}:00.000+09:00`;
  const end   = `${tomorrowStr}T${pad((h + 1) % 24)}:${pad(m)}:00.000+09:00`;

  // 5. Copy blocks from template
  console.log(`Fetching template content...`);
  const children = await fetchBlocks(workout.templateId);

  // 6. Create page
  const page = await notion('POST', '/pages', {
    parent: { database_id: DATABASE_ID },
    properties: {
      Name:   { title: [{ text: { content: workout.name } }] },
      Date:   { date: { start, end } },
      Status: { status: { name: 'Not started' } },
    },
    children: children.slice(0, 100),
  });

  console.log(`✅ Created: ${workout.name} at ${pad(h)}:${pad(m)}–${pad((h+1)%24)}:${pad(m)} KST`);
  console.log(`   ${page.url}`);
}

main().catch(err => {
  console.error('❌ JARVIS error:', err.message);
  process.exit(1);
});
