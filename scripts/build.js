#!/usr/bin/env node
const { execSync } = require("child_process");
const { existsSync, writeFileSync, mkdirSync } = require("fs");
const { join } = require("path");
const readline = require("readline");

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
    
    // Build to local dist directory within the server folder
    const localDistPath = join(serverPath, "dist");
    
    execSync(
      `npx tsc --project ${serverPath}/tsconfig.json --outDir ${localDistPath}`,
      {
        cwd: ROOT_DIR,
        stdio: "pipe",
      }
    );
    
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

function displayServerMenu(servers) {
  console.log("\n📦 Available servers to build:");
  console.log("─".repeat(40));
  
  servers.forEach((server, index) => {
    console.log(`${index + 1}. ${server}`);
  });
  
  console.log(`${servers.length + 1}. all (build all servers)`);
  console.log("─".repeat(40));
}

function getUserChoice(servers) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    displayServerMenu(servers);
    rl.question("\n🔧 Enter your choice (number): ", (answer) => {
      rl.close();
      const choice = parseInt(answer.trim());
      
      if (choice >= 1 && choice <= servers.length) {
        resolve([servers[choice - 1]]);
      } else if (choice === servers.length + 1) {
        resolve(servers);
      } else {
        console.log("❌ Invalid choice. Please try again.");
        resolve(getUserChoice(servers));
      }
    });
  });
}

function parseCommandLineArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    return null;
  }

  const serverArg = args.find(arg => arg.startsWith('--server='));
  if (serverArg) {
    const serverName = serverArg.split('=')[1];
    if (serverName === 'all') {
      return 'all';
    }
    return [serverName];
  }

  return null;
}

function buildSelectedServers(selectedServers) {
  console.log(`\n🚀 Building ${selectedServers.length} server(s): ${selectedServers.join(", ")}\n`);

  const progressBar = new ProgressBar(selectedServers.length);
  let successful = 0;
  let failed = 0;

  for (let i = 0; i < selectedServers.length; i++) {
    const server = selectedServers[i];
    if (buildServer(server, progressBar, i, selectedServers.length)) {
      successful++;
    } else {
      failed++;
    }
  }

  console.log(`\n📊 Build Summary:`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed > 0) {
    process.exit(1);
  }
}

async function main() {
  // Build shared modules first
  if (!buildShared()) {
    process.exit(1);
  }
  
  const servers = getServers();

  if (servers.length === 0) {
    console.log("No servers found to build");
    return;
  }

  // Check for command line arguments
  const cmdArgs = parseCommandLineArgs();
  let selectedServers;

  if (cmdArgs === 'all') {
    selectedServers = servers;
  } else if (cmdArgs && Array.isArray(cmdArgs)) {
    // Validate server name
    const serverName = cmdArgs[0];
    if (servers.includes(serverName)) {
      selectedServers = cmdArgs;
    } else {
      console.log(`❌ Server "${serverName}" not found. Available servers: ${servers.join(", ")}`);
      process.exit(1);
    }
  } else {
    // Interactive mode
    selectedServers = await getUserChoice(servers);
  }

  buildSelectedServers(selectedServers);
}

main();
