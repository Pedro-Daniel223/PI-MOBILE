import { post } from './api';

const ENDPOINTS = {
  checkout: '/api/checkout/',
  preview: '/api/checkout-preview/',
};

export const checkout = (payload, token) => post(ENDPOINTS.checkout, payload, token);
export const previewCheckout = (payload, token) => post(ENDPOINTS.preview, payload, token);

export default {
  checkout,
  previewCheckout,
};
