import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import {
  cadastro,
  login,
  logout,
  meuPerfil,
  atualizarMeuPerfil,
} from "../services/authService";

const AUTH_TOKEN_KEY = "auth_token";
export const DEMO_LOGIN_ENABLED = true;

const AuthContext = createContext(null);

const createDemoCliente = (nome) => {
  const normalizedName = String(nome ?? "")
    .trim()
    .replace(/\s+/g, " ");
  const [primeiroNome = "Visitante", ...resto] = normalizedName.split(" ");

  return {
    nome_clientes: primeiroNome || "Visitante",
    sobrenome_clientes: resto.join(" "),
    email: "",
    telefone: "",
    sexo: "",
    rua: "",
    casa_numero: "",
    bairro: "",
    cep: "",
    complemento: "",
    cpf: "",
    id_clientes: "demo-local",
    categoria_clientes: "",
    url_foto_clientes: "",
    demo_mode: true,
    nome_completo: normalizedName || "Visitante",
  };
};

const extractToken = (payload) => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const possibleTokens = [
    payload.token,
    payload.accessToken,
    payload.access_token,
    payload.authToken,
    payload.auth_token,
    payload.data?.token,
    payload.data?.accessToken,
    payload.data?.access_token,
    payload.result?.token,
    payload.result?.accessToken,
  ];

  return (
    possibleTokens.find((value) => typeof value === "string" && value.trim()) ||
    null
  );
};

const extractCliente = (payload) => {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const possibleCliente = [
    payload.cliente,
    payload.user,
    payload.usuario,
    payload.profile,
    payload.data?.cliente,
    payload.data?.user,
    payload.data?.usuario,
    payload.data?.profile,
    payload.result?.cliente,
    payload.result?.user,
    payload.result?.usuario,
    payload.result?.profile,
  ];

  return possibleCliente.find(Boolean) || null;
};

const PROFILE_KEYS = [
  "url_foto_clientes",
  "nome_clientes",
  "sobrenome_clientes",
  "email",
  "telefone",
  "sexo",
  "rua",
  "casa_numero",
  "bairro",
  "cep",
  "complemento",
  "cpf",
  "id_clientes",
  "categoria_clientes",
];

const isProfileLikeObject = (payload) => {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return PROFILE_KEYS.some((key) =>
    Object.prototype.hasOwnProperty.call(payload, key),
  );
};

const isTokenError = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("401") ||
    message.includes("unauthorized") ||
    message.includes("token") ||
    message.includes("credencial") ||
    message.includes("autent")
  );
};

export function AuthProvider({ children }) {
  const [cliente, setCliente] = useState(null);
  const [token, setToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const authRequestRef = useRef(0);

  const mergeCliente = useCallback((baseCliente, updates) => {
    if (baseCliente && updates) {
      return { ...baseCliente, ...updates };
    }

    return baseCliente || updates || null;
  }, []);

  const clearAuthState = useCallback(async (shouldRemoveStoredToken = true) => {
    setCliente(null);
    setToken(null);
    setAuthenticated(false);
    setDemoMode(false);

    if (shouldRemoveStoredToken) {
      try {
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      } catch {
        // Ignora falhas de limpeza local para nao travar o fluxo.
      }
    }
  }, []);

  const persistToken = useCallback(
    async (nextToken) => {
      if (!nextToken) {
        return null;
      }

      setToken(nextToken);
      setDemoMode(false);

      try {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, nextToken);
      } catch (error) {
        await clearAuthState(false);
        throw error;
      }

      return nextToken;
    },
    [clearAuthState],
  );

  const applySession = useCallback((nextCliente, nextToken, options = {}) => {
    if (nextCliente) {
      setCliente(nextCliente);
    }

    setDemoMode(Boolean(options?.demoMode));

    if (nextToken) {
      setToken(nextToken);
      setAuthenticated(true);
    } else if (nextCliente) {
      setAuthenticated(true);
    }
  }, []);

  const loadUser = useCallback(
    async (providedToken) => {
      const requestId = ++authRequestRef.current;
      setLoading(true);

      try {
        const storedToken =
          providedToken || (await SecureStore.getItemAsync(AUTH_TOKEN_KEY));

        if (requestId !== authRequestRef.current) {
          return null;
        }

        if (!storedToken) {
          return null;
        }

        setToken(storedToken);

        const response = await meuPerfil(storedToken);
        if (requestId !== authRequestRef.current) {
          return null;
        }

        const nextCliente =
          extractCliente(response) ||
          (isProfileLikeObject(response) ? response : null) ||
          null;

        setCliente(nextCliente);
        setAuthenticated(true);

        return response;
      } catch (error) {
        if (requestId !== authRequestRef.current) {
          return null;
        }

        await clearAuthState(true);

        if (!isTokenError(error)) {
          throw error;
        }

        return null;
      } finally {
        if (requestId === authRequestRef.current) {
          setLoading(false);
        }
      }
    },
    [clearAuthState],
  );

  const updateCliente = useCallback(
    async (updates = {}) => {
      const requestId = ++authRequestRef.current;
      const currentToken =
        token || (await SecureStore.getItemAsync(AUTH_TOKEN_KEY));
      const payload = Object.fromEntries(
        Object.entries(updates).filter(
          ([, value]) => typeof value !== "undefined",
        ),
      );

      if (Object.keys(payload).length === 0) {
        return cliente;
      }

      if (demoMode || !currentToken) {
        const nextCliente = mergeCliente(cliente, payload);
        setCliente(nextCliente);
        setAuthenticated(true);
        setDemoMode(Boolean(demoMode || !currentToken));
        return nextCliente;
      }

      const response = await atualizarMeuPerfil(payload, currentToken);

      if (requestId !== authRequestRef.current) {
        return null;
      }

      const nextCliente =
        extractCliente(response) ||
        (isProfileLikeObject(response) ? response : null) ||
        mergeCliente(cliente, payload);
      setCliente(nextCliente);
      setAuthenticated(true);

      return nextCliente;
    },
    [cliente, demoMode, mergeCliente, token],
  );

  const signIn = useCallback(
    async (email, senha) => {
      const requestId = ++authRequestRef.current;
      setLoading(true);

      try {
        const response = await login({ email, senha });
        if (requestId !== authRequestRef.current) {
          return response;
        }

        const nextToken = extractToken(response);
        const nextCliente = extractCliente(response);

        if (nextToken) {
          await persistToken(nextToken);
        }

        if (nextCliente) {
          applySession(nextCliente, nextToken);
        }

        if (!nextCliente && nextToken) {
          await loadUser(nextToken);
        }

        if (!nextToken && !nextCliente) {
          setAuthenticated(false);
        }

        return response;
      } catch (error) {
        if (requestId === authRequestRef.current) {
          await clearAuthState(true);
        }
        throw error;
      } finally {
        if (requestId === authRequestRef.current) {
          setLoading(false);
        }
      }
    },
    [applySession, clearAuthState, loadUser, persistToken],
  );

  const signInDemo = useCallback(
    async (nome, senha) => {
      const requestId = ++authRequestRef.current;
      setLoading(true);

      try {
        if (!DEMO_LOGIN_ENABLED) {
          throw new Error("O modo DEMO esta desativado.");
        }

        if (String(senha ?? "") !== "1234") {
          throw new Error("Senha de demonstracao invalida.");
        }

        const trimmedName = String(nome ?? "").trim();
        if (!trimmedName) {
          throw new Error("Informe um nome para continuar.");
        }

        if (requestId !== authRequestRef.current) {
          return null;
        }

        const nextCliente = createDemoCliente(trimmedName);
        applySession(nextCliente, null, { demoMode: true });
        return nextCliente;
      } catch (error) {
        if (requestId === authRequestRef.current) {
          await clearAuthState(true);
        }
        throw error;
      } finally {
        if (requestId === authRequestRef.current) {
          setLoading(false);
        }
      }
    },
    [applySession, clearAuthState],
  );

  const signUp = useCallback(
    async (dadosCadastro) => {
      const requestId = ++authRequestRef.current;
      setLoading(true);

      try {
        const response = await cadastro(dadosCadastro);
        if (requestId !== authRequestRef.current) {
          return response;
        }

        const nextToken = extractToken(response);
        const nextCliente = extractCliente(response);

        if (nextToken) {
          await persistToken(nextToken);
        }

        if (nextCliente) {
          applySession(nextCliente, nextToken);
        }

        if (!nextCliente && nextToken) {
          await loadUser(nextToken);
        }

        return response;
      } catch (error) {
        if (requestId === authRequestRef.current) {
          await clearAuthState(true);
        }
        throw error;
      } finally {
        if (requestId === authRequestRef.current) {
          setLoading(false);
        }
      }
    },
    [applySession, clearAuthState, loadUser, persistToken],
  );

  const signOut = useCallback(async () => {
    authRequestRef.current += 1;
    setLoading(true);

    try {
      const currentToken =
        token || (await SecureStore.getItemAsync(AUTH_TOKEN_KEY));

      if (currentToken) {
        await logout(currentToken);
      }
    } catch (error) {
      // Mantem o logout local mesmo se o backend falhar.
      await clearAuthState(true);
      throw error;
    } finally {
      await clearAuthState(true);
      setLoading(false);
    }
  }, [clearAuthState, token]);

  useEffect(() => {
    loadUser().catch(() => {
      // O load inicial ja limpa estado e SecureStore quando necessario.
    });
  }, [loadUser]);

  const value = {
    cliente,
    token,
    authenticated,
    demoMode,
    demoLoginEnabled: DEMO_LOGIN_ENABLED,
    loading,
    signIn,
    signInDemo,
    signUp,
    signOut,
    loadUser,
    updateCliente,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
