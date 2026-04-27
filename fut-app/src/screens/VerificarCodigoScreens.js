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

// DEFINIÇÃO DAS CORES
const colors = {
  primary: '#8B3A3A',      // Vermelho Drakos
  background: '#E8E8E8',   // Cinza do fundo
  white: '#FFFFFF',
  text: '#121212',         // Preto mais nítido
  mutedText: '#707070',
  otpBackground: '#D1D1D1'
};

export default function VerificarCodigo({ navigation }) {
  const [code, setCode] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(13);
  const inputs = useRef([]);

  // Lógica do cronômetro de reenvio
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (text, index) => {
    const numericText = text.replace(/[^0-9]/g, '');
    const newCode = [...code];
    newCode[index] = numericText;
    setCode(newCode);

    if (numericText.length !== 0 && index < 4) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
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
    
    Alert.alert('Sucesso', 'Código verificado com sucesso!', [
      { text: 'OK', onPress: () => navigation.navigate('NovaSenhaScreens') } 
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Elemento de fundo para profundidade */}
      <View style={styles.bgCircle} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollGrow} 
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          
          {/* BOTÃO VOLTAR GLASS SUTIL */}
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          {/* HEADER REESTILIZADO */}
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <View style={styles.iconRingOuter}>
                <View style={styles.iconRingInner}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconEmoji}>✉️</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <Text style={styles.headerTitle}>Verifique seu e-mail</Text>
            <Text style={styles.headerSubtitle}>
              Acabamos de enviar um código de <Text style={styles.highlightText}>5 dígitos</Text> para você.
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
                placeholder="0"
                placeholderTextColor="rgba(0,0,0,0.2)"
              />
            ))}
          </View>

          {/* ÁREA DO BOTÃO COM EFEITO GLASS */}
          <View style={styles.formContent}>
            <View style={styles.buttonWrap}>
              <CustomButton 
                title="Verificar Código" 
                onPress={handleVerify} 
                style={styles.glassButton} 
                textStyle={styles.buttonTitle}
              />
            </View>

            {/* REENVIAR CÓDIGO */}
            <TouchableOpacity 
              disabled={timer > 0} 
              onPress={() => setTimer(30)} 
              style={styles.resendButton}
            >
              <Text style={styles.resendText}>
                Não recebeu o código? <Text style={styles.resendTextBold}>{timer > 0 ? `Aguarde ${timer}s` : 'Reenviar agora'}</Text>
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
    overflow: 'hidden',
  },
  bgCircle: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: -1,
  },
  scrollGrow: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    paddingBottom: 40,
    paddingTop: 50,
  },
  back: {
    position: 'absolute',
    left: 24,
    top: 50,
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backText: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '300',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
    paddingHorizontal: 30,
  },
  iconWrap: {
    marginBottom: 30,
  },
  iconRingOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(139, 58, 58, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(139, 58, 58, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary, 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  iconEmoji: {
    fontSize: 45,
  },
  headerTitle: {
    fontSize: 31,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 17,
    color: colors.mutedText,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  highlightText: {
    color: colors.text,
    fontWeight: '700',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '85%',
    maxWidth: 340,
    marginBottom: 40,
  },
  otpInput: {
    width: 58,
    height: 75,
    backgroundColor: colors.otpBackground,
    borderRadius: 15,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  formContent: {
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  buttonWrap: {
    width: '100%',
  },
  // --- MANTENDO PADRÃO GLASS ---
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: 30, 
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    elevation: 4,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonTitle: {
    color: '#181818', 
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  resendButton: {
    marginTop: 25,
  },
  resendText: {
    color: '#707070',
    fontSize: 14,
  },
  resendTextBold: {
    fontWeight: '800',
    color: colors.primary, 
  }
});