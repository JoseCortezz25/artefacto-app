import { Message } from 'ai';
import { ReactNode } from 'react';

export type SearchResults = {
  title: string;
  link: string;
  snippet: string;
};

export type AIState = {
  messages: Array<Message>;
};

export type UIState = Array<{
  id: string;
  display: ReactNode;
  spinner?: ReactNode;
}>;

export enum DELTA_STATUS {
  ERROR = 'error',
  TOOL_CALL = 'tool-call',
  TEXT_DELTA = 'text-delta',
  FINISH = 'finish'
}

export enum User {
  AI = 'ai',
  User = 'user'
}

export enum Steps {
  Search = 'Search',
  Loading = 'Loading',
  Chat = 'Chat'
}

export enum SourceType {
  Wikipedia = 'Wikipedia',
  Internet = 'Internet',
  NormalAnswer = 'NormalAnswer'
}

export enum Creativity {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export enum Models {
  O1Preview = 'o1-preview',
  O1mini = 'o1-mini',
  GPT4o = 'gpt-4o',
  GPT4oMini = 'gpt-4o-mini',
  Gemini15ProLatest = 'gemini-1.5-pro-latest',
  GeminiFlash15 = 'gemini-1.5-flash-latest',
}

export interface Options {
  apiKey: string;
  model: Models
  creativity: Creativity
}
