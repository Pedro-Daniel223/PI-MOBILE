import { get, post } from './api';

const ENDPOINTS = {
  planos: '/api/planos/',
  minhaAssinatura: '/api/minha-assinatura/',
  assinarPlano: '/api/assinar-plano/',
};

export const getPlanos = (token) => get(ENDPOINTS.planos, token);
export const getMinhaAssinatura = (token) => get(ENDPOINTS.minhaAssinatura, token);

export const assinarPlano = (planoId, token) =>
  post(ENDPOINTS.assinarPlano, { plano_id: planoId }, token);

export default {
  getPlanos,
  getMinhaAssinatura,
  assinarPlano,
};
