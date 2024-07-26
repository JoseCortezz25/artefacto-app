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
