import { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

// DEFINIÇÃO DAS CORES (Direto do seu Figma)
const colors = {
    primary: '#880000',      // Vermelho do Covil
    background: '#E0E0E0',   // Cinza do card
    white: '#FFFFFF',        // Texto e botões
    text: '#000000',         // Cor padrão do texto
    mutedText: '#B9B9B9',    // Ícones e placeholder
    link: '#880000',         // Vermelho para os links
    cardBackground: '#E9E9E9' // Fundo dos inputs
};

export default function CadastroScreen({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleCadastro = () => {
        if (!nome || !email || !senha || !confirm) {
            Alert.alert('Erro', 'Preencha todos os campos!');
            return;
        }
        if (!email.includes('@') || !email.includes('.')) {
            Alert.alert('Erro', 'Email inválido!');
            return;
        }
        if (senha !== confirm) {
            Alert.alert('Erro', 'As senhas não coincidem!');
            return;
        }

        Alert.alert('Sucesso', 'Conta criada! Faça login.');
        navigation.navigate('Login');
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>BEM VINDO AO COVIL</Text>
                <Text style={styles.headerSubtitle}>Faça seu Cadastro para entrar no Covil dos Drakos</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.formTitle}>Cadastro</Text>
                
                <View style={styles.formContent}>
                    <Text style={styles.label}>Seu nome:</Text>
                    <CustomInput
                        placeholder="Nome completo ou sobrenome"
                        value={nome}
                        onChangeText={setNome}
                        style={styles.input}
                    />

                    <Text style={styles.label}>Seu Email/Cpf:</Text>
                    <CustomInput
                        placeholder="email@exemplo.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Senha:</Text>
                    <CustomInput
                        placeholder="********"
                        value={senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        style={styles.input}
                    />

                    <Text style={styles.label}>Confirmar Senha:</Text>
                    <CustomInput
                        placeholder="********"
                        value={confirm}
                        onChangeText={setConfirm}
                        secureTextEntry
                        style={styles.input}
                    />

                    <View style={styles.buttonWrap}>
                        <CustomButton title="Criar conta" onPress={handleCadastro} style={[styles.primaryButton, styles.glassButton]} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.primary,
    },
	// O header é a parte superior da tela, que tem o título e o subtítulo.
    header: {
        height: 210,
        paddingTop: 25,
        paddingHorizontal: 20,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
	// O back é o botão de voltar, que fica no canto superior esquerdo do header.
    back: {
        position: 'absolute',
        left: 20,
        top: 45,
        width: 42,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.14)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.22)',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
	// O título do header, com um estilo claro e legível para se destacar contra o fundo do header, e um espaçamento adequado para separar do subtítulo.
    backText: {
        fontSize: 19,
        color: colors.white,
        fontWeight: '700',
    },
	// O card é a parte inferior da tela, que tem o formulário de cadastro.
    headerTitle: {
        color: colors.white,
        fontSize: 17,
        fontWeight: '600',
        letterSpacing: 2,
        textAlign: 'center',
    },
	// O subtítulo do header, com um estilo claro e legível para se destacar contra o fundo do header, e um espaçamento adequado para separar do título.
    headerSubtitle: {
        color: '#ffdede',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
    },
	// O card é a parte inferior da tela, que tem o formulário de cadastro.
    card: {
        flex: 1,
        backgroundColor: colors.background,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 32,
        marginTop: -25,
    },
	// O título do formulário, com um estilo claro e legível para se destacar contra o fundo do card, e um espaçamento adequado para separar do restante do conteúdo.
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 14,
        textAlign: 'center',
    },
	// O rótulo do campo de input, com um estilo claro e legível para se destacar contra o fundo do card, e um espaçamento adequado para separar do campo de input.
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 8,
    },
	// O campo de input, com um estilo claro e legível para se destacar contra o fundo do card, e um espaçamento adequado para separar do restante do conteúdo.
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: colors.cardBackground,
        marginBottom: 12,
    },
	// O container do formulário, para centralizar o conteúdo e limitar a largura em telas maiores.
    link: {
        color: colors.link, // Corrigido aqui
        fontWeight: '700',
    },
	// O container do formulário, para centralizar o conteúdo e limitar a largura em telas maiores.
    buttonWrap: {
        marginVertical: 19,
        width: '100%',
        alignItems: 'center',
    },
	// O estilo do botão "Criar conta", com uma aparência de vidro fosco para se destacar na tela, e um texto claro e legível.
    formContent: {
        width: '100%',
        maxWidth: 360,
        alignSelf: 'center',
    },
	// O estilo do botão "Criar conta", com uma aparência de vidro fosco para se destacar na tela, e um texto claro e legível.
    primaryButton: {
        width: '100%',
    },
	// O estilo do botão "Criar conta", com uma aparência de vidro fosco para se destacar na tela, e um texto claro e legível.
    glassButton: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.6)',
        paddingVertical: 14,
        borderRadius: 28,
        elevation: 4,
    },
});