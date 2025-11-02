import { useState } from 'react';
import { 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useToast } from 'native-base';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { TextLink } from '@/components/ui/text-link';
import { useAuth } from '@/contexts/auth-context';
import { 
  validateEmail, 
  validatePassword, 
  validateName,
  validateConfirmPassword 
} from '@/lib/validation';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const toast = useToast();
  const { signUp } = useAuth();

  const handleRegister = async () => {
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);

    if (nameValidation) setNameError(nameValidation);
    if (emailValidation) setEmailError(emailValidation);
    if (passwordValidation) setPasswordError(passwordValidation);
    if (confirmPasswordValidation) setConfirmPasswordError(confirmPasswordValidation);

    if (nameValidation || emailValidation || passwordValidation || confirmPasswordValidation) {
      return;
    }

    setIsLoading(true);
    try {
      await signUp({ name, email, password });
      
      toast.show({
        title: 'Conta criada com sucesso!',
        description: `Bem-vindo, ${name}!`,
        status: 'success',
        duration: 3000,
        placement: 'top',
      });
      
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
    } catch (error: any) {
      console.error('Erro no registro:', error);
      
      const errorMessage = error?.message || 'Erro ao criar conta. Tente novamente.';
      
      toast.show({
        title: 'Erro ao criar conta',
        description: errorMessage,
        status: 'error',
        duration: 4000,
        placement: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedView style={styles.content}>
          <ThemedView style={styles.header}>
            <Logo size="medium" />
            <ThemedText type="title" style={styles.title}>
              Criar Conta
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Comece a conversar com seus documentos
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.form}>
            <Input
              label="Nome completo"
              placeholder="Seu nome"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setNameError('');
              }}
              error={nameError}
              editable={!isLoading}
            />

            <Input
              label="Email"
              placeholder="seu@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              error={emailError}
              editable={!isLoading}
            />

            <Input
              label="Senha"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry
              error={passwordError}
              editable={!isLoading}
            />

            <Input
              label="Confirmar senha"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError('');
              }}
              secureTextEntry
              error={confirmPasswordError}
              editable={!isLoading}
            />

            <Button
              title="Criar conta"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              style={styles.button}
            />

            <TextLink onPress={() => router.back()}>
              Já tem conta? Faça login
            </TextLink>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    minHeight: 700,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  button: {
    marginTop: 8,
  },
});
