import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, StatusBar } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { escudoDrakos, colors } from '../data/dataLogin';
import { useAuth } from '../contexts/AuthContext';
import { stylesLogin } from '../styles/styleLogin/styleLogin';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);
    })();
  }, []);

  const emailValid = email.includes('@') && email.includes('.');

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    if (!emailValid) {
      Alert.alert('Erro', 'Email inválido!');
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(email, senha);
    } catch (error) {
      Alert.alert('Erro', error?.message || 'Não foi possível realizar o login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBiometricAuth = async () => {
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      return Alert.alert('Biometria não configurada', 'Por favor, configure uma digital ou FaceID nas configurações do seu celular.');
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Entrar no Covil dos Drakos',
      fallbackLabel: 'Usar senha',
      disableDeviceFallback: false,
    });

    if (result.success) {
      if (!email || !senha) {
        Alert.alert('Erro', 'Preencha email e senha para continuar.');
        return;
      }

      try {
        setIsSubmitting(true);
        await signIn(email, senha);
      } catch (error) {
        Alert.alert('Erro', error?.message || 'Não foi possível realizar o login.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <SafeAreaView style={stylesLogin.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={stylesLogin.container}
      >
        <ScrollView
          contentContainerStyle={stylesLogin.scrollGrow}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >

          {/* HEADER VERMELHO */}
          <View style={stylesLogin.header}>
            <Image source={escudoDrakos} style={stylesLogin.escudoHeader} resizeMode="contain" />
            <View style={stylesLogin.headerContent}>
              <Text style={stylesLogin.headerTitle}>BEM-VINDO DE VOLTA AO COVIL</Text>
              <Text style={stylesLogin.headerSubtitle}>Faça seu login para entrar no Covil dos Drakos</Text>
            </View>
          </View>

          {/* CARD CINZA */}
          <View style={stylesLogin.card}>
            <Text style={stylesLogin.formTitle}>Login</Text>

            <View style={stylesLogin.formContent}>
              <Text style={stylesLogin.label}>Seu EMAIL/CPF:</Text>
              <CustomInput
                placeholder="email@exemplo.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={stylesLogin.inputStyle}
                rightComponent={
                  emailValid && (
                    <View style={stylesLogin.iconContainer}>
                      <Text style={stylesLogin.checkIcon}>✓</Text>
                    </View>
                  )
                }
              />

              <Text style={[stylesLogin.label, stylesLogin.passwordLabel]}>Senha:</Text>
              <CustomInput
                placeholder="********"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPass}
                style={stylesLogin.inputStyle}
                rightComponent={
                  <TouchableOpacity onPress={() => setShowPass(!showPass)} style={stylesLogin.iconContainer}>
                    <Text style={stylesLogin.inlineIconText}>{showPass ? <Ionicons name="eye-off" style={stylesLogin.iconEye} /> : <Ionicons name="eye" style={stylesLogin.iconEye} />}</Text>
                  </TouchableOpacity>
                }
              />

              <View style={stylesLogin.forgotRow}>
                <Text style={stylesLogin.forgotText}>Esqueceu Senha?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EsqueceuSenha')} style={stylesLogin.redefineBtn}>
                  <Text style={[stylesLogin.forgotText, stylesLogin.linkBold]}>Redefinir</Text>
                </TouchableOpacity>
              </View>

              <View style={stylesLogin.buttonWrap}>
                <CustomButton
                  title={isSubmitting ? 'Entrando...' : 'Entrar'}
                  onPress={handleLogin}
                  disabled={isSubmitting}
                  style={stylesLogin.glassButton}
                  textStyle={stylesLogin.buttonTitle}
                />

                {isBiometricSupported && (
                  <TouchableOpacity onPress={handleBiometricAuth} style={stylesLogin.biometricBtn}>
                    <Ionicons name="finger-print" size={24} color={colors.primary} />
                    <Text style={stylesLogin.biometricText}>Entrar com Biometria</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} activeOpacity={0.7} style={stylesLogin.footerContainer}>
              <Text style={stylesLogin.footerText}>
                Não possui uma conta? <Text style={stylesLogin.linkBold}>Registrar</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
