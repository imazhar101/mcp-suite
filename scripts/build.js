#!/usr/bin/env node
const { execSync } = require("child_process");
const { existsSync, writeFileSync, mkdirSync } = require("fs");
const { join } = require("path");

class ProgressBar {
  constructor(total, width = 30) {
    this.total = total;
    this.current = 0;
    this.width = width;
  }

  update(current, label = "") {
    this.current = current;
    const percentage = Math.round((current / this.total) * 100);
    const filled = Math.round((current / this.total) * this.width);
    const empty = this.width - filled;

    const bar = "█".repeat(filled) + "░".repeat(empty);
    const progress = `[${bar}] ${percentage}% (${current}/${this.total})`;

    process.stdout.write(`\r${progress} ${label}`);

    if (current === this.total) {
      process.stdout.write("\n");
    }
  }

  finish() {
    this.update(this.total);
  }
}

const ROOT_DIR = process.cwd();
const SERVERS_DIR = join(ROOT_DIR, "servers");

function getServers() {
  try {
    const entries = execSync("ls -d servers/*/", { encoding: "utf8" })
      .trim()
      .split("\n");
    return entries.map((entry) =>
      entry.replace("servers/", "").replace("/", "")
    );
  } catch (error) {
    console.log("No servers found");
    return [];
  }
}

function buildServer(serverName, progressBar, current, total) {
  const serverPath = join(SERVERS_DIR, serverName);
  const packageJsonPath = join(serverPath, "package.json");

  if (!existsSync(packageJsonPath)) {
    progressBar.update(current, `⚠️  Skipping ${serverName} (no package.json)`);
    return false;
  }

  try {
    progressBar.update(current, `📦 Building ${serverName}...`);
    execSync(
      `npx tsc --project ${serverPath}/tsconfig.json --outDir ${ROOT_DIR}/dist --rootDir ${ROOT_DIR}`,
      {
        cwd: ROOT_DIR,
        stdio: "pipe",
      }
    );
    
    // Create package.json in dist folder to specify ES modules
    const distServerPath = join(ROOT_DIR, "dist", "servers", serverName);
    if (!existsSync(distServerPath)) {
      mkdirSync(distServerPath, { recursive: true });
    }
    const distPackageJsonPath = join(distServerPath, "package.json");
    const distPackageJson = {
      "type": "module"
    };
    writeFileSync(distPackageJsonPath, JSON.stringify(distPackageJson, null, 2));
    
    progressBar.update(current + 1, `✅ ${serverName} completed`);
    return true;
  } catch (error) {
    progressBar.update(
      current + 1,
      `❌ ${serverName} failed: ${error.message.split("\n")[0]}`
    );
    return false;
  }
}

function buildShared() {
  try {
    console.log("📦 Building shared modules...");
    execSync("npm run build:shared", {
      cwd: ROOT_DIR,
      stdio: "pipe",
    });
    
    // Create package.json in shared dist folder
    const sharedDistPath = join(ROOT_DIR, "dist", "shared");
    if (!existsSync(sharedDistPath)) {
      mkdirSync(sharedDistPath, { recursive: true });
    }
    const sharedPackageJsonPath = join(sharedDistPath, "package.json");
    const sharedPackageJson = {
      "type": "module"
    };
    writeFileSync(sharedPackageJsonPath, JSON.stringify(sharedPackageJson, null, 2));
    
    console.log("✅ Shared modules completed\n");
    return true;
  } catch (error) {
    console.log(`❌ Shared modules failed: ${error.message.split("\n")[0]}`);
    return false;
  }
}

function main() {
  // Build shared modules first
  if (!buildShared()) {
    process.exit(1);
  }
  
  const servers = getServers();

  if (servers.length === 0) {
    console.log("No servers found to build");
    return;
  }

  console.log(`Building ${servers.length} server(s): ${servers.join(", ")}\n`);

  const progressBar = new ProgressBar(servers.length);
  let successful = 0;
  let failed = 0;

  for (let i = 0; i < servers.length; i++) {
    const server = servers[i];
    if (buildServer(server, progressBar, i, servers.length)) {
      successful++;
    } else {
      failed++;
    }
  }

  if (failed > 0) {
    process.exit(1);
  }
}

main();
