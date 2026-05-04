import React, { useState } from 'react';
import { 
  SafeAreaView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const colors = {
  primary: '#880000',
  background: '#EBEBEB',
  white: '#FFFFFF',
  text: '#121212',
  mutedText: '#707070',
  inputBackground: '#D1D1D1',
  accent: '#2D6A4F',
  glassBorder: 'rgba(255, 255, 255, 0.7)',
  glassBg: 'rgba(255, 255, 255, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.18)',
  ringOuter: 'rgba(136, 0, 0, 0.08)',
  ringInner: 'rgba(136, 0, 0, 0.12)'
};

export default function NovaSenhaScreens({ navigation }) {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Validação em tempo real
  const senhasCoincidem = senha.length > 0 && senha === confirmarSenha;

  const handleConfirm = () => {
    if (!senha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha os dois campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    Alert.alert('Sucesso', 'Sua senha foi redefinida com sucesso!', [
      { text: 'OK', onPress: () => navigation.navigate('Login') }
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Elemento decorativo de fundo */}
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
          
          {/* BOTÃO VOLTAR PADRONIZADO */}
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          {/* HEADER REESTILIZADO */}
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <View style={styles.iconRingOuter}>
                <View style={styles.iconRingInner}>
                  <View style={styles.iconCircle}>
                    <Text style={styles.iconEmoji}>🔑</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <Text style={styles.headerTitle}>Nova Senha</Text>
            <Text style={styles.headerSubtitle}>
              Crie uma senha forte e fácil de lembrar. Atenção ao confirmar os dados.
            </Text>
          </View>

          {/* FORMULÁRIO - MANTENDO SEUS INPUTS ORIGINAIS */}
          <View style={styles.formContent}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nova senha:</Text>
              <CustomInput
                placeholder="********"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={true}
                style={{ backgroundColor: colors.inputBackground }}
                rightComponent={
                  senha.length >= 6 ? (
                    <Text style={styles.checkIcon}>✓</Text>
                  ) : null
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar senha:</Text>
              <CustomInput
                placeholder="********"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={true}
                style={{ backgroundColor: colors.inputBackground }}
                rightComponent={
                  senhasCoincidem ? (
                    <Text style={styles.checkIcon}>✓</Text>
                  ) : null
                }
              />
            </View>

            {/* BOTÃO CONFIRMAR COM EFEITO GLASS */}
            <View style={styles.buttonWrap}>
              <CustomButton 
                title="Redefinir Senha" 
                onPress={handleConfirm} 
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
    overflow: 'hidden',
  },
  bgCircle: {
    position: 'absolute',
    top: -50,
    right: -50,
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
   // O botão de voltar é um círculo com uma seta, posicionado no canto superior esquerdo
   back: {
     position: 'absolute',
     left: 20,
     top: 55,
     width: 46,
     height: 46,
     borderRadius: 15,
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
     shadowRadius: 5,
   },
   backText: {
     fontSize: 26,
     color: colors.text,
     fontWeight: '300',
   },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
    paddingHorizontal: 35,
  },
  iconWrap: {
    marginBottom: 30,
  },
   iconRingOuter: {
     width: 132,
     height: 132,
     borderRadius: 66,
     backgroundColor: colors.ringOuter,
     alignItems: 'center',
     justifyContent: 'center',
   },
   iconRingInner: {
     width: 112,
     height: 112,
     borderRadius: 56,
     backgroundColor: colors.ringInner,
     alignItems: 'center',
     justifyContent: 'center',
   },
   iconCircle: {
     width: 92,
     height: 92,
     borderRadius: 46,
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
     fontSize: 41,
   },
   iconRingInner: {
     width: 110,
     height: 110,
     borderRadius: 55,
     backgroundColor: 'rgba(136, 0, 0, 0.1)',
     alignItems: 'center',
     justifyContent: 'center',
   },
   iconCircle: {
     width: 90,
     height: 90,
     borderRadius: 45,
     backgroundColor: colors.primary,
     alignItems: 'center',
     justifyContent: 'center',
     elevation: 7,
     shadowColor: colors.primary,
     shadowOffset: { width: 0, height: 5 },
     shadowOpacity: 0.28,
     shadowRadius: 7,
   },
   iconEmoji: {
     fontSize: 40,
   },
   iconEmoji: {
     fontSize: 40,
   },
   headerTitle: {
     fontSize: 29,
     fontWeight: '800',
     color: colors.text,
     marginBottom: 12,
     letterSpacing: 0.3,
     lineHeight: 35,
   },
   headerSubtitle: {
     fontSize: 15,
     color: colors.mutedText,
     textAlign: 'center',
     paddingHorizontal: 25,
     lineHeight: 22,
     letterSpacing: 0.1,
   },
   headerSubtitle: {
     fontSize: 16,
     color: colors.mutedText,
     textAlign: 'center',
     paddingHorizontal: 25,
     lineHeight: 22,
     letterSpacing: 0.1,
   },
   formContent: {
     width: '100%',
     maxWidth: 400,
     paddingHorizontal: 31,
   },
   inputGroup: {
     marginBottom: 22,
     width: '100%',
   },
   label: {
     fontSize: 14,
     fontWeight: '700',
     color: colors.text,
     marginBottom: 10,
     marginLeft: 5,
     letterSpacing: 0.8,
     opacity: 0.85,
   },
    checkIcon: {
      fontSize: 18,
      color: colors.accent,
      fontWeight: 'bold',
      marginRight: 10,
      textShadowColor: 'rgba(0,0,0,0.1)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
   buttonWrap: {
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
      textTransform: 'uppercase',
    },
  });