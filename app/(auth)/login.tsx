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
import { validateEmail, validatePassword } from '@/lib/validation';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const toast = useToast();
  const { signIn } = useAuth();

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (emailValidation) {
      setEmailError(emailValidation);
    }

    if (passwordValidation) {
      setPasswordError(passwordValidation);
    }

    if (emailValidation || passwordValidation) {
      return;
    }

    setIsLoading(true);
    try {
      await signIn({ email, password });
      
      toast.show({
        title: 'Login realizado com sucesso!',
        description: 'Bem-vindo de volta!',
        status: 'success',
        duration: 2000,
        placement: 'top',
      });
      
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
    } catch (error: any) {
      console.error('Erro no login:', error);
      
      const errorMessage = error?.message || 'Erro ao fazer login. Verifique suas credenciais.';
      
      toast.show({
        title: 'Erro ao fazer login',
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
            <Logo size="large" />
            <ThemedText style={styles.subtitle}>
              Converse com seus documentos usando IA
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.form}>
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
              placeholder="Sua senha"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry
              error={passwordError}
              editable={!isLoading}
            />

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={styles.button}
            />

            <TextLink onPress={() => router.push('/(auth)/register')}>
              Ainda não tem conta? Cadastre-se
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
    minHeight: 600,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 16,
  },
  form: {
    gap: 20,
  },
  button: {
    marginTop: 8,
  },
});
