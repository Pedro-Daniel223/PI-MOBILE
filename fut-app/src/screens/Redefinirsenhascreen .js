/**
 * RedefinirSenhaScreen
 * ─────────────────────────────────────────────────────────────────────────────
 * Fluxo único de recuperação de senha (Email → Código → Nova Senha), unificando
 * as antigas telas EsqueceuSenha / VerificarCodigo / NovaSenha em uma única
 * experiência, sem trocar de tela — apenas etapas internas com transição
 * suave (fade + slide), seguindo a identidade Premium Liquid Glass do app.
 *
 * IMPORTANTE:
 *   - Nenhuma das três telas originais fazia chamada real de API (apenas
 *     Alert + navigation local). Este arquivo reimplementa o mesmo tipo de
 *     fluxo local, já seguindo as novas regras desta etapa (6 dígitos,
 *     força de senha, checklist, contador 00:60, mensagens inline).
 *   - Ponto de saída (navigation.goBack no passo 1) e destino final
 *     (navigation.navigate('Login') após redefinir) foram preservados,
 *     espelhando o comportamento original das telas antigas.
 *   - Não depende de CustomInput/CustomButton nem dos arquivos de estilo
 *     antigos (styleEsqueceuSenha, styleVerificarCodigo, styleNovaSenha) —
 *     é 100% autocontido, então nada em outras telas é afetado.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import {
  esqueciSenha,
  validarCodigo,
  redefinirSenha,
} from '../services/authService';

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? '').trim());

const formatTimer = (totalSeconds) => {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

const STRENGTH_LABELS = ['Muito fraca', 'Fraca', 'Razoável', 'Boa', 'Forte'];
const STRENGTH_COLORS = ['#ff5b5b', '#ff5b5b', '#ffb020', '#ffd23d', '#4ee08a'];

const STEPS = [
  { key: 1, label: 'E-mail' },
  { key: 2, label: 'Código' },
  { key: 3, label: 'Senha' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUBCOMPONENTES — apenas apresentação
// ─────────────────────────────────────────────────────────────────────────────
const StepperHeader = React.memo(function StepperHeader({ step, line1Fill, line2Fill }) {
  return (
    <View style={styles.stepperRow}>
      {STEPS.map((s, idx) => {
        const isActive = step === s.key;
        const isDone = step > s.key;
        return (
          <React.Fragment key={s.key}>
            <View style={styles.stepperItem}>
              <View style={[styles.stepperDot, isActive && styles.stepperDotActive, isDone && styles.stepperDotDone]}>
                {isDone ? (
                  <Ionicons name="checkmark" size={13} color="#fff" />
                ) : (
                  <Text style={[styles.stepperDotText, isActive && styles.stepperDotTextActive]}>{s.key}</Text>
                )}
              </View>
              <Text style={[styles.stepperLabel, (isActive || isDone) && styles.stepperLabelActive]}>
                {s.label}
              </Text>
            </View>

            {idx < STEPS.length - 1 && (
              <View style={styles.stepperLineTrack}>
                <Animated.View
                  style={[
                    styles.stepperLineFill,
                    {
                      width: (idx === 0 ? line1Fill : line2Fill).interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
});

const GlassTextField = React.memo(function GlassTextField({
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  showToggleSecure = false,
  isSecureVisible = false,
  onToggleSecure,
  rightIcon,
  rightIconColor = '#4ee08a',
  returnKeyType = 'done',
  onSubmitEditing,
  inputRef,
  error,
}) {
  return (
    <View>
      <View style={[styles.inputShell, !!error && styles.inputShellError]}>
        <BlurView intensity={26} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)']}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons name={icon} size={17} color="rgba(255,255,255,0.55)" style={styles.inputIcon} />
        <TextInput
          ref={inputRef}
          style={styles.inputField}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.32)"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {showToggleSecure && (
          <TouchableOpacity onPress={onToggleSecure} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={isSecureVisible ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color="rgba(255,255,255,0.5)"
            />
          </TouchableOpacity>
        )}
        {!!rightIcon && (
          <Ionicons name={rightIcon} size={17} color={rightIconColor} style={styles.inputRightIcon} />
        )}
      </View>
      {!!error && <Text style={styles.fieldErrorText}>{error}</Text>}
    </View>
  );
});

const PasswordStrengthMeter = React.memo(function PasswordStrengthMeter({ score }) {
  return (
    <View style={styles.strengthWrap}>
      <View style={styles.strengthBarRow}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[styles.strengthSegment, i < score && { backgroundColor: STRENGTH_COLORS[score] }]}
          />
        ))}
      </View>
      <Text style={[styles.strengthLabel, { color: STRENGTH_COLORS[score] }]}>{STRENGTH_LABELS[score]}</Text>
    </View>
  );
});

const RequirementRow = React.memo(function RequirementRow({ label, met }) {
  return (
    <View style={styles.reqRow}>
      <Ionicons
        name={met ? 'checkmark-circle' : 'ellipse-outline'}
        size={15}
        color={met ? '#4ee08a' : 'rgba(255,255,255,0.32)'}
      />
      <Text style={[styles.reqText, met && styles.reqTextMet]}>{label}</Text>
    </View>
  );
});

const InlineMessage = React.memo(function InlineMessage({ type, text }) {
  if (!text) return null;
  const isError = type === 'error';
  return (
    <View style={[styles.inlineMsg, isError ? styles.inlineMsgError : styles.inlineMsgSuccess]}>
      <Ionicons name={isError ? 'alert-circle' : 'checkmark-circle'} size={16} color={isError ? '#ff6b6b' : '#4ee08a'} />
      <Text style={[styles.inlineMsgText, { color: isError ? '#ff9b9b' : '#8ff0bb' }]}>{text}</Text>
    </View>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// TELA PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function RedefinirSenhaScreen({ navigation, route }) {
  // ── Controle de etapas (substitui a navegação entre telas) ────────────────
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = avançar, -1 = voltar
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stepAnim = useRef(new Animated.Value(1)).current;
  const line1Fill = useRef(new Animated.Value(0)).current;
  const line2Fill = useRef(new Animated.Value(0)).current;
  const redirectTimeoutRef = useRef(null);

  const goToStep = (nextStep, dir = 1) => {
    setDirection(dir);
    stepAnim.setValue(0);
    setStep(nextStep);
  };

  useEffect(() => {
    Animated.timing(stepAnim, { toValue: 1, duration: 380, useNativeDriver: true }).start();
    Animated.timing(line1Fill, { toValue: step >= 2 ? 1 : 0, duration: 380, useNativeDriver: false }).start();
    Animated.timing(line2Fill, { toValue: step >= 3 ? 1 : 0, duration: 380, useNativeDriver: false }).start();
  }, [step]);

  const stepTranslate = stepAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [direction * 24, 0],
  });

  const handleBack = () => {
    if (isSubmitting) return;
    if (step === 1) {
      navigation.goBack();
    } else {
      goToStep(step - 1, -1);
    }
  };

  // ── ETAPA 1 — E-mail ────────────────────────────────────────────────────
  const [email, setEmail] = useState(route?.params?.email || '');
  const [emailError, setEmailError] = useState('');

  const handleContinueEmail = async () => {
    if (isSubmitting) return;

    if (!email) {
      setEmailError('Informe o e-mail associado à conta.');
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError('Digite um e-mail válido.');
      return;
    }

    try {
      setIsSubmitting(true);
      setEmailError('');
      await esqueciSenha({ email: email.trim() });
      goToStep(2, 1);
    } catch (error) {
      const message = error?.message || 'Não foi possível enviar o código. Tente novamente.';
      setEmailError(message);
      Alert.alert('Erro', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── ETAPA 2 — Código de verificação (6 dígitos) ────────────────────────
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [focusedOtpIndex, setFocusedOtpIndex] = useState(null);
  const [timer, setTimer] = useState(60);
  const [resendKey, setResendKey] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (step !== 2) return undefined;
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendKey]);

  const codeComplete = code.every((digit) => digit !== '');

  const handleOtpChange = (text, index) => {
    const digits = text.replace(/[^0-9]/g, '');

    if (digits.length > 1) {
      // Colagem de código completo — distribui entre as caixas
      const chars = digits.slice(0, 6).split('');
      const newCode = [...code];
      chars.forEach((char, offset) => {
        if (index + offset < 6) newCode[index + offset] = char;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + chars.length, 5);
      otpRefs.current[nextIndex]?.focus();
      if (codeError) setCodeError('');
      return;
    }

    const newCode = [...code];
    newCode[index] = digits;
    setCode(newCode);
    if (codeError) setCodeError('');

    if (digits.length !== 0 && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (isSubmitting || timer > 0) return;

    try {
      setIsSubmitting(true);
      setCode(['', '', '', '', '', '']);
      setCodeError('');
      await esqueciSenha({ email: email.trim() });
      setResendKey((k) => k + 1);
      otpRefs.current[0]?.focus();
    } catch (error) {
      const message = error?.message || 'Não foi possível reenviar o código. Tente novamente.';
      setCodeError(message);
      Alert.alert('Erro', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async () => {
    if (isSubmitting) return;

    if (!codeComplete) {
      setCodeError('Preencha os 6 dígitos do código.');
      return;
    }

    try {
      setIsSubmitting(true);
      setCodeError('');
      await validarCodigo({ email: email.trim(), codigo: code.join('') });
      goToStep(3, 1);
    } catch (error) {
      const message = error?.message || 'Não foi possível validar o código.';
      setCodeError(message);
      Alert.alert('Erro', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── ETAPA 3 — Nova senha ────────────────────────────────────────────────
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const confirmRef = useRef(null);

  const passwordChecks = useMemo(
    () => ({
      length: senha.length >= 8,
      upper: /[A-Z]/.test(senha),
      number: /[0-9]/.test(senha),
      special: /[^A-Za-z0-9]/.test(senha),
    }),
    [senha]
  );

  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;
  const passwordsMatch = confirmarSenha.length > 0 && senha === confirmarSenha;
  const isPasswordStepValid = passwordScore === 4 && passwordsMatch;

  const handleResetPassword = async () => {
    if (isSubmitting || resetSuccess) return;
    if (!isPasswordStepValid) return;

    try {
      setIsSubmitting(true);
      await redefinirSenha({
        email: email.trim(),
        codigo: code.join(''),
        senha,
        confirmar_senha: confirmarSenha,
      });
      setResetSuccess(true);
      redirectTimeoutRef.current = setTimeout(() => {
        navigation.navigate('Login');
      }, 1400);
    } catch (error) {
      const message = error?.message || 'Não foi possível redefinir a senha.';
      Alert.alert('Erro', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#050505', '#160303', '#1c0000']} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowBottom} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.75}>
            <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
            <Ionicons name="chevron-back" size={20} color="#fff" />
          </TouchableOpacity>

          <StepperHeader step={step} line1Fill={line1Fill} line2Fill={line2Fill} />

          <View style={styles.card}>
            <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.cardSpecular} />
            <View style={styles.cardBorder} />

            <Animated.View style={{ opacity: stepAnim, transform: [{ translateX: stepTranslate }] }}>
              {/* ── ETAPA 1 ─────────────────────────────────────────────── */}
              {step === 1 && (
                <View>
                  <View style={styles.iconBadge}>
                    <LinearGradient
                      colors={['rgba(232,0,15,0.35)', 'rgba(163,0,10,0.12)']}
                      style={StyleSheet.absoluteFill}
                    />
                    <Ionicons name="lock-closed-outline" size={26} color="#fff" />
                  </View>

                  <Text style={styles.stepTitle}>Esqueceu sua senha?</Text>
                  <Text style={styles.stepSubtitle}>
                    Sem problemas. Informe o e-mail da sua conta e enviaremos um código de verificação.
                  </Text>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>E-MAIL</Text>
                    <GlassTextField
                      icon="mail-outline"
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        if (emailError) setEmailError('');
                      }}
                      placeholder="seuemail@exemplo.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      rightIcon={isValidEmail(email) ? 'checkmark-circle' : undefined}
                      returnKeyType="done"
                      onSubmitEditing={handleContinueEmail}
                      error={emailError}
                    />
                  </View>

                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={handleContinueEmail}
                    activeOpacity={0.85}
                    disabled={isSubmitting}
                  >
                    <LinearGradient
                      colors={
                        isSubmitting
                          ? ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.05)']
                          : ['#e8000f', '#a3000a']
                      }
                      style={StyleSheet.absoluteFill}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    />
                    <Text style={[styles.primaryBtnText, isSubmitting && styles.primaryBtnTextDisabled]}>
                      {isSubmitting ? 'Enviando...' : 'Continuar'}
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={17}
                      color={isSubmitting ? 'rgba(255,255,255,0.35)' : '#fff'}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {/* ── ETAPA 2 ─────────────────────────────────────────────── */}
              {step === 2 && (
                <View>
                  <View style={styles.iconBadge}>
                    <LinearGradient
                      colors={['rgba(232,0,15,0.35)', 'rgba(163,0,10,0.12)']}
                      style={StyleSheet.absoluteFill}
                    />
                    <Ionicons name="mail-open-outline" size={24} color="#fff" />
                  </View>

                  <Text style={styles.stepTitle}>Verifique seu e-mail</Text>
                  <Text style={styles.stepSubtitle}>
                    Enviamos um código de 6 dígitos para{'\n'}
                    <Text style={styles.stepHighlight}>{email}</Text>
                  </Text>

                  <View style={styles.otpRow}>
                    {code.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (otpRefs.current[index] = ref)}
                        style={[
                          styles.otpBox,
                          focusedOtpIndex === index && styles.otpBoxFocused,
                          digit !== '' && styles.otpBoxFilled,
                        ]}
                        keyboardType="number-pad"
                        maxLength={6}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={(e) => handleOtpKeyPress(e, index)}
                        onFocus={() => setFocusedOtpIndex(index)}
                        onBlur={() => setFocusedOtpIndex((current) => (current === index ? null : current))}
                        selectTextOnFocus
                        textAlign="center"
                      />
                    ))}
                  </View>

                  <InlineMessage type="error" text={codeError} />

                  <View style={styles.resendRow}>
                    {timer > 0 ? (
                      <Text style={styles.resendText}>
                        Reenviar código em <Text style={styles.resendTimer}>{formatTimer(timer)}</Text>
                      </Text>
                    ) : (
                      <TouchableOpacity onPress={handleResend} activeOpacity={0.75} disabled={isSubmitting}>
                        <Text style={styles.resendLink}>Reenviar código</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryBtn, !codeComplete && styles.primaryBtnDisabled]}
                    onPress={handleVerifyCode}
                    disabled={!codeComplete || isSubmitting}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={
                        codeComplete && !isSubmitting
                          ? ['#e8000f', '#a3000a']
                          : ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.05)']
                      }
                      style={StyleSheet.absoluteFill}
                    />
                    <Text
                      style={[
                        styles.primaryBtnText,
                        (!codeComplete || isSubmitting) && styles.primaryBtnTextDisabled,
                      ]}
                    >
                      {isSubmitting ? 'Validando...' : 'Verificar'}
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={17}
                      color={codeComplete && !isSubmitting ? '#fff' : 'rgba(255,255,255,0.35)'}
                    />
                  </TouchableOpacity>
                </View>
              )}

              {/* ── ETAPA 3 ─────────────────────────────────────────────── */}
              {step === 3 && (
                <View>
                  {!resetSuccess ? (
                    <View>
                      <View style={styles.iconBadge}>
                        <LinearGradient
                          colors={['rgba(232,0,15,0.35)', 'rgba(163,0,10,0.12)']}
                          style={StyleSheet.absoluteFill}
                        />
                        <Ionicons name="key-outline" size={24} color="#fff" />
                      </View>

                      <Text style={styles.stepTitle}>Crie uma nova senha</Text>
                      <Text style={styles.stepSubtitle}>
                        Escolha uma senha forte para manter sua conta protegida.
                      </Text>

                      <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>NOVA SENHA</Text>
                        <GlassTextField
                          icon="lock-closed-outline"
                          value={senha}
                          onChangeText={setSenha}
                          placeholder="Digite sua nova senha"
                          secureTextEntry={!showSenha}
                          showToggleSecure
                          isSecureVisible={showSenha}
                          onToggleSecure={() => setShowSenha((v) => !v)}
                          returnKeyType="next"
                          onSubmitEditing={() => confirmRef.current?.focus()}
                        />
                      </View>

                      {senha.length > 0 && (
                        <>
                          <PasswordStrengthMeter score={passwordScore} />
                          <View style={styles.reqList}>
                            <RequirementRow label="Mínimo de 8 caracteres" met={passwordChecks.length} />
                            <RequirementRow label="Pelo menos 1 letra maiúscula" met={passwordChecks.upper} />
                            <RequirementRow label="Pelo menos 1 número" met={passwordChecks.number} />
                            <RequirementRow label="Pelo menos 1 caractere especial" met={passwordChecks.special} />
                          </View>
                        </>
                      )}

                      <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>CONFIRMAR SENHA</Text>
                        <GlassTextField
                          inputRef={confirmRef}
                          icon="lock-closed-outline"
                          value={confirmarSenha}
                          onChangeText={setConfirmarSenha}
                          placeholder="Repita a nova senha"
                          secureTextEntry={!showConfirm}
                          showToggleSecure
                          isSecureVisible={showConfirm}
                          onToggleSecure={() => setShowConfirm((v) => !v)}
                          rightIcon={passwordsMatch ? 'checkmark-circle' : undefined}
                          returnKeyType="done"
                          onSubmitEditing={handleResetPassword}
                        />
                        {confirmarSenha.length > 0 && !passwordsMatch && (
                          <Text style={styles.fieldErrorText}>As senhas não coincidem.</Text>
                        )}
                      </View>

                      <TouchableOpacity
                        style={[styles.primaryBtn, !isPasswordStepValid && styles.primaryBtnDisabled]}
                        onPress={handleResetPassword}
                        disabled={!isPasswordStepValid || isSubmitting}
                        activeOpacity={0.85}
                      >
                        <LinearGradient
                          colors={
                            isPasswordStepValid && !isSubmitting
                              ? ['#e8000f', '#a3000a']
                              : ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.05)']
                          }
                          style={StyleSheet.absoluteFill}
                        />
                        <Text
                          style={[
                            styles.primaryBtnText,
                            (!isPasswordStepValid || isSubmitting) && styles.primaryBtnTextDisabled,
                          ]}
                        >
                          {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.successWrap}>
                      <View style={styles.successIconCircle}>
                        <Ionicons name="checkmark" size={30} color="#fff" />
                      </View>
                      <Text style={styles.stepTitle}>Senha redefinida!</Text>
                      <Text style={styles.stepSubtitle}>
                        Sua senha foi alterada com sucesso.{'\n'}Redirecionando para o login...
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTILOS — 100% autocontidos (Liquid Glass)
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#050505',
  },
  glowTop: {
    position: 'absolute',
    top: -120,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(232,0,15,0.22)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -140,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(163,0,10,0.16)',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.16)',
    marginBottom: 22,
  },

  // ── Stepper ────────────────────────────────────────────────────────────
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 26,
    paddingHorizontal: 4,
  },
  stepperItem: {
    alignItems: 'center',
    width: 64,
  },
  stepperDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  stepperDotActive: {
    backgroundColor: 'rgba(232,0,15,0.35)',
    borderColor: 'rgba(232,0,15,0.75)',
  },
  stepperDotDone: {
    backgroundColor: 'rgba(78,224,138,0.28)',
    borderColor: 'rgba(78,224,138,0.6)',
  },
  stepperDotText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.45)',
  },
  stepperDotTextActive: {
    color: '#fff',
  },
  stepperLabel: {
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 6,
    fontWeight: '600',
  },
  stepperLabelActive: {
    color: 'rgba(255,255,255,0.85)',
  },
  stepperLineTrack: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginTop: 14,
    overflow: 'hidden',
  },
  stepperLineFill: {
    height: '100%',
    backgroundColor: '#e8000f',
    borderRadius: 1,
  },

  // ── Card ───────────────────────────────────────────────────────────────
  card: {
    borderRadius: 28,
    overflow: 'hidden',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 16,
  },
  cardSpecular: {
    position: 'absolute',
    top: 0,
    left: '12%',
    right: '12%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  cardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.16)',
  },

  // ── Cabeçalho de etapa ─────────────────────────────────────────────────
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.18)',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 13.5,
    lineHeight: 19,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 22,
  },
  stepHighlight: {
    color: '#fff',
    fontWeight: '700',
  },

  // ── Campos ─────────────────────────────────────────────────────────────
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 14,
    overflow: 'hidden',
    paddingHorizontal: 14,
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  inputShellError: {
    borderColor: 'rgba(255,107,107,0.55)',
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    padding: 0,
  },
  inputRightIcon: {
    marginLeft: 8,
  },
  fieldErrorText: {
    fontSize: 12,
    color: '#ff9b9b',
    marginTop: 6,
    marginLeft: 2,
  },

  // ── OTP ────────────────────────────────────────────────────────────────
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  otpBox: {
    width: 46,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.16)',
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  otpBoxFocused: {
    borderColor: 'rgba(232,0,15,0.75)',
    backgroundColor: 'rgba(232,0,15,0.10)',
  },
  otpBoxFilled: {
    borderColor: 'rgba(255,255,255,0.32)',
  },

  resendRow: {
    alignItems: 'center',
    marginBottom: 22,
  },
  resendText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  resendTimer: {
    color: '#fff',
    fontWeight: '700',
  },
  resendLink: {
    fontSize: 13.5,
    color: '#ff4d4d',
    fontWeight: '700',
  },

  // ── Força / checklist de senha ─────────────────────────────────────────
  strengthWrap: {
    marginBottom: 14,
  },
  strengthBarRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  strengthLabel: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  reqList: {
    marginBottom: 16,
    gap: 6,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reqText: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.45)',
  },
  reqTextMet: {
    color: 'rgba(255,255,255,0.8)',
  },

  // ── Mensagens inline ───────────────────────────────────────────────────
  inlineMsg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 0.75,
  },
  inlineMsgError: {
    backgroundColor: 'rgba(255,107,107,0.10)',
    borderColor: 'rgba(255,107,107,0.35)',
  },
  inlineMsgSuccess: {
    backgroundColor: 'rgba(78,224,138,0.10)',
    borderColor: 'rgba(78,224,138,0.35)',
  },
  inlineMsgText: {
    fontSize: 12.5,
    flex: 1,
  },

  // ── Botão principal ────────────────────────────────────────────────────
  primaryBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    gap: 8,
    borderWidth: 0.75,
    borderColor: 'rgba(255,255,255,0.18)',
    marginTop: 4,
  },
  primaryBtnDisabled: {
    borderColor: 'rgba(255,255,255,0.08)',
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 15.5,
    fontWeight: '700',
  },
  primaryBtnTextDisabled: {
    color: 'rgba(255,255,255,0.35)',
  },

  // ── Sucesso ────────────────────────────────────────────────────────────
  successWrap: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(78,224,138,0.22)',
    borderWidth: 0.75,
    borderColor: 'rgba(78,224,138,0.55)',
    marginBottom: 16,
  },
});
