import { gql } from '@apollo/client';

// Auth Mutations
export const REGISTER_MUTATION = gql`
  mutation Register($createUserInput: CreateUserInput!) {
    register(createUserInput: $createUserInput) {
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
      token
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      user {
        id
        name
        email
        createdAt
        updatedAt
      }
      token
    }
  }
`;

// User Mutations
export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: String!, $updateUserInput: UpdateUserInput!) {
    updateUser(id: $id, updateUserInput: $updateUserInput) {
      id
      name
      email
      updatedAt
    }
  }
`;

export const REMOVE_USER_MUTATION = gql`
  mutation RemoveUser($id: String!) {
    removeUser(id: $id)
  }
`;

// Project Mutations
export const CREATE_PROJECT_MUTATION = gql`
  mutation CreateProject($createProjectInput: CreateProjectInput!) {
    createProject(createProjectInput: $createProjectInput) {
      id
      name
      userId
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROJECT_MUTATION = gql`
  mutation UpdateProject($id: String!, $updateProjectInput: UpdateProjectInput!) {
    updateProject(id: $id, updateProjectInput: $updateProjectInput) {
      id
      name
      updatedAt
    }
  }
`;

export const REMOVE_PROJECT_MUTATION = gql`
  mutation RemoveProject($id: String!) {
    removeProject(id: $id) {
      id
      name
    }
  }
`;

// Document Mutations
export const UPLOAD_DOCUMENT_MUTATION = gql`
  mutation UploadDocument($projectId: String!, $file: Upload!) {
    uploadDocument(projectId: $projectId, file: $file) {
      id
      name
      type
      status
      fileSize
      gcsPath
      uploadedAt
    }
  }
`;

export const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument($createDocumentInput: CreateDocumentInput!) {
    createDocument(createDocumentInput: $createDocumentInput) {
      id
      name
      projectId
      uploadedAt
      status
    }
  }
`;

export const UPDATE_DOCUMENT_MUTATION = gql`
  mutation UpdateDocument($id: String!, $updateDocumentInput: UpdateDocumentInput!) {
    updateDocument(id: $id, updateDocumentInput: $updateDocumentInput) {
      id
      name
      uploadedAt
    }
  }
`;

export const REMOVE_DOCUMENT_MUTATION = gql`
  mutation RemoveDocument($id: String!) {
    removeDocument(id: $id)
  }
`;

// Conversation Mutations
export const CREATE_CONVERSATION_MUTATION = gql`
  mutation CreateConversation($createConversationInput: CreateConversationInput!) {
    createConversation(createConversationInput: $createConversationInput) {
      id
      projectId
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_CONVERSATION_MUTATION = gql`
  mutation RemoveConversation($id: String!) {
    removeConversation(id: $id)
  }
`;

// Message Mutations
export const CREATE_MESSAGE_MUTATION = gql`
  mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      id
      content
      role
      conversationId
      createdAt
      updatedAt
    }
  }
`;
