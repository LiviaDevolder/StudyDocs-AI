import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import {
  Actionsheet,
  AlertDialog,
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Icon,
  Pressable,
  Spinner,
  Text,
  VStack,
  useDisclose,
  useToast
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { REMOVE_DOCUMENT_MUTATION } from '@/lib/graphql/mutations';
import { DOCUMENTS_BY_PROJECT_QUERY, PROJECT_QUERY } from '@/lib/graphql/queries';
import { Document, Project } from '@/types/api';
import { openAddDocumentRef } from './_layout';

export default function ProjectDocumentsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const params = useGlobalSearchParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { isOpen: isActionOpen, onOpen: onActionOpen, onClose: onActionClose } = useDisclose();
  const cancelRef = React.useRef(null);

  useEffect(() => {
    openAddDocumentRef.current = onActionOpen;
    return () => {
      openAddDocumentRef.current = null;
    };
  }, [onActionOpen]);

  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [getProject, { data: projectData, loading: projectLoading, error: projectError }] = useLazyQuery<{ project: Project }>(
    PROJECT_QUERY,
    {
      fetchPolicy: 'network-only',
    }
  );

  const { data: docsData, loading: docsLoading, error: docsError, refetch: refetchDocs } = useQuery<{ documentsByProject: Document[] }>(
    DOCUMENTS_BY_PROJECT_QUERY,
    {
      variables: { projectId },
      skip: !projectId,
      fetchPolicy: 'network-only',
      pollInterval: 5000,
    }
  );

  const [removeDocument] = useMutation(REMOVE_DOCUMENT_MUTATION, {
    refetchQueries: [
      {
        query: DOCUMENTS_BY_PROJECT_QUERY,
        variables: { projectId },
      },
    ],
    awaitRefetchQueries: true,
  });

  const uploadDocumentToServer = async (file: { uri: string; name: string; type?: string }) => {
    try {
      const token = await AsyncStorage.getItem('@studydocs_token');
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }

      const apiUrl = process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:3000/graphql';

      const formData = new FormData();

      const operations = {
        query: `
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
        `,
        variables: {
          projectId,
          file: null,
        },
      };
      formData.append('operations', JSON.stringify(operations));

      // Map
      const map = {
        '0': ['variables.file'],
      };
      formData.append('map', JSON.stringify(map));

      console.log('📤 Preparando upload:', {
        fileName: file.name,
        fileType: file.type,
        fileUri: file.uri,
        isBlob: file.uri.startsWith('blob:')
      });

      if (file.uri.startsWith('blob:')) {
        const blobResponse = await fetch(file.uri);
        let blob = await blobResponse.blob();
        
        if (!blob.type && file.type) {
          blob = new Blob([blob], { type: file.type });
        }
        
        console.log('📦 Blob criado:', {
          size: blob.size,
          type: blob.type,
          name: file.name
        });
        
        formData.append('0', blob, file.name);
      } else {
        console.log('📱 Usando formato React Native nativo');
        formData.append('0', {
          uri: file.uri,
          name: file.name,
          type: file.type || 'application/octet-stream',
        } as any);
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('📥 Resposta HTTP:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const result = await response.json();
      
      console.log('📥 Resultado JSON:', result);

      if (!response.ok) {
        console.error('❌ Erro HTTP:', result);
        throw new Error(result.message || `Erro HTTP: ${response.status}`);
      }

      if (result.errors && result.errors.length > 0) {
        console.error('❌ Erro GraphQL:', result.errors);
        throw new Error(result.errors[0].message);
      }

      console.log('✅ Upload bem-sucedido:', result.data?.uploadDocument);
      return result.data?.uploadDocument;
    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      throw error;
    }
  };

  const getFileType = (fileName: string, mimeType?: string): string => {
    const extension = fileName.toLowerCase().split('.').pop() || '';
    
    const typeMap: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'txt': 'text/plain',
      'md': 'text/markdown',
      'markdown': 'text/markdown',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    };

    return typeMap[extension] || mimeType || 'application/octet-stream';
  };

  useEffect(() => {
    if (projectId) {
      getProject({ variables: { id: projectId } });
    }
  }, [projectId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchDocs();
    } finally {
      setRefreshing(false);
    }
  };

  const handlePickDocument = async () => {
    onActionClose();
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
          'text/plain',
          'text/markdown',
          'image/*',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      const fileType = getFileType(file.name, file.mimeType);
      
      const uploadedDoc = await uploadDocumentToServer({
        uri: file.uri,
        name: file.name,
        type: fileType,
      });

      if (uploadedDoc) {
        toast.show({
          title: 'Documento adicionado!',
          description: `"${file.name}" foi adicionado ao projeto.`,
          placement: 'top',
          duration: 2000,
        });
        refetchDocs();
      }
    } catch (error: any) {
      toast.show({
        title: 'Erro ao adicionar documento',
        description: error.message || 'Tente novamente mais tarde.',
        placement: 'top',
      });
    }
  };

  const handleTakePhoto = async () => {
    onActionClose();
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        toast.show({
          title: 'Permissão negada',
          description: 'Precisamos de acesso à câmera para tirar fotos.',
          placement: 'top',
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      const fileName = `photo_${Date.now()}.jpg`;
      
      const uploadedDoc = await uploadDocumentToServer({
        uri: file.uri,
        name: fileName,
        type: 'image/jpeg',
      });

      if (uploadedDoc) {
        toast.show({
          title: 'Foto adicionada!',
          description: 'A foto foi adicionada ao projeto.',
          placement: 'top',
          duration: 2000,
        });
        refetchDocs();
      }
    } catch (error: any) {
      toast.show({
        title: 'Erro ao tirar foto',
        description: error.message || 'Tente novamente mais tarde.',
        placement: 'top',
      });
    }
  };

  const handlePickFromGallery = async () => {
    onActionClose();
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        toast.show({
          title: 'Permissão negada',
          description: 'Precisamos de acesso à galeria para selecionar fotos.',
          placement: 'top',
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets[0];
      const fileName = file.fileName || `image_${Date.now()}.jpg`;
      const fileType = getFileType(fileName, file.mimeType);
      
      const uploadedDoc = await uploadDocumentToServer({
        uri: file.uri,
        name: fileName,
        type: fileType,
      });

      if (uploadedDoc) {
        toast.show({
          title: 'Imagem adicionada!',
          description: `"${fileName}" foi adicionada ao projeto.`,
          placement: 'top',
          duration: 2000,
        });
        refetchDocs();
      }
    } catch (error: any) {
      toast.show({
        title: 'Erro ao adicionar imagem',
        description: error.message || 'Tente novamente mais tarde.',
        placement: 'top',
      });
    }
  };

  const handleDeleteDocument = async () => {
    if (!deletingDocId) return;

    try {
      const { data, errors } = await removeDocument({
        variables: { id: deletingDocId },
      });

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      if (!data?.removeDocument) {
        throw new Error('Falha ao remover documento');
      }

      toast.show({
        title: 'Documento removido!',
        placement: 'top',
        duration: 2000,
      });
      
      await refetchDocs();
    } catch (error: any) {
      toast.show({
        title: 'Erro ao remover documento',
        description: error.message || 'Tente novamente mais tarde.',
        placement: 'top',
      });
    } finally {
      setIsDeleteOpen(false);
      setDeletingDocId(null);
    }
  };

  const project = projectData?.project;
  const documents = docsData?.documentsByProject || [];
  const loading = projectLoading || docsLoading;

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

  if (projectError || docsError || !project) {
    return (
      <Center flex={1} bg={colorScheme === 'dark' ? 'gray.900' : 'white'} px={6}>
        <Icon as={Ionicons} name="alert-circle" size="4xl" color="red.500" mb={4} />
        <Text color={colorScheme === 'dark' ? 'white' : 'gray.800'} fontSize="lg" fontWeight="bold" mb={2}>
          Erro ao carregar projeto
        </Text>
        <Text color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'} textAlign="center" mb={6}>
          {projectError?.message || docsError?.message || 'Projeto não encontrado'}
        </Text>
        <Button onPress={() => router.push('/(tabs)')} bg={colors.tint}>
          Voltar para Projetos
        </Button>
      </Center>
    );
  }

  const renderDocumentItem = ({ item }: { item: Document }) => {
    const isPending = item.status === 'PENDING';
    const iconBgColor = isPending ? 'yellow.500' : colors.tint;
    const iconName = isPending ? 'hourglass-outline' : 'document-text';
    
    return (
      <Box mb={3}>
        <Box
          bg={colorScheme === 'dark' ? 'gray.800' : 'white'}
          borderWidth={1}
          borderColor={isPending ? 'yellow.500' : (colorScheme === 'dark' ? 'gray.700' : 'gray.200')}
          borderRadius="lg"
          p={4}
          shadow={1}
        >
          <HStack alignItems="center" justifyContent="space-between">
            <HStack alignItems="center" flex={1} space={3}>
              <Box bg={iconBgColor} p={2} borderRadius="md">
                {isPending ? (
                  <Spinner size="sm" color="white" />
                ) : (
                  <Icon as={Ionicons} name={iconName} size="md" color="white" />
                )}
              </Box>
              <VStack flex={1}>
                <HStack alignItems="center" space={2}>
                  <Text
                    color={colorScheme === 'dark' ? 'white' : 'gray.800'}
                    fontSize="md"
                    fontWeight="600"
                    numberOfLines={1}
                    flex={1}
                  >
                    {item.name}
                  </Text>
                  {isPending && (
                    <Text
                      color="yellow.600"
                      fontSize="xs"
                      fontWeight="600"
                      bg="yellow.100"
                      px={2}
                      py={0.5}
                      borderRadius="md"
                    >
                      Processando
                    </Text>
                  )}
                </HStack>
                <Text
                  color={colorScheme === 'dark' ? 'gray.400' : 'gray.600'}
                  fontSize="xs"
                >
                  {new Date(item.uploadedAt).toLocaleDateString('pt-BR')}
                </Text>
              </VStack>
            </HStack>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="danger"
              leftIcon={<Icon as={Ionicons} name="trash-outline" />}
              onPress={() => {
                setDeletingDocId(item.id);
                setIsDeleteOpen(true);
              }}
            />
          </HStack>
        </Box>
      </Box>
    );
  };

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
      </VStack>

      {documents.length === 0 ? (
        <Center flex={1} px={8}>
          <Icon
            as={Ionicons}
            name="documents-outline"
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
            Nenhum documento ainda
          </Text>
          <Text
            color={colorScheme === 'dark' ? 'gray.500' : 'gray.500'}
            fontSize="md"
            textAlign="center"
          >
            Toque no botão + abaixo para adicionar documentos
          </Text>
        </Center>
      ) : (
        <FlatList
          data={documents}
          renderItem={renderDocumentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 100,
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

      <AlertDialog
        leastDestructiveRef={cancelRef}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
      >
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Remover Documento</AlertDialog.Header>
          <AlertDialog.Body>
            Tem certeza que deseja remover este documento? Esta ação não pode ser desfeita.
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                colorScheme="coolGray"
                onPress={() => setIsDeleteOpen(false)}
                ref={cancelRef}
              >
                Cancelar
              </Button>
              <Button 
                colorScheme="danger" 
                onPress={handleDeleteDocument}
              >
                Remover
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      <Actionsheet isOpen={isActionOpen} onClose={onActionClose}>
        <Actionsheet.Content>
          <Actionsheet.Item
            startIcon={<Icon as={Ionicons} name="document-attach" />}
            onPress={() => {
              onActionClose();
              handlePickDocument();
            }}
          >
            Escolher Arquivo
          </Actionsheet.Item>
          <Actionsheet.Item
            startIcon={<Icon as={Ionicons} name="camera" />}
            onPress={() => {
              onActionClose();
              handleTakePhoto();
            }}
          >
            Tirar Foto
          </Actionsheet.Item>
          <Actionsheet.Item
            startIcon={<Icon as={Ionicons} name="images" />}
            onPress={() => {
              onActionClose();
              handlePickFromGallery();
            }}
          >
            Escolher da Galeria
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
}
