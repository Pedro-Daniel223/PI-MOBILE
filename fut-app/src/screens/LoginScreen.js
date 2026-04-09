import { useState, useLayoutEffect } from 'react';
import {View,Text,StyleSheet,Alert,SafeAreaView,TouchableOpacity} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import colors from '../theme/colors';

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
              <Text style={{ color: emailValid ? colors.text : colors.mutedText }}>{emailValid ? '✓' : ''}</Text>
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
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Text style={{ color: colors.mutedText }}>{showPass ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          }
          style={styles.input}
        />

        <Text style={styles.forgotText}>Esqueceu Senha? <Text style={styles.link} onPress={() => navigation.navigate('EsqueceuSenha')}>Redefinir</Text></Text>

        <View style={styles.buttonWrap}>
          <CustomButton title="Entrar" onPress={handleLogin} style={[styles.primaryButton, styles.glassButton]} />
        </View>
			</View>

        <Text style={styles.footerText}>Não possui conta? <Text style={styles.link} onPress={() => navigation.navigate('Cadastro')}>Registrar</Text></Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  // Esse é o header, a parte vermelha que fica no topo da tela, onde tem o título e subtítulo.
  header: {
    height: 210,
    paddingTop: 25,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // As fontes que ficam dentro do header no caso titulo.
  headerTitle: {
    color: colors.white,
    fontSize: 17.5,
    fontWeight: '600',
    letterSpacing: 2,
  },
  // As fontes que ficam dentro do header no caso subtitulo.
  headerSubtitle: {
    color: '#ffdede',
    fontSize: 14,
    marginTop: 10,
  },
  // O card é a parte principal da tela, onde ficam os inputs e o botão de login.
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    marginTop: -25,
  },
  // O formTitle é o título do formulário, no caso "Login".
  formTitle: {
    fontSize: 24,
    fontWeight: '550',
    color: colors.primary,
    marginBottom: 14,
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  // O label é o texto que fica acima do input, para indicar o que deve ser preenchido.
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  // Esses estilos de input e justamente pra colocar as informações de validação.
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: colors.cardBackground,
    marginBottom: 1,
  },
  // Esse é o texto de "Esqueci minha senha", que fica abaixo do input de senha.
  forgotText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 9,
    marginTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Esse é o estilo do link, que fica dentro do texto de "Esqueci minha senha" e "Não possui conta?".
  link: {
    color: colors.link,
    fontWeight: '700',
  },
  // Esse é o estilo do botão de login, que fica dentro do card.
  buttonWrap: {
    marginVertical: 19,
    width: '100%',
    alignItems: 'center',
  },
  // Esse é o estilo do botão de login, que fica dentro do card.
  formContent: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    marginTop: 9,
  },
  // Esse é o estilo do botão de login, que fica dentro do card.
  primaryButton: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  glassButton: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 28,
  },
  // Esse é o texto de "Não possui conta?", que fica abaixo do botão de login.
  footerText: {
    textAlign: 'center',
    color: colors.text,
    marginTop: 5,
    fontSize: 13,
  },
});