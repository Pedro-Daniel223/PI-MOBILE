import { useState } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const colors = {
    primary: '#880000',      
    background: '#E0E0E0',   
    white: '#FFFFFF',
    text: '#000000',
    mutedText: '#707070',
    cardBackground: '#E9E9E9' 
};

export default function CadastroScreen({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState(''); // Novo campo Opcional
    const [senha, setSenha] = useState('');
    const [confirm, setConfirm] = useState('');
    const [accepted, setAccepted] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleCadastro = () => {
        if (!nome || !email || !senha || !confirm) {
            Alert.alert('Erro', 'Preencha os campos obrigatórios!');
            return;
        }
        if (senha !== confirm) {
            Alert.alert('Erro', 'As senhas não coincidem!');
            return;
        }
        if (!accepted) {
            Alert.alert('Aviso', 'Você precisa aceitar as políticas de privacidade.');
            return;
        }

        Alert.alert('Sucesso', 'Conta criada!');
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                            <Text style={styles.backText}>←</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>AQUI COMEÇA TUDO PARA VOCÊ!</Text>
                        <Text style={styles.headerSubtitle}>Crie sua conta para desbloquear o conteúdo exclusivo</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.formTitle}>Cadastro</Text>
                        
                        <View style={styles.formContent}>
                            <Text style={styles.label}>NOME COMPLETO:</Text>
                            <CustomInput
                                placeholder="Como deseja ser chamado"
                                value={nome}
                                onChangeText={setNome}
                                style={styles.inputStyle}
                            />

                            <Text style={[styles.label, styles.spacing]}>EMAIL:</Text>
                            <CustomInput
                                placeholder="email@exemplo.com"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.inputStyle}
                                rightComponent={email.includes('@') && email.includes('.') ? (
                                    <View style={styles.iconContainer}><Text style={styles.checkIcon}>✓</Text></View>
                                ) : null}
                            />

                            {/* CAMPO CPF OPCIONAL */}
                            <Text style={[styles.label, styles.spacing]}>CPF (OPCIONAL):</Text>
                            <CustomInput
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChangeText={setCpf}
                                keyboardType="numeric"
                                style={styles.inputStyle}
                            />

                            <Text style={[styles.label, styles.spacing]}>SENHA:</Text>
                            <CustomInput
                                placeholder="********"
                                value={senha}
                                onChangeText={setSenha}
                                secureTextEntry={!showPass}
                                style={styles.inputStyle}
                                rightComponent={
                                    <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.iconContainer}>
                                        <Text style={{fontSize: 18, opacity: 0.5}}>{showPass ? '🙈' : '👁'}</Text>
                                    </TouchableOpacity>
                                }
                            />

                            <Text style={[styles.label, styles.spacing]}>CONFIRMAR SENHA:</Text>
                            <CustomInput
                                placeholder="********"
                                value={confirm}
                                onChangeText={setConfirm}
                                secureTextEntry={!showConfirm}
                                style={styles.inputStyle}
                                rightComponent={
                                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.iconContainer}>
                                        <Text style={{fontSize: 18, opacity: 0.5}}>{showConfirm ? '🙈' : '👁'}</Text>
                                    </TouchableOpacity>
                                }
                            />

                            <View style={styles.acceptRow}>
                                <TouchableOpacity 
                                    style={[styles.checkbox, accepted && styles.checkboxActive]} 
                                    onPress={() => setAccepted(!accepted)}
                                >
                                    {accepted && <Text style={styles.checkIconSmall}>✓</Text>}
                                </TouchableOpacity>
                                <Text style={styles.acceptText}>Aceito políticas e privacidade</Text>
                            </View>

                            <View style={styles.buttonWrap}>
                                <CustomButton 
                                    title="CRIAR CONTA" 
                                    onPress={handleCadastro} 
                                    style={styles.glassButton}
                                    textStyle={styles.glassButtonText}
                                />
                            </View>

                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.footerText}>
                                    Já tem conta? <Text style={styles.link}>Entrar</Text>
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
        height: 180,
        backgroundColor: colors.primary,
        paddingHorizontal: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    back: {
        position: 'absolute',
        left: 20,
        top: 40,
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backText: {
        fontSize: 22,
        color: colors.white,
    },
    headerTitle: {
        color: colors.white,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 1,
    },
    headerSubtitle: {
        color: '#FFDEDE',
        fontSize: 13,
        marginTop: 8,
        textAlign: 'center',
        opacity: 0.8,
    },
    card: {
        flex: 1,
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 25,
        paddingHorizontal: 30,
        marginTop: -30,
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
        fontSize: 12,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 5,
        marginLeft: 4,
        opacity: 0.7,
    },
    spacing: {
        marginTop: 11,
    },
    inputStyle: {
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        height: 50,
    },
    iconContainer: {
        paddingRight: 15,
        justifyContent: 'center',
    },
    checkIcon: {
        color: 'green',
        fontWeight: 'bold',
        fontSize: 18
    },
    acceptRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: colors.primary,
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxActive: {
        backgroundColor: colors.primary,
    },
    checkIconSmall: {
        fontSize: 12,
        color: colors.white,
        fontWeight: 'bold',
    },
    acceptText: {
        color: '#333',
        fontSize: 12,
        fontWeight: '500',
    },
    buttonWrap: {
        marginTop: 25,
    },
    // PADRONIZADO COM O ESTILO GLASS DO LOGIN
    glassButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)', 
        borderRadius: 30, 
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.8)', 
        shadowColor: '#FFFFFF', 
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 3, 
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
        marginTop: 20,
        fontSize: 14,
        paddingBottom: 20,
    },
    link: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});