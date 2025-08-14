# AI Job Search MCP Server

An MCP server for AI-powered job search functionality, providing skills extraction and job matching capabilities.

## Features

- **Skills Extraction**: Extract skills from text using taxonomy mappings, LLM prompts, and RAG
- **Job Matching**: Find jobs that match skills or descriptive text

## Installation

```bash
npm install @imazhar101/mcp-aijobsearch-server
```

## Configuration

Set the following environment variables:

- `AIJOBSEARCH_API_URL`: API base URL (default: https://api-main-poc.aiml.asu.edu)
- `AIJOBSEARCH_API_TOKEN`: Your API access token (required)

## Available Tools

### extract_skills
Extract skills from text using taxonomy mappings.

**Parameters:**
- `taxonomy` (string): Skills taxonomy to use (recommended: "lightcast")
- `context` (string): Job description, resume, or text block to extract skills from

### match_jobs
Find jobs that match skills or text.

**Parameters:**
- `type` (string): "skills" or "text"
- `skills_list` (array): Array of skills (required when type='skills')
  - `title` (string): Skill title
  - `description` (string): Skill description
  - `taxonomy` (string): Taxonomy name
- `context` (string): Resume or text block (required when type='text')

## Usage

```javascript
// Extract skills from text
const skills = await extractSkills({
  taxonomy: "lightcast",
  context: "Software Engineer with experience in web development..."
});

// Match jobs by skills
const jobs = await matchJobs({
  type: "skills",
  skills_list: [
    {
      title: "Software Engineering",
      description: "Software Engineering...",
      taxonomy: "lightcast"
    }
  ]
});

// Match jobs by text
const jobsByText = await matchJobs({
  type: "text",
  context: "Your resume text here..."
});
```

## License

MIT