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

import { useSubscription } from "../contexts/SubscriptionContext";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

const user = defaultUser;
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

  return name || "Usuário";
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS — Máscaras e validação (apenas apresentação/entrada, não afeta payload)
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN SYSTEM — Tokens Light/Dark (Liquid Glass)
// Segue o mesmo padrão adotado em LojaScreens: ThemeContext + makeStyles(DS)
// via useMemo. Dark Mode mantém EXATAMENTE os valores originais já usados
// nesta tela; Light Mode é um conjunto de tokens novo e paralelo.
// ─────────────────────────────────────────────────────────────────────────────
const DARK_DS = {
  scheme: "dark",
  bgGradient: ["#160000", "#0a0a0a", "#050505"],
  screenBg: "#050505",

  textPrimary: "#ffffff",
  textSecondary: "rgba(255,255,255,0.7)",
  textMuted: "rgba(255,255,255,0.45)",
  textFaint: "rgba(255,255,255,0.35)",

  glassBlurIntensity: 32,
  glassBlurTint: "dark",
  glassFillGradient: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.015)"],
  glassBorder: "rgba(255,255,255,0.10)",
  glassBorderSoft: "rgba(255,255,255,0.09)",
  glassIconBg: "rgba(255,255,255,0.06)",
  glassChipBg: "rgba(255,255,255,0.08)",

  specularTop: "rgba(255,255,255,0.35)",
  specularTopStrong: "rgba(255,255,255,0.55)",

  shadowColor: "#000",
  shadowOpacityCard: 0.35,
  shadowOpacityPromo: 0.3,
  shadowOpacityModal: 0.4,

  accent: "#e8000f",
  accentSoft: "rgba(232,0,15,0.12)",
  accentBorder: "rgba(232,0,15,0.42)",
  accentGradient: ["#e8000f", "#a3000a"],

  dividerColor: "rgba(255,255,255,0.10)",
  dividerColorSoft: "rgba(255,255,255,0.07)",

  logoutText: "#ff6b6b",
  logoutBorder: "rgba(255,107,107,0.25)",

  notifDotBorder: "#0a0a0a",

  // Modal (Editar Perfil)
  modalOverlay: "rgba(4,0,0,0.55)",
  modalBg: "rgba(18,10,10,0.4)",
  modalBlurTint: "dark",
  modalBorder: "rgba(255,255,255,0.16)",
  modalFillGradient: ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"],
  modalTitleColor: "#ffffff",
  modalSubtitleColor: "rgba(255,255,255,0.5)",
  closeBtnBg: "rgba(255,255,255,0.10)",
  closeBtnBorder: "rgba(255,255,255,0.16)",
  closeBtnIcon: "#ffffff",

  fieldLabelColor: "rgba(255,255,255,0.62)",
  fieldBorder: "rgba(255,255,255,0.14)",
  fieldIconColor: "rgba(255,255,255,0.55)",
  fieldTextColor: "#ffffff",
  fieldPlaceholder: "rgba(255,255,255,0.32)",
  fieldReadOnlyBorder: "rgba(255,255,255,0.08)",
  fieldReadOnlyText: "rgba(255,255,255,0.45)",
  fieldReadOnlyIcon: "rgba(255,255,255,0.32)",
  fieldLockIcon: "rgba(255,255,255,0.28)",
  fieldValidBorder: "rgba(78,224,138,0.55)",
  fieldErrorBorder: "rgba(255,107,107,0.55)",

  sexoOptionBorder: "rgba(255,255,255,0.14)",
  sexoOptionBg: "rgba(255,255,255,0.05)",
  sexoOptionSelectedBorder: "rgba(232,0,15,0.65)",
  sexoOptionText: "rgba(255,255,255,0.6)",
  sexoOptionTextSelected: "#ffffff",

  footerBorder: "rgba(255,255,255,0.10)",
  cancelBtnBg: "rgba(255,255,255,0.08)",
  cancelBtnBorder: "rgba(255,255,255,0.16)",
  cancelTextColor: "rgba(255,255,255,0.75)",
  saveBtnBorder: "rgba(255,255,255,0.18)",
  saveTextColor: "#ffffff",
  saveTextDisabledColor: "rgba(255,255,255,0.35)",
  saveDisabledGradient: ["rgba(255,255,255,0.10)", "rgba(255,255,255,0.05)"],
};

const LIGHT_DS = {
  scheme: "light",
  // Fundo levemente rosado/crimson-neutro para preservar a identidade Drakos
  // sem cair em branco puro (regra do design system: evitar fundos puros).
  bgGradient: ["#fbeceb", "#f6f1ef", "#f3f2f0"],
  screenBg: "#f3f2f0",

  textPrimary: "#1a1414",
  textSecondary: "rgba(26,20,20,0.68)",
  textMuted: "rgba(26,20,20,0.48)",
  textFaint: "rgba(26,20,20,0.38)",

  glassBlurIntensity: 40,
  glassBlurTint: "light",
  glassFillGradient: ["rgba(255,255,255,0.55)", "rgba(255,255,255,0.22)"],
  glassBorder: "rgba(20,10,10,0.08)",
  glassBorderSoft: "rgba(20,10,10,0.07)",
  glassIconBg: "rgba(20,10,10,0.05)",
  glassChipBg: "rgba(255,255,255,0.6)",

  specularTop: "rgba(255,255,255,0.85)",
  specularTopStrong: "rgba(255,255,255,0.95)",

  shadowColor: "#402020",
  shadowOpacityCard: 0.14,
  shadowOpacityPromo: 0.10,
  shadowOpacityModal: 0.16,

  accent: "#c0000a",
  accentSoft: "rgba(192,0,10,0.08)",
  accentBorder: "rgba(192,0,10,0.30)",
  accentGradient: ["#e8000f", "#a3000a"],

  dividerColor: "rgba(20,10,10,0.08)",
  dividerColorSoft: "rgba(20,10,10,0.06)",

  logoutText: "#c0392b",
  logoutBorder: "rgba(192,57,43,0.22)",

  notifDotBorder: "#f3f2f0",

  // Modal (Editar Perfil)
  modalOverlay: "rgba(30,15,15,0.32)",
  modalBg: "rgba(255,251,250,0.55)",
  modalBlurTint: "light",
  modalBorder: "rgba(20,10,10,0.10)",
  modalFillGradient: ["rgba(255,255,255,0.55)", "rgba(255,255,255,0.20)"],
  modalTitleColor: "#1a1414",
  modalSubtitleColor: "rgba(26,20,20,0.55)",
  closeBtnBg: "rgba(20,10,10,0.06)",
  closeBtnBorder: "rgba(20,10,10,0.10)",
  closeBtnIcon: "#1a1414",

  fieldLabelColor: "rgba(26,20,20,0.62)",
  fieldBorder: "rgba(20,10,10,0.12)",
  fieldIconColor: "rgba(26,20,20,0.5)",
  fieldTextColor: "#1a1414",
  fieldPlaceholder: "rgba(26,20,20,0.32)",
  fieldReadOnlyBorder: "rgba(20,10,10,0.06)",
  fieldReadOnlyText: "rgba(26,20,20,0.45)",
  fieldReadOnlyIcon: "rgba(26,20,20,0.30)",
  fieldLockIcon: "rgba(26,20,20,0.28)",
  fieldValidBorder: "rgba(36,158,90,0.55)",
  fieldErrorBorder: "rgba(214,68,58,0.55)",

  sexoOptionBorder: "rgba(20,10,10,0.12)",
  sexoOptionBg: "rgba(20,10,10,0.03)",
  sexoOptionSelectedBorder: "rgba(192,0,10,0.55)",
  sexoOptionText: "rgba(26,20,20,0.55)",
  sexoOptionTextSelected: "#ffffff",

  footerBorder: "rgba(20,10,10,0.08)",
  cancelBtnBg: "rgba(20,10,10,0.05)",
  cancelBtnBorder: "rgba(20,10,10,0.10)",
  cancelTextColor: "rgba(26,20,20,0.72)",
  saveBtnBorder: "rgba(20,10,10,0.10)",
  saveTextColor: "#ffffff",
  saveTextDisabledColor: "rgba(26,20,20,0.32)",
  saveDisabledGradient: ["rgba(20,10,10,0.08)", "rgba(20,10,10,0.04)"],
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — Identidade visual do plano de sócio (apenas apresentação)
// Deriva emoji/label/cores a partir de subscription.tier (API) + title/price
// já existentes no objeto subscription. Não introduz novos campos de dados,
// não cria estado, não toca em contexts.
// Agora recebe DS (tokens de tema) para adaptar cores neutras entre temas,
// preservando as cores de identidade de cada tier (diamante/ouro/prata).
// ─────────────────────────────────────────────────────────────────────────────
const getTierMeta = (DS) => ({
  diamante: {
    emoji: "👑",
    label: "Sócio Diamante",
    accent: DS.scheme === "dark" ? "#ffffff" : "#3a3a3c",
    cardColors:
      DS.scheme === "dark"
        ? ["#2c2c2e", "#161616", "#0a0a0a"]
        : ["#f2f2f4", "#e4e4e7", "#d4d4d8"],
    borderColor:
      DS.scheme === "dark" ? "rgba(255,255,255,0.30)" : "rgba(60,60,67,0.22)",
    glowColor:
      DS.scheme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(60,60,67,0.08)",
    textColor: DS.scheme === "dark" ? "#ffffff" : "#1a1414",
  },
  ouro: {
    emoji: "⭐",
    label: "Sócio Ouro",
    accent: DS.scheme === "dark" ? "#ff3b30" : "#c0000a",
    cardColors:
      DS.scheme === "dark"
        ? ["#3a0006", "#1c0002", "#0a0a0a"]
        : ["#fdebe9", "#fbd8d4", "#f5c1bc"],
    borderColor:
      DS.scheme === "dark" ? "rgba(232,0,15,0.42)" : "rgba(192,0,10,0.30)",
    glowColor:
      DS.scheme === "dark" ? "rgba(232,0,15,0.20)" : "rgba(192,0,10,0.10)",
    textColor: DS.scheme === "dark" ? "#ffece9" : "#5c0a06",
  },
  prata: {
    emoji: "🥈",
    label: "Sócio Prata",
    accent: DS.scheme === "dark" ? "#c7c9cc" : "#5c5c60",
    cardColors:
      DS.scheme === "dark"
        ? ["#2a2a2c", "#18181a", "#0a0a0a"]
        : ["#f4f4f5", "#e6e6e8", "#d8d8db"],
    borderColor:
      DS.scheme === "dark" ? "rgba(199,201,204,0.32)" : "rgba(92,92,96,0.22)",
    glowColor:
      DS.scheme === "dark" ? "rgba(199,201,204,0.14)" : "rgba(92,92,96,0.08)",
    textColor: DS.scheme === "dark" ? "#f0f0f2" : "#242426",
  },
});

const getDefaultTierMeta = (DS) => ({
  emoji: "⭐",
  label: null,
  accent: DS.accent,
  cardColors:
    DS.scheme === "dark"
      ? ["#3a0006", "#1c0002", "#0a0a0a"]
      : ["#fdebe9", "#fbd8d4", "#f5c1bc"],
  borderColor: DS.accentBorder,
  glowColor: DS.scheme === "dark" ? "rgba(232,0,15,0.20)" : "rgba(192,0,10,0.10)",
  textColor: DS.scheme === "dark" ? "#ffece9" : "#5c0a06",
});

const getPlanIdentity = (subscription, DS) => {
  if (!subscription) {
    return {
      isSocio: false,
      emoji: null,
      label: "Ainda não é Sócio Drakos",
      sublabel: "Torne-se Sócio Drakos",
      title: null,
      price: null,
      accent: DS.textMuted,
      cardColors:
        DS.scheme === "dark"
          ? ["rgba(255,255,255,0.07)", "rgba(255,255,255,0.02)"]
          : ["rgba(20,10,10,0.05)", "rgba(20,10,10,0.015)"],
      borderColor: DS.glassBorder,
      glowColor: DS.scheme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(20,10,10,0.03)",
      textColor: DS.textSecondary,
    };
  }

  const tierKey = String(subscription.tier || "").trim().toLowerCase();
  const TIER_META = getTierMeta(DS);
  const meta = TIER_META[tierKey] || getDefaultTierMeta(DS);

  return {
    isSocio: true,
    emoji: meta.emoji,
    label: meta.label || subscription.title || "Sócio Drakos",
    sublabel: subscription.title || null,
    title: subscription.title || null,
    price: subscription.price || null,
    accent: meta.accent,
    cardColors: meta.cardColors,
    borderColor: meta.borderColor,
    glowColor: meta.glowColor,
    textColor: meta.textColor,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMPONENTES DO POPUP "EDITAR PERFIL" — apenas UI, sem lógica de negócio
// ─────────────────────────────────────────────────────────────────────────────
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
  return parts.length > 0 ? `${baseDate} • ${parts.join(" • ")}` : baseDate;
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
  editStyles,
  DS,
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
        <BlurView intensity={26} tint={DS.modalBlurTint} style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={DS.scheme === "dark"
            ? ["rgba(255,255,255,0.07)", "rgba(255,255,255,0.02)"]
            : ["rgba(255,255,255,0.5)", "rgba(255,255,255,0.15)"]}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons
          name={icon}
          size={16}
          color={DS.fieldIconColor}
          style={editStyles.fieldIcon}
        />
        <TextInput
          ref={inputRef}
          style={editStyles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={DS.fieldPlaceholder}
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
  editStyles,
  DS,
}) {
  return (
    <View style={editStyles.fieldWrap}>
      <Text style={editStyles.fieldLabel}>{label}</Text>
      <View style={[editStyles.inputShell, editStyles.inputShellReadOnly]}>
        <BlurView intensity={14} tint={DS.modalBlurTint} style={StyleSheet.absoluteFill} />
        <Ionicons
          name={icon}
          size={16}
          color={DS.fieldReadOnlyIcon}
          style={editStyles.fieldIcon}
        />
        <Text style={editStyles.readOnlyText} numberOfLines={1}>
          {value || "Não informado"}
        </Text>
        <Ionicons
          name="lock-closed"
          size={13}
          color={DS.fieldLockIcon}
          style={editStyles.validIcon}
        />
      </View>
    </View>
  );
});

const SexoSelector = React.memo(function SexoSelector({
  value,
  onChange,
  editStyles,
}) {
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
                color={selected ? "#ffffff" : editStyles.sexoOptionIconColor}
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
  const { isDark } = useTheme();
  const DS = useMemo(
    () => (isDark ? DARK_DS : LIGHT_DS),
    [isDark],
  );
  const ps = useMemo(() => makePs(DS), [DS]);
  const editStyles = useMemo(() => makeEditStyles(DS), [DS]);

  const [editingField, setEditingField] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { subscription } = useSubscription();
  const { cliente, token, signOut, updateCliente } = useAuth();
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  const currentCliente = buildProfileSnapshot(cliente);
  const activePlanCategory = trimValue(
    subscription?.title
      || subscription?.nome_plano
      || subscription?.nome
      || subscription?.plan?.title
      || subscription?.plan?.nome,
  );
  const currentUser = {
    name: buildDisplayName(currentCliente),
    email: currentCliente.email,
    phone: currentCliente.telefone,
    photo: currentCliente.url_foto_clientes,
    cpf: currentCliente.cpf,
    id: currentCliente.id_clientes,
    category: activePlanCategory,
    status: activePlanCategory || user.status,
  };

  // ── Derivações puras de apresentação (não criam estado nem tocam contexts) ──
  const planIdentity = useMemo(
    () => getPlanIdentity(subscription, DS),
    [subscription, DS],
  );
  const beneficiosAtivos = Array.isArray(subscription?.beneficios)
    ? subscription.beneficios
    : [];

  const [profileDraft, setProfileDraft] = useState(currentCliente);
  const originalProfileRef = useRef(currentCliente);

  // Foto pendente: verdadeiro quando o rascunho da foto difere da foto salva.
  // Puramente derivado do estado já existente (profileDraft) — não é um novo
  // estado de negócio, apenas uma comparação para controlar a UI.
  const hasPendingPhoto = useMemo(() => {
    const draftPhoto = trimValue(profileDraft.url_foto_clientes);
    const savedPhoto = trimValue(
      originalProfileRef.current?.url_foto_clientes,
    );
    return draftPhoto.length > 0 && draftPhoto !== savedPhoto;
  }, [profileDraft.url_foto_clientes]);

  // ── Estado exclusivo da experiência do popup "Editar Perfil" (apenas UI) ──
  const [touchedFields, setTouchedFields] = useState({});
  const modalAnim = useRef(new Animated.Value(0)).current;

  // ── Estado exclusivo do botão "Salvar alterações" da foto (apenas UI) ─────
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

      loadPurchaseHistory();

      return () => {
        isActive = false;
      };
    }, [token]),
  );

  useEffect(() => {
    if (!editModalVisible) {
      setProfileDraft(buildProfileSnapshot(cliente));
      originalProfileRef.current = buildProfileSnapshot(cliente);
    }
  }, [cliente, editModalVisible]);

  // ── Animação de abertura/fechamento do popup (apenas visual) ──────────────
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

  // ── Atualização de campos do formulário (mesmo shape de estado original) ──
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

  // ── Validação discreta (não bloqueia nada além do botão Salvar) ───────────
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
        "Permissão necessária",
        "Precisamos de acesso à galeria para escolher uma foto de perfil.",
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
        error?.message || "Não foi possível salvar os dados.",
      );
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert("Erro", error?.message || "Não foi possível sair da conta.");
    }
  };

  // ── Wrapper apenas de UI: reutiliza handleSaveProfile (sem alterá-la) para
  // acionar o salvamento a partir do botão flutuante da foto, com feedback
  // visual de carregamento (isSavingPhoto). ─────────────────────────────────
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
    <View style={ps.container}>
      {/* BACKGROUND */}
      <LinearGradient
        colors={DS.bgGradient}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={ps.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ══════════════════════════════════════════════════════════════
            HERO CARD — foto, nome, categoria, status premium do sócio
        ══════════════════════════════════════════════════════════════ */}
        <View style={ps.hero}>
          <Image
            source={escudoDrakos}
            style={ps.heroWatermark}
            resizeMode="contain"
          />
          <LinearGradient
            colors={
              DS.scheme === "dark"
                ? ["transparent", "rgba(5,5,5,0.55)", "#050505"]
                : ["transparent", "rgba(243,242,240,0.55)", "#f3f2f0"]
            }
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
              />
            </View>
            <TouchableOpacity
              style={ps.editAvatarBtn}
              activeOpacity={0.8}
              onPress={pickProfileImage}
            >
              <BlurView intensity={30} tint={DS.modalBlurTint} style={StyleSheet.absoluteFill} />
              <View style={ps.editAvatarBorder} />
              <Ionicons name="camera" size={13} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={ps.username}>{currentUser.name}</Text>

          {/* Chip de status — identificação premium do plano do sócio */}
          <View style={ps.statusChip}>
            <BlurView intensity={34} tint={DS.modalBlurTint} style={StyleSheet.absoluteFill} />
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
              {planIdentity.label}
            </Text>
          </View>

          {/* Botão "Salvar alterações" — aparece só com foto pendente */}
          {hasPendingPhoto && (
            <TouchableOpacity
              style={ps.savePhotoBtn}
              activeOpacity={0.85}
              onPress={handleSavePendingPhoto}
              disabled={isSavingPhoto}
            >
              <LinearGradient
                colors={DS.accentGradient}
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

        {/* ══════════════════════════════════════════════════════════════
            MEMBERSHIP CARD — cartão de sócio premium independente
        ══════════════════════════════════════════════════════════════ */}
        {subscription ? (
          <View style={ps.membershipCard}>
            <LinearGradient
              colors={planIdentity.cardColors}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
            />
            <BlurView
              intensity={16}
              tint={DS.modalBlurTint}
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

            <Text style={[ps.membershipTitle, { color: planIdentity.textColor }]}>
              {planIdentity.title || planIdentity.label}
            </Text>
            <Text style={ps.membershipSubtitle}>Sócio-torcedor Drakos FC</Text>

            <View style={ps.membershipDivider} />

            <View style={ps.membershipFooterRow}>
              <View style={ps.membershipBenefits}>
                <Text style={ps.membershipBenefitsTitle}>Benefícios do plano</Text>
                <Text style={ps.membershipBenefitsSubtitle}>
                  Vantagens ativas da assinatura atual
                </Text>
                {beneficiosAtivos.map((beneficio, index) => (
                  <View key={`${String(beneficio)}-${index}`} style={ps.membershipBenefitItem}>
                    <Ionicons name="checkmark-circle" size={13} color={planIdentity.accent} />
                    <Text style={ps.membershipBenefitText}>{beneficio}</Text>
                  </View>
                ))}
              </View>
              {planIdentity.price ? (
                <Text style={[ps.membershipPrice, { color: planIdentity.textColor }]}>{planIdentity.price}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={ps.membershipManageBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Socio")}
            >
              <BlurView intensity={24} tint={DS.modalBlurTint} style={StyleSheet.absoluteFill} />
              <View style={ps.membershipManageBorder} />
              <Text style={[ps.membershipManageBtnText, { color: planIdentity.textColor }]}>Gerenciar assinatura</Text>
              <Ionicons name="chevron-forward" size={14} color={planIdentity.textColor} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={ps.membershipPromo}
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Socio")}
          >
            <LinearGradient
              colors={
                DS.scheme === "dark"
                  ? ["#2a0004", "#150002", "#0a0a0a"]
                  : ["#fdebe9", "#fbd8d4", "#f5c1bc"]
              }
              style={StyleSheet.absoluteFill}
              start={{ x: 0.1, y: 0 }}
              end={{ x: 0.9, y: 1 }}
            />
            <View style={ps.membershipBorder} />
            <View style={ps.membershipSpecularTop} />

            <View style={ps.membershipPromoIconWrap}>
              <Ionicons name="shield-outline" size={22} color={DS.accent} />
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
              <Ionicons name="arrow-forward" size={15} color={DS.accent} />
            </View>
          </TouchableOpacity>
        )}

        {/* ══════════════════════════════════════════════════════════════
            BOAS-VINDAS — mensagem leve com notificação
        ══════════════════════════════════════════════════════════════ */}
        <View style={ps.welcomeCard}>
          <BlurView intensity={32} tint={DS.modalBlurTint} style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={DS.glassFillGradient}
            style={StyleSheet.absoluteFill}
          />
          <View style={ps.welcomeBorder} />

          <View style={ps.welcomeIconWrap}>
            <Ionicons name="sparkles-outline" size={16} color={DS.accent} />
          </View>
          <Text style={ps.welcomeBody}>
            Olá, {currentUser.name.split(" ")[0]}. Explore as novidades,
            confira seus dados e aproveite ao máximo sua experiência com a
            gente.
          </Text>
          <TouchableOpacity style={ps.notifBadge} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={18} color={DS.textPrimary} />
            <View style={ps.notifDot} />
          </TouchableOpacity>
        </View>

        {/* ══════════════════════════════════════════════════════════════
            AÇÕES RÁPIDAS
        ══════════════════════════════════════════════════════════════ */}
        <Text style={ps.groupLabel}>Acesso rápido</Text>
        <View style={ps.actionsRow}>
          <TouchableOpacity style={ps.actionCard} activeOpacity={0.85}>
            <BlurView intensity={30} tint={DS.modalBlurTint} style={StyleSheet.absoluteFill} />
            <View style={ps.actionBorder} />
            <View style={ps.actionIconWrap}>
              <Ionicons name="card-outline" size={19} color={DS.textPrimary} />
            </View>
            <Text style={ps.actionLabel}>Meu Cartão</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={ps.actionCard}
            activeOpacity={0.85}
            onPress={() => setShowHistory((prev) => !prev)}
          >
            <BlurView intensity={30} tint={DS.modalBlurTint} style={StyleSheet.absoluteFill} />
            <View style={ps.actionBorder} />
            <View style={ps.actionIconWrap}>
              <Ionicons name="receipt-outline" size={19} color={DS.textPrimary} />
            </View>
            <Text style={ps.actionLabel}>Compras</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={ps.actionCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Socio")}
          >
            <BlurView intensity={30} tint={DS.modalBlurTint} style={StyleSheet.absoluteFill} />
            <View style={ps.actionBorder} />
            <View style={ps.actionIconWrap}>
              <Ionicons name="people-outline" size={19} color={DS.textPrimary} />
            </View>
            <Text style={ps.actionLabel}>Sócio</Text>
          </TouchableOpacity>
        </View>

        {/* ══════════════════════════════════════════════════════════════
            HISTÓRICO — mesmo funcionamento, cartões renovados
        ══════════════════════════════════════════════════════════════ */}
        {showHistory && (
          <View style={ps.historySection}>
            <BlurView intensity={32} tint={DS.modalBlurTint} style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={DS.glassFillGradient}
              style={StyleSheet.absoluteFill}
            />
            <View style={ps.historyBorder} />

            <View style={ps.historyHeader}>
              <Text style={ps.historyTitle}>Compras e assinaturas</Text>
              <TouchableOpacity
                onPress={() => setShowHistory(false)}
                activeOpacity={0.7}
                style={ps.historyCloseBtn}
              >
                <Ionicons name="close" size={15} color={DS.textPrimary} />
              </TouchableOpacity>
            </View>

            {subscription && (
              <View style={ps.historySubBadge}>
                {planIdentity.isSocio && (
                  <Text style={ps.historySubEmoji}>{planIdentity.emoji}</Text>
                )}
                <Text style={ps.historySubText}>
                  Assinatura ativa: {subscription.title}
                </Text>
                <Text style={ps.historySubPrice}>{subscription.price}</Text>
              </View>
            )}

            <Text style={ps.historyListTitle}>Histórico</Text>

            {purchaseHistory && purchaseHistory.length > 0 ? (
              purchaseHistory.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <View style={ps.historyRow}>
                    {item.type === "subscription" ? (
                      <View style={ps.historyIconWrap}>
                        <Ionicons
                          name="shield-checkmark-outline"
                          size={15}
                          color={DS.accent}
                        />
                      </View>
                    ) : item.itemImages && item.itemImages[0] ? (
                      <Image
                        source={item.itemImages[0]}
                        style={ps.historyProductImage}
                      />
                    ) : (
                      <View style={ps.historyIconWrap}>
                        <Ionicons name="bag-outline" size={15} color={DS.accent} />
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
                  color={DS.scheme === "dark" ? "rgba(255,255,255,0.22)" : "rgba(26,20,20,0.20)"}
                />
                <Text style={ps.historyEmptyText}>
                  Nenhuma compra ou assinatura ainda
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ══════════════════════════════════════════════════════════════
            DADOS PESSOAIS
        ══════════════════════════════════════════════════════════════ */}
        <View style={ps.sectionHeaderCustom}>
          <Text style={ps.sectionTitle}>Dados pessoais</Text>
          <TouchableOpacity
            style={ps.sectionEditBtn}
            onPress={() => setEditModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil-outline" size={15} color={DS.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={ps.infoCard}>
          <BlurView intensity={32} tint={DS.modalBlurTint} style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={DS.glassFillGradient}
            style={StyleSheet.absoluteFill}
          />
          <View style={ps.infoBorder} />

          <View style={ps.infoRow}>
            <View style={ps.infoLeft}>
              <View style={ps.infoIconWrap}>
                <Ionicons name="person-outline" size={15} color={DS.textPrimary} />
              </View>
              <View style={ps.infoTextGroup}>
                <Text style={ps.infoLabel}>Nome completo</Text>
                <Text style={ps.infoValue}>{currentUser.name}</Text>
              </View>
            </View>
          </View>

          <View style={ps.infoDivider} />

          <View style={ps.infoRow}>
            <View style={ps.infoLeft}>
              <View style={ps.infoIconWrap}>
                <Ionicons name="mail-outline" size={15} color={DS.textPrimary} />
              </View>
              <View style={ps.infoTextGroup}>
                <Text style={ps.infoLabel}>Email</Text>
                <Text style={ps.infoValue}>{currentUser.email}</Text>
              </View>
            </View>
          </View>

          <View style={ps.infoDivider} />

          <View style={ps.infoRow}>
            <View style={ps.infoLeft}>
              <View style={ps.infoIconWrap}>
                <Ionicons name="call-outline" size={15} color={DS.textPrimary} />
              </View>
              <View style={ps.infoTextGroup}>
                <Text style={ps.infoLabel}>Telefone</Text>
                <Text style={ps.infoValue}>{currentUser.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ══════════════════════════════════════════════════════════════
            SAIR
        ══════════════════════════════════════════════════════════════ */}
        <TouchableOpacity
          style={ps.logoutBtn}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <BlurView intensity={22} tint={DS.modalBlurTint} style={StyleSheet.absoluteFill} />
          <View style={ps.logoutBorder} />
          <Ionicons name="log-out-outline" size={17} color={DS.logoutText} />
          <Text style={ps.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>


      {/* MODAL EDITAR PERFIL — Liquid Glass */}
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
                tint={DS.modalBlurTint}
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={DS.modalFillGradient}
                style={StyleSheet.absoluteFill}
              />
              <View style={editStyles.specularTop} />
              <View style={editStyles.modalBorder} />

              {/* Cabeçalho */}
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
                  <Ionicons name="close" size={18} color={DS.closeBtnIcon} />
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
                  editStyles={editStyles}
                  DS={DS}
                />

                <Text style={editStyles.sectionLabel}>Informações básicas</Text>

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
                  editStyles={editStyles}
                  DS={DS}
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
                  editStyles={editStyles}
                  DS={DS}
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
                  editStyles={editStyles}
                  DS={DS}
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
                  editStyles={editStyles}
                  DS={DS}
                />

                <SexoSelector
                  value={profileDraft.sexo}
                  onChange={handleSexoChange}
                  editStyles={editStyles}
                />

                <Text style={editStyles.sectionLabel}>Endereço</Text>

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
                  editStyles={editStyles}
                  DS={DS}
                />

                <View style={editStyles.rowTwo}>
                  <View style={{ flex: 1 }}>
                    <GlassField
                      label="Número"
                      icon="pin-outline"
                      value={profileDraft.casa_numero}
                      onChangeText={handleNumeroChange}
                      placeholder="Nº"
                      keyboardType="numeric"
                      maxLength={10}
                      returnKeyType="next"
                      inputRef={numeroRef}
                      onSubmitEditing={() => cepRef.current?.focus()}
                      editStyles={editStyles}
                      DS={DS}
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
                      editStyles={editStyles}
                      DS={DS}
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
                  editStyles={editStyles}
                  DS={DS}
                />

                <GlassField
                  label="Complemento"
                  icon="add-circle-outline"
                  value={profileDraft.complemento}
                  onChangeText={handleComplementoChange}
                  placeholder="Apartamento, bloco, referência..."
                  maxLength={120}
                  returnKeyType="done"
                  blurOnSubmit
                  inputRef={complementoRef}
                  onSubmitEditing={() => complementoRef.current?.blur()}
                  editStyles={editStyles}
                  DS={DS}
                />

                <Text style={editStyles.sectionLabel}>Dados verificados</Text>

                <ReadOnlyField
                  label="CPF"
                  icon="card-outline"
                  value={currentUser.cpf}
                  editStyles={editStyles}
                  DS={DS}
                />
                <ReadOnlyField
                  label="ID do cliente"
                  icon="finger-print-outline"
                  value={currentUser.id}
                  editStyles={editStyles}
                  DS={DS}
                />
                <ReadOnlyField
                  label="Categoria"
                  icon="ribbon-outline"
                  value={currentUser.category}
                  editStyles={editStyles}
                  DS={DS}
                />
              </ScrollView>

              {/* Rodapé com ações */}
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
                        ? DS.accentGradient
                        : DS.saveDisabledGradient
                    }
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                  <Ionicons
                    name="checkmark"
                    size={17}
                    color={
                      isProfileFormValid ? "#fff" : DS.saveTextDisabledColor
                    }
                  />
                  <Text
                    style={[
                      editStyles.saveText,
                      !isProfileFormValid && editStyles.saveTextDisabled,
                    ]}
                  >
                    Salvar alterações
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
// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS — PerfilScreen (Liquid Glass Premium, 100% local a este arquivo)
// Hero cinematográfico + Membership Card + cartões renovados.
// Regra de sombra iOS: containers com shadow* NÃO usam overflow:'hidden';
// um wrapper interno separado faz o clip de blur/gradiente.
//
// Convertido para factory makePs(DS) para suportar Light/Dark Mode mantendo
// a mesma estrutura/valores de layout já existentes — apenas cores/tokens
// passam a vir de DS. Nenhuma prop, nome de chave ou valor de layout
// (paddings, tamanhos, radius, gaps) foi alterado.
// ─────────────────────────────────────────────────────────────────────────────
const makePs = (DS) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 56,
      paddingBottom: 40,
      gap: 18,
    },

    // ── HERO ──────────────────────────────────────────────────────────────
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
      opacity: DS.scheme === "dark" ? 0.05 : 0.045,
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
      backgroundColor: DS.scheme === "dark" ? "rgba(232,0,15,0.9)" : "rgba(192,0,10,0.92)",
    },
    editAvatarBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 15,
      borderWidth: 1,
      borderColor: DS.scheme === "dark" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.55)",
    },
    username: {
      color: DS.textPrimary,
      fontSize: 24,
      fontWeight: "800",
      letterSpacing: -0.3,
      textAlign: "center",
    },
    categoryText: {
      color: DS.textMuted,
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

    // ── MEMBERSHIP CARD ───────────────────────────────────────────────────
    membershipCard: {
      borderRadius: 22,
      overflow: "hidden",
      padding: 18,
      shadowColor: DS.shadowColor,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: DS.shadowOpacityCard,
      shadowRadius: 20,
      elevation: 12,
    },
    membershipBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: DS.accentBorder,
    },
    membershipSpecularTop: {
      position: "absolute",
      top: 0,
      left: "14%",
      right: "14%",
      height: 1,
      backgroundColor: DS.specularTop,
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
      color: DS.textPrimary,
      fontSize: 21,
      fontWeight: "900",
      letterSpacing: -0.4,
      marginTop: 14,
    },
    membershipSubtitle: {
      color: DS.textMuted,
      fontSize: 12,
      fontWeight: "500",
      marginTop: 3,
    },
    membershipDivider: {
      height: 1,
      backgroundColor: DS.dividerColor,
      marginVertical: 16,
    },
    membershipFooterRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    membershipBenefits: {
      gap: 8,
      flex: 1,
      paddingRight: 14,
    },
    membershipBenefitsTitle: {
      color: DS.textPrimary,
      fontSize: 13,
      fontWeight: "800",
      letterSpacing: 0.2,
    },
    membershipBenefitsSubtitle: {
      color: DS.textMuted,
      fontSize: 11,
      fontWeight: "500",
      marginBottom: 2,
    },
    membershipBenefitItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    membershipBenefitText: {
      color: DS.textSecondary,
      fontSize: 12,
      fontWeight: "500",
    },
    membershipPrice: {
      color: DS.textPrimary,
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
      borderColor: DS.scheme === "dark" ? "rgba(255,255,255,0.16)" : "rgba(20,10,10,0.10)",
    },
    membershipManageBtnText: {
      color: DS.textPrimary,
      fontSize: 13,
      fontWeight: "700",
    },

    membershipPromo: {
      borderRadius: 22,
      overflow: "hidden",
      padding: 18,
      shadowColor: DS.shadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: DS.shadowOpacityPromo,
      shadowRadius: 16,
      elevation: 8,
    },
    membershipPromoIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: DS.accentSoft,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    membershipPromoTextGroup: {
      marginBottom: 16,
    },
    membershipPromoTitle: {
      color: DS.textPrimary,
      fontSize: 17,
      fontWeight: "800",
      marginBottom: 6,
    },
    membershipPromoBody: {
      color: DS.textSecondary,
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
      color: DS.accent,
      fontSize: 13.5,
      fontWeight: "800",
    },

    // ── BOAS-VINDAS ───────────────────────────────────────────────────────
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
      borderColor: DS.glassBorder,
    },
    welcomeIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: DS.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    welcomeBody: {
      flex: 1,
      color: DS.textSecondary,
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
      borderColor: DS.notifDotBorder,
    },

    // ── AÇÕES RÁPIDAS ─────────────────────────────────────────────────────
    groupLabel: {
      color: DS.textFaint,
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
      borderColor: DS.glassBorderSoft,
    },
    actionIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: DS.glassIconBg,
      alignItems: "center",
      justifyContent: "center",
    },
    actionLabel: {
      color: DS.textPrimary,
      fontSize: 11.5,
      fontWeight: "600",
      textAlign: "center",
    },

    // ── HISTÓRICO ─────────────────────────────────────────────────────────
    historySection: {
      borderRadius: 18,
      overflow: "hidden",
      padding: 16,
    },
    historyBorder: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: DS.glassBorder,
    },
    historyHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    historyTitle: {
      color: DS.textPrimary,
      fontSize: 15,
      fontWeight: "700",
    },
    historyCloseBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: DS.glassIconBg,
      alignItems: "center",
      justifyContent: "center",
    },
    historySubBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: DS.accentSoft,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: DS.scheme === "dark" ? "rgba(232,0,15,0.20)" : "rgba(192,0,10,0.16)",
      marginBottom: 14,
      gap: 8,
    },
    historySubEmoji: {
      fontSize: 13,
    },
    historySubText: {
      color: DS.textPrimary,
      fontSize: 12.5,
      fontWeight: "600",
      flex: 1,
    },
    historySubPrice: {
      color: DS.textPrimary,
      fontSize: 12.5,
      fontWeight: "700",
    },
    historyListTitle: {
      color: DS.textMuted,
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
      backgroundColor: DS.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    historyInfo: {
      flex: 1,
      marginLeft: 10,
    },
    historyPlan: {
      color: DS.textPrimary,
      fontSize: 13.5,
      fontWeight: "600",
    },
    historyDate: {
      color: DS.textMuted,
      fontSize: 11,
      marginTop: 1,
    },
    historyPrice: {
      color: DS.textPrimary,
      fontSize: 13.5,
      fontWeight: "700",
    },
    historyDivider: {
      height: 1,
      backgroundColor: DS.dividerColorSoft,
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
      color: DS.textFaint,
      fontSize: 12.5,
      textAlign: "center",
    },

    // ── DADOS PESSOAIS ────────────────────────────────────────────────────
    sectionHeaderCustom: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sectionTitle: {
      color: DS.textPrimary,
      fontSize: 16,
      fontWeight: "800",
      letterSpacing: 0.2,
    },
    sectionEditBtn: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: DS.glassIconBg,
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
      borderColor: DS.glassBorder,
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
      backgroundColor: DS.glassIconBg,
      alignItems: "center",
      justifyContent: "center",
    },
    infoTextGroup: {
      flex: 1,
    },
    infoLabel: {
      color: DS.textFaint,
      fontSize: 10.5,
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 3,
    },
    infoValue: {
      color: DS.textPrimary,
      fontSize: 14.5,
      fontWeight: "600",
    },
    infoDivider: {
      height: 1,
      backgroundColor: DS.dividerColorSoft,
      marginHorizontal: 16,
    },

    // ── SAIR ──────────────────────────────────────────────────────────────
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
      borderColor: DS.logoutBorder,
    },
    logoutText: {
      color: DS.logoutText,
      fontSize: 14.5,
      fontWeight: "600",
      letterSpacing: 0.3,
    },
  });

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS — Popup "Editar Perfil" (Liquid Glass, escopo local ao componente)
// Convertido para factory makeEditStyles(DS). O popup mantém a MESMA estrutura,
// mesmo layout e mesmo comportamento — apenas os tokens de cor mudam com o tema.
// ─────────────────────────────────────────────────────────────────────────────
const makeEditStyles = (DS) => {
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: DS.modalOverlay,
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
      backgroundColor: DS.modalBg,
      shadowColor: DS.shadowColor,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: DS.shadowOpacityModal,
      shadowRadius: 30,
      elevation: 20,
    },
    specularTop: {
      position: "absolute",
      top: 0,
      left: "12%",
      right: "12%",
      height: 1,
      backgroundColor: DS.specularTopStrong,
    },
    modalBorder: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 28,
      borderWidth: 0.75,
      borderColor: DS.modalBorder,
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
      color: DS.modalTitleColor,
      letterSpacing: 0.2,
    },
    modalSubtitle: {
      fontSize: 12.5,
      color: DS.modalSubtitleColor,
      marginTop: 2,
    },
    closeIconBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: DS.closeBtnBg,
      borderWidth: 0.75,
      borderColor: DS.closeBtnBorder,
    },
    scrollContent: {
      paddingHorizontal: 22,
      paddingBottom: 18,
    },
    sectionLabel: {
      fontSize: 11.5,
      fontWeight: "700",
      color: DS.textFaint,
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
      color: DS.fieldLabelColor,
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
      borderColor: DS.fieldBorder,
    },
    inputShellValid: {
      borderColor: DS.fieldValidBorder,
    },
    inputShellError: {
      borderColor: DS.fieldErrorBorder,
    },
    inputShellReadOnly: {
      borderColor: DS.fieldReadOnlyBorder,
    },
    fieldIcon: {
      marginRight: 10,
    },
    fieldInput: {
      flex: 1,
      fontSize: 15,
      color: DS.fieldTextColor,
      padding: 0,
    },
    readOnlyText: {
      flex: 1,
      fontSize: 15,
      color: DS.fieldReadOnlyText,
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
      borderColor: DS.sexoOptionBorder,
      backgroundColor: DS.sexoOptionBg,
    },
    sexoOptionSelected: {
      borderColor: DS.sexoOptionSelectedBorder,
    },
    sexoOptionText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: "600",
      color: DS.sexoOptionText,
    },
    sexoOptionTextSelected: {
      color: DS.sexoOptionTextSelected,
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
      borderTopColor: DS.footerBorder,
    },
    cancelBtn: {
      flex: 1,
      height: 48,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: DS.cancelBtnBg,
      borderWidth: 0.75,
      borderColor: DS.cancelBtnBorder,
    },
    cancelText: {
      color: DS.cancelTextColor,
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
      borderColor: DS.saveBtnBorder,
    },
    saveText: {
      color: DS.saveTextColor,
      fontSize: 15,
      fontWeight: "700",
    },
    saveTextDisabled: {
      color: DS.saveTextDisabledColor,
    },
  });

  // Valor auxiliar não-estilo (cor do ícone do seletor Sexo quando não
  // selecionado), consumido pelo SexoSelector. Mantido fora do objeto de
  // estilos do StyleSheet.create para não quebrar validação de estilos RN,
  // mas anexado ao mesmo objeto retornado por conveniência de uso local.
  styles.sexoOptionIconColor = DS.sexoOptionText;

  return styles;
};
