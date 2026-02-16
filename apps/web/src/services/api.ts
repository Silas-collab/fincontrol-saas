import axios from 'axios';

// Detecta se está rodando no Docker (produção) ou desenvolvimento local
const isDocker = window.location.hostname !== 'localhost' || window.location.port === '80';

// Em produção/Docker, usa caminho relativo para o nginx fazer proxy
// Em desenvolvimento local, usa localhost:3001
const API_URL = isDocker
  ? '/api'
  : ((import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  const workspaceId = localStorage.getItem('workspaceId');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (workspaceId) {
    config.headers['x-workspace-id'] = workspaceId;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extrai mensagem de erro do backend
    const backendError = error.response?.data?.error;
    const status = error.response?.status;
    
    // Cria um novo Error com a mensagem do backend ou mensagem padrão
    const errorMessage = backendError || error.message || 'Erro na requisição';
    const customError = new Error(errorMessage);
    
    // Adiciona propriedades do erro original
    (customError as any).status = status;
    (customError as any).response = error.response;
    (customError as any).isBackendError = !!backendError;
    
    // Se for 401, faz logout
    if (status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('workspaceId');
      window.location.href = '/login';
    }
    
    return Promise.reject(customError);
  }
);

export default api;
