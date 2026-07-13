import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    Alert,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Animated,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../contexts/AuthContext';

import { escudoDrakos, colors } from '../data/dataCadastro';
import styles from '../styles/styleCadastro/styleCadastro';

// ─────────────────────────────────────────────────────────────────────────────
// WIZARD DE CADASTRO — 3 etapas em uma única tela
//   Etapa 1: Informações pessoais (sexo, nome, sobrenome)
//   Etapa 2: Dados da conta (email, cpf, telefone, senha, confirmar)
//   Etapa 3: Endereço — opcional (rua, número, bairro, cep, complemento)
// A lógica de autenticação (signUp) e o formato do payload NÃO foram alterados.
//
// Paleta dos elementos novos (dots, chips, progress bar, botão voltar) ajustada
// para FUNDO CLARO: base em preto translúcido baixo (rgba(10,10,10,x)) em vez
// de branco translúcido, com sombra suave no lugar do brilho de borda.
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 3;

const STEP_META = [
    { key: 1, title: 'Informações pessoais', icon: 'person-outline' },
    { key: 2, title: 'Dados da conta', icon: 'lock-closed-outline' },
    { key: 3, title: 'Endereço', icon: 'location-outline' },
];

// ── Máscaras simples (apenas visuais — não afetam o payload enviado) ─────────
const onlyDigits = (value = '') => value.replace(/\D/g, '');

const formatCPF = (value) => {
    return onlyDigits(value)
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatTelefone = (value) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 10) {
        return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};

const formatCEP = (value) => {
    return onlyDigits(value).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export default function CadastroScreen({ navigation }) {
    // ── Etapa atual ───────────────────────────────────────────────────────
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});

    // ── Etapa 1 — Informações pessoais ───────────────────────────────────
    const [sexo, setSexo] = useState('');
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');

    // ── Etapa 2 — Dados da conta ──────────────────────────────────────────
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // ── Etapa 3 — Endereço (opcional) ─────────────────────────────────────
    const [rua, setRua] = useState('');
    const [numero, setNumero] = useState('');
    const [bairro, setBairro] = useState('');
    const [cep, setCep] = useState('');
    const [complemento, setComplemento] = useState('');

    const [accepted, setAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { signUp } = useAuth();

    const scrollRef = useRef(null);

    // ── Animações de transição entre etapas ──────────────────────────────
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(1 / TOTAL_STEPS)).current;

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: step / TOTAL_STEPS,
            duration: 380,
            useNativeDriver: false,
        }).start();
    }, [step]);

    const animateToStep = useCallback((nextStep, direction) => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 160,
            useNativeDriver: true,
        }).start(() => {
            slideAnim.setValue(direction * 28);
            setStep(nextStep);
            scrollRef.current?.scrollTo({ y: 0, animated: true });
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 280,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 280,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    }, [fadeAnim, slideAnim]);

    // ── Helpers de erro ────────────────────────────────────────────────────
    const clearError = (field) => {
        setErrors((prev) => {
            if (!prev[field]) return prev;
            const next = { ...prev };
            delete next[field];
            return next;
        });
    };

    // ── Validação por etapa ────────────────────────────────────────────────
    const validateStep1 = () => {
        const next = {};
        if (!nome.trim()) next.nome = 'Informe seu nome';
        if (!sobrenome.trim()) next.sobrenome = 'Informe seu sobrenome';
        if (!sexo) next.sexo = 'Selecione uma opção';
        return next;
    };

    const validateStep2 = () => {
        const next = {};
        if (!email.trim()) next.email = 'Informe seu email';
        else if (!isValidEmail(email)) next.email = 'Email inválido';
        if (!cpf.trim()) next.cpf = 'Informe seu CPF';
        if (!telefone.trim()) next.telefone = 'Informe seu telefone';
        if (!senha) next.senha = 'Informe uma senha';
        if (!confirm) next.confirm = 'Confirme sua senha';
        else if (senha !== confirm) next.confirm = 'As senhas não coincidem';
        return next;
    };

    const handleNext = () => {
        const stepErrors = step === 1 ? validateStep1() : validateStep2();
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            return;
        }
        setErrors({});
        animateToStep(step + 1, 1);
    };

    const handleBackStep = () => {
        setErrors({});
        animateToStep(step - 1, -1);
    };

    // ── Payload — formato mantido EXATAMENTE igual ao original ────────────
    const buildCadastroPayload = () => {
        return {
            nome: nome.trim(),
            sobrenome: sobrenome.trim(),
            email: email.trim(),
            telefone: telefone.trim(),
            cpf: cpf.trim(),
            senha,
            sexo,
            rua: rua.trim(),
            casa_numero: numero.trim(),
            bairro: bairro.trim(),
            cep: cep.trim(),
            complemento: complemento.trim(),
        };
    };

    const handleCadastro = async () => {
        if (!accepted) {
            Alert.alert('Aviso', 'Você precisa aceitar as políticas de privacidade.');
            return;
        }

        try {
            setIsSubmitting(true);
            await signUp(buildCadastroPayload());
        } catch (error) {
            Alert.alert('Erro', error?.message || 'Não foi possível criar a conta.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={{ flexGrow: 1 }}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* HEADER COM ESCUDO INTEGRADO (IGUAL AO LOGIN) — inalterado */}
                    <View style={styles.header}>
                        <Image
                            source={escudoDrakos}
                            style={styles.escudoHeader}
                            resizeMode="contain"
                        />
                        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                            <Text style={styles.backText}>←</Text>
                        </TouchableOpacity>

                        <View style={styles.headerContent}>
                            <Text style={styles.headerTitle}>AQUI COMEÇA TUDO PARA VOCÊ!</Text>
                            <Text style={styles.headerSubtitle}>Crie sua conta para desbloquear o conteúdo exclusivo</Text>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.formTitle}>Cadastro</Text>

                        {/* ── Barra de progresso ─────────────────────────────── */}
                        <View style={localStyles.progressSection}>
                            <View style={localStyles.dotsRow}>
                                {STEP_META.map((meta, index) => {
                                    const isActive = meta.key === step;
                                    const isDone = meta.key < step;
                                    return (
                                        <React.Fragment key={meta.key}>
                                            <View
                                                style={[
                                                    localStyles.dot,
                                                    (isActive || isDone) && localStyles.dotFilled,
                                                ]}
                                            >
                                                <Ionicons
                                                    name={isDone ? 'checkmark' : meta.icon}
                                                    size={14}
                                                    color={isActive || isDone ? '#fff' : 'rgba(10,10,10,0.40)'}
                                                />
                                            </View>
                                            {index < STEP_META.length - 1 && (
                                                <View style={localStyles.dotConnector}>
                                                    <View
                                                        style={[
                                                            localStyles.dotConnectorFill,
                                                            { width: meta.key < step ? '100%' : '0%' },
                                                        ]}
                                                    />
                                                </View>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </View>

                            <View style={localStyles.progressTrack}>
                                <Animated.View style={[localStyles.progressFill, { width: progressWidth }]}>
                                    <LinearGradient
                                        colors={['#e8000f', '#c0000a']}
                                        style={StyleSheet.absoluteFill}
                                        start={{ x: 0, y: 0.5 }}
                                        end={{ x: 1, y: 0.5 }}
                                    />
                                </Animated.View>
                            </View>

                            <Text style={localStyles.progressLabel}>
                                Etapa {step} de {TOTAL_STEPS} · {STEP_META[step - 1].title}
                            </Text>
                        </View>

                        {/* ── Conteúdo animado da etapa ──────────────────────── */}
                        <Animated.View
                            style={[
                                styles.formContent,
                                localStyles.stepContainer,
                                { opacity: fadeAnim, transform: [{ translateX: slideAnim }] },
                            ]}
                        >
                            {step === 1 && (
                                <>
                                    <Text style={styles.label}>SEXO:</Text>
                                    <View style={localStyles.sexoRow}>
                                        {['Masculino', 'Feminino'].map((option) => {
                                            const isSelected = sexo === option;
                                            return (
                                                <TouchableOpacity
                                                    key={option}
                                                    activeOpacity={0.85}
                                                    style={[
                                                        localStyles.sexoChip,
                                                        isSelected && localStyles.sexoChipActive,
                                                    ]}
                                                    onPress={() => {
                                                        setSexo(option);
                                                        clearError('sexo');
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <LinearGradient
                                                            colors={['#e8000f', '#9c0008']}
                                                            style={StyleSheet.absoluteFill}
                                                            start={{ x: 0, y: 0 }}
                                                            end={{ x: 1, y: 1 }}
                                                        />
                                                    )}
                                                    <Text
                                                        style={[
                                                            localStyles.sexoChipText,
                                                            isSelected && localStyles.sexoChipTextActive,
                                                        ]}
                                                    >
                                                        {option}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                    {!!errors.sexo && <Text style={localStyles.errorText}>{errors.sexo}</Text>}

                                    <Text style={[styles.label, styles.spacing]}>NOME:</Text>
                                    <CustomInput
                                        placeholder="Seu primeiro nome"
                                        value={nome}
                                        onChangeText={(text) => {
                                            setNome(text);
                                            clearError('nome');
                                        }}
                                        style={[styles.inputStyle, errors.nome && localStyles.inputErrorBorder]}
                                    />
                                    {!!errors.nome && <Text style={localStyles.errorText}>{errors.nome}</Text>}

                                    <Text style={[styles.label, styles.spacing]}>SOBRENOME:</Text>
                                    <CustomInput
                                        placeholder="Seu sobrenome"
                                        value={sobrenome}
                                        onChangeText={(text) => {
                                            setSobrenome(text);
                                            clearError('sobrenome');
                                        }}
                                        style={[styles.inputStyle, errors.sobrenome && localStyles.inputErrorBorder]}
                                    />
                                    {!!errors.sobrenome && <Text style={localStyles.errorText}>{errors.sobrenome}</Text>}
                                </>
                            )}

                            {step === 2 && (
                                <>
                                    <Text style={styles.label}>EMAIL:</Text>
                                    <CustomInput
                                        placeholder="email@exemplo.com"
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            clearError('email');
                                        }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        style={[styles.inputStyle, errors.email && localStyles.inputErrorBorder]}
                                        rightComponent={isValidEmail(email) ? (
                                            <View style={styles.iconContainer}><Text style={styles.checkIcon}>✓</Text></View>
                                        ) : null}
                                    />
                                    {!!errors.email && <Text style={localStyles.errorText}>{errors.email}</Text>}

                                    <Text style={[styles.label, styles.spacing]}>CPF:</Text>
                                    <CustomInput
                                        placeholder="000.000.000-00"
                                        value={cpf}
                                        onChangeText={(text) => {
                                            setCpf(formatCPF(text));
                                            clearError('cpf');
                                        }}
                                        keyboardType="numeric"
                                        style={[styles.inputStyle, errors.cpf && localStyles.inputErrorBorder]}
                                    />
                                    {!!errors.cpf && <Text style={localStyles.errorText}>{errors.cpf}</Text>}

                                    <Text style={[styles.label, styles.spacing]}>TELEFONE:</Text>
                                    <CustomInput
                                        placeholder="(00) 00000-0000"
                                        value={telefone}
                                        onChangeText={(text) => {
                                            setTelefone(formatTelefone(text));
                                            clearError('telefone');
                                        }}
                                        keyboardType="phone-pad"
                                        style={[styles.inputStyle, errors.telefone && localStyles.inputErrorBorder]}
                                    />
                                    {!!errors.telefone && <Text style={localStyles.errorText}>{errors.telefone}</Text>}

                                    <Text style={[styles.label, styles.spacing]}>SENHA:</Text>
                                    <CustomInput
                                        placeholder="********"
                                        value={senha}
                                        onChangeText={(text) => {
                                            setSenha(text);
                                            clearError('senha');
                                        }}
                                        secureTextEntry={!showPass}
                                        style={[styles.inputStyle, errors.senha && localStyles.inputErrorBorder]}
                                        rightComponent={
                                            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.iconContainer}>
                                                <Text style={{ fontSize: 18, opacity: 0.5 }}>{showPass ? '🙈' : '👁'}</Text>
                                            </TouchableOpacity>
                                        }
                                    />
                                    {!!errors.senha && <Text style={localStyles.errorText}>{errors.senha}</Text>}

                                    <Text style={[styles.label, styles.spacing]}>CONFIRMAR SENHA:</Text>
                                    <CustomInput
                                        placeholder="********"
                                        value={confirm}
                                        onChangeText={(text) => {
                                            setConfirm(text);
                                            clearError('confirm');
                                        }}
                                        secureTextEntry={!showConfirm}
                                        style={[styles.inputStyle, errors.confirm && localStyles.inputErrorBorder]}
                                        rightComponent={
                                            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.iconContainer}>
                                                <Text style={{ fontSize: 18, opacity: 0.5 }}>{showConfirm ? '🙈' : '👁'}</Text>
                                            </TouchableOpacity>
                                        }
                                    />
                                    {!!errors.confirm && <Text style={localStyles.errorText}>{errors.confirm}</Text>}
                                </>
                            )}

                            {step === 3 && (
                                <>
                                    <Text style={localStyles.optionalHint}>Todos os campos abaixo são opcionais</Text>

                                    <Text style={styles.label}>RUA:</Text>
                                    <CustomInput
                                        placeholder="Nome da rua"
                                        value={rua}
                                        onChangeText={setRua}
                                        style={styles.inputStyle}
                                    />

                                    <Text style={[styles.label, styles.spacing]}>NÚMERO:</Text>
                                    <CustomInput
                                        placeholder="Número"
                                        value={numero}
                                        onChangeText={setNumero}
                                        style={styles.inputStyle}
                                    />

                                    <Text style={[styles.label, styles.spacing]}>BAIRRO:</Text>
                                    <CustomInput
                                        placeholder="Bairro"
                                        value={bairro}
                                        onChangeText={setBairro}
                                        style={styles.inputStyle}
                                    />

                                    <Text style={[styles.label, styles.spacing]}>CEP:</Text>
                                    <CustomInput
                                        placeholder="00000-000"
                                        value={cep}
                                        onChangeText={(text) => setCep(formatCEP(text))}
                                        keyboardType="numeric"
                                        style={styles.inputStyle}
                                    />

                                    <Text style={[styles.label, styles.spacing]}>COMPLEMENTO:</Text>
                                    <CustomInput
                                        placeholder="Apto, bloco, referência..."
                                        value={complemento}
                                        onChangeText={setComplemento}
                                        style={styles.inputStyle}
                                    />

                                    <View style={styles.acceptRow}>
                                        <TouchableOpacity
                                            style={[styles.checkbox, accepted && styles.checkboxActive]}
                                            onPress={() => setAccepted(!accepted)}
                                        >
                                            {accepted && <Text style={styles.checkIconSmall}>✓</Text>}
                                        </TouchableOpacity>
                                        <Text style={styles.acceptText}>Aceito as políticas de privacidade</Text>
                                    </View>
                                </>
                            )}
                        </Animated.View>

                        {/* ── Navegação entre etapas ─────────────────────────── */}
                        <View style={localStyles.navRow}>
                            {step > 1 && (
                                <TouchableOpacity
                                    style={localStyles.backStepButton}
                                    onPress={handleBackStep}
                                    disabled={isSubmitting}
                                >
                                    <Ionicons name="chevron-back" size={16} color="rgba(10,10,10,0.75)" />
                                    <Text style={localStyles.backStepButtonText}>Voltar</Text>
                                </TouchableOpacity>
                            )}

                            <View style={{ flex: 1 }}>
                                {step < TOTAL_STEPS ? (
                                    <CustomButton
                                        title="PRÓXIMO"
                                        onPress={handleNext}
                                        style={styles.glassButton}
                                        textStyle={styles.glassButtonText}
                                    />
                                ) : (
                                    <CustomButton
                                        title={isSubmitting ? 'CRIANDO...' : 'CRIAR CONTA'}
                                        onPress={handleCadastro}
                                        disabled={isSubmitting}
                                        style={styles.glassButton}
                                        textStyle={styles.glassButtonText}
                                    />
                                )}
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            style={styles.footerTouchable}
                        >
                            <Text style={styles.footerText}>
                              Já possui uma conta? <Text style={styles.link}>Entrar</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Estilos NOVOS do wizard — definidos localmente para não alterar
// src/styles/styleCadastro/styleCadastro.js.
//
// AJUSTE FUNDO CLARO: base em preto translúcido baixo (rgba(10,10,10,x)) em vez
// de branco translúcido; sombra suave no lugar do brilho de borda; texto escuro
// translúcido em vez de branco translúcido. O acento crimson permanece igual
// (já contrasta bem em fundo claro).
// ─────────────────────────────────────────────────────────────────────────────
const localStyles = StyleSheet.create({
    progressSection: {
        marginTop: 4,
        marginBottom: 22,
    },
    dotsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    dot: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'rgba(10,10,10,0.14)',
        backgroundColor: 'rgba(10,10,10,0.04)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 2,
        elevation: 1,
    },
    dotFilled: {
        borderColor: 'rgba(192,0,10,0.9)',
        backgroundColor: '#c0000a',
    },
    dotConnector: {
        width: 34,
        height: 2,
        marginHorizontal: 4,
        backgroundColor: 'rgba(10,10,10,0.10)',
        borderRadius: 1,
        overflow: 'hidden',
    },
    dotConnectorFill: {
        height: '100%',
        backgroundColor: '#c0000a',
    },
    progressTrack: {
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(10,10,10,0.08)',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressLabel: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.4,
        color: 'rgba(10,10,10,0.50)',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    stepContainer: {
        width: '100%',
    },
    sexoRow: {
        flexDirection: 'row',
    },
    sexoChip: {
        flex: 1,
        height: 46,
        marginRight: 10,
        borderRadius: 14,
        borderWidth: 0.75,
        borderColor: 'rgba(10,10,10,0.14)',
        backgroundColor: 'rgba(10,10,10,0.03)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    sexoChipActive: {
        borderColor: 'rgba(192,0,10,0.9)',
        shadowOpacity: 0.12,
    },
    sexoChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(10,10,10,0.60)',
        letterSpacing: 0.3,
    },
    sexoChipTextActive: {
        color: '#fff',
    },
    errorText: {
        marginTop: 6,
        fontSize: 12,
        color: '#d0263c',
        fontWeight: '500',
    },
    inputErrorBorder: {
        borderWidth: 1,
        borderColor: '#d0263c',
    },
    optionalHint: {
        fontSize: 12,
        color: 'rgba(10,10,10,0.40)',
        marginBottom: 14,
        fontStyle: 'italic',
    },
    navRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 28,
    },
    backStepButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        paddingHorizontal: 18,
        marginRight: 10,
        borderRadius: 16,
        borderWidth: 0.75,
        borderColor: 'rgba(10,10,10,0.14)',
        backgroundColor: 'rgba(10,10,10,0.03)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    backStepButtonText: {
        marginLeft: 4,
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(10,10,10,0.75)',
        letterSpacing: 0.3,
    },
});

// styles and data moved to src/styles/styleCadastro/styleCadastro.js and src/data/dataCadastro.js