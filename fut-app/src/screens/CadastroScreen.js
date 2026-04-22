import { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

// DEFINIÇÃO DAS CORES PADRONIZADAS
const colors = {
    primary: '#880000',      // Vermelho do Covil
    background: '#E0E0E0',   // Cinza do fundo (Card)
    white: '#FFFFFF',
    text: '#000000',
    mutedText: '#B9B9B9',
    cardBackground: '#E9E9E9' // Fundo dos inputs
};

export default function CadastroScreen({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirm, setConfirm] = useState('');
    const [accepted, setAccepted] = useState(false);

    const handleCadastro = () => {
        if (!nome || !email || !senha || !confirm) {
            Alert.alert('Erro', 'Preencha todos os campos!');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Erro', 'Email inválido!');
            return;
        }
        if (senha !== confirm) {
            Alert.alert('Erro', 'As senhas não coincidem!');
            return;
        }

        Alert.alert('Sucesso', 'Conta criada! Faça login.');
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', paddingBottom: 40 }}
                    bounces={false}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    
                    {/* HEADER PADRONIZADO */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                            <Text style={styles.backText}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>AQUI COMEÇA TUDO PARA VOCÊ!</Text>
                        <Text style={styles.headerSubtitle}>Crie sua conta para desbloquear o conteúdo exclusivo</Text>
                    </View>

                    {/* CARD DE FORMULÁRIO */}
                    <View style={styles.card}>
                        <Text style={styles.formTitle}>Cadastro</Text>
                        
                        <View style={styles.formContent}>
                            <Text style={styles.label}>Seu nome:</Text>
                            <CustomInput
                                placeholder="Nome completo ou sobrenome"
                                value={nome}
                                onChangeText={setNome}
                                containerStyle={{ marginBottom: 12 }}
                                style={{ backgroundColor: colors.cardBackground }}
                            />

                            <Text style={styles.label}>Seu Email/Cpf:</Text>
                            <CustomInput
                                placeholder="email@exemplo.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                containerStyle={{ marginBottom: 12 }}
                                style={{ backgroundColor: colors.cardBackground }}
                                rightComponent={email.includes('@') && email.includes('.') ? (
                                    <View style={styles.iconContainer}><Text style={styles.checkIcon}>✓</Text></View>
                                ) : null}
                            />

                            <Text style={[styles.label, styles.passwordLabel]}>Senha:</Text>
                            <CustomInput
                                placeholder="********"
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry
                                containerStyle={{ marginBottom: 12 }}
                                style={{ backgroundColor: colors.cardBackground }}
                                rightComponent={<TouchableOpacity onPress={() => {}} style={styles.iconContainer}><Text>👁</Text></TouchableOpacity>}
                            />

                            <Text style={styles.label}>Confirmar Senha:</Text>
                            <CustomInput
                                placeholder="********"
                                value={confirm}
                                onChangeText={setConfirm}
                                secureTextEntry
                                containerStyle={{ marginBottom: 12 }}
                                style={{ backgroundColor: colors.cardBackground }}
                                rightComponent={<TouchableOpacity onPress={() => {}} style={styles.iconContainer}><Text>👁</Text></TouchableOpacity>}
                            />

                            <View style={styles.acceptRow}>
                                <TouchableOpacity style={[styles.checkbox, accepted && styles.checkboxActive]} onPress={() => setAccepted(!accepted)}>
                                    {accepted && <Text style={styles.checkIconSmall}>✓</Text>}
                                </TouchableOpacity>
                                <Text style={styles.acceptText}>Eu aceito políticas é privacidade desse app</Text>
                            </View>

                            <View style={styles.buttonWrap}>
                                <CustomButton 
                                    title="Criar conta" 
                                    onPress={handleCadastro} 
                                    style={styles.glassButton}
                                    textStyle={styles.glassButtonText}
                                />
                            </View>

                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.footerText}>
                                    Já tem uma conta? <Text style={styles.link}>Entrar</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        height: 200,
        backgroundColor: colors.primary,
        paddingHorizontal: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    back: {
        position: 'absolute',
        left: 20,
        top: 20,
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    backText: {
        fontSize: 22,
        color: colors.white,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: colors.white,
        fontSize: 15.5,
        fontWeight: 'bold',
        letterSpacing: 1.2,
        textAlign: 'center',
    },
    headerSubtitle: {
        color: '#FFDEDE',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
        opacity: 0.8,
    },
    card: {
        flex: 1,
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 35,
        paddingBottom: 40,
        paddingHorizontal: 30,
        marginTop: -20,
    },
    formTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 25,
        textAlign: 'center',
    },
    formContent: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 6,
        marginLeft: 4,
    },
    acceptRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        marginBottom: 12,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#888',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    checkboxActive: {
        backgroundColor: '#DDD',
        borderColor: '#666',
    },
    checkIconSmall: {
        fontSize: 12,
        color: '#222',
        fontWeight: '700',
    },
    acceptText: {
        color: '#333',
        fontSize: 12,
        flex: 1,
        flexWrap: 'wrap',
    },
    buttonWrap: {
        marginTop: 30,
        width: '100%',
    },
    glassButton: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        borderWidth: 0.6,
        borderColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 6,
    },
    glassButtonText: {
        color: '#181818',
        fontWeight: '700',
        fontSize: 18,
        letterSpacing: 1.5,
    },
    footerText: {
        textAlign: 'center',
        color: colors.text,
        marginTop: 25,
        fontSize: 14,
    },
    link: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});