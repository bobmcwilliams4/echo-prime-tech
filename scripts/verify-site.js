const fs = require('fs');
const path = require('path');

const identity = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'SITE_IDENTITY.json'), 'utf8'));
const vercelPath = path.join(__dirname, '..', '.vercel', 'project.json');

if (fs.existsSync(vercelPath)) {
  const project = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  if (project.projectId !== identity.vercel_project_id) {
    console.error(`\n  SITE IDENTITY MISMATCH!\n  Expected: ${identity.vercel_project_id} (${identity.site_id})\n  Got:      ${project.projectId} (${project.projectName})\n  ABORTING BUILD — wrong Vercel project is deploying this code.\n`);
    process.exit(1);
  }
  console.log(`Site identity verified: ${identity.site_id} → ${identity.vercel_project}`);
} else {
  console.log(`No .vercel/project.json found — skipping identity check (CI/fresh clone)`);
}
