#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const servers = [
    'aws',
    'bitbucket', 
    'canvas',
    'clickup',
    'elasticsearch',
    'figma',
    'jira',
    'notion',
    'postgresql',
    'puppeteer',
    'salesforce'
];

function publishPackage(serverName) {
    const serverPath = path.join(__dirname, '..', 'servers', serverName);
    const packageJsonPath = path.join(serverPath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
        console.log(`❌ Package.json not found for ${serverName}`);
        return false;
    }

    try {
        console.log(`📦 Publishing @imazhar101/mcp-${serverName}-server...`);
        
        // Change to server directory and publish
        process.chdir(serverPath);
        execSync('npm publish --access public', { stdio: 'inherit' });
        
        console.log(`✅ Successfully published @imazhar101/mcp-${serverName}-server`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to publish ${serverName}:`, error.message);
        return false;
    }
}

function main() {
    console.log('🚀 Publishing MCP Suite packages to npm...\n');
    
    let successful = 0;
    let failed = 0;
    
    for (const server of servers) {
        if (publishPackage(server)) {
            successful++;
        } else {
            failed++;
        }
        console.log(''); // Add spacing between packages
    }
    
    console.log('📊 Publishing Summary:');
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed > 0) {
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}