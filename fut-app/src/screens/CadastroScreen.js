import { useState, useLayoutEffect } from 'react';
import {View,Text,StyleSheet,Alert,SafeAreaView,TouchableOpacity} from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import colors from '../theme/colors';

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
		<View style={styles.safe}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
					<Text style={styles.backText}>←</Text>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>BEM VINDO DE VOLTA AO COVIL</Text>
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
		</View>
	);
}

	const styles = StyleSheet.create({
		safe: {
			flex: 1,
			backgroundColor: '#8b0000',
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
			left: 14,
			top: 36,
			width: 42,
			height: 36,
			borderRadius: 10,
			backgroundColor: 'rgba(255,255,255,0.14)',
			borderWidth: 1,
			borderColor: 'rgba(255,255,255,0.22)',
			alignItems: 'center',
			justifyContent: 'center',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.08,
			shadowRadius: 4,
			elevation: 3,
		},
		// O backText é o texto do botão de voltar, que é a seta "←".
		backText: {
			fontSize: 19,
			color: '#fff',
			fontWeight: '700',
		},
		//  texto que fica dentro do header, o título principal.
		headerTitle: {
			color: colors.white,
			fontSize: 17,
			fontWeight: '600',
			letterSpacing: 2,
		},
		// O headerSubtitle é o texto que fica abaixo do título, é uma descrição ou instrução para o usuário.
		headerSubtitle: {
			color: '#ffdede',
			fontSize: 14,
			marginTop: 10,
		},
		// O card é a parte principal da tela, onde ficam os inputs e o botão de cadastro.*
		card: {
			flex: 1,
			backgroundColor: colors.background,
			borderTopLeftRadius: 32,
			borderTopRightRadius: 32,
			padding: 32,
			marginTop: -25,
		},
		// O formTitle é o título do formulário, no caso "Cadastro".
		formTitle: {
			fontSize: 24,
			fontWeight: '600',
			color: colors.primary,
			marginBottom: 14,
			alignContent: 'center',
            justifyContent: 'center',
            textAlign: 'center',
		},
		// O label é o texto que fica acima do input, para indicar o que deve ser preenchido.
		label: {
			fontSize: 15,
			fontWeight: '600',
			color: colors.text,
			marginBottom: 8,
		},
		// Esses estilos de input e justamente pra colocar as informações de validação.
		input: {
			borderWidth: 1,
			borderColor: '#ccc',
			paddingVertical: 16,
			paddingHorizontal: 16,
			borderRadius: 14,
			backgroundColor: colors.cardBackground,
			marginBottom: 1,
		},
		// Esses estilos de texto e justamente pra colocar as informações de validação.
		forgotText: {
			fontSize: 14,
			color: colors.text,
			marginBottom: 9,
			marginTop: 4,
			alignItems: 'center',
            justifyContent: 'center',
		},
		// Esse é o estilo do link, que fica dentro do texto de "Esqueci minha senha" e "Não possui conta?".
		link: {
			color: colors,
			fontWeight: '700',
		},
		// Esse é o estilo do botão de cadastro, que fica dentro do card.
		buttonWrap: {
			marginVertical: 19,
			width: '100%',
			// paddingHorizontal: 6,
			alignItems: 'center',
		},
		// Esse é o estilo do botão de cadastro, que fica dentro do card.
		formContent: {
			width: '100%',
			maxWidth: 360,
			alignSelf: 'center',
			marginTop: 9,
		},
		// Esse é o estilo do botão de cadastro, que fica dentro do card.
		primaryButton: {
			width: '100%',
			maxWidth: 360,
			alignSelf: 'center',
		},
		// Esse é o estilo do botão de cadastro, que fica dentro do card.
		glassButton: {
			backgroundColor: 'rgba(255,255,255,0.7)',
			borderWidth: 1,
			borderColor: 'rgba(255,255,255,0.6)',
			shadowColor: '#000',
			shadowOffset: { width: 0, height: 6 },
			shadowOpacity: 0.06,
			shadowRadius: 10,
			elevation: 4,
			paddingVertical: 14,
			paddingHorizontal: 18,
			borderRadius: 28,
		},
		// Esse é o estilo do texto de rodapé, que fica abaixo do botão de cadastro.
		footerText: {
			textAlign: 'center',
			color: '#333',
			marginTop: 5,
			fontSize: 13,
		},
	});
