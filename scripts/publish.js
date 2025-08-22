#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const servers = [
  "aws",
  "bitbucket",
  "canvas",
  "clickup",
  "elasticsearch",
  "figma",
  "jira",
  "notion",
  "paypal",
  "postgresql",
  "puppeteer",
  "rippling",
  "salesforce",
  "stripe",
];

function publishPackage(serverName, versionBump) {
  const serverPath = path.join(__dirname, "..", "servers", serverName);
  const packageJsonPath = path.join(serverPath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.log(`❌ Package.json not found for ${serverName}`);
    return false;
  }

  try {
    console.log(`📦 Publishing @imazhar101/mcp-${serverName}-server...`);

    // Change to server directory
    process.chdir(serverPath);

    // Check if dist folder exists (built files should be here)
    const serverDistPath = path.join(serverPath, "dist");
    if (!fs.existsSync(serverDistPath)) {
      console.log(
        `❌ No dist folder found for ${serverName}. Run build first.`
      );
      return false;
    }

    // Bump version if specified
    if (versionBump) {
      console.log(`🔢 Bumping version (${versionBump})...`);
      execSync(`npm version ${versionBump} --no-git-tag-version`, {
        stdio: "inherit",
      });
    }

    // Publish the package
    execSync("npm publish --access public", { stdio: "inherit" });

    console.log(
      `✅ Successfully published @imazhar101/mcp-${serverName}-server`
    );
    return true;
  } catch (error) {
    console.error(`❌ Failed to publish ${serverName}:`, error.message);
    return false;
  }
}

function main() {
  const args = process.argv.slice(2);

  // Handle npm run publish -- server --version=patch
  let serverName = null;
  let versionBump = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--version=")) {
      versionBump = arg.split("=")[1];
    } else if (!arg.startsWith("--") && !serverName) {
      serverName = arg;
    }
  }

  if (serverName && !serverName.startsWith("--")) {
    // Publish single server
    if (!servers.includes(serverName)) {
      console.error(
        `❌ Server '${serverName}' not found. Available servers: ${servers.join(
          ", "
        )}`
      );
      process.exit(1);
    }

    console.log(`🚀 Publishing ${serverName} server to npm...\n`);

    if (publishPackage(serverName, versionBump)) {
      console.log(
        `✅ Successfully published @imazhar101/mcp-${serverName}-server`
      );
    } else {
      console.log(`❌ Failed to publish ${serverName}`);
      process.exit(1);
    }
  } else {
    // Publish all servers
    console.log("🚀 Publishing MCP Suite packages to npm...\n");

    let successful = 0;
    let failed = 0;

    for (const server of servers) {
      if (publishPackage(server, versionBump)) {
        successful++;
      } else {
        failed++;
      }
      console.log(""); // Add spacing between packages
    }

    console.log("📊 Publishing Summary:");
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);

    if (failed > 0) {
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main();
}
