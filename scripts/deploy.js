#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
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

function bumpVersion(serverName, versionType = 'patch') {
  const serverPath = join(SERVERS_DIR, serverName);
  const packageJsonPath = join(serverPath, 'package.json');
  
  try {
    console.log(`📝 Bumping ${versionType} version for ${serverName}...`);
    
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const [major, minor, patch] = packageJson.version.split('.').map(Number);
    
    let newVersion;
    switch (versionType) {
      case 'major':
        newVersion = `${major + 1}.0.0`;
        break;
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`;
        break;
      case 'patch':
      default:
        newVersion = `${major}.${minor}.${patch + 1}`;
        break;
    }
    
    packageJson.version = newVersion;
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    
    console.log(`✅ ${serverName} version bumped to ${newVersion}`);
    return newVersion;
  } catch (error) {
    console.error(`❌ Failed to bump version for ${serverName}:`, error.message);
    return null;
  }
}

function publishServer(serverName) {
  const serverPath = join(SERVERS_DIR, serverName);
  
  try {
    console.log(`📦 Building ${serverName}...`);
    execSync('npm run build', { cwd: serverPath, stdio: 'inherit' });
    
    console.log(`📤 Publishing ${serverName}...`);
    execSync('npm publish --access public', { cwd: serverPath, stdio: 'inherit' });
    
    console.log(`✅ ${serverName} published successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to publish ${serverName}:`, error.message);
    return false;
  }
}

function createGitTag(serverName, version) {
  try {
    const tag = `${serverName}-v${version}`;
    console.log(`🏷️  Creating git tag: ${tag}`);
    
    execSync(`git add servers/${serverName}/package.json`, { stdio: 'inherit' });
    execSync(`git commit -m "chore: bump ${serverName} to v${version}"`, { stdio: 'inherit' });
    execSync(`git tag ${tag}`, { stdio: 'inherit' });
    execSync(`git push origin ${tag}`, { stdio: 'inherit' });
    
    console.log(`✅ Git tag ${tag} created and pushed`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create git tag:`, error.message);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);
  const serverName = args[0];
  const versionType = args[1] || 'patch';
  
  if (!serverName) {
    console.error('Usage: node deploy.js <server-name> [version-type]');
    console.error('Version types: major, minor, patch (default)');
    console.error('Example: node deploy.js jira patch');
    process.exit(1);
  }

  const servers = getServers();
  
  if (!servers.includes(serverName)) {
    console.error(`❌ Server "${serverName}" not found`);
    console.error(`Available servers: ${servers.join(', ')}`);
    process.exit(1);
  }

  console.log(`🚀 Deploying ${serverName} with ${versionType} version bump...\n`);
  
  // Bump version
  const newVersion = bumpVersion(serverName, versionType);
  if (!newVersion) {
    process.exit(1);
  }

  // Build and publish
  if (!publishServer(serverName)) {
    process.exit(1);
  }

  // Create git tag
  if (!createGitTag(serverName, newVersion)) {
    process.exit(1);
  }

  console.log(`\n🎉 ${serverName} v${newVersion} deployed successfully!`);
}

main();