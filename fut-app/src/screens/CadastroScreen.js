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

import { escudoDrakos, colors } from '../data/dataCadastro';
import styles from '../styles/styleCadastro/styleCadastro';

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
                                <Text style={styles.acceptText}>Aceito as políticas de privacidade</Text>
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
                                  Já possui uma conta? <Text style={styles.link}>Entrar</Text>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// styles and data moved to src/styles/styleCadastro/styleCadastro.js and src/data/dataCadastro.js