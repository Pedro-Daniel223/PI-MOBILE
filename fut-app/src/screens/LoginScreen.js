import React, { useState, useLayoutEffect } from 'react';
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

const escudoDrakos = require('../assets/img/Escudo_Drakos.png');

const colors = {
  primary: '#880000',
  background: '#E0E0E0',
  white: '#FFFFFF',
  text: '#000000',
  mutedText: '#B9B9B9',
  link: '#880000',
  cardBackground: '#E9E9E9',
  border: '#CCCCCC',
  success: '#2E8B57',
  headerSubtitle: '#FFDEDE'
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPass, setShowPass] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

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

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollGrow} 
          bounces={false} 
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER COM ESCUDO INTEGRADO */}
          <View style={styles.header}>
            <Image 
              source={escudoDrakos}
              style={styles.escudoHeader}
              resizeMode="contain"
            />
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>BEM VINDO DE VOLTA AO COVIL</Text>
              <Text style={styles.headerSubtitle}>Faça seu Login para entrar no Covil dos Drakos</Text>
            </View>
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
                style={styles.inputStyle}
                rightComponent={
                  emailValid && (
                    <View style={styles.iconContainer}>
                      <Text style={styles.checkIcon}>✓</Text>
                    </View>
                  )
                }
              />

              <Text style={[styles.label, styles.passwordLabel]}>Senha:</Text>
              <CustomInput
                placeholder="********"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPass}
                style={styles.inputStyle}
                rightComponent={
                  <TouchableOpacity 
                    onPress={() => setShowPass(!showPass)} 
                    style={styles.iconContainer}
                  >
                    <Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁'}</Text>
                  </TouchableOpacity>
                }
              />

              <View style={styles.forgotRow}>
                <Text style={styles.forgotText}>Esqueceu Senha?</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('EsqueceuSenhaScreen')} 
                  style={styles.redefineBtn}
                >
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
              </View>
            </View>

            {/* BOTÃO DE REGISTRAR - PRIORIDADE DE TOQUE ALTA */}
            <TouchableOpacity 
              onPress={() => {
                console.log("Navegando para Cadastro...");
                navigation.navigate('CadastroScreen');
              }}
              activeOpacity={0.7}
              style={styles.footerContainer}
            >
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
  safe: {
    flex: 1,
    backgroundColor: colors.primary, // Cor do topo para o SafeArea superior
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollGrow: {
    flexGrow: 1,
  },
  header: {
    height: 200,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Mantém o escudo dentro do limite
  },
  escudoHeader: {
    position: 'absolute',
    width: 250,
    height: 250,
    opacity: 0.15, // Opacidade baixa para não brigar com o texto
    right: -50,
    top: -20,
    transform: [{ rotate: '-15deg' }],
  },
  headerContent: {
    zIndex: 2,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: colors.headerSubtitle,
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 30,
    marginTop: -30, // Encaixe perfeito no header
    zIndex: 10, // Garante que o card e seus botões fiquem por cima de tudo
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 30,
    textAlign: 'center',
  },
  formContent: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.8,
  },
  inputStyle: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    height: 55,
  },
  passwordLabel: {
    marginTop: 18,
  },
  iconContainer: {
    paddingRight: 15,
    justifyContent: 'center',
  },
  checkIcon: {
    color: colors.success,
    fontWeight: 'bold',
    fontSize: 18,
  },
  eyeIcon: {
    fontSize: 18, 
    opacity: 0.6,
  },
  forgotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  redefineBtn: {
    marginLeft: 5,
  },
  forgotText: {
    fontSize: 14,
    color: colors.text,
  },
  linkBold: {
    color: colors.link,
    fontWeight: 'bold',
  },
  buttonWrap: {
    marginTop: 35,
    width: '100%',
  },
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
  buttonTitle: {
    color: '#181818',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 1.5,
  },
  footerContainer: {
    marginTop: 30,
    paddingVertical: 20, // Área de toque bem generosa
    width: '100%',
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 14,
  },
});