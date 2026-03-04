// Serviço de API com interceptor para JWT
const API_BASE_URL = 'http://localhost:8080/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiService {
  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  }

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = false, headers, ...restOptions } = options;

    const config: RequestInit = {
      ...restOptions,
      headers: requiresAuth
        ? this.getAuthHeader()
        : { 'Content-Type': 'application/json', ...headers },
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      // Tratamento de erros HTTP
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token inválido ou expirado
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Sessão expirada. Faça login novamente.');
        }

        // Tentar obter mensagem de erro do backend
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.message || errorData.error || 'Erro na requisição';
        throw new Error(errorMessage);
      }

      // Se não há conteúdo, retornar null
      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão com o servidor');
    }
  }

  // Métodos HTTP
  get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', requiresAuth });
  }

  post<T>(endpoint: string, data?: any, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  patch<T>(endpoint: string, data?: any, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    });
  }

  put<T>(endpoint: string, data?: any, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth,
    });
  }

  delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', requiresAuth });
  }

  // Upload de arquivo (currículo)
  async uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = 'curriculo'
  ): Promise<T> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Sessão expirada. Faça login novamente.');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao fazer upload');
      }

      if (response.status === 204) {
        return null as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao fazer upload do arquivo');
    }
  }

  // Download de arquivo (currículo)
  async downloadFile(endpoint: string): Promise<Blob> {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          throw new Error('Sessão expirada. Faça login novamente.');
        }

        throw new Error('Erro ao baixar arquivo');
      }

      return await response.blob();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao baixar arquivo');
    }
  }
}

export const api = new ApiService();
