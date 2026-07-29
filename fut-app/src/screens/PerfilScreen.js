import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import { styleSocioModal } from "../styles/styleSocios/styleSociosModal";
import { escudoDrakos, user as defaultUser } from "../data/dataPerfil";
import { fetchPurchaseHistory } from "../services/purchaseService";
import { getMinhaAssinatura } from "../services/subscriptionService";

import { useSubscription } from "../contexts/SubscriptionContext";
import { useAuth } from "../contexts/AuthContext";

const DEFAULT_AVATAR = defaultUser.avatar;
const EDITABLE_PROFILE_FIELDS = [
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
];

const trimValue = (value) => {
  if (value === null || typeof value === "undefined") {
    return "";
  }

  return String(value).trim();
};

const buildProfileSnapshot = (cliente = {}) => ({
  url_foto_clientes: trimValue(cliente.url_foto_clientes),
  nome_clientes: trimValue(cliente.nome_clientes),
  sobrenome_clientes: trimValue(cliente.sobrenome_clientes),
  email: trimValue(cliente.email || cliente.email_clientes),
  telefone: trimValue(
    cliente.telefone || cliente.telefone_clientes || cliente.phone,
  ),
  sexo: trimValue(cliente.sexo),
  rua: trimValue(cliente.rua),
  casa_numero: trimValue(cliente.casa_numero),
  bairro: trimValue(cliente.bairro),
  cep: trimValue(cliente.cep),
  complemento: trimValue(cliente.complemento),
  cpf: trimValue(cliente.cpf),
  id_clientes: trimValue(
    cliente.id_clientes || cliente.id || cliente.cliente_id,
  ),
  categoria_clientes: trimValue(
    cliente.categoria_clientes || cliente.categoria || cliente.tipo_cliente,
  ),
});

const buildDisplayName = (cliente = {}) => {
  const name = [cliente.nome_clientes, cliente.sobrenome_clientes]
    .map(trimValue)
    .filter(Boolean)
    .join(" ")
    .trim();

  return name || "UsuÃ¡rio";
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HELPERS â€” MÃ¡scaras e validaÃ§Ã£o (apenas apresentaÃ§Ã£o/entrada, nÃ£o afeta payload)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const onlyDigits = (value) => String(value ?? "").replace(/\D/g, "");

const formatPhoneBR = (value) => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const formatCEP = (value) => {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimValue(value));

const normalizeSexo = (value) => {
  const v = trimValue(value).toLowerCase();
  if (["m", "masculino", "male"].includes(v)) return "Masculino";
  if (["f", "feminino", "female"].includes(v)) return "Feminino";
  return "";
};

const SEXO_OPTIONS = [
  { value: "Masculino", label: "Masculino", icon: "male" },
  { value: "Feminino", label: "Feminino", icon: "female" },
];

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// HELPER â€” Identidade visual do plano de sÃ³cio (apenas apresentaÃ§Ã£o)
// Deriva emoji/label/cores a partir de subscription.tier (API) + title/price
// jÃ¡ existentes no objeto subscription. NÃ£o introduz novos campos de dados,
// nÃ£o cria estado, nÃ£o toca em contexts. Paleta 100% crimson/neutra â€” sem
// dourado â€” para manter consistÃªncia com o resto do app.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TIER_META = {
  diamante: {
    emoji: "ðŸ‘‘",
    label: "Sócio Diamante",
    accent: "#ffffff",
    cardColors: ["#2c2c2e", "#161616", "#0a0a0a"],
    borderColor: "rgba(255,255,255,0.30)",
    glowColor: "rgba(255,255,255,0.12)",
    textColor: "#ffffff",
  },
  ouro: {
    emoji: "💛",
    label: "Sócio Ouro",
    accent: "#ff3b30",
    cardColors: ["#3a0006", "#1c0002", "#0a0a0a"],
    borderColor: "rgba(232,0,15,0.42)",
    glowColor: "rgba(232,0,15,0.20)",
    textColor: "#ffece9",
  },
  prata: {
    emoji: "💍",
    label: "Sócio Prata",
    accent: "#c7c9cc",
    cardColors: ["#2a2a2c", "#18181a", "#0a0a0a"],
    borderColor: "rgba(199,201,204,0.32)",
    glowColor: "rgba(199,201,204,0.14)",
    textColor: "#f0f0f2",
  },
};

const DEFAULT_TIER_META = {
  emoji: "",
  label: null,
  accent: "#e8000f",
  cardColors: ["#3a0006", "#1c0002", "#0a0a0a"],
  borderColor: "rgba(232,0,15,0.42)",
  glowColor: "rgba(232,0,15,0.20)",
  textColor: "#ffece9",
};

const getPlanIdentity = (subscription) => {
  if (!subscription) {
    return {
      isSocio: false,
      emoji: null,
      label: "Ainda não é Sócio Drakos",
      sublabel: "Torne-se Sócio Drakos",
      title: null,
      price: null,
<<<<<<< HEAD
      colors: ["rgba(255,255,255,0.14)", "rgba(255,255,255,0.05)"],
      cardColors: ["rgba(255,255,255,0.14)", "rgba(255,255,255,0.05)"],
      borderColor: "rgba(255,255,255,0.18)",
      glowColor: "rgba(255,255,255,0.08)",
      accent: "#e8000f",
      textColor: "#ffffff",
=======
      accent: "rgba(255,255,255,0.55)",
      cardColors: ["rgba(255,255,255,0.07)", "rgba(255,255,255,0.02)"],
      borderColor: "rgba(255,255,255,0.14)",
      glowColor: "rgba(255,255,255,0.05)",
      textColor: "rgba(255,255,255,0.75)",
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
    };
  }

  const tierKey = String(subscription.tier || "").trim().toLowerCase();
  const meta = TIER_META[tierKey] || DEFAULT_TIER_META;

  return {
    isSocio: true,
    emoji: meta.emoji,
    label: meta.label || subscription.title || "Sócio Drakos",
    sublabel: subscription.title || null,
    title: subscription.title || null,
    price: subscription.price || null,
<<<<<<< HEAD
    colors: meta.colors,
    cardColors: meta.colors,
=======
    accent: meta.accent,
    cardColors: meta.cardColors,
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
    borderColor: meta.borderColor,
    glowColor: meta.glowColor,
    accent: meta.colors?.[1] || meta.colors?.[0] || "#e8000f",
    textColor: meta.textColor,
  };
};

<<<<<<< HEAD
const normalizeAssinaturaResponse = (payload, fallbackPlan = null) => {
  if (!payload) {
    return null;
  }

  const plano =
    payload.plano ||
    payload.plan ||
    payload.categoria_plano ||
    payload.categoria ||
    fallbackPlan ||
    null;

  const planoId =
    payload.plano_id ?? payload.id_plano ?? plano?.id ?? fallbackPlan?.id ?? null;
  const titulo =
    payload.title ||
    payload.nome ||
    payload.nome_plano ||
    plano?.title ||
    fallbackPlan?.title ||
    null;
  const preco =
    payload.price ||
    payload.valor ||
    payload.preco ||
    plano?.price ||
    fallbackPlan?.price ||
    null;

  return {
    ...payload,
    plano_id: planoId,
    id: payload.id ?? planoId,
    title: titulo,
    nome: titulo,
    nome_plano: titulo,
    price: preco,
    valor: preco,
    plano,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMPONENTES DO POPUP "EDITAR PERFIL" — apenas UI, sem lógica de negócio
// ─────────────────────────────────────────────────────────────────────────────
=======
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SUBCOMPONENTES DO POPUP "EDITAR PERFIL" â€” apenas UI, sem lÃ³gica de negÃ³cio
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
const formatHistoryDate = (value) => {
  if (!value) {
    return "";
  }

  try {
    return new Date(value).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return String(value);
  }
};

const buildPurchaseSummary = (item = {}) => {
  const parts = [];

  if (item.size) {
    parts.push(`Tam. ${item.size}`);
  }

  if (typeof item.quantity === "number" && Number.isFinite(item.quantity)) {
    parts.push(`Qtd. ${String(item.quantity).padStart(2, "0")}`);
  }

  if (item.status) {
    parts.push(item.status);
  }

  const baseDate = formatHistoryDate(item.date);
  return parts.length > 0 ? `${baseDate} â€¢ ${parts.join(" â€¢ ")}` : baseDate;
};

const GlassField = React.memo(function GlassField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  maxLength,
  autoCapitalize = "sentences",
  showValidation = false,
  isValid = null,
  returnKeyType = "next",
  onSubmitEditing,
  blurOnSubmit = false,
  inputRef,
}) {
  const invalid = showValidation && isValid === false;
  const valid = showValidation && isValid === true;

  return (
    <View style={editStyles.fieldWrap}>
      <Text style={editStyles.fieldLabel}>{label}</Text>
      <View
        style={[
          editStyles.inputShell,
          invalid && editStyles.inputShellError,
          valid && editStyles.inputShellValid,
        ]}
      >
        <BlurView intensity={26} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={["rgba(255,255,255,0.07)", "rgba(255,255,255,0.02)"]}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons
          name={icon}
          size={16}
          color="rgba(255,255,255,0.55)"
          style={editStyles.fieldIcon}
        />
        <TextInput
          ref={inputRef}
          style={editStyles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.32)"
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={blurOnSubmit}
        />
        {valid && (
          <Ionicons
            name="checkmark-circle"
            size={15}
            color="#4ee08a"
            style={editStyles.validIcon}
          />
        )}
        {invalid && (
          <Ionicons
            name="alert-circle"
            size={15}
            color="#ff6b6b"
            style={editStyles.validIcon}
          />
        )}
      </View>
    </View>
  );
});

const ReadOnlyField = React.memo(function ReadOnlyField({
  label,
  icon,
  value,
}) {
  return (
    <View style={editStyles.fieldWrap}>
      <Text style={editStyles.fieldLabel}>{label}</Text>
      <View style={[editStyles.inputShell, editStyles.inputShellReadOnly]}>
        <BlurView intensity={14} tint="dark" style={StyleSheet.absoluteFill} />
        <Ionicons
          name={icon}
          size={16}
          color="rgba(255,255,255,0.32)"
          style={editStyles.fieldIcon}
        />
        <Text style={editStyles.readOnlyText} numberOfLines={1}>
          {value || "NÃ£o informado"}
        </Text>
        <Ionicons
          name="lock-closed"
          size={13}
          color="rgba(255,255,255,0.28)"
          style={editStyles.validIcon}
        />
      </View>
    </View>
  );
});

const SexoSelector = React.memo(function SexoSelector({ value, onChange }) {
  const selectedValue = normalizeSexo(value);

  return (
    <View style={editStyles.fieldWrap}>
      <Text style={editStyles.fieldLabel}>Sexo</Text>
      <View style={editStyles.sexoRow}>
        {SEXO_OPTIONS.map((opt) => {
          const selected = selectedValue === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              style={[
                editStyles.sexoOption,
                selected && editStyles.sexoOptionSelected,
              ]}
              activeOpacity={0.85}
              onPress={() => onChange(opt.value)}
            >
              {selected && (
                <LinearGradient
                  colors={["rgba(232,0,15,0.55)", "rgba(163,0,10,0.35)"]}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Ionicons
                name={opt.icon}
                size={16}
                color={selected ? "#ffffff" : "rgba(255,255,255,0.55)"}
              />
              <Text
                style={[
                  editStyles.sexoOptionText,
                  selected && editStyles.sexoOptionTextSelected,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

export default function PerfilScreen({ navigation }) {
  const [editingField, setEditingField] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { subscription, setSubscription } = useSubscription();
  const { cliente, token, signOut, updateCliente } = useAuth();
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const currentCliente = buildProfileSnapshot(cliente);
  const currentUser = {
    name: buildDisplayName(currentCliente),
    email: currentCliente.email,
    phone: currentCliente.telefone,
    photo: currentCliente.url_foto_clientes,
    cpf: currentCliente.cpf,
    id: currentCliente.id_clientes,
    category: currentCliente.categoria_clientes,
    status: currentCliente.categoria_clientes || "",
  };

  // â”€â”€ DerivaÃ§Ãµes puras de apresentaÃ§Ã£o (nÃ£o criam estado nem tocam contexts) â”€â”€
  const planIdentity = useMemo(
    () => getPlanIdentity(subscription),
    [subscription],
  );
  const planStatusLabel = planIdentity.isSocio
    ? `Status atual: ${planIdentity.label}`
    : 'Status atual: Não sócio';
  const sociosSummaryLabel = planIdentity.isSocio
    ? `Plano ativo: ${planIdentity.label}`
    : 'Plano ativo: Não possui assinatura';

  const [profileDraft, setProfileDraft] = useState(currentCliente);
  const originalProfileRef = useRef(currentCliente);

  // Foto pendente: verdadeiro quando o rascunho da foto difere da foto salva.
  // Puramente derivado do estado jÃ¡ existente (profileDraft) â€” nÃ£o Ã© um novo
  // estado de negÃ³cio, apenas uma comparaÃ§Ã£o para controlar a UI.
  const hasPendingPhoto = useMemo(() => {
    const draftPhoto = trimValue(profileDraft.url_foto_clientes);
    const savedPhoto = trimValue(
      originalProfileRef.current?.url_foto_clientes,
    );
    return draftPhoto.length > 0 && draftPhoto !== savedPhoto;
  }, [profileDraft.url_foto_clientes]);

  // â”€â”€ Estado exclusivo da experiÃªncia do popup "Editar Perfil" (apenas UI) â”€â”€
  const [touchedFields, setTouchedFields] = useState({});
  const modalAnim = useRef(new Animated.Value(0)).current;

  // â”€â”€ Estado exclusivo do botÃ£o "Salvar alteraÃ§Ãµes" da foto (apenas UI) â”€â”€â”€â”€â”€
  const [isSavingPhoto, setIsSavingPhoto] = useState(false);

  const nomeRef = useRef(null);
  const sobrenomeRef = useRef(null);
  const emailRef = useRef(null);
  const telefoneRef = useRef(null);
  const ruaRef = useRef(null);
  const numeroRef = useRef(null);
  const cepRef = useRef(null);
  const bairroRef = useRef(null);
  const complementoRef = useRef(null);

  useEffect(() => {
    const nextProfile = buildProfileSnapshot(cliente);
    setProfileDraft(nextProfile);
    originalProfileRef.current = nextProfile;
  }, [cliente]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadSubscription = async () => {
        if (!token) {
          if (isActive) {
            setSubscription(null);
          }
          return;
        }

        try {
          const response = await getMinhaAssinatura(token);
          const normalized = normalizeAssinaturaResponse(response);

          if (isActive) {
            setSubscription(normalized);
          }
        } catch (error) {
          if (error?.status === 404) {
            if (isActive) {
              setSubscription(null);
            }
            return;
          }

          if (isActive) {
            setSubscription(null);
          }
        }
      };

      const loadPurchaseHistory = async () => {
        if (!token) {
          setPurchaseHistory([]);
          return;
        }

        try {
          const history = await fetchPurchaseHistory(token);
          if (isActive) {
            setPurchaseHistory(history);
          }
        } catch {
          if (isActive) {
            setPurchaseHistory([]);
          }
        }
      };

      loadSubscription();
      loadPurchaseHistory();

      return () => {
        isActive = false;
      };
    }, [setSubscription, token]),
  );

  useEffect(() => {
    if (!editModalVisible) {
      setProfileDraft(buildProfileSnapshot(cliente));
      originalProfileRef.current = buildProfileSnapshot(cliente);
    }
  }, [cliente, editModalVisible]);

  // â”€â”€ AnimaÃ§Ã£o de abertura/fechamento do popup (apenas visual) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (editModalVisible) {
      setTouchedFields({});
      modalAnim.setValue(0);
      Animated.timing(modalAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    }
  }, [editModalVisible]);

  const closeEditModal = () => {
    Animated.timing(modalAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setEditModalVisible(false);
    });
  };

  // â”€â”€ AtualizaÃ§Ã£o de campos do formulÃ¡rio (mesmo shape de estado original) â”€â”€
  const updateProfileField = (field, value) => {
    setProfileDraft((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) =>
      prev[field] ? prev : { ...prev, [field]: true },
    );
  };

  const handleNomeChange = (text) => updateProfileField("nome_clientes", text);
  const handleSobrenomeChange = (text) =>
    updateProfileField("sobrenome_clientes", text);
  const handleEmailChange = (text) =>
    updateProfileField("email", text.replace(/\s/g, ""));
  const handlePhoneChange = (text) =>
    updateProfileField("telefone", formatPhoneBR(text));
  const handleRuaChange = (text) => updateProfileField("rua", text);
  const handleNumeroChange = (text) =>
    updateProfileField("casa_numero", onlyDigits(text));
  const handleBairroChange = (text) => updateProfileField("bairro", text);
  const handleCepChange = (text) => updateProfileField("cep", formatCEP(text));
  const handleComplementoChange = (text) =>
    updateProfileField("complemento", text);
  const handleSexoChange = (value) => updateProfileField("sexo", value);

  // â”€â”€ ValidaÃ§Ã£o discreta (nÃ£o bloqueia nada alÃ©m do botÃ£o Salvar) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fieldValidity = useMemo(() => {
    const nome = trimValue(profileDraft.nome_clientes);
    const email = trimValue(profileDraft.email);
    const telefoneDigits = onlyDigits(profileDraft.telefone);
    const cepDigits = onlyDigits(profileDraft.cep);

    return {
      nome_clientes: nome.length > 0 && nome.length <= 50,
      sobrenome_clientes:
        trimValue(profileDraft.sobrenome_clientes).length <= 80,
      email: email.length > 0 && isValidEmail(email),
      telefone: telefoneDigits.length === 0 || telefoneDigits.length === 11,
      cep: cepDigits.length === 0 || cepDigits.length === 8,
    };
  }, [profileDraft]);

  const isProfileFormValid = Object.values(fieldValidity).every(Boolean);

  const pickProfileImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "PermissÃ£o necessÃ¡ria",
        "Precisamos de acesso Ã  galeria para escolher uma foto de perfil.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setProfileDraft((prev) => ({
        ...prev,
        url_foto_clientes: result.assets[0].uri,
      }));
    }
  };

  const handleSaveProfile = async () => {
    const nextDraft = buildProfileSnapshot(profileDraft);
    const originalDraft = originalProfileRef.current || {};

    const changes = EDITABLE_PROFILE_FIELDS.reduce((acc, field) => {
      const nextValue = trimValue(nextDraft[field]);
      const originalValue = trimValue(originalDraft[field]);

      if (nextValue !== originalValue) {
        acc[field] = nextValue;
      }

      return acc;
    }, {});

    if (Object.keys(changes).length === 0) {
      setEditModalVisible(false);
      return;
    }

    try {
      const updatedCliente = await updateCliente(changes);
      const mergedProfile = buildProfileSnapshot(
        updatedCliente || { ...currentCliente, ...changes },
      );
      setProfileDraft(mergedProfile);
      originalProfileRef.current = mergedProfile;
      setEditModalVisible(false);
    } catch (error) {
      Alert.alert(
        "Erro",
        error?.message || "NÃ£o foi possÃ­vel salvar os dados.",
      );
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert("Erro", error?.message || "NÃ£o foi possÃ­vel sair da conta.");
    }
  };

  // â”€â”€ Wrapper apenas de UI: reutiliza handleSaveProfile (sem alterÃ¡-la) para
  // acionar o salvamento a partir do botÃ£o flutuante da foto, com feedback
  // visual de carregamento (isSavingPhoto). â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSavePendingPhoto = async () => {
    setIsSavingPhoto(true);
    try {
      await handleSaveProfile();
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const currentAvatarUri =
    trimValue(profileDraft.url_foto_clientes) ||
    trimValue(currentCliente.url_foto_clientes) ||
    DEFAULT_AVATAR;

  return (
<<<<<<< HEAD
    <View style={stylesPerfil.container}>
      {/* BACKGROUND */}
      <LinearGradient
        colors={["#150000", "#0a0a0a", "#050505"]}
=======
    <View style={ps.container}>
      {/* BACKGROUND */}
      <LinearGradient
        colors={["#160000", "#0a0a0a", "#050505"]}
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={ps.content}
        showsVerticalScrollIndicator={false}
      >
        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
<<<<<<< HEAD
            HERO â€” Avatar cinematogrÃ¡fico + identificaÃ§Ã£o do sÃ³cio
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <View style={stylesPerfil.hero}>
          <Image
            source={escudoDrakos}
            style={stylesPerfil.heroWatermark}
            resizeMode="contain"
          />
          <LinearGradient
            colors={["transparent", "rgba(5,5,5,0.4)", "#050505"]}
            style={stylesPerfil.heroFade}
          />

          <View style={stylesPerfil.avatarStage}>
            <View
              style={[
                stylesPerfil.avatarGlow,
                { backgroundColor: planIdentity.glowColor },
              ]}
            />
            <View
              style={[
                stylesPerfil.avatarRing,
                { borderColor: planIdentity.borderColor },
              ]}
            >
              <Image
                source={{ uri: currentAvatarUri }}
                style={stylesPerfil.avatar}
=======
            HERO CARD â€” foto, nome, categoria, status premium do sÃ³cio
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <View style={ps.hero}>
          <Image
            source={escudoDrakos}
            style={ps.heroWatermark}
            resizeMode="contain"
          />
          <LinearGradient
            colors={["transparent", "rgba(5,5,5,0.55)", "#050505"]}
            style={ps.heroFade}
            pointerEvents="none"
          />

          <View style={ps.avatarStage}>
            <View
              style={[ps.avatarGlow, { backgroundColor: planIdentity.glowColor }]}
              pointerEvents="none"
            />
            <View
              style={[ps.avatarRing, { borderColor: planIdentity.borderColor }]}
            >
              <Image
                source={{ uri: currentAvatarUri }}
                style={ps.avatar}
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
              />
            </View>
            <TouchableOpacity
              style={ps.editAvatarBtn}
              activeOpacity={0.8}
              onPress={pickProfileImage}
            >
<<<<<<< HEAD
              <BlurView
                intensity={30}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
              <Ionicons name="camera" size={13} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={stylesPerfil.username}>{currentUser.name}</Text>

          {/* Chip de status â€” identificaÃ§Ã£o premium do plano */}
          <View style={stylesPerfil.statusChip}>
            <BlurView
              intensity={34}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
=======
              <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={ps.editAvatarBorder} />
              <Ionicons name="camera" size={13} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={ps.username}>{currentUser.name}</Text>
          {currentUser.category ? (
            <Text style={ps.categoryText}>{currentUser.category}</Text>
          ) : null}

          {/* Chip de status â€” identificaÃ§Ã£o premium do plano do sÃ³cio */}
          <View style={ps.statusChip}>
            <BlurView intensity={34} tint="dark" style={StyleSheet.absoluteFill} />
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
            <LinearGradient
              colors={[planIdentity.glowColor, "transparent"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View
              style={[ps.statusChipBorder, { borderColor: planIdentity.borderColor }]}
            />
            {planIdentity.isSocio && (
              <Text style={ps.statusChipEmoji}>{planIdentity.emoji}</Text>
            )}
            <Text style={[ps.statusChipText, { color: planIdentity.textColor }]}>
              {planStatusLabel}
            </Text>
          </View>

<<<<<<< HEAD
        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            MEMBERSHIP CARD â€” cartÃ£o de sÃ³cio independente
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {subscription ? (
          <View style={stylesPerfil.membershipCard}>
=======
          {/* BotÃ£o "Salvar alteraÃ§Ãµes" â€” aparece sÃ³ com foto pendente */}
          {hasPendingPhoto && (
            <TouchableOpacity
              style={ps.savePhotoBtn}
              activeOpacity={0.85}
              onPress={handleSavePendingPhoto}
              disabled={isSavingPhoto}
            >
              <LinearGradient
                colors={["#e8000f", "#a3000a"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={ps.savePhotoBorder} />
              <Ionicons
                name={isSavingPhoto ? "sync" : "checkmark-circle"}
                size={15}
                color="#fff"
              />
              <Text style={ps.savePhotoText}>
                {isSavingPhoto ? "Salvando..." : "Salvar alterações"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            MEMBERSHIP CARD â€” cartÃ£o de sÃ³cio premium independente
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {subscription ? (
          <View style={ps.membershipCard}>
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
            <LinearGradient
              colors={planIdentity.cardColors}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
            />
            <BlurView
              intensity={16}
              tint="dark"
<<<<<<< HEAD
              style={[StyleSheet.absoluteFill, { opacity: 0.4 }]}
            />
            <View
              style={[
                stylesPerfil.membershipBorder,
                { borderColor: planIdentity.borderColor },
              ]}
            />
            <View style={stylesPerfil.membershipSpecularTop} />

            <View style={stylesPerfil.membershipTopRow}>
              <View style={stylesPerfil.membershipBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={12}
                  color={planIdentity.accent}
                />
                <Text
                  style={[
                    stylesPerfil.membershipBadgeText,
                    { color: planIdentity.accent },
                  ]}
                >
                  MEMBRO ATIVO
                </Text>
              </View>
              <Text style={stylesPerfil.membershipEmoji}>
                {planIdentity.emoji}
              </Text>
            </View>

            <Text style={stylesPerfil.membershipTitle}>
              {planIdentity.title || planIdentity.label}
            </Text>
            <Text style={stylesPerfil.membershipSubtitle}>
              SÃ³cio-torcedor Drakos FC
            </Text>

            <View style={stylesPerfil.membershipDivider} />

            <View style={stylesPerfil.membershipFooterRow}>
              <View style={stylesPerfil.membershipBenefits}>
                <View style={stylesPerfil.membershipBenefitItem}>
                  <View style={stylesPerfil.membershipBenefitDot} />
                  <Text style={stylesPerfil.membershipBenefitText}>
                    BenefÃ­cios ativos do plano
                  </Text>
                </View>
                <View style={stylesPerfil.membershipBenefitItem}>
                  <View style={stylesPerfil.membershipBenefitDot} />
                  <Text style={stylesPerfil.membershipBenefitText}>
=======
              style={[StyleSheet.absoluteFill, { opacity: 0.35 }]}
            />
            <View
              style={[ps.membershipBorder, { borderColor: planIdentity.borderColor }]}
            />
            <View style={ps.membershipSpecularTop} />

            <View style={ps.membershipTopRow}>
              <View style={ps.membershipBadge}>
                <Ionicons name="shield-checkmark" size={11} color={planIdentity.accent} />
                <Text style={[ps.membershipBadgeText, { color: planIdentity.accent }]}>
                  MEMBRO ATIVO
                </Text>
              </View>
              <Text style={ps.membershipEmoji}>{planIdentity.emoji}</Text>
            </View>

            <Text style={ps.membershipTitle}>
              {planIdentity.title || planIdentity.label}
            </Text>
            <Text style={ps.membershipSubtitle}>{sociosSummaryLabel}</Text>

            <View style={ps.membershipDivider} />

            <View style={ps.membershipFooterRow}>
              <View style={ps.membershipBenefits}>
                <View style={ps.membershipBenefitItem}>
                  <View style={ps.membershipBenefitDot} />
                  <Text style={ps.membershipBenefitText}>
                    Beneficios ativos do plano
                  </Text>
                </View>
                <View style={ps.membershipBenefitItem}>
                  <View style={ps.membershipBenefitDot} />
                  <Text style={ps.membershipBenefitText}>
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
                    Prioridade em compras e ingressos
                  </Text>
                </View>
              </View>
              {planIdentity.price ? (
<<<<<<< HEAD
                <Text style={stylesPerfil.membershipPrice}>
                  {planIdentity.price}
                </Text>
=======
                <Text style={ps.membershipPrice}>{planIdentity.price}</Text>
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
              ) : null}
            </View>

            <TouchableOpacity
<<<<<<< HEAD
              style={stylesPerfil.membershipManageBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Socio")}
            >
              <BlurView
                intensity={24}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
              <View style={stylesPerfil.membershipManageBorder} />
              <Text style={stylesPerfil.membershipManageBtnText}>
                Gerenciar assinatura
              </Text>
              <Ionicons name="chevron-forward" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={stylesPerfil.membershipPromo}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Socio")}
          >
            <LinearGradient
              colors={["#2a0004", "#150002", "#0a0a0a"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
            />
            <View style={stylesPerfil.membershipBorder} />
            <View style={stylesPerfil.membershipSpecularTop} />

            <View style={stylesPerfil.membershipPromoIconWrap}>
              <Ionicons name="shield-outline" size={22} color="#e8000f" />
            </View>
            <View style={stylesPerfil.membershipPromoTextGroup}>
              <Text style={stylesPerfil.membershipPromoTitle}>
                Torne-se SÃ³cio Drakos
              </Text>
              <Text style={stylesPerfil.membershipPromoBody}>
                Descontos exclusivos, prioridade em ingressos e experiÃªncias
                only para sÃ³cios.
              </Text>
            </View>
            <View style={stylesPerfil.membershipPromoCta}>
              <Text style={stylesPerfil.membershipPromoCtaText}>Ver planos</Text>
=======
              style={ps.membershipManageBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Socio")}
            >
              <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={ps.membershipManageBorder} />
              <Text style={ps.membershipManageBtnText}>Gerenciar assinatura</Text>
              <Ionicons name="chevron-forward" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={ps.membershipPromo}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Socio")}
          >
            <LinearGradient
              colors={["#2a0004", "#150002", "#0a0a0a"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
            />
            <View style={ps.membershipBorder} />
            <View style={ps.membershipSpecularTop} />

            <View style={ps.membershipPromoIconWrap}>
              <Ionicons name="shield-outline" size={22} color="#e8000f" />
            </View>
            <View style={ps.membershipPromoTextGroup}>
              <Text style={ps.membershipPromoTitle}>Torne-se Sócio Drakos</Text>
              <Text style={ps.membershipPromoBody}>
                Descontos exclusivos, prioridade em ingressos e experiências
                only para sócios.
              </Text>
            </View>
            <View style={ps.membershipPromoCta}>
              <Text style={ps.membershipPromoCtaText}>Ver planos</Text>
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
              <Ionicons name="arrow-forward" size={15} color="#e8000f" />
            </View>
          </TouchableOpacity>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
<<<<<<< HEAD
            BOAS-VINDAS â€” mensagem leve
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <View style={stylesPerfil.welcomeCard}>
          <BlurView
            intensity={36}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
=======
            BOAS-VINDAS â€” mensagem leve com notificaÃ§Ã£o
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <View style={ps.welcomeCard}>
          <BlurView intensity={32} tint="dark" style={StyleSheet.absoluteFill} />
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
          <LinearGradient
            colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.015)"]}
            style={StyleSheet.absoluteFill}
          />
<<<<<<< HEAD
          <View style={stylesPerfil.welcomeBorder} />

          <View style={stylesPerfil.welcomeIconWrap}>
            <Ionicons name="sparkles-outline" size={16} color="#e8000f" />
          </View>
          <Text style={stylesPerfil.welcomeBody}>
            OlÃ¡, {currentUser.name.split(" ")[0]}. Explore as novidades,
            confira seus dados e aproveite ao mÃ¡ximo sua experiÃªncia com a
            gente.
          </Text>
          <TouchableOpacity
            style={stylesPerfil.notifBadge}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={19} color="#fff" />
            <View style={stylesPerfil.notifDot} />
=======
          <View style={ps.welcomeBorder} />

          <View style={ps.welcomeIconWrap}>
            <Ionicons name="sparkles-outline" size={16} color="#e8000f" />
          </View>
          <Text style={ps.welcomeBody}>
            Olá, {currentUser.name.split(" ")[0]}. Explore as novidades,
            confira seus dados e aproveite ao máximo sua experiência com a
            gente.
          </Text>
          <TouchableOpacity style={ps.notifBadge} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={18} color="#fff" />
            <View style={ps.notifDot} />
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
          </TouchableOpacity>
        </View>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            AÃ‡Ã•ES RÃPIDAS
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
<<<<<<< HEAD
        <Text style={stylesPerfil.groupLabel}>Acesso rÃ¡pido</Text>
        <View style={stylesPerfil.actionsRow}>
          <TouchableOpacity style={stylesPerfil.actionCard} activeOpacity={0.85}>
            <BlurView
              intensity={34}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <View style={stylesPerfil.actionBorder} />
            <View style={stylesPerfil.actionIconWrap}>
              <Ionicons name="card-outline" size={20} color="#fff" />
            </View>
            <Text style={stylesPerfil.actionLabel}>Meu CartÃ£o</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesPerfil.actionCard}
            activeOpacity={0.85}
            onPress={() => setShowHistory((prev) => !prev)}
          >
            <BlurView
              intensity={34}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <View style={stylesPerfil.actionBorder} />
            <View style={stylesPerfil.actionIconWrap}>
              <Ionicons name="receipt-outline" size={20} color="#fff" />
            </View>
            <Text style={stylesPerfil.actionLabel}>Compras</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesPerfil.actionCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Socio")}
          >
            <BlurView
              intensity={34}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <View style={stylesPerfil.actionBorder} />
            <View style={stylesPerfil.actionIconWrap}>
              <Ionicons name="people-outline" size={20} color="#fff" />
            </View>
            <Text style={stylesPerfil.actionLabel}>SÃ³cio</Text>
=======
        <Text style={ps.groupLabel}>Acesso rÃ¡pido</Text>
        <View style={ps.actionsRow}>
          <TouchableOpacity style={ps.actionCard} activeOpacity={0.85}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={ps.actionBorder} />
            <View style={ps.actionIconWrap}>
              <Ionicons name="card-outline" size={19} color="#fff" />
            </View>
            <Text style={ps.actionLabel}>Meu CartÃ£o</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={ps.actionCard}
            activeOpacity={0.85}
            onPress={() => setShowHistory((prev) => !prev)}
          >
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={ps.actionBorder} />
            <View style={ps.actionIconWrap}>
              <Ionicons name="receipt-outline" size={19} color="#fff" />
            </View>
            <Text style={ps.actionLabel}>Compras</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={ps.actionCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Socio")}
          >
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={ps.actionBorder} />
            <View style={ps.actionIconWrap}>
              <Ionicons name="people-outline" size={19} color="#fff" />
            </View>
            <Text style={ps.actionLabel}>sócios</Text>
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
          </TouchableOpacity>
        </View>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
<<<<<<< HEAD
            HISTÃ“RICO
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {showHistory && (
          <View style={stylesPerfil.historySection}>
            <BlurView
              intensity={36}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
=======
            HISTÃ“RICO â€” mesmo funcionamento, cartÃµes renovados
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {showHistory && (
          <View style={ps.historySection}>
            <BlurView intensity={32} tint="dark" style={StyleSheet.absoluteFill} />
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
            <LinearGradient
              colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.015)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={ps.historyBorder} />

<<<<<<< HEAD
            <View style={stylesPerfil.historyHeader}>
              <Text style={stylesPerfil.historyTitle}>
                Compras e assinaturas
              </Text>
              <TouchableOpacity
                onPress={() => setShowHistory(false)}
                activeOpacity={0.7}
                style={stylesPerfil.historyCloseBtn}
              >
                <Ionicons name="close" size={16} color="#fff" />
=======
            <View style={ps.historyHeader}>
              <Text style={ps.historyTitle}>Compras e assinaturas</Text>
              <TouchableOpacity
                onPress={() => setShowHistory(false)}
                activeOpacity={0.7}
                style={ps.historyCloseBtn}
              >
                <Ionicons name="close" size={15} color="#fff" />
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
              </TouchableOpacity>
            </View>

            {subscription && (
              <View style={ps.historySubBadge}>
                {planIdentity.isSocio && (
                  <Text style={ps.historySubEmoji}>{planIdentity.emoji}</Text>
                )}
                <Text style={ps.historySubText}>{sociosSummaryLabel}</Text>
                <Text style={ps.historySubPrice}>{subscription.price}</Text>
              </View>
            )}

<<<<<<< HEAD
            <Text style={stylesPerfil.historyListTitle}>HistÃ³rico</Text>
=======
            <Text style={ps.historyListTitle}>HistÃ³rico</Text>
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254

            {(() => {
              const historyList = Array.isArray(purchaseHistory)
                ? purchaseHistory
                : [];

              return historyList.length > 0 ? (
                historyList.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <View style={ps.historyRow}>
                    {item.type === "subscription" ? (
<<<<<<< HEAD
                      <View style={stylesPerfil.historyIconWrap}>
                        <Ionicons
                          name="shield-checkmark-outline"
                          size={16}
=======
                      <View style={ps.historyIconWrap}>
                        <Ionicons
                          name="shield-checkmark-outline"
                          size={15}
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
                          color="#e8000f"
                        />
                      </View>
                    ) : item.itemImages && item.itemImages[0] ? (
                      <Image
                        source={item.itemImages[0]}
                        style={ps.historyProductImage}
                      />
                    ) : (
<<<<<<< HEAD
                      <View style={stylesPerfil.historyIconWrap}>
                        <Ionicons name="bag-outline" size={16} color="#e8000f" />
=======
                      <View style={ps.historyIconWrap}>
                        <Ionicons name="bag-outline" size={15} color="#e8000f" />
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
                      </View>
                    )}
                    <View style={ps.historyInfo}>
                      <Text style={ps.historyPlan}>
                        {item.type === "subscription"
                          ? item.planTitle
                          : item.productName || item.items?.[0] || "Produto"}
                      </Text>
                      <Text style={ps.historyDate}>
                        {item.type === "subscription"
                          ? formatHistoryDate(item.date)
                          : buildPurchaseSummary(item)}
                      </Text>
                    </View>
                    <Text style={ps.historyPrice}>{item.price}</Text>
                  </View>
<<<<<<< HEAD
                  {idx < historyList.length - 1 && (
                    <View style={stylesPerfil.historyDivider} />
                  )}
                </React.Fragment>
                ))
              ) : (
              <View style={stylesPerfil.historyEmpty}>
                <Ionicons
                  name="document-text-outline"
                  size={32}
                  color="rgba(255,255,255,0.25)"
=======
                  {idx < purchaseHistory.length - 1 && (
                    <View style={ps.historyDivider} />
                  )}
                </React.Fragment>
              ))
            ) : (
              <View style={ps.historyEmpty}>
                <Ionicons
                  name="document-text-outline"
                  size={30}
                  color="rgba(255,255,255,0.22)"
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
                />
                <Text style={ps.historyEmptyText}>
                  Nenhuma compra ou assinatura ainda
                </Text>
              </View>
              );
            })()}
          </View>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            DADOS PESSOAIS
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
<<<<<<< HEAD
        <View style={stylesPerfil.sectionHeaderCustom}>
          <Text style={stylesPerfil.sectionTitle}>Dados pessoais</Text>
=======
        <View style={ps.sectionHeaderCustom}>
          <Text style={ps.sectionTitle}>Dados pessoais</Text>
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
          <TouchableOpacity
            style={ps.sectionEditBtn}
            onPress={() => setEditModalVisible(true)}
            activeOpacity={0.7}
          >
<<<<<<< HEAD
            <Ionicons name="pencil-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={stylesPerfil.infoCard}>
          <BlurView
            intensity={36}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
=======
            <Ionicons name="pencil-outline" size={15} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={ps.infoCard}>
          <BlurView intensity={32} tint="dark" style={StyleSheet.absoluteFill} />
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
          <LinearGradient
            colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.015)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={ps.infoBorder} />

<<<<<<< HEAD
          <View style={stylesPerfil.infoRow}>
            <View style={stylesPerfil.infoLeft}>
              <View style={stylesPerfil.infoIconWrap}>
                <Ionicons name="person-outline" size={16} color="#fff" />
              </View>
              <View style={stylesPerfil.infoTextGroup}>
                <Text style={stylesPerfil.infoLabel}>Nome completo</Text>
                <Text style={stylesPerfil.infoValue}>{currentUser.name}</Text>
=======
          <View style={ps.infoRow}>
            <View style={ps.infoLeft}>
              <View style={ps.infoIconWrap}>
                <Ionicons name="person-outline" size={15} color="#fff" />
              </View>
              <View style={ps.infoTextGroup}>
                <Text style={ps.infoLabel}>Nome completo</Text>
                <Text style={ps.infoValue}>{currentUser.name}</Text>
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
              </View>
            </View>
          </View>

          <View style={ps.infoDivider} />

<<<<<<< HEAD
          <View style={stylesPerfil.infoRow}>
            <View style={stylesPerfil.infoLeft}>
              <View style={stylesPerfil.infoIconWrap}>
                <Ionicons name="mail-outline" size={16} color="#fff" />
              </View>
              <View style={stylesPerfil.infoTextGroup}>
                <Text style={stylesPerfil.infoLabel}>Email</Text>
                <Text style={stylesPerfil.infoValue}>{currentUser.email}</Text>
=======
          <View style={ps.infoRow}>
            <View style={ps.infoLeft}>
              <View style={ps.infoIconWrap}>
                <Ionicons name="mail-outline" size={15} color="#fff" />
              </View>
              <View style={ps.infoTextGroup}>
                <Text style={ps.infoLabel}>Email</Text>
                <Text style={ps.infoValue}>{currentUser.email}</Text>
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
              </View>
            </View>
          </View>

          <View style={ps.infoDivider} />

<<<<<<< HEAD
          <View style={stylesPerfil.infoRow}>
            <View style={stylesPerfil.infoLeft}>
              <View style={stylesPerfil.infoIconWrap}>
                <Ionicons name="call-outline" size={16} color="#fff" />
              </View>
              <View style={stylesPerfil.infoTextGroup}>
                <Text style={stylesPerfil.infoLabel}>Telefone</Text>
                <Text style={stylesPerfil.infoValue}>{currentUser.phone}</Text>
=======
          <View style={ps.infoRow}>
            <View style={ps.infoLeft}>
              <View style={ps.infoIconWrap}>
                <Ionicons name="call-outline" size={15} color="#fff" />
              </View>
              <View style={ps.infoTextGroup}>
                <Text style={ps.infoLabel}>Telefone</Text>
                <Text style={ps.infoValue}>{currentUser.phone}</Text>
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
              </View>
            </View>
          </View>
        </View>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
            SAIR
        â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <TouchableOpacity
          style={ps.logoutBtn}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
<<<<<<< HEAD
          <BlurView
            intensity={22}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <View style={stylesPerfil.logoutBorder} />
          <Ionicons name="log-out-outline" size={18} color="#ff6b6b" />
          <Text style={stylesPerfil.logoutText}>Sair da conta</Text>
=======
          <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={ps.logoutBorder} />
          <Ionicons name="log-out-outline" size={17} color="#ff6b6b" />
          <Text style={ps.logoutText}>Sair da conta</Text>
>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>


      {/* MODAL EDITAR PERFIL â€” Liquid Glass */}
      <Modal
        animationType="none"
        transparent
        visible={editModalVisible}
        onRequestClose={closeEditModal}
        statusBarTranslucent
      >
        <Animated.View
          style={[
            editStyles.overlay,
            {
              opacity: modalAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={closeEditModal}
          />

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={editStyles.kav}
            pointerEvents="box-none"
          >
            <Animated.View
              style={[
                editStyles.modalCard,
                {
                  opacity: modalAnim,
                  transform: [
                    {
                      translateY: modalAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [36, 0],
                      }),
                    },
                    {
                      scale: modalAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.96, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <BlurView
                intensity={55}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
                style={StyleSheet.absoluteFill}
              />
              <View style={editStyles.specularTop} />
              <View style={editStyles.modalBorder} />

              {/* CabeÃ§alho */}
              <View style={editStyles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={editStyles.modalTitle}>Editar Perfil</Text>
                  <Text style={editStyles.modalSubtitle}>
                    Atualize seus dados pessoais
                  </Text>
                </View>
                <TouchableOpacity
                  style={editStyles.closeIconBtn}
                  onPress={closeEditModal}
                  activeOpacity={0.75}
                >
                  <Ionicons name="close" size={18} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                contentContainerStyle={editStyles.scrollContent}
              >
                <Text style={editStyles.sectionLabel}>Foto de perfil</Text>
                <GlassField
                  label="URL da foto"
                  icon="image-outline"
                  value={profileDraft.url_foto_clientes}
                  onChangeText={(text) =>
                    updateProfileField("url_foto_clientes", text)
                  }
                  placeholder="Cole um link ou use a galeria acima"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => nomeRef.current?.focus()}
                />

                <Text style={editStyles.sectionLabel}>InformaÃ§Ãµes bÃ¡sicas</Text>

                <GlassField
                  label="Nome"
                  icon="person-outline"
                  value={profileDraft.nome_clientes}
                  onChangeText={handleNomeChange}
                  placeholder="Digite seu nome"
                  maxLength={50}
                  showValidation={touchedFields.nome_clientes}
                  isValid={fieldValidity.nome_clientes}
                  returnKeyType="next"
                  inputRef={nomeRef}
                  onSubmitEditing={() => sobrenomeRef.current?.focus()}
                />

                <GlassField
                  label="Sobrenome"
                  icon="person-outline"
                  value={profileDraft.sobrenome_clientes}
                  onChangeText={handleSobrenomeChange}
                  placeholder="Digite seu sobrenome"
                  maxLength={80}
                  returnKeyType="next"
                  inputRef={sobrenomeRef}
                  onSubmitEditing={() => emailRef.current?.focus()}
                />

                <GlassField
                  label="E-mail"
                  icon="mail-outline"
                  value={profileDraft.email}
                  onChangeText={handleEmailChange}
                  placeholder="seuemail@exemplo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  showValidation={touchedFields.email}
                  isValid={fieldValidity.email}
                  returnKeyType="next"
                  inputRef={emailRef}
                  onSubmitEditing={() => telefoneRef.current?.focus()}
                />

                <GlassField
                  label="Telefone"
                  icon="call-outline"
                  value={formatPhoneBR(profileDraft.telefone)}
                  onChangeText={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  keyboardType="phone-pad"
                  maxLength={15}
                  showValidation={touchedFields.telefone}
                  isValid={fieldValidity.telefone}
                  returnKeyType="next"
                  inputRef={telefoneRef}
                  onSubmitEditing={() => ruaRef.current?.focus()}
                />

                <SexoSelector
                  value={profileDraft.sexo}
                  onChange={handleSexoChange}
                />

                <Text style={editStyles.sectionLabel}>EndereÃ§o</Text>

                <GlassField
                  label="Rua"
                  icon="home-outline"
                  value={profileDraft.rua}
                  onChangeText={handleRuaChange}
                  placeholder="Nome da rua"
                  maxLength={120}
                  returnKeyType="next"
                  inputRef={ruaRef}
                  onSubmitEditing={() => numeroRef.current?.focus()}
                />

                <View style={editStyles.rowTwo}>
                  <View style={{ flex: 1 }}>
                    <GlassField
                      label="NÃºmero"
                      icon="pin-outline"
                      value={profileDraft.casa_numero}
                      onChangeText={handleNumeroChange}
                      placeholder="NÂº"
                      keyboardType="numeric"
                      maxLength={10}
                      returnKeyType="next"
                      inputRef={numeroRef}
                      onSubmitEditing={() => cepRef.current?.focus()}
                    />
                  </View>
                  <View style={{ width: 12 }} />
                  <View style={{ flex: 1 }}>
                    <GlassField
                      label="CEP"
                      icon="location-outline"
                      value={formatCEP(profileDraft.cep)}
                      onChangeText={handleCepChange}
                      placeholder="00000-000"
                      keyboardType="numeric"
                      maxLength={9}
                      showValidation={touchedFields.cep}
                      isValid={fieldValidity.cep}
                      returnKeyType="next"
                      inputRef={cepRef}
                      onSubmitEditing={() => bairroRef.current?.focus()}
                    />
                  </View>
                </View>

                <GlassField
                  label="Bairro"
                  icon="business-outline"
                  value={profileDraft.bairro}
                  onChangeText={handleBairroChange}
                  placeholder="Bairro"
                  maxLength={80}
                  returnKeyType="next"
                  inputRef={bairroRef}
                  onSubmitEditing={() => complementoRef.current?.focus()}
                />

                <GlassField
                  label="Complemento"
                  icon="add-circle-outline"
                  value={profileDraft.complemento}
                  onChangeText={handleComplementoChange}
                  placeholder="Apartamento, bloco, referÃªncia..."
                  maxLength={120}
                  returnKeyType="done"
                  blurOnSubmit
                  inputRef={complementoRef}
                  onSubmitEditing={() => complementoRef.current?.blur()}
                />

                <Text style={editStyles.sectionLabel}>Dados verificados</Text>

                <ReadOnlyField
                  label="CPF"
                  icon="card-outline"
                  value={currentUser.cpf}
                />
                <ReadOnlyField
                  label="ID do cliente"
                  icon="finger-print-outline"
                  value={currentUser.id}
                />
                <ReadOnlyField
                  label="Categoria"
                  icon="ribbon-outline"
                  value={currentUser.category || currentUser.status || ""}
                />
              </ScrollView>

              {/* RodapÃ© com aÃ§Ãµes */}
              <View style={editStyles.footerRow}>
                <TouchableOpacity
                  style={editStyles.cancelBtn}
                  onPress={closeEditModal}
                  activeOpacity={0.8}
                >
                  <Text style={editStyles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={editStyles.saveBtn}
                  onPress={handleSaveProfile}
                  disabled={!isProfileFormValid}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={
                      isProfileFormValid
                        ? ["#e8000f", "#a3000a"]
                        : ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.05)"]
                    }
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <Ionicons
                    name="checkmark"
                    size={17}
                    color={
                      isProfileFormValid ? "#fff" : "rgba(255,255,255,0.35)"
                    }
                  />
                  <Text
                    style={[
                      editStyles.saveText,
                      !isProfileFormValid && editStyles.saveTextDisabled,
                    ]}
                  >
                    Salvar alteraÃ§Ãµes
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </Animated.View>
      </Modal>
    </View>
  );
}
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ESTILOS â€” PerfilScreen (Liquid Glass Premium, 100% local a este arquivo)
// Hero cinematogrÃ¡fico + Membership Card + cartÃµes renovados.
// Regra de sombra iOS: containers com shadow* NÃƒO usam overflow:'hidden';
// um wrapper interno separado faz o clip de blur/gradiente.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ps = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 40,
    gap: 18,
  },

  // â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  hero: {
    alignItems: "center",
    paddingBottom: 6,
    position: "relative",
  },
  heroWatermark: {
    position: "absolute",
    width: 260,
    height: 260,
    top: -70,
    alignSelf: "center",
    opacity: 0.05,
  },
  heroFade: {
    position: "absolute",
    top: -40,
    left: -20,
    right: -20,
    height: 180,
  },
  avatarStage: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  avatarRing: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(232,0,15,0.9)",
  },
  editAvatarBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  username: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  categoryText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12.5,
    fontWeight: "500",
    marginTop: 3,
    textAlign: "center",
  },

  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 30,
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 7,
    marginTop: 14,
  },
  statusChipBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 30,
    borderWidth: 1,
  },
  statusChipEmoji: {
    fontSize: 13,
  },
  statusChipText: {
    fontSize: 12.5,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  savePhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    gap: 7,
    marginTop: 14,
  },
  savePhotoBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  savePhotoText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  // â”€â”€ MEMBERSHIP CARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  membershipCard: {
    borderRadius: 22,
    overflow: "hidden",
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  membershipBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(232,0,15,0.42)",
  },
  membershipSpecularTop: {
    position: "absolute",
    top: 0,
    left: "14%",
    right: "14%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  membershipTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  membershipBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  membershipBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  membershipEmoji: {
    fontSize: 22,
  },
  membershipTitle: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "900",
    letterSpacing: -0.4,
    marginTop: 14,
  },
  membershipSubtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 3,
  },
  membershipDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginVertical: 16,
  },
  membershipFooterRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  membershipBenefits: {
    gap: 7,
    flex: 1,
  },
  membershipBenefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  membershipBenefitDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  membershipBenefitText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "500",
  },
  membershipPrice: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  membershipManageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 42,
    borderRadius: 13,
    overflow: "hidden",
    gap: 6,
    marginTop: 16,
  },
  membershipManageBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  membershipManageBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },

  membershipPromo: {
    borderRadius: 22,
    overflow: "hidden",
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  membershipPromoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(232,0,15,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  membershipPromoTextGroup: {
    marginBottom: 16,
  },
  membershipPromoTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },
  membershipPromoBody: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "400",
  },
  membershipPromoCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  membershipPromoCtaText: {
    color: "#e8000f",
    fontSize: 13.5,
    fontWeight: "800",
  },

  // â”€â”€ BOAS-VINDAS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  welcomeCard: {
    borderRadius: 18,
    overflow: "hidden",
    padding: 16,
    paddingRight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  welcomeBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  welcomeIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(232,0,15,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeBody: {
    flex: 1,
    color: "rgba(255,255,255,0.7)",
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: "400",
  },
  notifBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    padding: 4,
  },
  notifDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#ff2b2b",
    borderWidth: 1.5,
    borderColor: "#0a0a0a",
  },

  // â”€â”€ AÃ‡Ã•ES RÃPIDAS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  groupLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: -6,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  actionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: {
    color: "#fff",
    fontSize: 11.5,
    fontWeight: "600",
    textAlign: "center",
  },

  // â”€â”€ HISTÃ“RICO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  historySection: {
    borderRadius: 18,
    overflow: "hidden",
    padding: 16,
  },
  historyBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  historyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  historyTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  historyCloseBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  historySubBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(232,0,15,0.10)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(232,0,15,0.20)",
    marginBottom: 14,
    gap: 8,
  },
  historySubEmoji: {
    fontSize: 13,
  },
  historySubText: {
    color: "#fff",
    fontSize: 12.5,
    fontWeight: "600",
    flex: 1,
  },
  historySubPrice: {
    color: "#fff",
    fontSize: 12.5,
    fontWeight: "700",
  },
  historyListTitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11.5,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  historyIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(232,0,15,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },
  historyInfo: {
    flex: 1,
    marginLeft: 10,
  },
  historyPlan: {
    color: "#fff",
    fontSize: 13.5,
    fontWeight: "600",
  },
  historyDate: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    marginTop: 1,
  },
  historyPrice: {
    color: "#fff",
    fontSize: 13.5,
    fontWeight: "700",
  },
  historyDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  historyProductImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  historyEmpty: {
    alignItems: "center",
    paddingVertical: 22,
    gap: 8,
  },
  historyEmptyText: {
    color: "rgba(255,255,255,0.35)",
    fontSize: 12.5,
    textAlign: "center",
  },

  // â”€â”€ DADOS PESSOAIS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  sectionHeaderCustom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  sectionEditBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    borderRadius: 18,
    overflow: "hidden",
  },
  infoBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextGroup: {
    flex: 1,
  },
  infoLabel: {
    color: "rgba(255,255,255,0.42)",
    fontSize: 10.5,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  infoValue: {
    color: "#fff",
    fontSize: 14.5,
    fontWeight: "600",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginHorizontal: 16,
  },

  // â”€â”€ SAIR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 15,
    gap: 10,
    overflow: "hidden",
  },
  logoutBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.25)",
  },
  logoutText: {
    color: "#ff6b6b",
    fontSize: 14.5,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ESTILOS â€” Popup "Editar Perfil" (Liquid Glass, escopo local ao componente)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const editStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(4,0,0,0.55)",
    justifyContent: "flex-end",
  },
  kav: {
    width: "100%",
  },
  modalCard: {
    maxHeight: "88%",
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "rgba(18,10,10,0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 20,
  },
  specularTop: {
    position: "absolute",
    top: 0,
    left: "12%",
    right: "12%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.55)",
  },
  modalBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    borderWidth: 0.75,
    borderColor: "rgba(255,255,255,0.16)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 22,
    paddingHorizontal: 22,
    paddingBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.2,
  },
  modalSubtitle: {
    fontSize: 12.5,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  closeIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 0.75,
    borderColor: "rgba(255,255,255,0.16)",
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 18,
  },
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "rgba(255,255,255,0.42)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 18,
    marginBottom: 10,
  },
  fieldWrap: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12.5,
    color: "rgba(255,255,255,0.62)",
    marginBottom: 6,
    fontWeight: "500",
  },
  inputShell: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 14,
    overflow: "hidden",
    paddingHorizontal: 14,
    borderWidth: 0.75,
    borderColor: "rgba(255,255,255,0.14)",
  },
  inputShellValid: {
    borderColor: "rgba(78,224,138,0.55)",
  },
  inputShellError: {
    borderColor: "rgba(255,107,107,0.55)",
  },
  inputShellReadOnly: {
    borderColor: "rgba(255,255,255,0.08)",
  },
  fieldIcon: {
    marginRight: 10,
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: "#fff",
    padding: 0,
  },
  readOnlyText: {
    flex: 1,
    fontSize: 15,
    color: "rgba(255,255,255,0.45)",
  },
  validIcon: {
    marginLeft: 8,
  },
  sexoRow: {
    flexDirection: "row",
    gap: 10,
  },
  sexoOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 0.75,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  sexoOptionSelected: {
    borderColor: "rgba(232,0,15,0.65)",
  },
  sexoOptionText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
  },
  sexoOptionTextSelected: {
    color: "#fff",
  },
  rowTwo: {
    flexDirection: "row",
  },
  footerRow: {
    flexDirection: "row",
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 20,
    gap: 12,
    borderTopWidth: 0.75,
    borderTopColor: "rgba(255,255,255,0.10)",
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 0.75,
    borderColor: "rgba(255,255,255,0.16)",
  },
  cancelText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 15,
    fontWeight: "600",
  },
  saveBtn: {
    flex: 1.4,
    height: 48,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    gap: 6,
    borderWidth: 0.75,
    borderColor: "rgba(255,255,255,0.18)",
  },
  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  saveTextDisabled: {
    color: "rgba(255,255,255,0.35)",
  },
});
<<<<<<< HEAD
=======

>>>>>>> 82103e06decf51444de41bfdbfc8b1c9db377254
