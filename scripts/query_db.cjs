const { createRequire } = require('module');
const apiRequire = createRequire('e:/MitFloww/api/package.json');
const { Client } = apiRequire('pg');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_jVNy2tv5XDoq@ep-misty-glade-aoufloww-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require'
  });
  await client.connect();
  const res = await client.query("SELECT * FROM mitfloww.sessions WHERE user_id = 'f58ed04e-e049-4645-9f26-3d691a36ffbb' ORDER BY created_at DESC LIMIT 3");
  console.log('SESSIONS:', JSON.stringify(res.rows, null, 2));

  await client.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
