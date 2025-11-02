import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginInput, CreateUserInput, AuthResponse } from '@/types/api';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '@/lib/graphql/mutations';
import { ME_QUERY } from '@/lib/graphql/queries';

const TOKEN_KEY = '@studydocs_token';

interface AuthContextData {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (input: LoginInput) => Promise<void>;
  signUp: (input: CreateUserInput) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [loginMutation] = useMutation<{ login: AuthResponse }>(LOGIN_MUTATION);
  const [registerMutation] = useMutation<{ register: AuthResponse }>(REGISTER_MUTATION);

  useEffect(() => {
    loadStoredToken();
  }, []);

  const { refetch: refetchMe } = useQuery<{ me: User }>(ME_QUERY, {
    skip: !token,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
      }
      setLoading(false);
    },
    onError: (error) => {
      console.log('Erro ao buscar usuário:', error.message);
      signOut();
      setLoading(false);
    },
  });

  async function loadStoredToken() {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        setToken(storedToken);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro ao carregar token:', error);
      setLoading(false);
    }
  }

  async function signIn(input: LoginInput) {
    try {
      const { data, errors } = await loginMutation({
        variables: { loginInput: input },
      });

      if (errors && errors.length > 0) {
        const errorMessage = errors[0].message || 'Erro ao fazer login';
        throw new Error(errorMessage);
      }

      if (data?.login) {
        const { user: userData, token: authToken } = data.login;
        await AsyncStorage.setItem(TOKEN_KEY, authToken);
        setToken(authToken);
        setUser(userData);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  async function signUp(input: CreateUserInput) {
    try {
      const { data, errors } = await registerMutation({
        variables: { createUserInput: input },
      });

      if (errors && errors.length > 0) {
        const errorMessage = errors[0].message || 'Erro ao criar conta';
        throw new Error(errorMessage);
      }

      if (data?.register) {
        const { user: userData, token: authToken } = data.register;
        await AsyncStorage.setItem(TOKEN_KEY, authToken);
        setToken(authToken);
        setUser(userData);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
