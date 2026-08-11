const DEFAULT_BASE_URL = "https://projeto-futebol.onrender.com";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;

const REQUEST_TIMEOUT = 30000;

const buildUrl = (path) => {
  if (!path) {
    return BASE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedBaseUrl = BASE_URL.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
};

const collectErrorMessages = (value) => {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectErrorMessages);
  }

  if (typeof value === "object") {
    return Object.values(value).flatMap(collectErrorMessages);
  }

  return [];
};

const normalizeErrorMessage = (payload, fallback) => {
  if (!payload) {
    return fallback;
  }

  const knownFields = [
    payload.message,
    payload.detail,
    payload.error,
    payload.non_field_errors,
  ];

  for (const field of knownFields) {
    const messages = collectErrorMessages(field)
      .map((message) => message.trim())
      .filter(Boolean);
    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  const fallbackMessages = collectErrorMessages(payload)
    .map((message) => message.trim())
    .filter(Boolean);
  return fallbackMessages.length > 0 ? fallbackMessages.join(" ") : fallback;
};

const parseResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const request = async (method, path, data, token, extraHeaders = {}) => {
  const url = buildUrl(path);

  const isFormData =
    typeof FormData !== "undefined" && data instanceof FormData;
  const headers = {
    Accept: "application/json",
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...extraHeaders,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const body = isFormData ? data : JSON.stringify(data);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(buildUrl(path), {
      method,
      headers,
      ...(typeof data !== "undefined" ? { body } : {}),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const payload = await parseResponse(response);

    if (!response.ok) {
      const fallbackMessage =
        response.statusText || `Erro HTTP ${response.status}`;
      const error = new Error(normalizeErrorMessage(payload, fallbackMessage));
      error.status = response.status;
      throw error;
    }

    return payload;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      const timeoutError = new Error('A requisição demorou muito tempo. Tente novamente.');
      timeoutError.status = 0;
      throw timeoutError;
    }
    throw error;
  }
};

export const get = (path, token, headers) =>
  request("GET", path, undefined, token, headers);

export const post = (path, data, token, headers) =>
  request("POST", path, data, token, headers);

export const put = (path, data, token, headers) =>
  request("PUT", path, data, token, headers);

export const patch = (path, data, token, headers) =>
  request("PATCH", path, data, token, headers);

export const deleteRequest = (path, data, token, headers) =>
  request("DELETE", path, data, token, headers);

export { deleteRequest as delete };

export default {
  get,
  post,
  put,
  patch,
  delete: deleteRequest,
  request,
  BASE_URL,
};
