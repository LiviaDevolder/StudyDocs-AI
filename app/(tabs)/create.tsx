import React, { useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from '@apollo/client';
import {
  Box,
  VStack,
  Heading,
  Text,
  FormControl,
  Input,
  Button,
  useToast,
  KeyboardAvoidingView as NBKeyboardAvoidingView,
} from 'native-base';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CREATE_PROJECT_MUTATION } from '@/lib/graphql/mutations';
import { CreateProjectInput, Project } from '@/types/api';

export default function CreateProjectScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const toast = useToast();

  const [projectName, setProjectName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createProject] = useMutation<
    { createProject: Project },
    { createProjectInput: CreateProjectInput }
  >(CREATE_PROJECT_MUTATION);

  const handleCreateProject = async () => {
    if (projectName.trim().length < 3) {
      toast.show({
        title: 'Nome muito curto',
        description: 'O nome do projeto deve ter pelo menos 3 caracteres.',
        placement: 'top',
      });
      return;
    }

    if (projectName.trim().length > 100) {
      toast.show({
        title: 'Nome muito longo',
        description: 'O nome do projeto deve ter no máximo 100 caracteres.',
        placement: 'top',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, errors } = await createProject({
        variables: {
          createProjectInput: {
            name: projectName.trim(),
          },
        },
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      if (data?.createProject) {
        const projectId = data.createProject.id;
        
        toast.show({
          title: 'Sucesso!',
          description: `Projeto "${data.createProject.name}" criado com sucesso.`,
          placement: 'top',
          duration: 2000,
        });

        setTimeout(() => {
          router.push(`/project/${projectId}/documents`);
        }, 500);
      }
    } catch (error: any) {
      toast.show({
        title: 'Erro ao criar projeto',
        description: error.message || 'Tente novamente mais tarde.',
        placement: 'top',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <NBKeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      flex={1}
      bg={colorScheme === 'dark' ? 'gray.900' : 'white'}
    >
      <Box flex={1} safeArea px={6} pt={8}>
        <VStack space={6} flex={1}>
          {/* Header */}
          <VStack space={2}>
            <Heading size="xl" color={colorScheme === 'dark' ? 'white' : 'gray.800'}>
              Criar Novo Projeto
            </Heading>
            <Text color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'} fontSize="md">
              Dê um nome ao seu projeto de estudos
            </Text>
          </VStack>

          {/* Formulário */}
          <VStack space={4} flex={1}>
            <FormControl isRequired isInvalid={projectName.length > 0 && projectName.length < 3}>
              <FormControl.Label>
                <Text color={colorScheme === 'dark' ? 'gray.300' : 'gray.700'} fontSize="md" fontWeight="medium">
                  Nome do Projeto
                </Text>
              </FormControl.Label>
              <Input
                size="lg"
                placeholder="Ex: Matemática - Cálculo I"
                value={projectName}
                onChangeText={setProjectName}
                maxLength={100}
                autoFocus
                bg={colorScheme === 'dark' ? 'gray.800' : 'gray.50'}
                borderColor={colorScheme === 'dark' ? 'gray.700' : 'gray.300'}
                color={colorScheme === 'dark' ? 'white' : 'gray.800'}
                placeholderTextColor={colorScheme === 'dark' ? 'gray.500' : 'gray.400'}
                _focus={{
                  borderColor: colors.tint,
                  bg: colorScheme === 'dark' ? 'gray.800' : 'white',
                }}
              />
              <FormControl.HelperText>
                <Text color={colorScheme === 'dark' ? 'gray.500' : 'gray.500'} fontSize="sm">
                  {projectName.length}/100 caracteres
                </Text>
              </FormControl.HelperText>
              {projectName.length > 0 && projectName.length < 3 && (
                <FormControl.ErrorMessage>
                  Mínimo de 3 caracteres
                </FormControl.ErrorMessage>
              )}
            </FormControl>

            {/* Botão Criar */}
            <Button
              size="lg"
              onPress={handleCreateProject}
              isLoading={isSubmitting}
              isDisabled={projectName.trim().length < 3 || isSubmitting}
              bg={colors.tint}
              _pressed={{
                bg: colors.tint,
                opacity: 0.8,
              }}
              _disabled={{
                bg: colorScheme === 'dark' ? 'gray.700' : 'gray.300',
                opacity: 0.5,
              }}
            >
              <Text color="white" fontSize="md" fontWeight="bold">
                Criar Projeto
              </Text>
            </Button>

            {/* Dica */}
            <Box
              bg={colorScheme === 'dark' ? 'gray.800' : 'blue.50'}
              p={4}
              borderRadius="lg"
              borderWidth={1}
              borderColor={colorScheme === 'dark' ? 'gray.700' : 'blue.200'}
            >
              <Text color={colorScheme === 'dark' ? 'gray.300' : 'gray.700'} fontSize="sm">
                💡 <Text fontWeight="medium">Dica:</Text> Escolha um nome descritivo que facilite a identificação do seu projeto.
              </Text>
            </Box>
          </VStack>
        </VStack>
      </Box>
    </NBKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Estilos adicionais se necessário
});
