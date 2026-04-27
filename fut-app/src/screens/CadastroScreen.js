import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Alert, 
    SafeAreaView, 
    TouchableOpacity, 
    ScrollView, 
    KeyboardAvoidingView, 
    Platform,
    Image 
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

// Ativos (Assets)
const escudoDrakos = require('../assets/img/Escudo_Drakos.png');

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
    const [cpf, setCpf] = useState('');
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
                    
                    {/* HEADER COM ESCUDO INTEGRADO (IGUAL AO LOGIN) */}
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

                            <TouchableOpacity 
                                onPress={() => navigation.navigate('Login')}
                                style={styles.footerTouchable}
                            >
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
        backgroundColor: colors.primary, // Mantém o topo sólido
    },
    header: {
        height: 200,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    escudoHeader: {
        position: 'absolute',
        width: 250,
        height: 250,
        opacity: 0.12,
        right: -40,
        top: -30,
        transform: [{ rotate: '-15deg' }],
    },
    headerContent: {
        zIndex: 2,
        paddingHorizontal: 40,
        alignItems: 'center',
    },
    back: {
        position: 'absolute',
        left: 20,
        top: 20, // Ajustado para não colidir com o SafeArea em alguns dispositivos
        zIndex: 10,
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
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 1,
    },
    headerSubtitle: {
        color: '#FFDEDE',
        fontSize: 16,
        marginTop: 8,
        textAlign: 'center',
        opacity: 0.8,
    },
    card: {
        flex: 1,
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 30,
        paddingHorizontal: 30,
        marginTop: -30,
        zIndex: 5,
    },
    formTitle: {
        fontSize: 26,
        fontWeight: '700',
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
        marginTop: 12,
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
        fontWeight: '700',
        fontSize: 18
    },
    acceptRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
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
        fontWeight: '700',
    },
    acceptText: {
        color: '#333',
        fontSize: 13,
        fontWeight: '500',
    },
    buttonWrap: {
        marginTop: 30,
    },
    glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 35,
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
        fontWeight: '750',
        fontSize: 18,
        letterSpacing: 1.5,

    },
    footerTouchable: {
        marginTop: 4,
        paddingVertical: 15,
        alignItems: 'center',
    },
    footerText: {
        color: colors.text,
        fontSize: 14,
    },
    link: {
        color: colors.primary,
        fontWeight: 'bold',
    },
});