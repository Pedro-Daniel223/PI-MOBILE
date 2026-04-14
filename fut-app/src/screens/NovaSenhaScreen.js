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
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          {/* HEADER: Identidade visual mantida */}
          <View style={styles.header}>
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
    backgroundColor: '#EBEBEB',
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
  },
  back: {
    position: 'absolute',
    left: 20,
    top: 50,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    zIndex: 10,
  },
  backText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  formContent: {
    width: '85%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  checkIcon: {
    fontSize: 18,
    color: '#2E8B57', // Verde para indicar sucesso
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonWrap: {
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#F5F5F5',
    width: '100%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  confirmButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  }
});