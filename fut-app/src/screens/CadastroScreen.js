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
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
                    
                    {/* HEADER PADRONIZADO */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                            <Text style={styles.backText}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>BEM VINDO AO COVIL</Text>
                        <Text style={styles.headerSubtitle}>Faça seu Cadastro para entrar no Covil dos Drakos</Text>
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
                                // O CustomInput já tem o estilo base, passamos apenas o fundo customizado
                                style={{ backgroundColor: colors.cardBackground }}
                            />

                            <Text style={styles.label}>Seu Email/Cpf:</Text>
                            <CustomInput
                                placeholder="email@exemplo.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={{ backgroundColor: colors.cardBackground }}
                            />

                            <Text style={styles.label}>Senha:</Text>
                            <CustomInput
                                placeholder="********"
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry
                                style={{ backgroundColor: colors.cardBackground }}
                            />

                            <Text style={styles.label}>Confirmar Senha:</Text>
                            <CustomInput
                                placeholder="********"
                                value={confirm}
                                onChangeText={setConfirm}
                                secureTextEntry
                                style={{ backgroundColor: colors.cardBackground }}
                            />

                            {/* BOTÃO PADRONIZADO */}
                            <View style={styles.buttonWrap}>
                                <CustomButton 
                                    title="Criar conta" 
                                    onPress={handleCadastro} 
                                    // Usando o estilo glass que combina com o header
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
        backgroundColor: colors.primary,
    },
    header: {
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
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
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
    card: {
        flex: 1,
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 25,
        paddingTop: 30,
        paddingBottom: 40,
    },
    formTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 20,
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
    buttonWrap: {
        marginTop: 15,
        marginBottom: 20,
    },
    glassButton: {
        backgroundColor: colors.primary, // Botão de ação principal em vermelho
        borderRadius: 12,
        elevation: 4,
    },
    glassButtonText: {
        color: colors.white,
    },
    footerText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
    },
    link: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});