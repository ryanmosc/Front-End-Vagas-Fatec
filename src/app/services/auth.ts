import { jwtDecode } from 'jwt-decode';
import { User, UserRole } from '../types';

interface JWTPayload {
  sub: string; // id do usuário
  email: string;
  role: string;
  exp: number;
}

export const authService = {
  // Salvar token no localStorage
  setToken(token: string): void {
    localStorage.setItem('token', token);
  },

  // Obter token do localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // Remover token e dados do usuário
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Verificar se usuário está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch {
      return false;
    }
  },

  // Obter dados do usuário do token
  getUserFromToken(): User | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      return {
        id: parseInt(decoded.sub),
        email: decoded.email,
        role: decoded.role as UserRole,
      };
    } catch {
      return null;
    }
  },

  // Verificar se usuário tem uma role específica
  hasRole(role: UserRole): boolean {
    const user = this.getUserFromToken();
    return user?.role === role;
  },

  // Obter role do usuário
  getUserRole(): UserRole | null {
    const user = this.getUserFromToken();
    return user?.role || null;
  },
};
