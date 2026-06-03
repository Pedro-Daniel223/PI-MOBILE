import React, { useState, useLayoutEffect, useEffect } from 'react'; // Adicionado useEffect
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, StatusBar } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication'; // NOVO: Importação
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { Ionicons } from '@expo/vector-icons';
import { escudoDrakos, colors } from '../data/dataLogin';
import { stylesLogin } from '../styles/styleLogin/styleLogin';

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
    navigation.navigate('MainTabs');
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
      navigation.replace('MainTabs');
    }
  };

  return (
  <SafeAreaView style={stylesLogin.safe}>
      {/* Define a cor da barra de status do celular */}
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
            <Image 
              source={escudoDrakos}
              style={stylesLogin.escudoHeader}
              resizeMode="contain"
            />
            <View style={styles.headerContent}>
              <Text style={stylesLogin.headerTitle}>BEM-VINDO DE VOLTA AO COVIL</Text>
              <Text style={stylesLogin.headerSubtitle}>Faça seu login para entrar no Covil dos Drakos</Text>
            </View>
          </View>

          {/* CARD CINZA */}
          <View style={stylesLogin.card}>
            <Text style={stylesLogin.formTitle}>Login</Text>

            <View style={styles.formContent}>
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
                    <View style={styles.iconContainer}>
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
                  <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.iconContainer}>
                    <Text style={stylesLogin.inlineIconText}>{showPass ? <Ionicons name="eye-off" style={stylesLogin.iconEye} /> : <Ionicons name="eye" style={stylesLogin.iconEye} />}</Text>
                  </TouchableOpacity>
                }
              />

              <View style={stylesLogin.forgotRow}>
                <Text style={stylesLogin.forgotText}>Esqueceu Senha?</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('EsqueceuSenha')}
                  style={styles.redefineBtn}
                >
                  <Text style={[stylesLogin.forgotText, stylesLogin.linkBold]}>Redefinir</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonWrap}>
                <CustomButton
                  title="Entrar"
                  onPress={handleLogin}
                  style={stylesLogin.glassButton}
                  textStyle={stylesLogin.buttonTitle}
                />

                {/* NOVO: Botão de Biometria condicional */}
                {isBiometricSupported && (
                  <TouchableOpacity 
                    onPress={handleBiometricAuth} 
                    style={stylesLogin.biometricBtn}
                  >
                    <Ionicons name="finger-print" size={24} color={colors.primary} />
                    <Text style={stylesLogin.biometricText}>Entrar com Biometria</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => {
                console.log("Navegando para Cadastro...");
                navigation.navigate('Cadastro');
              }}
              activeOpacity={0.7}
              style={stylesLogin.footerContainer}
            >
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
