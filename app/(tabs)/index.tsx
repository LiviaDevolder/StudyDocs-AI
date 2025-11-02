import { useQuery } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import {
  Box,
  Center,
  HStack,
  Heading,
  Icon,
  Pressable,
  Spinner,
  Text,
  VStack,
} from 'native-base';
import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PROJECTS_QUERY } from '@/lib/graphql/queries';
import { Project } from '@/types/api';

export default function ProjectsScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  
  const { data, loading, error, refetch } = useQuery<{ projects: Project[] }>(
    PROJECTS_QUERY,
    {
      fetchPolicy: 'network-only',
    }
  );

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [refetch])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const projects = data?.projects || [];

  if (loading) {
    return (
      <Center flex={1} bg={colorScheme === 'dark' ? 'gray.900' : 'white'}>
        <Spinner size="lg" color={colors.tint} />
        <Text mt={4} color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'}>
          Carregando projetos...
        </Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center flex={1} bg={colorScheme === 'dark' ? 'gray.900' : 'white'} px={6}>
        <Icon as={Ionicons} name="alert-circle" size="4xl" color="red.500" mb={4} />
        <Text color={colorScheme === 'dark' ? 'white' : 'gray.800'} fontSize="lg" fontWeight="bold" mb={2}>
          Erro ao carregar projetos
        </Text>
        <Text color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'} textAlign="center">
          {error.message}
        </Text>
      </Center>
    );
  }

  const renderProjectItem = ({ item }: { item: Project }) => (
    <Pressable
      onPress={() => router.push(`/project/${item.id}/documents`)}
      mb={3}
      _pressed={{ opacity: 0.7 }}
    >
      <Box
        bg={colorScheme === 'dark' ? 'gray.800' : 'white'}
        borderWidth={1}
        borderColor={colorScheme === 'dark' ? 'gray.700' : 'gray.200'}
        borderRadius="lg"
        p={4}
        shadow={1}
      >
        <HStack alignItems="center" justifyContent="space-between">
          <HStack alignItems="center" flex={1} space={3}>
            <Box
              bg={colors.tint}
              p={2}
              borderRadius="md"
            >
              <Icon
                as={Ionicons}
                name="folder"
                size="md"
                color="white"
              />
            </Box>
            <VStack flex={1}>
              <Text
                color={colorScheme === 'dark' ? 'white' : 'gray.800'}
                fontSize="lg"
                fontWeight="600"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'}
                fontSize="sm"
              >
                Criado em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
              </Text>
            </VStack>
          </HStack>
          <Icon
            as={Ionicons}
            name="chevron-forward"
            size="sm"
            color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'}
          />
        </HStack>
      </Box>
    </Pressable>
  );

  return (
    <Box flex={1} safeArea bg={colorScheme === 'dark' ? 'gray.900' : 'white'}>
      <VStack space={4} px={6} pt={6} pb={4}>
        <Heading size="2xl" color={colorScheme === 'dark' ? 'white' : 'gray.800'}>
          Meus Projetos
        </Heading>
        <Text color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'} fontSize="lg">
          Olá, {user?.name || 'Usuário'}! 👋
        </Text>
      </VStack>

      {projects.length === 0 ? (
        <Center flex={1} px={8}>
          <Icon
            as={Ionicons}
            name="folder-open-outline"
            size="6xl"
            color={colorScheme === 'dark' ? 'gray.700' : 'gray.300'}
            mb={4}
          />
          <Text
            color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'}
            fontSize="xl"
            fontWeight="600"
            mb={2}
          >
            Nenhum projeto ainda
          </Text>
          <Text
            color={colorScheme === 'dark' ? 'gray.500' : 'gray.500'}
            fontSize="md"
            textAlign="center"
          >
            Clique no botão "+" abaixo para criar seu primeiro projeto
          </Text>
        </Center>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 24,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.tint}
              colors={[colors.tint]}
            />
          }
        />
      )}
    </Box>
  );
}