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

// DEFINIÇÃO DAS CORES (Padronizadas com as outras telas)
const colors = {
  primary: '#8B3A3A',      // Vermelho do ícone/tema
  background: '#EBEBEB',   // Cinza do fundo
  white: '#FFFFFF',
  text: '#000000',
  mutedText: '#666',
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
          // O back é o botão de voltar, que fica no canto superior esquerdo do header.
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          {/* HEADER: Identidade visual mantida */}
          <View style={styles.header}>
            // Estilos para o ícone de chave, centralizado dentro de um círculo.
            <View style={styles.iconCircle}>
              <Text style={styles.iconEmoji}>🔑</Text>
            </View>
            
            <Text style={styles.headerTitle}>Nova senha</Text>
            <Text style={styles.headerSubtitle}>
              Insira sua nova senha. Atenção ao confirmar os dados.
            </Text>
          </View>

          {/* FORMULÁRIO */}
          <View style={styles.formContent}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nova senha:</Text>
              <CustomInput
                placeholder="********"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={true}
                style={{ backgroundColor: colors.inputBackground }}
                // Feedback visual de preenchimento
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
                // Feedback visual de coincidência
                rightComponent={
                  senhasCoincidem ? (
                    <Text style={styles.checkIcon}>✓</Text>
                  ) : null
                }
              />
            </View>

            {/* BOTÃO CONFIRMAR */}
            <View style={styles.buttonWrap}>
              <CustomButton 
                title="Confirmar" 
                onPress={handleConfirm} 
                style={styles.confirmButton} 
                textStyle={styles.confirmButtonText}
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
  },
  scrollGrow: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
    paddingHorizontal: 20,
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
    fontWeight: 'bold',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.mutedText,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  formContent: {
    width: '100%',
    maxWidth: 360,
    paddingHorizontal: 30,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  checkIcon: {
    fontSize: 18,
    color: '#2E8B57', // Verde para indicar sucesso
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonWrap: {
    marginTop: 15,
  },
  confirmButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12, // Padronizado com os inputs
    height: 60,
    elevation: 3,
  },
  confirmButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  }
});