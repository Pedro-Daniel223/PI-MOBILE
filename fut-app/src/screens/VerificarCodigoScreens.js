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
import { colorsVerificar } from '../data/dataVerificarCodigo';
import { stylesVerificar } from '../styles/styleVerificarCodigo/styleVerificarCodigo';

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
      { text: 'OK', onPress: () => navigation.navigate('NovaSenha') } 
    ]);
  };

  return (
    <SafeAreaView style={stylesVerificar.safe}>
      {/* Elemento de fundo para profundidade */}
      <View style={stylesVerificar.bgCircle} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={stylesVerificar.scrollGrow} 
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          
          {/* BOTÃO VOLTAR GLASS SUTIL */}
          <TouchableOpacity style={stylesVerificar.back} onPress={() => navigation.goBack()}>
            <Text style={stylesVerificar.backText}>←</Text>
          </TouchableOpacity>

          {/* HEADER REESTILIZADO */}
          <View style={stylesVerificar.header}>
            <View style={stylesVerificar.iconWrap}>
              <View style={stylesVerificar.iconRingOuter}>
                <View style={stylesVerificar.iconRingInner}>
                  <View style={stylesVerificar.iconCircle}>
                    <Text style={stylesVerificar.iconEmoji}>✉️</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <Text style={stylesVerificar.headerTitle}>Verifique seu e-mail</Text>
            <Text style={stylesVerificar.headerSubtitle}>
              Acabamos de enviar um código de <Text style={stylesVerificar.highlightText}>5 dígitos</Text> para você.
            </Text>
          </View>

          {/* INPUTS DE CÓDIGO (OTP) */}
          <View style={stylesVerificar.otpContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                style={stylesVerificar.otpInput}
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
          <View style={stylesVerificar.formContent}>
            <View style={stylesVerificar.buttonWrap}>
              <CustomButton 
                title="Verificar Código" 
                onPress={handleVerify} 
                style={stylesVerificar.glassButton} 
                textStyle={stylesVerificar.buttonTitle}
              />
            </View>

            {/* REENVIAR CÓDIGO */}
            <TouchableOpacity
              disabled={timer > 0}
              onPress={() => setTimer(30)}
              style={stylesVerificar.resendButton}
            >
              <Text style={stylesVerificar.resendText}>
                Não recebeu o código? <Text style={stylesVerificar.resendTextBold}>{timer > 0 ? `Aguarde ${timer}s` : 'Reenviar código'}</Text>
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
     top: 55,
     width: 46,
     height: 46,
     borderRadius: 15,
     backgroundColor: colors.glassBg,
     borderWidth: 1.6,
     borderColor: colors.glassBorder,
     alignItems: 'center',
     justifyContent: 'center',
     zIndex: 10,
     elevation: 3,
      // styles moved to src/styles/styleVerificarCodigo/styleVerificarCodigo.js
   },
   headerSubtitle: {
     fontSize: 15,
     color: colors.mutedText,
     textAlign: 'center',
     lineHeight: 22,
     paddingHorizontal: 20,
   },
   highlightText: {
     color: colors.primary,
     fontWeight: '800',
     fontSize: 17,
   },
   otpContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     width: '84%',
     maxWidth: 325,
     marginBottom: 37,
     alignSelf: 'center',
   },
   otpInput: {
     width: 53,
     height: 68,
     backgroundColor: colors.otpBackground,
     borderRadius: 13,
     textAlign: 'center',
     fontSize: 28,
     fontWeight: '800',
     color: colors.text,
     borderWidth: 1.3,
     borderColor: 'rgba(0,0,0,0.06)',
     shadowColor: colors.shadowDark,
     shadowOffset: { width: 0, height: 1.5 },
     shadowOpacity: 0.12,
     shadowRadius: 2.5,
     elevation: 1.5,
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
   glassButton: {
     backgroundColor: colors.glassBg,
     borderRadius: 31,
     height: 63,
     justifyContent: 'center',
     alignItems: 'center',
     borderWidth: 1.6,
     borderColor: colors.glassBorder,
     elevation: 5,
     shadowColor: colors.shadowDark,
     shadowOffset: { width: 0, height: 3.5 },
     shadowOpacity: 0.22,
     shadowRadius: 7,
   },
   buttonTitle: {
     color: '#181818',
     fontWeight: '700',
     fontSize: 17,
     letterSpacing: 1.3,
     textTransform: 'uppercase',
   },
   resendButton: {
     marginTop: 22,
     paddingVertical: 8,
   },
   resendText: {
     color: '#707070',
     fontSize: 15,
     textAlign: 'center',
   },
   resendTextBold: {
     fontWeight: '800',
     color: colors.primary,
     letterSpacing: 0.3,
   }
});