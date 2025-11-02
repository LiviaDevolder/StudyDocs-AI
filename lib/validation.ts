export function validateEmail(email: string): string | null {
  if (!email) {
    return 'Email é obrigatório';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Email inválido';
  }
  
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Senha é obrigatória';
  }
  
  if (password.length < 8) {
    return 'A senha deve ter no mínimo 8 caracteres';
  }
  
  return null;
}

export function validateName(name: string): string | null {
  if (!name) {
    return 'Nome é obrigatório';
  }
  
  if (name.trim().length < 3) {
    return 'Nome deve ter no mínimo 3 caracteres';
  }
  
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return 'Confirmação de senha é obrigatória';
  }
  
  if (password !== confirmPassword) {
    return 'As senhas não conferem';
  }
  
  return null;
}
