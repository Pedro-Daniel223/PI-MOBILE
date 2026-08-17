import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { Ionicons } from "@expo/vector-icons";
import { escudoDrakos, colors } from "../data/dataLogin";
import { DEMO_LOGIN_ENABLED, useAuth } from "../contexts/AuthContext";
import { stylesLogin } from "../styles/styleLogin/styleLogin";

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim());

const onlyDigits = (value = "") => value.replace(/\D/g, "");
const formatCPF = (value) => {
  return onlyDigits(value)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};
const isValidCPF = (value) => onlyDigits(value).length === 11;

const detectIdentifierType = (value) => {
  if (/[A-Za-z]/.test(String(value ?? ""))) return "email";

  const digits = onlyDigits(value);
  if (digits.length >= 11) return "cpf";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim()))
    return "email";
  return digits.length > 0 ? "cpf" : "email";
};

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState("");
  const [senha, setSenha] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signInDemo } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const identifierType = detectIdentifierType(identifier);
  const identifierValid =
    identifierType === "email"
      ? isValidEmail(identifier)
      : isValidCPF(identifier);

  // Fluxo real preservado para reativar depois da apresentação.
  const handleRealLogin = async () => {
    if (!identifier || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    if (!identifierValid) {
      Alert.alert(
        "Erro",
        identifierType === "email" ? "Email inválido!" : "CPF inválido!",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(identifier.trim(), senha);
    } catch (error) {
      Alert.alert(
        "Erro",
        error?.message || "Não foi possível realizar o login.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    if (!identifier.trim() || !senha.trim()) {
      Alert.alert("Erro", "Informe seu nome e a senha de demonstração.");
      return;
    }

    if (senha !== "1234") {
      Alert.alert("Erro", "Use a senha de demonstração 1234.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signInDemo(identifier.trim(), senha);
    } catch (error) {
      Alert.alert(
        "Erro",
        error?.message || "Não foi possível entrar no modo demo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = DEMO_LOGIN_ENABLED ? handleDemoLogin : handleRealLogin;

  const handleBiometricAuth = async () => {
    if (DEMO_LOGIN_ENABLED) {
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      return Alert.alert(
        "Biometria não configurada",
        "Por favor, configure uma digital ou FaceID nas configurações do seu celular.",
      );
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Entrar no Covil dos Drakos",
      fallbackLabel: "Usar senha",
      disableDeviceFallback: false,
    });

    if (result.success) {
      if (!identifier || !senha) {
        Alert.alert("Erro", "Preencha email/CPF e senha para continuar.");
        return;
      }

      try {
        setIsSubmitting(true);
        await signIn(identifier.trim(), senha);
      } catch (error) {
        Alert.alert(
          "Erro",
          error?.message || "Não foi possível realizar o login.",
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <SafeAreaView style={stylesLogin.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={stylesLogin.container}
      >
        <ScrollView
          contentContainerStyle={stylesLogin.scrollGrow}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={stylesLogin.header}>
            <Image
              source={escudoDrakos}
              style={stylesLogin.escudoHeader}
              resizeMode="contain"
            />
            <View style={stylesLogin.headerContent}>
              <Text style={stylesLogin.headerTitle}>
                BEM-VINDO DE VOLTA AO COVIL
              </Text>
              <Text style={stylesLogin.headerSubtitle}>
                {DEMO_LOGIN_ENABLED
                  ? "Modo DEMO temporário: entre com um nome e a senha 1234"
                  : "Faça seu login para entrar no Covil dos Drakos"}
              </Text>
            </View>
          </View>

          <View style={stylesLogin.card}>
            <Text style={stylesLogin.formTitle}>Login</Text>

            <View style={stylesLogin.formContent}>
              <Text style={stylesLogin.label}>
                {DEMO_LOGIN_ENABLED ? "Nome" : "Email / CPF"}
              </Text>
              <CustomInput
                placeholder={
                  DEMO_LOGIN_ENABLED
                    ? "Digite seu nome"
                    : "Digite seu email ou CPF"
                }
                value={identifier}
                onChangeText={(text) => {
                  if (!DEMO_LOGIN_ENABLED && identifierType === "cpf") {
                    setIdentifier(formatCPF(text));
                  } else {
                    setIdentifier(text);
                  }
                }}
                keyboardType={
                  DEMO_LOGIN_ENABLED
                    ? "default"
                    : identifierType === "cpf"
                      ? "numeric"
                      : "email-address"
                }
                autoCapitalize={DEMO_LOGIN_ENABLED ? "words" : "none"}
                style={stylesLogin.inputStyle}
                rightComponent={
                  !DEMO_LOGIN_ENABLED &&
                  identifierValid &&
                  identifier.length > 0 ? (
                    <View style={stylesLogin.iconContainer}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color="rgba(192, 0, 10, 0.85)"
                      />
                    </View>
                  ) : null
                }
              />

              <Text style={[stylesLogin.label, stylesLogin.passwordLabel]}>
                Senha:
              </Text>
              <CustomInput
                placeholder="********"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPass}
                keyboardType="default"
                style={stylesLogin.inputStyle}
                rightComponent={
                  <TouchableOpacity
                    onPress={() => setShowPass(!showPass)}
                    style={stylesLogin.iconContainer}
                  >
                    <Text style={stylesLogin.inlineIconText}>
                      {showPass ? (
                        <Ionicons name="eye-off" style={stylesLogin.iconEye} />
                      ) : (
                        <Ionicons name="eye" style={stylesLogin.iconEye} />
                      )}
                    </Text>
                  </TouchableOpacity>
                }
              />

              <View style={stylesLogin.forgotRow}>
                <Text style={stylesLogin.forgotText}>Esqueceu Senha?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("RedefinirSenha")}
                  style={stylesLogin.redefineBtn}
                >
                  <Text style={[stylesLogin.forgotText, stylesLogin.linkBold]}>
                    Redefinir
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={stylesLogin.buttonWrap}>
                <CustomButton
                  title={isSubmitting ? "Entrando..." : "Entrar"}
                  onPress={handleLogin}
                  disabled={isSubmitting}
                  style={stylesLogin.glassButton}
                  textStyle={stylesLogin.buttonTitle}
                />

                {!DEMO_LOGIN_ENABLED && isBiometricSupported && (
                  <TouchableOpacity
                    onPress={handleBiometricAuth}
                    style={stylesLogin.biometricBtn}
                  >
                    <Ionicons
                      name="finger-print"
                      size={24}
                      color={colors.primary}
                    />
                    <Text style={stylesLogin.biometricText}>
                      Entrar com Biometria
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {!DEMO_LOGIN_ENABLED && (
              <TouchableOpacity
                onPress={() => navigation.navigate("Cadastro")}
                activeOpacity={0.7}
                style={stylesLogin.footerContainer}
              >
                <Text style={stylesLogin.footerText}>
                  Não possui uma conta?{" "}
                  <Text style={stylesLogin.linkBold}>Registrar</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
