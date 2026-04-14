import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput
} from 'react-native';
import CustomButton from '../components/CustomButton';

export default function VerificacaoCodigoScreen({ navigation }) {
  const [code, setCode] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(13);
  
  // Referências para focar automaticamente no próximo campo
  const inputs = useRef([]);

  // Lógica do cronômetro de reenvio
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Se digitou um número, pula para o próximo input
    if (text.length !== 0 && index < 4) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Se apertar "Backspace" em um campo vazio, volta para o anterior
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length < 5) {
      Alert.alert('Erro', 'Por favor, insira o código completo de 5 dígitos.');
      return;
    }
    
    // Simulação de verificação
    Alert.alert('Sucesso', 'Código verificado com sucesso!', [
      { text: 'OK', onPress: () => navigation.navigate('RedefinirSenha') } 
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollGrow} 
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          
          {/* BOTÃO VOLTAR */}
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
               {/* Ícone de Email conforme a imagem */}
              <Text style={styles.iconEmoji}>✉️</Text>
            </View>
            
            <Text style={styles.headerTitle}>Verifique seu email</Text>
            <Text style={styles.headerSubtitle}>
              Insira o codigo de 5 digitos enviado para seu email
            </Text>
          </View>

          {/* INPUTS DE CÓDIGO (OTP) - Estilo IDÊNTICO ao print */}
          <View style={styles.otpContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(text) => handleInputChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                value={digit}
                ref={(ref) => (inputs.current[index] = ref)}
              />
            ))}
          </View>

          {/* BOTÃO VERIFICAR */}
          <View style={styles.formContent}>
            <CustomButton 
              title="Verificar" 
              onPress={handleVerify} 
              style={styles.verifyButton} 
              textStyle={styles.verifyButtonText}
            />

            {/* REENVIAR CÓDIGO */}
            <TouchableOpacity 
              disabled={timer > 0} 
              onPress={() => setTimer(30)} 
              style={styles.resendButton}
            >
              <Text style={styles.resendText}>
                Nao recebeu codigo?, <Text style={styles.resendTextBold}>reenviar({timer}s)</Text>
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
    backgroundColor: '#E8E8E8', // Fundo levemente cinza como na foto
  },
  // Centralização total do conteúdo, com padding para evitar que fique colado na borda
  scrollGrow: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    paddingBottom: 40,
  },
  // O header é a parte superior da tela, que tem o título e o subtítulo.
    back: {
    position: 'absolute',
    left: 20,
    top: 50,
    width: 42,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  // O texto do botão de voltar
  backText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  // O título principal do header
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  // O círculo do ícone de email
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8B3A3A', 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 10,
    borderColor: 'rgba(139, 58, 58, 0.15)',
  },
  // O emoji do ícone de email
  iconEmoji: {
    fontSize: 45,
  },
  // O título do header
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  // O subtítulo do header, com espaçamento e centralização melhorados para uma aparência mais elegante.
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 50,
    lineHeight: 20,
  },
  // O container dos inputs de código (OTP), com espaçamento entre eles e alinhamento centralizado.
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginBottom: 40,
  },
  // O estilo de cada input de código (OTP), com altura alongada, bordas arredondadas e centralização do texto, seguindo o design do print.
  otpInput: {
    width: 55,
    height: 95, // Altura alongada igual ao print
    backgroundColor: '#D1D1D1', // Cinza dos inputs
    borderRadius: 20,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
  // O container do formulário, que inclui o botão de verificar e o link de reenvio, centralizado e com espaçamento adequado.
  formContent: {
    width: '85%',
    alignItems: 'center',
  },
  // O botão de verificar, com estilo moderno e atraente, seguindo as cores e formas do print.
  verifyButton: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  // O texto do botão de verificar, com cor escura e fonte em negrito para se destacar.
  verifyButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // O botão de reenvio, com estilo simples e texto menor, seguindo o design do print.
  resendButton: {
    marginTop: 20,
  },
  // O estilo do botão de reenvio, com um fundo levemente transparente e bordas arredondadas para se destacar como um link clicável.
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  // O texto "reenviar" em negrito dentro do link de reenvio, para destacar a ação que o usuário pode realizar.
  resendTextBold: {
    fontWeight: 'bold',
    color: '#8B3A3A',
  }
});