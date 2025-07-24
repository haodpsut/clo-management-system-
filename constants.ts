
import { PLO } from './types';

export const BLOOM_LEVELS: string[] = [
  "Remembering",
  "Understanding",
  "Applying",
  "Analyzing",
  "Evaluating",
  "Creating",
];

export const SKILL_TYPES: string[] = [
  "Professional Skill",
  "Soft Skill",
  "Technical Skill",
  "Analytical Skill",
  "Communication Skill",
];

export const PLO_LIST: PLO[] = [
  { id: "PLO1", description: "An ability to identify, formulate, and solve complex engineering problems by applying principles of engineering, science, and mathematics." },
  { id: "PLO2", description: "An ability to apply engineering design to produce solutions that meet specified needs with consideration of public health, safety, and welfare, as well as global, cultural, social, environmental, and economic factors." },
  { id: "PLO3", description: "An ability to communicate effectively with a range of audiences." },
  { id: "PLO4", description: "An ability to recognize ethical and professional responsibilities in engineering situations and make informed judgments." },
  { id: "PLO5", description: "An ability to function effectively on a team whose members together provide leadership, create a collaborative and inclusive environment, establish goals, plan tasks, and meet objectives." },
  { id: "PLO6", description: "An ability to develop and conduct appropriate experimentation, analyze and interpret data, and use engineering judgment to draw conclusions." },
  { id: "PLO7", description: "An ability to acquire and apply new knowledge as needed, using appropriate learning strategies." },
];

export const OPEN_ROUTER_MODELS: { name: string; id: string }[] = [
    { name: "GPT-3.5 Turbo (OpenAI)", id: "openai/gpt-3.5-turbo" },
    { name: "Llama 3 8B (Meta)", id: "meta-llama/llama-3-8b-instruct" },
    { name: "Mistral 7B (MistralAI)", id: "mistralai/mistral-7b-instruct" },
    { name: "Gemma 7B (Google)", id: "google/gemma-7b-it" },
];
