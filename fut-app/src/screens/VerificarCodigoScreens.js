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