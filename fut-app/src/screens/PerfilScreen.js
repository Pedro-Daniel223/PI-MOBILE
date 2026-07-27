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
import { stylesPerfil } from "../styles/stylePerfil/stylePerfil";
import { escudoDrakos, user as defaultUser } from "../data/dataPerfil";
import { fetchPurchaseHistory } from "../services/purchaseService";

import { useSubscription } from "../contexts/SubscriptionContext";
import { useAuth } from "../contexts/AuthContext";

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
// HELPER — Identidade visual do plano de sócio (apenas apresentação)
// Deriva emoji/label/cores a partir de subscription.tier (API) + title/price
// já existentes no objeto subscription. Não introduz novos campos de dados.
// ─────────────────────────────────────────────────────────────────────────────
const TIER_META = {
  diamante: {
    emoji: "💎",
    label: "Sócio Diamante",
    colors: ["#dff3ff", "#8fd4f7", "#4fa8d8"],
    borderColor: "rgba(143,212,247,0.45)",
    glowColor: "rgba(143,212,247,0.25)",
    textColor: "#eaf8ff",
  },
  ouro: {
    emoji: "👑",
    label: "Sócio Ouro",
    colors: ["#fff2c9", "#f0c866", "#c99a2e"],
    borderColor: "rgba(240,200,102,0.45)",
    glowColor: "rgba(240,200,102,0.25)",
    textColor: "#fff8e6",
  },
  prata: {
    emoji: "🛡",
    label: "Sócio Prata",
    colors: ["#f4f6f8", "#c9d1da", "#98a4b0"],
    borderColor: "rgba(201,209,218,0.45)",
    glowColor: "rgba(201,209,218,0.22)",
    textColor: "#f6f8fa",
  },
};

const DEFAULT_TIER_META = {
  emoji: "⭐",
  label: null,
  colors: ["#fff2c9", "#f0c866", "#c99a2e"],
  borderColor: "rgba(240,200,102,0.45)",
  glowColor: "rgba(240,200,102,0.25)",
  textColor: "#fff8e6",
};

const getPlanIdentity = (subscription) => {
  if (!subscription) {
    return {
      isSocio: false,
      emoji: "🔓",
      label: "Ainda não é Sócio Drakos",
      sublabel: "Torne-se Sócio Drakos",
      title: null,
      price: null,
      colors: ["rgba(255,255,255,0.14)", "rgba(255,255,255,0.05)"],
      borderColor: "rgba(255,255,255,0.18)",
      glowColor: "rgba(255,255,255,0.08)",
      textColor: "#ffffff",
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
    colors: meta.colors,
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
          {value || "Não informado"}
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
  const { subscription } = useSubscription();
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
    status: currentCliente.categoria_clientes || user.status,
  };

  const planIdentity = useMemo(
    () => getPlanIdentity(subscription),
    [subscription],
  );

  const [profileDraft, setProfileDraft] = useState(currentCliente);
  const originalProfileRef = useRef(currentCliente);

  // ── Estado exclusivo da experiência do popup "Editar Perfil" (apenas UI) ──
  const [touchedFields, setTouchedFields] = useState({});
  const modalAnim = useRef(new Animated.Value(0)).current;

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

  const currentAvatarUri =
    trimValue(profileDraft.url_foto_clientes) ||
    trimValue(currentCliente.url_foto_clientes) ||
    DEFAULT_AVATAR;

  return (
    <View style={stylesPerfil.container}>
      {/* BACKGROUND GRADIENT */}
      <LinearGradient
        colors={["#b30000", "#5a0000", "#1a0000"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={stylesPerfil.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER COM AVATAR ── */}
        <View style={stylesPerfil.header}>
          <Image
            source={escudoDrakos}
            style={stylesPerfil.drakosBg}
            resizeMode="contain"
          />
          <View style={stylesPerfil.avatarWrapper}>
            <Image
              source={{ uri: currentAvatarUri }}
              style={stylesPerfil.avatar}
            />
            <TouchableOpacity
              style={stylesPerfil.editAvatarBtn}
              activeOpacity={0.8}
              onPress={pickProfileImage}
            >
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={stylesPerfil.username}>{currentUser.name}</Text>

          {/* ── IDENTIFICAÇÃO PREMIUM DO PLANO (substitui "Status atual: ...") ── */}
          <View style={stylesPerfil.statusChip}>
            <BlurView
              intensity={30}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={[planIdentity.glowColor, "transparent"]}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View
              style={[
                stylesPerfil.statusChipBorder,
                { borderColor: planIdentity.borderColor },
              ]}
            />
            {planIdentity.isSocio && (
              <Text style={stylesPerfil.statusChipEmoji}>
                {planIdentity.emoji}
              </Text>
            )}
            <Text
              style={[
                stylesPerfil.statusChipText,
                { color: planIdentity.textColor },
              ]}
            >
              {planIdentity.label}
            </Text>
          </View>
        </View>

        {/* ── CARD DE BOAS-VINDAS / PAINEL DE ASSINATURA ── */}
        <View style={stylesPerfil.welcomeCard}>
          <BlurView
            intensity={40}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={stylesPerfil.welcomeBorder} />

          <View style={stylesPerfil.welcomeHeader}>
            <Text style={stylesPerfil.welcomeTitle}>Seja bem-vindo</Text>
            <TouchableOpacity
              style={stylesPerfil.notifBadge}
              activeOpacity={0.8}
            >
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              <View style={stylesPerfil.notifDot} />
            </TouchableOpacity>
          </View>

          <Text style={stylesPerfil.welcomeBody}>
            Olá, {currentUser.name}
            {"\n"}Explore as novidades, confira seus dados e aproveite ao máximo
            sua experiência com a gente!
          </Text>

          {subscription ? (
            /* ── ESTADO SÓCIO: painel com plano, benefícios e status ── */
            <View style={stylesPerfil.planPanel}>
              <LinearGradient
                colors={[planIdentity.glowColor, "transparent"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View
                style={[
                  stylesPerfil.planPanelBorder,
                  { borderColor: planIdentity.borderColor },
                ]}
              />

              <View style={stylesPerfil.planPanelHeader}>
                <View style={stylesPerfil.planPanelHeaderLeft}>
                  <Text style={stylesPerfil.planPanelEmoji}>
                    {planIdentity.emoji}
                  </Text>
                  <View>
                    <Text style={stylesPerfil.planPanelTitle}>
                      {planIdentity.title || planIdentity.label}
                    </Text>
                    <View style={stylesPerfil.planPanelStatusRow}>
                      <View style={stylesPerfil.planPanelStatusDot} />
                      <Text style={stylesPerfil.planPanelStatusText}>
                        Assinatura ativa
                      </Text>
                    </View>
                  </View>
                </View>
                {planIdentity.price ? (
                  <Text style={stylesPerfil.planPanelPrice}>
                    {planIdentity.price}
                  </Text>
                ) : null}
              </View>

              <View style={stylesPerfil.planPanelDivider} />

              <View style={stylesPerfil.planPanelBenefits}>
                <View style={stylesPerfil.planPanelBenefitItem}>
                  <Ionicons name="checkmark-circle" size={15} color="#4ee08a" />
                  <Text style={stylesPerfil.planPanelBenefitText}>
                    Acesso aos benefícios do seu plano
                  </Text>
                </View>
                <View style={stylesPerfil.planPanelBenefitItem}>
                  <Ionicons name="checkmark-circle" size={15} color="#4ee08a" />
                  <Text style={stylesPerfil.planPanelBenefitText}>
                    Prioridade em compras e ingressos
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={stylesPerfil.planPanelManageBtn}
                activeOpacity={0.85}
                onPress={() => navigation.navigate("Socio")}
              >
                <Text style={stylesPerfil.planPanelManageBtnText}>
                  Gerenciar assinatura
                </Text>
                <Ionicons name="chevron-forward" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            /* ── ESTADO NÃO-SÓCIO: incentivo à assinatura ── */
            <View style={stylesPerfil.planPanel}>
              <LinearGradient
                colors={["rgba(232,0,15,0.14)", "transparent"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={stylesPerfil.planPanelBorder} />

              <View style={stylesPerfil.planPanelPromoHeader}>
                <Ionicons name="star-outline" size={20} color="#ffd166" />
                <Text style={stylesPerfil.planPanelPromoTitle}>
                  Torne-se Sócio Drakos
                </Text>
              </View>
              <Text style={stylesPerfil.planPanelPromoBody}>
                Descontos exclusivos, prioridade em ingressos e experiências
                only para sócios.
              </Text>

              <TouchableOpacity
                style={stylesPerfil.planPanelCta}
                activeOpacity={0.85}
                onPress={() => navigation.navigate("Socio")}
              >
                <LinearGradient
                  colors={["#e8000f", "#a3000a"]}
                  style={StyleSheet.absoluteFill}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
                <Text style={stylesPerfil.planPanelCtaText}>Ver planos</Text>
                <Ionicons name="arrow-forward" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ── AÇÕES RÁPIDAS COM BACKGROUND SUAVE ── */}
        <View style={stylesPerfil.actionsRow}>
          <TouchableOpacity style={stylesPerfil.actionCard}>
            <BlurView
              intensity={40}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={stylesPerfil.actionBorder} />
            <View style={stylesPerfil.actionContent}>
              <Ionicons name="card-outline" size={28} color="#fff" />
              <Text style={stylesPerfil.actionLabel}>Meu Cartão</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesPerfil.actionCard}
            onPress={() => setShowHistory((prev) => !prev)}
          >
            <BlurView
              intensity={40}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={stylesPerfil.actionBorder} />
            <View style={stylesPerfil.actionContent}>
              <Ionicons name="receipt-outline" size={28} color="#fff" />
              <Text style={stylesPerfil.actionLabel}>Minhas Compras</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={stylesPerfil.actionCard}
            onPress={() => navigation.navigate("Socio")}
          >
            <BlurView
              intensity={40}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={stylesPerfil.actionBorder} />
            <View style={stylesPerfil.actionContent}>
              <Ionicons name="people-outline" size={28} color="#fff" />
              <Text style={stylesPerfil.actionLabel} numberOfLines={2}>
                {planIdentity.isSocio
                  ? `${planIdentity.emoji} ${planIdentity.label}`
                  : "Sócio"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── HISTÓRICO DE COMPRAS E ASSINATURAS COM BACKGROUND SUAVE ── */}
        {showHistory && (
          <View style={stylesPerfil.historySection}>
            <BlurView
              intensity={40}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
              style={StyleSheet.absoluteFill}
            />
            <View style={stylesPerfil.historyBorder} />

            <View style={stylesPerfil.historyHeader}>
              <Text style={stylesPerfil.historyTitle}>
                Minhas Compras e Assinaturas
              </Text>
              <TouchableOpacity
                onPress={() => setShowHistory(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {subscription && (
              <View style={stylesPerfil.historySubBadge}>
                {planIdentity.isSocio && (
                  <Text style={stylesPerfil.historySubEmoji}>
                    {planIdentity.emoji}
                  </Text>
                )}
                <Text style={stylesPerfil.historySubText}>
                  Assinatura ativa: {subscription.title}
                </Text>
                <Text style={stylesPerfil.historySubPrice}>
                  {subscription.price}
                </Text>
              </View>
            )}

            <Text style={stylesPerfil.historyListTitle}>Histórico</Text>

            {purchaseHistory && purchaseHistory.length > 0 ? (
              purchaseHistory.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <View style={stylesPerfil.historyRow}>
                    {item.type === "subscription" ? (
                      <Ionicons name="star-outline" size={22} color="#ffd700" />
                    ) : item.itemImages && item.itemImages[0] ? (
                      <Image
                        source={item.itemImages[0]}
                        style={stylesPerfil.historyProductImage}
                      />
                    ) : (
                      <Ionicons name="bag-outline" size={18} color="#ff2b2b" />
                    )}
                    <View style={stylesPerfil.historyInfo}>
                      <Text style={stylesPerfil.historyPlan}>
                        {item.type === "subscription"
                          ? item.planTitle
                          : item.productName || item.items?.[0] || "Produto"}
                      </Text>
                      <Text style={stylesPerfil.historyDate}>
                        {item.type === "subscription"
                          ? formatHistoryDate(item.date)
                          : buildPurchaseSummary(item)}
                      </Text>
                    </View>
                    <Text style={stylesPerfil.historyPrice}>{item.price}</Text>
                  </View>
                  {idx < purchaseHistory.length - 1 && (
                    <View style={stylesPerfil.historyDivider} />
                  )}
                </React.Fragment>
              ))
            ) : (
              <View style={stylesPerfil.historyEmpty}>
                <Ionicons
                  name="document-text-outline"
                  size={36}
                  color="rgba(255,255,255,0.3)"
                />
                <Text style={stylesPerfil.historyEmptyText}>
                  Nenhuma compra ou assinatura ainda
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── DIVISOR DADOS PESSOAIS ── */}
        <View style={stylesPerfil.sectionHeaderCustom}>
          <Text style={stylesPerfil.sectionTitle}>Dados pessoais</Text>
          <TouchableOpacity
            style={stylesPerfil.sectionEditBtn}
            onPress={() => setEditModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── CARD DADOS PESSOAIS ── */}
        <View style={stylesPerfil.infoCard}>
          <BlurView
            intensity={40}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={["rgba(255,255,255,0.06)", "rgba(255,255,255,0.02)"]}
            style={StyleSheet.absoluteFill}
          />
          <View style={stylesPerfil.infoBorder} />

          <View style={stylesPerfil.infoRow}>
            <View style={stylesPerfil.infoLeft}>
              <Ionicons name="person-outline" size={20} color="#ffffff" />
              <View style={stylesPerfil.infoTextGroup}>
                <Text style={stylesPerfil.infoLabel}>Nome completo</Text>
                <Text style={stylesPerfil.infoValue}>{currentUser.name}</Text>
              </View>
            </View>
          </View>

          <View style={stylesPerfil.infoDivider} />

          <View style={stylesPerfil.infoRow}>
            <View style={stylesPerfil.infoLeft}>
              <Ionicons name="mail-outline" size={20} color="#ffffff" />
              <View style={stylesPerfil.infoTextGroup}>
                <Text style={stylesPerfil.infoLabel}>Email</Text>
                <Text style={stylesPerfil.infoValue}>{currentUser.email}</Text>
              </View>
            </View>
          </View>

          <View style={stylesPerfil.infoDivider} />

          <View style={stylesPerfil.infoRow}>
            <View style={stylesPerfil.infoLeft}>
              <Ionicons name="call-outline" size={20} color="#ffffff" />
              <View style={stylesPerfil.infoTextGroup}>
                <Text style={stylesPerfil.infoLabel}>Telefone</Text>
                <Text style={stylesPerfil.infoValue}>{currentUser.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* BOTÃO SAIR */}
        <TouchableOpacity
          style={stylesPerfil.logoutBtn}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <LinearGradient
            colors={["rgba(255,0,0,0.2)", "rgba(255,0,0,0.1)"]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <BlurView
            intensity={20}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <View style={stylesPerfil.logoutBorder} />
          <Ionicons name="log-out-outline" size={22} color="#ff6b6b" />
          <Text style={stylesPerfil.logoutText}>Sair da conta</Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#ff6b6b" />
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
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
              <LinearGradient
                colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
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
                  placeholder="Apartamento, bloco, referência..."
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
                  value={currentUser.category || currentUser.status}
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
// ESTILOS — Popup "Editar Perfil" (Liquid Glass, escopo local ao componente)
// ─────────────────────────────────────────────────────────────────────────────
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