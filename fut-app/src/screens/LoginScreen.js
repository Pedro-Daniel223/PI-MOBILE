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
  Platform 
} from 'react-native';
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

              <Text style={[styles.label, styles.passwordLabel]}>Senha:</Text>
              <CustomInput
                placeholder="********"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showPass}
                style={{ backgroundColor: colors.cardBackground }}
                rightComponent={
                  <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.iconContainer}>
                    <Text style={{ fontSize: 18 }}>{showPass ? '🙈' : '👁'}</Text>
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
                  glass={true}
                  glassRadius={12}
                  textStyle={styles.buttonTitle}
                />
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
  safe: {
    flex: 1,
    backgroundColor: colors.background
  },
  // Estilos para o LoginScreen
  header: {
    height: 200,
    backgroundColor: colors.primary,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // esse e o  titulo do header, o texto grande
  headerTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  // esse e o subtitulo do header, o texto pequeno
  headerSubtitle: {
    color: '#FFDEDE',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    opacity: 0.8,
  },
  // esse e o card que fica por cima do header, onde tem o formulario de login
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 35,
    paddingBottom: 40,
    paddingHorizontal: 30,
    marginTop: -20,
  },
  // esse e o titulo do formulario, o texto "Login"
  formTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 25,
    textAlign: 'center',
  },
  // esse e o container do formulario, onde tem os inputs e o botao de login
  formContent: {
    width: '100%'
  },
  // esses sao os labels dos inputs, o texto "Seu Email/Cpf:" e "Senha:"
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
    marginLeft: 4,
  },
  // esse e o estilo do label da senha, tem uma margem maior em cima para separar do input de email
  passwordLabel: {
    marginTop: 13,
  },
  // esse e o container do icone de check que aparece quando o email e valido, ou do icone de olho para mostrar/ocultar a senha
  iconContainer: {
    paddingRight: 10,
    justifyContent: 'center',
  },
  // esse e o estilo do icone de check que aparece quando o email e valido
  checkIcon: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 18
  },
  // esse e o container da linha de "Esqueceu Senha?" e "Redefinir", eles ficam na mesma linha
  forgotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  // esse e o estilo do botao de redefinir senha, ele tem uma margem a esquerda para separar do texto "Esqueceu Senha?"
  redefineBtn: {
    marginLeft: 8,
  },
  // esse e o estilo do texto "Esqueceu Senha?" e "Redefinir", eles tem a mesma cor e tamanho, mas o "Redefinir" tem um estilo diferente para parecer um link
  forgotText: {
    fontSize: 14,
    color: colors.text
  },
  // esse e o estilo do texto "Registrar" no rodape, ele tem a mesma cor e tamanho do texto "Não possui conta?", mas tem um estilo diferente para parecer um link
  linkBold: {
    color: colors.link,
    fontWeight: 'bold'
  },
  // esse e o container do botao de login, ele tem uma margem em cima para separar dos inputs e ocupa toda a largura do formulario
  buttonWrap: {
    marginTop: 30,
    width: '100%',
  },
  // esse e o estilo do botao de login, ele tem um fundo branco com opacidade para parecer um vidro, bordas arredondadas, sombra e um texto grande e negrito
  glassButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
  },
  // esse e o estilo do texto do botao de login, ele tem uma cor escura para contrastar com o fundo claro do botao, e um tamanho grande e negrito para chamar a atencao
  buttonTitle: {
    color: '#181818',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 1.5,
  },
  // esse e o estilo do texto do rodape, ele tem uma cor escura para contrastar com o fundo claro do card, um tamanho pequeno e uma margem em cima para separar do botao de login
  footerText: {
    textAlign: 'center',
    color: colors.text,
    marginTop: 25,
    fontSize: 14,
  },
});