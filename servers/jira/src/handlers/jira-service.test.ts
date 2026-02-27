import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JiraService } from './jira-service.js';
import { Logger } from '../../../../shared/utils/logger.js';
import axios from 'axios';
import { CreateIssueRequest } from '../types.js';

vi.mock('axios');
vi.mock('../../../../shared/utils/logger.js');
vi.mock('../../../../shared/middleware/error-handler.js');
vi.mock('../../../../shared/middleware/auth.js');

describe('JiraService', () => {
  let jiraService: JiraService;
  let mockAxios: any;
  let mockLogger: any;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockLogger = {
      withContext: vi.fn().mockReturnThis(),
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    };
    
    mockAxios = {
      create: vi.fn().mockReturnValue({
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
      }),
    };
    
    (axios.create as any) = mockAxios.create;
    (Logger as any).mockImplementation(() => mockLogger);

    const config = {
      baseUrl: 'https://test.atlassian.net',
      email: 'test@example.com',
      apiToken: 'test-token',
    };

    jiraService = new JiraService(config, mockLogger);
  });

  describe('createIssue', () => {
    it('should create a regular issue without parent', async () => {
      const mockClient = mockAxios.create();
      mockClient.post.mockResolvedValue({
        data: { key: 'TEST-123' },
      });

      const request: CreateIssueRequest = {
        projectKey: 'TEST',
        summary: 'Test Issue',
        description: 'Test description',
        issueType: 'Task',
        priority: 'High',
      };

      const result = await jiraService.createIssue(request);

      expect(mockClient.post).toHaveBeenCalledWith('/issue', {
        fields: {
          project: { key: 'TEST' },
          summary: 'Test Issue',
          issuetype: { name: 'Task' },
          priority: { name: 'High' },
          description: {
            type: 'doc',
            version: 1,
            content: [{
              type: 'paragraph',
              content: [{ type: 'text', text: 'Test description' }],
            }],
          },
        },
      });

      expect(result.success).toBe(true);
      expect(result.data?.key).toBe('TEST-123');
    });

    it('should create a subtask with parent key', async () => {
      const mockClient = mockAxios.create();
      mockClient.post.mockResolvedValue({
        data: { key: 'TEST-124' },
      });

      const request: CreateIssueRequest = {
        projectKey: 'TEST',
        summary: 'Test Subtask',
        parentKey: 'TEST-123',
        issueType: 'Sub-task',
      };

      const result = await jiraService.createIssue(request);

      expect(mockClient.post).toHaveBeenCalledWith('/issue', {
        fields: {
          project: { key: 'TEST' },
          summary: 'Test Subtask',
          issuetype: { name: 'Sub-task' },
          priority: { name: 'Medium' },
          parent: { key: 'TEST-123' },
        },
      });

      expect(result.success).toBe(true);
      expect(result.data?.key).toBe('TEST-124');
    });

    it('should create a subtask with assignee', async () => {
      const mockClient = mockAxios.create();
      mockClient.post.mockResolvedValue({
        data: { key: 'TEST-125' },
      });

      const request: CreateIssueRequest = {
        projectKey: 'TEST',
        summary: 'Assigned Subtask',
        parentKey: 'TEST-123',
        assignee: 'assignee@example.com',
      };

      const result = await jiraService.createIssue(request);

      expect(mockClient.post).toHaveBeenCalledWith('/issue', {
        fields: {
          project: { key: 'TEST' },
          summary: 'Assigned Subtask',
          issuetype: { name: 'Task' },
          priority: { name: 'Medium' },
          parent: { key: 'TEST-123' },
          assignee: { emailAddress: 'assignee@example.com' },
        },
      });

      expect(result.success).toBe(true);
    });

    it('should not include parent field when parentKey is not provided', async () => {
      const mockClient = mockAxios.create();
      mockClient.post.mockResolvedValue({
        data: { key: 'TEST-126' },
      });

      const request: CreateIssueRequest = {
        projectKey: 'TEST',
        summary: 'Regular Issue',
      };

      await jiraService.createIssue(request);

      const callArgs = mockClient.post.mock.calls[0][1];
      expect(callArgs.fields).not.toHaveProperty('parent');
    });
  });
});