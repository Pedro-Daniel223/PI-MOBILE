import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

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
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BEM VINDO DE VOLTA AO COVIL</Text>
        <Text style={styles.headerSubtitle}>Faça seu Login para entrar no Covil dos Drakos</Text>
      </View>

      {/* FORM CARD */}
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
            style={styles.input}
            rightComponent={
              email && (
                <View style={styles.iconContainer}>
                  <Text style={{ color: emailValid ? 'green' : colors.mutedText, fontWeight: 'bold' }}>
                    {emailValid ? '✓' : ''}
                  </Text>
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
            style={styles.input}
            rightComponent={
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.iconContainer}>
                <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            }
          />

          <TouchableOpacity 
            onPress={() => navigation.navigate('EsqueceuSenhaScreen')}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotText}>
              Esqueceu Senha? <Text style={styles.linkBold}>Redefinir</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonWrap}>
            <CustomButton 
                title="Entrar" 
                onPress={handleLogin} 
                style={styles.glassButton} 
                titleStyle={styles.buttonTitle} 
            />
          </View>
        </View>

        <Text style={styles.footerText}>
          Não possui conta? {' '}
          <Text style={styles.linkBold} onPress={() => navigation.navigate('CadastroScreen')}>
            Registrar
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Layout Principal
  safe: { flex: 1, backgroundColor: colors.primary },
  // O header, com um fundo sólido e um texto claro para dar as boas-vindas ao usuário, e um espaçamento adequado para separar do restante do conteúdo.
  header: {
    height: 210,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 20,
  },
  headerSubtitle: {
    color: '#FFDEDE',
    fontSize: 14.5,
    marginTop: 7.5,
    textAlign: 'center',
    opacity: 1.2,
  },

  // Card de Formulário
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    marginTop: -20,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 21,
    textAlign: 'center',
  },
  formContent: { width: '100%' },

  // Inputs
  label: {
    fontSize: 14.5,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    marginLeft: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    marginBottom: 15,
  },
  iconContainer: {
    paddingRight: 14,
    justifyContent: 'center',
  },

  // Links e Texto
  forgotBtn: {
    alignSelf: 'flex-start', // Move para a esquerda
    marginTop: 6.5,
  },
  forgotText: { 
    fontSize: 14.5, 
    color: colors.text 
  },
  linkBold: { 
    color: colors.link, 
    fontWeight: 'bold' 
  },
  footerText: {
    textAlign: 'center',
    color: colors.text,
    marginTop: 26,
    fontSize: 14,
  },

  // Botão com efeito de Vidro Refinado
  buttonWrap: { 
    marginTop: 25, 
    width: '100%',
    // Um leve brilho ao redor do container ajuda a destacar o vidro
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  glassButton: {
    // Branco bem suave para parecer vidro limpo
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    
    // A borda é o "pulo do gato": mais opaca que o fundo para simular o reflexo da luz na quina
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.7)', 
    
    borderRadius: 28,
    height: 55,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    
    // Sombra projetada (Android/iOS)
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonTitle: { 
    color: colors.text, 
    fontWeight: '700', // Negrito ajuda a ler através da transparência
    fontSize: 16,
    letterSpacing: 0.8,
    // Sombra interna no texto para dar profundidade
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});