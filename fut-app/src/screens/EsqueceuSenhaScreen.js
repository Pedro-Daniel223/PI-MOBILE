import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

// DEFINIÇÃO DAS CORES (Mantendo a consistência com o tema)
const colors = {
    primary: '#8B3A3A',      // Vermelho do ícone/tema
    background: '#EBEBEB',   // Cinza do fundo
    white: '#FFFFFF',
    text: '#000000',
    mutedText: '#666',
    inputBackground: '#D1D1D1' // Fundo cinza dos inputs
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
    
    // Navega para a tela de verificação de código
    navigation.navigate('VerificarCodigo', { email }); // Passa o email para a próxima tela, se necessário
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
          
          // O back é o botão de voltar, que fica no canto superior esquerdo do header.
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>

          // O header é a parte superior da tela, que tem o título e o subtítulo.
          <View style={styles.header}>
            // Estilos para o ícone de cadeado, centralizado dentro de um círculo.
            <View style={styles.iconWrap}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>🔒</Text>
              </View>
            </View>
            
            // O título principal do header
            <Text style={styles.headerTitle}>Esqueceu Senha?</Text>
            
            // O subtítulo do header, com espaçamento e centralização melhorados.
            <Text style={styles.headerSubtitle}>
              Não se preocupe! Por favor, insira o endereço associado. Nós enviaremos instruções de redefinição.
            </Text>
          </View>

          // O conteúdo do formulário, centralizado e organizado.
          <View style={styles.formContent}>
            // O grupo de input, com o label e o campo padronizado.
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email:</Text>
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

            // O estilo do botão "Proximo", padronizado com o CustomButton.
            <View style={styles.buttonWrap}>
              <CustomButton 
                title="Próximo" 
                onPress={handleNext} 
                style={styles.primaryButton} 
                textStyle={styles.primaryButtonText}
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
  // Novo estilo para centralizar o conteúdo verticalmente
  scrollGrow: {
    flexGrow: 1,
    justifyContent: 'center', 
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  back: {
    position: 'absolute',
    left: 20,
    top: 50,
    width: 42,
    height: 42, // Ajustado para ser quadrado (consistente com Cadastro)
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.4)', // Levemente mais visível sobre o cinza
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
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  headerSubtitle: {
    color: colors.mutedText,
    fontSize: 16,
    paddingHorizontal: 40, 
    textAlign: 'center',
    lineHeight: 22,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary,
    borderWidth: 10,
    borderColor: 'rgba(139, 58, 58, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  iconEmoji: {
    fontSize: 40,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  checkIcon: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  buttonWrap: {
    width: '100%',
    marginTop: 10,
  },
  // Botão "Próximo" agora segue o padrão de altura e arredondamento do CustomButton
  primaryButton: {
    backgroundColor: '#F5F5F5', 
    borderRadius: 12, // Consistente com os inputs
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 18,
  }
});