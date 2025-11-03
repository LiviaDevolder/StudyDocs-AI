import { gql } from '@apollo/client';

// User Queries
export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export const USERS_QUERY = gql`
  query Users {
    users {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export const USER_QUERY = gql`
  query User($id: String!) {
    user(id: $id) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

export const USER_BY_EMAIL_QUERY = gql`
  query UserByEmail($email: String!) {
    userByEmail(email: $email) {
      id
      name
      email
      createdAt
      updatedAt
    }
  }
`;

// Project Queries
export const PROJECTS_QUERY = gql`
  query Projects {
    projects {
      id
      name
      userId
      createdAt
      updatedAt
    }
  }
`;

export const PROJECT_QUERY = gql`
  query Project($id: String!) {
    project(id: $id) {
      id
      name
      userId
      createdAt
      updatedAt
    }
  }
`;

// Document Queries
export const DOCUMENTS_QUERY = gql`
  query Documents {
    documents {
      id
      name
      path
      projectId
      createdAt
      updatedAt
    }
  }
`;

export const DOCUMENT_QUERY = gql`
  query Document($id: String!) {
    document(id: $id) {
      id
      name
      path
      projectId
      createdAt
      updatedAt
    }
  }
`;

export const DOCUMENTS_BY_PROJECT_QUERY = gql`
  query DocumentsByProject($projectId: String!) {
    documentsByProject(projectId: $projectId) {
      id
      name
      projectId
      uploadedAt
      status
    }
  }
`;

// Conversation Queries
export const CONVERSATIONS_BY_PROJECT_QUERY = gql`
  query ConversationsByProject($projectId: String!) {
    conversationsByProject(projectId: $projectId) {
      id
      projectId
      createdAt
      updatedAt
    }
  }
`;

// Message Queries
export const MESSAGES_BY_PROJECT_QUERY = gql`
  query MessagesByProject($projectId: String!) {
    messagesByProject(projectId: $projectId) {
      id
      content
      role
      conversationId
      createdAt
      updatedAt
    }
  }
`;
