import { get, post } from './api';

const ENDPOINTS = {
  login: '/api/login/',
  cadastro: '/api/cadastro/',
  logout: '/api/logout/',
  esqueciSenha: '/api/esqueci-senha/',
  validarCodigo: '/api/validar-codigo/',
  redefinirSenha: '/api/redefinir-senha/',
  meuPerfil: '/api/meu-perfil/',
};

export const login = (dados) => post(ENDPOINTS.login, dados);

export const cadastro = (dados) => post(ENDPOINTS.cadastro, dados);

export const logout = (token) => post(ENDPOINTS.logout, undefined, token);

export const esqueciSenha = (dados) => post(ENDPOINTS.esqueciSenha, dados);

export const validarCodigo = (dados) => post(ENDPOINTS.validarCodigo, dados);

export const redefinirSenha = (dados) => post(ENDPOINTS.redefinirSenha, dados);

export const meuPerfil = (token) => get(ENDPOINTS.meuPerfil, token);

export default {
  login,
  cadastro,
  logout,
  esqueciSenha,
  validarCodigo,
  redefinirSenha,
  meuPerfil,
};
