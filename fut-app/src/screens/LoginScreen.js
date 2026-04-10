import { useState, useLayoutEffect } from 'react';
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
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    if (email === '' || senha === '') {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert('Erro', 'Email inválido!');
      return;
    }
    navigation.replace('Home'); 
  };

  const emailValid = email.includes('@') && email.includes('.');

  return (
    <SafeAreaView style={styles.safe}>
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
            rightComponent={
              email ? (
                <View style={styles.iconContainer}>
                   <Text style={{ color: emailValid ? 'green' : colors.mutedText, fontWeight: 'bold' }}>
                    {emailValid ? '✓' : ''}
                  </Text>
                </View>
              ) : null
            }
            style={styles.input}
          />

          <Text style={styles.label}>Senha:</Text>
          <CustomInput
            placeholder="********"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!showPass}
            rightComponent={
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.iconContainer}>
                <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            }
            style={styles.input}
          />

          <TouchableOpacity 
            onPress={() => navigation.navigate('EsqueceuSenhaScreen')}
            style={styles.forgotBtn}
          >
            <Text style={styles.forgotText}>
              Esqueceu Senha? <Text style={styles.link}>Redefinir</Text>
            </Text>
          </TouchableOpacity>

          <View style={styles.buttonWrap}>
            <CustomButton 
               title="Entrar" 
               onPress={handleLogin} 
               style={[styles.primaryButton, styles.glassButton]} 
               titleStyle={{ color: colors.text, fontWeight: 'bold' }} 
            />
          </View>
        </View>

        <Text style={styles.footerText}>
          Não possui conta? {' '}
          <Text 
            style={styles.linkBold} 
            onPress={() => navigation.navigate('CadastroScreen')}
          >
            Registrar
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  header: {
    height: 180,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // O título do header, com um estilo claro e legível para se destacar contra o fundo do header, e um espaçamento adequado para separar do subtítulo.
  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  // O subtítulo do header, com um estilo claro e legível para se destacar contra o fundo do header, e um espaçamento adequado para separar do título.
  headerSubtitle: {
    color: '#FFDEDE',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.9,
  },
  // O card é a parte inferior da tela, que tem o formulário de login.
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    marginTop: -20,
  },
  // O título do formulário, com um estilo claro e legível para se destacar contra o fundo do card, e um espaçamento adequado para separar do restante do conteúdo.
  formTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  // O rótulo do campo de input, com um estilo claro e legível para se destacar contra o fundo do card, e um espaçamento adequado para separar do campo de input.
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    marginLeft: 4,
  },
  // O campo de input, com um estilo claro e legível para se destacar contra o fundo do card, e um espaçamento adequado para separar do restante do conteúdo.
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    marginBottom: 16,
  },
  // O container do ícone de validação do email, com um espaçamento adequado para separar do campo de input, e centralizado verticalmente para alinhar com o texto do email.
  iconContainer: {
    paddingRight: 12,
    justifyContent: 'center',
  },
  // O botão "Esqueceu Senha?", com um estilo claro e legível para se destacar contra o fundo do card, e um espaçamento adequado para separar do restante do conteúdo.
  forgotBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
  },
  // O texto do link "Esqueceu Senha?", com um estilo claro e legível para se destacar contra o fundo do card, e um espaçamento adequado para separar do restante do conteúdo.
  forgotText: { fontSize: 13, color: colors.text },
  link: { color: colors.link, fontWeight: '600' },
  linkBold: { color: colors.link, fontWeight: 'bold', fontSize: 15 },
  buttonWrap: { marginTop: 25, width: '100%', alignItems: 'center' },
  formContent: { width: '100%' },
  primaryButton: { width: '100%', height: 55, borderRadius: 28 },
  glassButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // O texto do rodapé, com um estilo claro e legível para se destacar contra o fundo do card, e um espaçamento adequado para separar do restante do conteúdo.
  footerText: {
    textAlign: 'center',
    color: colors.text,
    marginTop: 25,
    fontSize: 14,
  },
});