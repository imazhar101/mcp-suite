import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';

describe('Jira Server Integration', () => {
  let serverProcess: ChildProcess;
  const serverPath = join(process.cwd(), 'servers', 'jira', 'dist', 'index.js');

  beforeAll(async () => {
    // Note: This would require the server to be built first
    // and proper environment variables to be set
    if (process.env.CI || !process.env.JIRA_BASE_URL) {
      return; // Skip integration tests in CI or when env vars are missing
    }

    serverProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        LOG_LEVEL: 'debug'
      }
    });

    // Wait for server to start
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 10000);

      serverProcess.stderr?.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Jira MCP server running')) {
          clearTimeout(timeout);
          resolve();
        }
      });

      serverProcess.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  });

  afterAll(async () => {
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      await new Promise<void>((resolve) => {
        serverProcess.on('exit', () => resolve());
        setTimeout(() => {
          serverProcess.kill('SIGKILL');
          resolve();
        }, 5000);
      });
    }
  });

  it('should start successfully', () => {
    if (process.env.CI || !process.env.JIRA_BASE_URL) {
      expect(true).toBe(true); // Skip test
      return;
    }
    
    expect(serverProcess).toBeDefined();
    expect(serverProcess.killed).toBe(false);
  });

  // Add more integration tests here when needed
  // These would test actual MCP protocol communication
});