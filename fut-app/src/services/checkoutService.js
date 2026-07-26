import { post } from './api';

const ENDPOINTS = {
  checkout: '/api/checkout/',
};

export const checkout = (payload, token) => post(ENDPOINTS.checkout, payload, token);

export default {
  checkout,
};
