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
import { colorsNovaSenha } from '../data/dataNovaSenha';
import { stylesNovaSenha } from '../styles/styleNovaSenha/styleNovaSenha';

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
    <SafeAreaView style={stylesNovaSenha.safe}>
      {/* Elemento decorativo de fundo */}
      <View style={stylesNovaSenha.bgCircle} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={stylesNovaSenha.scrollGrow} 
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          
          {/* BOTÃO VOLTAR PADRONIZADO */}
          <TouchableOpacity style={stylesNovaSenha.back} onPress={() => navigation.goBack()}>
            <Text style={stylesNovaSenha.backText}>←</Text>
          </TouchableOpacity>

          {/* HEADER REESTILIZADO */}
          <View style={stylesNovaSenha.header}>
            <View style={styles.iconWrap}>
              <View style={stylesNovaSenha.iconRingOuter}>
                <View style={stylesNovaSenha.iconRingInner}>
                  <View style={stylesNovaSenha.iconCircle}>
                    <Text style={stylesNovaSenha.iconEmoji}>🔑</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <Text style={stylesNovaSenha.headerTitle}>Nova Senha</Text>
            <Text style={stylesNovaSenha.headerSubtitle}>
              Crie uma senha forte e fácil de lembrar. Atenção ao confirmar os dados.
            </Text>
          </View>

          {/* FORMULÁRIO - MANTENDO SEUS INPUTS ORIGINAIS */}
          <View style={stylesNovaSenha.formContent}>
            
            <View style={styles.inputGroup}>
              <Text style={stylesNovaSenha.label}>Nova senha:</Text>
              <CustomInput
                placeholder="********"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={true}
                style={{ backgroundColor: colorsNovaSenha.inputBackground }}
                rightComponent={
                  senha.length >= 6 ? (
                    <Text style={stylesNovaSenha.checkIcon}>✓</Text>
                  ) : null
                }
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={stylesNovaSenha.label}>Confirmar senha:</Text>
              <CustomInput
                placeholder="********"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry={true}
                style={{ backgroundColor: colorsNovaSenha.inputBackground }}
                rightComponent={
                  senhasCoincidem ? (
                    <Text style={stylesNovaSenha.checkIcon}>✓</Text>
                  ) : null
                }
              />
            </View>

            {/* BOTÃO CONFIRMAR COM EFEITO GLASS */}
            <View style={stylesNovaSenha.buttonWrap}>
              <CustomButton 
                title="Redefinir Senha" 
                onPress={handleConfirm} 
                style={stylesNovaSenha.glassButton} 
                textStyle={stylesNovaSenha.buttonTitle}
              />
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// styles moved to src/styles/styleNovaSenha/styleNovaSenha.js
// styles moved to src/styles/styleNovaSenha/styleNovaSenha.js