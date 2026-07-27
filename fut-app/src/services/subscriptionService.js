import { get, post } from './api';

const ENDPOINTS = {
  minhaAssinatura: '/api/minha-assinatura/',
  assinarPlano: '/api/assinar-plano/',
};

export const getMinhaAssinatura = (token) => get(ENDPOINTS.minhaAssinatura, token);

export const assinarPlano = (planoId, token) =>
  post(ENDPOINTS.assinarPlano, { plano_id: planoId }, token);

export default {
  getMinhaAssinatura,
  assinarPlano,
};
