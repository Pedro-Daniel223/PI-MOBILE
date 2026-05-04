import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const colors = {
    primary: '#880000',
    background: '#EBEBEB',
    white: '#FFFFFF',
    text: '#121212',
    mutedText: '#707070',
    inputBackground: '#D1D1D1',
    accent: '#B22222',
    glassBorder: 'rgba(255, 255, 255, 0.7)',
    glassBg: 'rgba(255, 255, 255, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.18)',
    ringOuter: 'rgba(136, 0, 0, 0.08)',
    ringInner: 'rgba(136, 0, 0, 0.12)'
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
            
            <Text style={styles.headerTitle}>Você esqueceu a senha?</Text>
            
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
     top: -120,
     right: -120,
     width: 350,
     height: 350,
     borderRadius: 175,
     backgroundColor: 'rgba(255, 255, 255, 0.35)',
     zIndex: -1,
   },
  // O scrollGrow é o container do ScrollView, centralizando o conteúdo verticalmente
  scrollGrow: {
    flexGrow: 1,
    justifyContent: 'center', 
    paddingBottom: 40,
  },
  // O header é a parte superior com o título e o ícone, centralizado
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 25,
    marginBottom: 20,
  },
   // O botão de voltar é um círculo com uma seta, posicionado no canto superior esquerdo
   back: {
     position: 'absolute',
     left: 20,
     top: 55,
     width: 45,
     height: 45,
     borderRadius: 13,
     backgroundColor: colors.glassBg,
     borderWidth: 1.5,
     borderColor: colors.glassBorder,
     alignItems: 'center',
     justifyContent: 'center',
     zIndex: 10,
     elevation: 3,
     shadowColor: colors.shadowDark,
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.2,
     shadowRadius: 4,
   },
  // O texto da seta é simples, mas pode ser substituído por um ícone se desejar
  backText: {
    fontSize: 22,
    color: colors.text,
    fontWeight: '700',
  },
   // O título é grande e chamativo, com um toque de estilo para parecer mais moderno
   headerTitle: {
     color: colors.text,
     fontSize: 25,
     fontWeight: '800',
     textAlign: 'center',
     marginBottom: 14,
     letterSpacing: 0.4,
     lineHeight: 30,
   },
   headerSubtitle: {
     color: colors.mutedText,
     fontSize: 15,
     paddingHorizontal: 28,
     textAlign: 'center',
     lineHeight: 23,
     letterSpacing: 0.15,
   },
   // O subtítulo é mais suave, com uma cor mais clara e um pouco de espaçamento para melhorar a legibilidade
   headerSubtitle: {
     color: colors.mutedText,
     fontSize: 15,
     paddingHorizontal: 25,
     textAlign: 'center',
     lineHeight: 24,
     letterSpacing: 0.2,
   },
  iconWrap: {
    marginBottom: 30,
  },
   iconRingOuter: {
     width: 135,
     height: 135,
     borderRadius: 67.5,
     backgroundColor: colors.ringOuter,
     alignItems: 'center',
     justifyContent: 'center',
   },
   iconRingInner: {
     width: 115,
     height: 115,
     borderRadius: 57.5,
     backgroundColor: colors.ringInner,
     alignItems: 'center',
     justifyContent: 'center',
   },
   iconCircle: {
     width: 95,
     height: 95,
     borderRadius: 47.5,
     backgroundColor: colors.primary,
     alignItems: 'center',
     justifyContent: 'center',
     elevation: 7,
     shadowColor: colors.primary,
     shadowOffset: { width: 0, height: 5 },
     shadowOpacity: 0.28,
     shadowRadius: 8,
   },
   iconEmoji: {
     fontSize: 44,
   },
  formContent: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    paddingHorizontal: 30,
  },
   inputGroup: {
     width: '100%',
     marginBottom: 18,
   },
   label: {
     fontSize: 14,
     fontWeight: '700',
     color: colors.text,
     marginBottom: 10,
     marginLeft: 5,
     letterSpacing: 1,
     opacity: 0.75,
   },
   checkIcon: {
     fontSize: 21,
     color: '#1B4332',
     fontWeight: 'bold',
   },
  buttonWrap: {
    width: '100%',
    marginTop: 20,
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
   },
});