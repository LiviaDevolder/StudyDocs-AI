import React, { useEffect } from 'react';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { useLazyQuery } from '@apollo/client';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Spinner,
  Center,
  Button,
  Pressable,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PROJECT_QUERY } from '@/lib/graphql/queries';
import { Project } from '@/types/api';

export default function ProjectChatScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useGlobalSearchParams<{ id: string }>();
  const router = useRouter();

  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [getProject, { data, loading, error }] = useLazyQuery<{ project: Project }>(
    PROJECT_QUERY,
    {
      fetchPolicy: 'network-only',
    }
  );

  useEffect(() => {
    if (projectId) {
      getProject({ variables: { id: projectId } });
    }
  }, [projectId]);

  const project = data?.project;

  if (!projectId) {
    return (
      <Center flex={1} bg={colorScheme === 'dark' ? 'gray.900' : 'white'} px={6}>
        <Icon as={Ionicons} name="alert-circle" size="4xl" color="orange.500" mb={4} />
        <Text color={colorScheme === 'dark' ? 'white' : 'gray.800'} fontSize="lg" fontWeight="bold" mb={2}>
          ID do projeto não encontrado
        </Text>
        <Button onPress={() => router.push('/(tabs)')} bg={colors.tint}>
          Voltar para Projetos
        </Button>
      </Center>
    );
  }

  if (loading) {
    return (
      <Center flex={1} bg={colorScheme === 'dark' ? 'gray.900' : 'white'}>
        <Spinner size="lg" color={colors.tint} />
        <Text mt={4} color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'}>
          Carregando projeto...
        </Text>
      </Center>
    );
  }

  if (error || !project) {
    return (
      <Center flex={1} bg={colorScheme === 'dark' ? 'gray.900' : 'white'} px={6}>
        <Icon as={Ionicons} name="alert-circle" size="4xl" color="red.500" mb={4} />
        <Text color={colorScheme === 'dark' ? 'white' : 'gray.800'} fontSize="lg" fontWeight="bold" mb={2}>
          Erro ao carregar projeto
        </Text>
        <Text color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'} textAlign="center" mb={2}>
          {error?.message || 'Projeto não encontrado'}
        </Text>
        {error?.graphQLErrors && error.graphQLErrors.length > 0 && (
          <Text color="red.400" fontSize="xs" textAlign="center" mb={4}>
            {error.graphQLErrors[0].message}
          </Text>
        )}
        <Button onPress={() => router.push('/(tabs)')} bg={colors.tint}>
          Voltar para Projetos
        </Button>
      </Center>
    );
  }

  return (
    <Box flex={1} safeArea bg={colorScheme === 'dark' ? 'gray.900' : 'white'}>
      <VStack space={2} px={6} pt={6} pb={4}>
        <HStack alignItems="center" justifyContent="space-between">
          <Heading size="lg" color={colorScheme === 'dark' ? 'white' : 'gray.800'}>
            {project.name}
          </Heading>
          <Pressable onPress={() => router.push('/(tabs)')}>
            <Icon
              as={Ionicons}
              name="close-circle-outline"
              size="lg"
              color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'}
            />
          </Pressable>
        </HStack>
        <Text color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'} fontSize="sm">
          Chat com IA sobre seus documentos
        </Text>
      </VStack>

      <Box flex={1} px={6}>
        <Center flex={1}>
          <Icon as={Ionicons} name="chatbubbles-outline" size="4xl" color={colorScheme === 'dark' ? 'gray.700' : 'gray.300'} mb={4} />
          <Text color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'} fontSize="lg" fontWeight="medium" mb={2}>
            Chat em breve
          </Text>
          <Text color={colorScheme === 'dark' ? 'gray.500' : 'gray.500'} fontSize="sm" textAlign="center" px={8}>
            Aqui você poderá conversar com a IA sobre o conteúdo dos seus documentos
          </Text>
        </Center>
      </Box>
    </Box>
  );
}
