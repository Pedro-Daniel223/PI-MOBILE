  // const DEFAULT_BASE_URL = 'http://10.44.236.2:8000'; // Substitua pelo seu endereço IP e porta do backend (do curso)
  const DEFAULT_BASE_URL = 'http://10.162.119.2:8000'; // IP atual da máquina local

  const BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_BASE_URL;
  console.log('[API] BASE_URL =', BASE_URL);

  const buildUrl = (path) => {
    if (!path) {
      return BASE_URL;
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const normalizedBaseUrl = BASE_URL.replace(/\/+$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${normalizedBaseUrl}${normalizedPath}`;
  };

  const collectErrorMessages = (value) => {
    if (!value) {
      return [];
    }

    if (typeof value === 'string') {
      return [value];
    }

    if (Array.isArray(value)) {
      return value.flatMap(collectErrorMessages);
    }

    if (typeof value === 'object') {
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
      const messages = collectErrorMessages(field).map((message) => message.trim()).filter(Boolean);
      if (messages.length > 0) {
        return messages.join(' ');
      }
    }

    const fallbackMessages = collectErrorMessages(payload).map((message) => message.trim()).filter(Boolean);
    return fallbackMessages.length > 0 ? fallbackMessages.join(' ') : fallback;
  };

  const parseResponse = async (response) => {
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
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
    console.log('[API] request start', { method, url, hasBody: typeof data !== 'undefined' });

    const response = await fetch(buildUrl(path), {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Token ${token}` } : {}),
        ...extraHeaders,
      },
      ...(typeof data !== 'undefined' ? { body: JSON.stringify(data) } : {}),
    });

    const payload = await parseResponse(response);
    console.log('[API] response', { method, url, status: response.status, ok: response.ok });

    if (!response.ok) {
      const fallbackMessage = response.statusText || `Erro HTTP ${response.status}`;
      console.log('[API] request error payload', payload);
      const error = new Error(normalizeErrorMessage(payload, fallbackMessage));
      error.status = response.status;
      error.payload = payload;
      throw error;
    }

    console.log('[API] request success', { method, url });
    return payload;
  };

  export const get = (path, token, headers) => request('GET', path, undefined, token, headers);

  export const post = (path, data, token, headers) => request('POST', path, data, token, headers);

  export const put = (path, data, token, headers) => request('PUT', path, data, token, headers);

  export const patch = (path, data, token, headers) => request('PATCH', path, data, token, headers);

  export const deleteRequest = (path, data, token, headers) => request('DELETE', path, data, token, headers);

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
