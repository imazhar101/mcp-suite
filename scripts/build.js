#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const ROOT_DIR = process.cwd();
const SERVERS_DIR = join(ROOT_DIR, 'servers');

function getServers() {
  try {
    const entries = execSync('ls -d servers/*/', { encoding: 'utf8' }).trim().split('\n');
    return entries.map(entry => entry.replace('servers/', '').replace('/', ''));
  } catch (error) {
    console.log('No servers found');
    return [];
  }
}

function buildServer(serverName) {
  const serverPath = join(SERVERS_DIR, serverName);
  const packageJsonPath = join(serverPath, 'package.json');
  
  if (!existsSync(packageJsonPath)) {
    console.log(`⚠️  No package.json found for ${serverName}, skipping...`);
    return false;
  }

  try {
    console.log(`📦 Building ${serverName}...`);
    execSync(`npx tsc --project ${serverPath}/tsconfig.json --outDir ${ROOT_DIR}/dist --rootDir ${ROOT_DIR}`, { 
      cwd: ROOT_DIR, 
      stdio: 'inherit' 
    });
    console.log(`✅ ${serverName} built successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to build ${serverName}:`, error.message);
    return false;
  }
}

function main() {
  const servers = getServers();
  
  if (servers.length === 0) {
    console.log('No servers found to build');
    return;
  }

  console.log(`Building ${servers.length} server(s): ${servers.join(', ')}\n`);
  
  let successful = 0;
  let failed = 0;

  for (const server of servers) {
    if (buildServer(server)) {
      successful++;
    } else {
      failed++;
    }
  }

  console.log(`\n📊 Build Summary:`);
  console.log(`   ✅ Successful: ${successful}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📦 Total: ${servers.length}`);

  if (failed > 0) {
    process.exit(1);
  }
}

main();