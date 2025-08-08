export interface AIJobSearchConfig {
  apiUrl: string;
  apiToken: string;
}

export interface Skill {
  title: string;
  description: string;
  taxonomy_reference_link: string;
  match_relevance: number;
}

export interface SkillForJobMatching {
  title: string;
  description: string;
  taxonomy: string;
}

export interface SkillsExtractionResponse {
  skills_list: Skill[];
}

export interface Job {
  title: string;
  description: string;
  job_site: string;
  link_to_job: string;
  skills_matched: Skill[];
  jobs_match_relevance: number;
}

export interface JobMatchingResponse {
  jobs_list: Job[];
}