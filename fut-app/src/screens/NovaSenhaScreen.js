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

// DEFINIÇÃO DAS CORES
const colors = {
  primary: '#8B3A3A',      // Vermelho Drakos
  background: '#EBEBEB',   // Cinza do fundo
  white: '#FFFFFF',
  text: '#121212',         // Preto mais nítido para legibilidade
  mutedText: '#707070',
  inputBackground: '#D1D1D1' 
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
  back: {
    position: 'absolute',
    left: 20,
    top: 50,
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
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
    paddingHorizontal: 35,
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
    fontSize: 37,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 17,
    color: colors.mutedText,
    textAlign: 'center',
    paddingHorizontal: 21,
    lineHeight: 22,
  },
  formContent: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: 31,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 14,
    marginLeft: 5,
    opacity: 0.7,
  },
  checkIcon: {
    fontSize: 18,
    color: '#2D6A4F', // Verde floresta mais sofisticado
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonWrap: {
    marginTop: 20,
  },
  // --- PADRÃO GLASS ---
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
});