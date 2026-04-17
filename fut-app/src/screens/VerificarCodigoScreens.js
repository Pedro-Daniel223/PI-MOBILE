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

// DEFINIÇÃO DAS CORES (Padronizadas com as outras telas)
const colors = {
  primary: '#8B3A3A',      // Vermelho Drakos
  background: '#E8E8E8',   // Cinza do fundo
  white: '#FFFFFF',
  text: '#000000',
  mutedText: '#888',
  otpBackground: '#D1D1D1'
};

export default function VerificarCodigo({ navigation }) {
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
    // Garante que apenas números sejam digitados
    const numericText = text.replace(/[^0-9]/g, '');
    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);

    // Se digitou um número, pula para o próximo input
    if (numericText.length !== 0 && index < 4) {
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
    
    // Verificação bem-sucedida
    Alert.alert('Sucesso', 'Código verificado com sucesso!', [
      { 
        text: 'OK', 
        onPress: () => navigation.navigate('NovaSenhaScreens') 
      } 
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
          
          {/* BOTÃO VOLTAR PADRONIZADO */}
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>✉️</Text>
            </View>
            
            <Text style={styles.headerTitle}>Verifique seu email</Text>
            <Text style={styles.headerSubtitle}>
              Insira o código de 5 dígitos enviado para seu email
            </Text>
          </View>

          {/* INPUTS DE CÓDIGO (OTP) */}
          <View style={styles.otpContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus={true} 
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
                Não recebeu código? <Text style={styles.resendTextBold}>reenviar({timer}s)</Text>
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
    backgroundColor: colors.background,
  },
  scrollGrow: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    paddingBottom: 40,
  },
  back: {
    position: 'absolute',
    left: 20,
    top: 50,
    width: 42,
    height: 42,
    borderRadius: 12, // Padronizado com as outras telas
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backText: {
    fontSize: 22,
    color: colors.text,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary, 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 10,
    borderColor: 'rgba(139, 58, 58, 0.15)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  iconEmoji: {
    fontSize: 45,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.mutedText,
    textAlign: 'center',
    paddingHorizontal: 50,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    maxWidth: 320,
    marginBottom: 40,
  },
  otpInput: {
    width: 55,
    height: 80, // Ajustado levemente para melhor proporção
    backgroundColor: colors.otpBackground,
    borderRadius: 12, // Combinando com os outros inputs do app
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  formContent: {
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    borderRadius: 12, // Padronizado com o resto do app
    height: 60,
    elevation: 3,
  },
  verifyButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 25,
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  resendTextBold: {
    fontWeight: 'bold',
    color: colors.primary, 
  }
});