// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Project Types
export interface Project {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  name: string;
}

export interface UpdateProjectInput {
  name?: string;
}

// Document Types
export interface Document {
  id: string;
  name: string;
  path: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentInput {
  name: string;
  path: string;
  projectId: string;
}

export interface UpdateDocumentInput {
  name?: string;
  path?: string;
}

// Conversation Types
export interface Conversation {
  id: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationInput {
  projectId: string;
}

// Message Types
export enum MessageRole {
  HUMAN = 'Human',
  AI = 'AI',
}

export interface Message {
  id: string;
  content: string;
  role: MessageRole;
  conversationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageInput {
  content: string;
  conversationId: string;
  role: MessageRole;
}
