import React, { useState, useLayoutEffect, useEffect } from 'react'; // Adicionado useEffect
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication'; // NOVO: Importação
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';

const colors = {
  primary: '#880000',      
  background: '#E0E0E0',   
  white: '#FFFFFF',
  text: '#000000',
  mutedText: '#B9B9B9',
  link: '#880000',
  cardBackground: '#E9E9E9',
  border: '#CCCCCC'
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false); // NOVO: Estado para verificar suporte

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // NOVO: Verifica se o dispositivo suporta biometria ao carregar a tela
  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const emailValid = email.includes('@') && email.includes('.');

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    if (!emailValid) {
      Alert.alert('Erro', 'Email inválido!');
      return;
    }
    navigation.replace('Home');
  };

  // NOVO: Função de Autenticação Biométrica
  const handleBiometricAuth = async () => {
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!isEnrolled) {
      return Alert.alert(
        'Biometria não configurada',
        'Por favor, configure uma digital ou FaceID nas configurações do seu celular.'
      );
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Entrar no Covil dos Drakos',
      fallbackLabel: 'Usar senha',
      disableDeviceFallback: false,
    });

    if (result.success) {
      navigation.replace('Home');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>BEM VINDO DE VOLTA AO COVIL</Text>
            <Text style={styles.headerSubtitle}>Faça seu Login para entrar no Covil dos Drakos</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.formTitle}>Login</Text>

            <View style={styles.formContent}>
              <Text style={styles.label}>Seu Email/Cpf:</Text>
              <CustomInput
                placeholder="email@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ backgroundColor: colors.cardBackground }}
                rightComponent={
                  emailValid && (
                    <View style={styles.iconContainer}>
                      <Text style={styles.checkIcon}>✓</Text>
                    </View>
                  )
                }
              />

              <Text style={styles.label}>Senha:</Text>
              <CustomInput
                placeholder="********"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPass}
                style={{ backgroundColor: colors.cardBackground }}
                rightComponent={
                  <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.iconContainer}>
                    <Text style={{ fontSize: 18 }}>{showPass ? <Ionicons name="eye-off" style={styles.iconEye} /> : <Ionicons name="eye" style={styles.iconEye} />}</Text>
                  </TouchableOpacity>
                }
              />

              <View style={styles.forgotRow}>
                <Text style={styles.forgotText}>Esqueceu Senha?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EsqueceuSenhaScreen')} style={styles.redefineBtn}>
                  <Text style={[styles.forgotText, styles.linkBold]}>Redefinir</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonWrap}>
                <CustomButton 
                  title="Entrar" 
                  onPress={handleLogin} 
                  style={styles.glassButton} 
                  textStyle={styles.buttonTitle}
                />

                {/* NOVO: Botão de Biometria condicional */}
                {isBiometricSupported && (
                  <TouchableOpacity 
                    onPress={handleBiometricAuth} 
                    style={styles.biometricBtn}
                  >
                    <Ionicons name="finger-print" size={24} color={colors.primary} />
                    <Text style={styles.biometricText}>Entrar com Biometria</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('CadastroScreen')}>
                <Text style={styles.footerText}>
                  Não possui conta? <Text style={styles.linkBold}>Registrar</Text>
                </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... Seus estilos anteriores se mantêm iguais ...
  safe: { flex: 1, backgroundColor: colors.background },
  header: { height: 200, backgroundColor: colors.primary, paddingHorizontal: 25, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: colors.white, fontSize: 16, fontWeight: 'bold', letterSpacing: 1.2, textAlign: 'center' },
  headerSubtitle: { color: '#FFDEDE', fontSize: 14, marginTop: 10, textAlign: 'center', opacity: 0.8 },
  card: { flex: 1, backgroundColor: colors.background, borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 35, paddingBottom: 40, paddingHorizontal: 30, marginTop: -20 },
  formTitle: { fontSize: 26, fontWeight: 'bold', color: colors.primary, marginBottom: 25, textAlign: 'center' },
  formContent: { width: '100%' },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 6, marginLeft: 4 },
  iconContainer: { paddingRight: 10, justifyContent: 'center' },
  checkIcon: { color: 'green', fontWeight: 'bold', fontSize: 18 },
  forgotRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  redefineBtn: { marginLeft: 8 },
  forgotText: { fontSize: 14, color: colors.text },
  linkBold: { color: colors.link, fontWeight: 'bold' },
  buttonWrap: { marginTop: 30, width: '100%' },
  glassButton: { backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, height: 56, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, borderWidth: 0.6, borderColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 6 },
  buttonTitle: { color: '#181818', fontWeight: '700', fontSize: 18, letterSpacing: 1.5 },
  footerText: { textAlign: 'center', color: colors.text, marginTop: 25, fontSize: 14 },
  
  // NOVO: Estilos para o botão de biometria
  biometricBtn: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  biometricText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 14,
  },
  iconEye: {
    color: colors.primary,
    fontSize: 18,
  },
});