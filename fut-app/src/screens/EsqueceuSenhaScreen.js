import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const colors = {
    primary: '#8B3A3A',
    background: '#EBEBEB', 
    white: '#FFFFFF',
    text: '#000000',
    mutedText: '#666',
    inputBackground: '#D1D1D1'
};

export default function EsqueceuSenhaScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const emailValid = email.includes('@') && email.includes('.');

  const handleNext = () => {
    if (!email) {
      Alert.alert('Erro', 'Informe o email associado à conta.');
      return;
    }
    if (!emailValid) {
      Alert.alert('Erro', 'Email inválido.');
      return;
    }
    navigation.navigate('VerificarCodigo', { email });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Elementos de fundo para dar profundidade sem precisar de biblioteca externa */}
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
          
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconWrap}>
              {/* Anéis decorativos ao redor do ícone */}
              <View style={styles.iconRingOuter}>
                <View style={styles.iconRingInner}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconEmoji}>🔒</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <Text style={styles.headerTitle}>Esqueceu Senha?</Text>
            
            <Text style={styles.headerSubtitle}>
              Não se preocupe! Por favor, insira o endereço associado. Nós enviaremos instruções de redefinição.
            </Text>
          </View>

          <View style={styles.formContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL:</Text>
              <CustomInput
                placeholder="exemple@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                rightComponent={
                  emailValid ? (
                    <Text style={styles.checkIcon}>✓</Text>
                  ) : null
                }
                style={{ backgroundColor: colors.inputBackground }} 
              />
            </View>

            <View style={styles.buttonWrap}>
              <CustomButton 
                title="Próximo" 
                onPress={handleNext} 
                style={styles.glassButton} 
                textStyle={styles.buttonTitle}
              />
            </View>
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
    overflow: 'hidden', // Garante que os círculos de fundo não vazem
  },
  // Círculo decorativo no fundo para tirar o aspecto "chapado"
  bgCircle: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: -1,
  },
  scrollGrow: {
    flexGrow: 1,
    justifyContent: 'center', 
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  back: {
    position: 'absolute',
    left: 20,
    top: 50,
    width: 42,
    height: 42,
    borderRadius: 12,
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
    fontWeight: '700',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: colors.mutedText,
    fontSize: 16,
    paddingHorizontal: 30, 
    textAlign: 'center',
    lineHeight: 22,
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
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  iconEmoji: {
    fontSize: 45,
  },
  formContent: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    paddingHorizontal: 30,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
    opacity: 0.6,
  },
  checkIcon: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  buttonWrap: {
    width: '100%',
    marginTop: 20,
  },
  glassButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: 30, 
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    elevation: 3,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  buttonTitle: {
    color: '#181818', 
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 1.5,
  },
});