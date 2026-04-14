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
        // AQUI ESTÁ A MUDANÇA: O nome deve ser 'RedefinirSenha' para bater com o App.js
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
          
          {/* BOTÃO VOLTAR */}
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
              Insira o codigo de 5 digitos enviado para seu email
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
                selectTextOnFocus={true} // Facilita a edição
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
    backgroundColor: '#E8E8E8',
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
    top: Platform.OS === 'ios' ? 50 : 20, 
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    zIndex: 10,
  },
  backText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
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
  iconEmoji: {
    fontSize: 45,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 50,
    lineHeight: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    marginBottom: 40,
  },
  otpInput: {
    width: 55,
    height: 95,
    backgroundColor: '#D1D1D1',
    borderRadius: 20,
    textAlign: 'center',
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
  formContent: {
    width: '85%',
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  verifyButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resendButton: {
    marginTop: 20,
  },
  resendText: {
    color: '#666',
    fontSize: 14,
  },
  resendTextBold: {
    fontWeight: 'bold',
    color: '#8B3A3A', // Cor bordô para destacar
  }
});