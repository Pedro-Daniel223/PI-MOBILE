import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors } from '../data/dataEsqueceuSenha';
import styles from '../styles/styleEsqueceuSenha/styleEsqueceuSenha';

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
                style={{ backgroundColor: colors?.inputBackground }}
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

// styles and data extracted to src/styles/styleEsqueceuSenha/styleEsqueceuSenha.js and src/data/dataEsqueceuSenha.js