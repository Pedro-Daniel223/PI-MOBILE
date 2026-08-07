import { get, post } from "./api";

const ENDPOINTS = {
  ingressos: "/api/ingressos/",
  preview: "/api/ingressos/preview/",
  checkout: "/api/ingressos/comprar/",
};

export const fetchIngressos = () => get(ENDPOINTS.ingressos);
export const previewIngressosCheckout = (payload, token) =>
  post(ENDPOINTS.preview, payload, token);
export const checkoutIngressos = (payload, token) =>
  post(ENDPOINTS.checkout, payload, token);

export default {
  fetchIngressos,
  previewIngressosCheckout,
  checkoutIngressos,
};
