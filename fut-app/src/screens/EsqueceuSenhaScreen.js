import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

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
    Alert.alert('Enviado', 'Instruções foram enviadas para o seu email.');
    navigation.goBack();
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

          {/* HEADER: Centralização Ajustada */}
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconEmoji}>🔒</Text>
              </View>
            </View>
            
            <Text style={styles.headerTitle}>Esqueceu Senha?</Text>
            <Text style={styles.headerSubtitle}>
              Não se preocupe! Por favor, insira o endereço associado. Nós enviaremos instruções de redefinição.
            </Text>
          </View>

          {/* FORMULÁRIO: Alinhamento Centralizado */}
          <View style={styles.formContent}>
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
                style={styles.input}
              />
            </View>

            <View style={styles.buttonWrap}>
              <CustomButton 
                title="Proximo" 
                onPress={handleNext} 
                style={styles.glassButton} 
                textStyle={styles.glassButtonText}
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
    backgroundColor: '#E5E5E5',
  },
  // Novo estilo para centralizar o conteúdo verticalmente
  scrollGrow: {
    flexGrow: 1,
    justifyContent: 'center', // Centraliza o conteúdo verticalmente na tela
    paddingBottom: 40,
  },
  // O header é a parte superior da tela, que tem o título e o subtítulo.
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  // O back é o botão de voltar, que fica no canto superior esquerdo do header.
  back: {
    position: 'absolute',
    left: 20,
    top: 50,
    width: 42,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  // O texto do botão de voltar
  backText: {
    fontSize: 20,
    color: '#000',
    fontWeight: '700',
  },
  // O título principal do header
  headerTitle: {
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  // O subtítulo do header, com espaçamento e centralização melhorados para uma aparência mais elegante.
  headerSubtitle: {
    color: '#666',
    fontSize: 16,
    paddingHorizontal: 40, // Aumentado para forçar uma quebra de linha mais elegante e centralizada
    textAlign: 'center',
    lineHeight: 22,
  },
  // Estilos para o ícone de cadeado, centralizado dentro de um círculo com sombra para destaque.
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  // O círculo que envolve o ícone, com uma borda suave e sombra para dar profundidade.
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8B3A3A',
    borderWidth: 10,
    borderColor: 'rgba(139, 58, 58, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  // O emoji do cadeado, com um tamanho maior para se destacar dentro do círculo.
  iconEmoji: {
    fontSize: 40,
  },
  // O conteúdo do formulário, centralizado e com espaçamento adequado para uma aparência limpa e organizada.
  formContent: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    paddingHorizontal: 40,
  },
  // O grupo de input, com um espaçamento maior entre o label e o input para melhorar a legibilidade.
  inputGroup: {
    width: '100%',
    marginBottom: 25,
  },
  // O label do input, com um estilo mais proeminente para indicar claramente o campo que deve ser preenchido.
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    alignSelf: 'flex-start', // Garante que o label alinhe à esquerda do input
  },
  // O estilo do input, com uma aparência mais moderna e limpa, e um indicador visual de validação (check) quando o email é válido.
  input: {
    height: 55,
    borderRadius: 12,
    backgroundColor: '#D1D1D1',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000',
    width: '100%',
  },
  // O ícone de check que aparece à direita do input quando o email é válido, com um estilo simples e claro para indicar sucesso.
  checkIcon: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    marginRight: 10,
  },
  // O estilo do botão "Proximo", com uma aparência de vidro fosco para se destacar na tela, e um texto claro e legível.
  buttonWrap: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  // O estilo do botão "Proximo", com uma aparência de vidro fosco para se destacar na tela, e um texto claro e legível.
  glassButton: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 28,
    width: '100%',
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  // O texto do botão "Proximo", com um estilo claro e legível para se destacar contra o fundo do botão de vidro fosco.
  glassButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 18,
  }
});