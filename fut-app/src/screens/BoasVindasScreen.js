import { Image, View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation as nav} from '@react-navigation/native';
import { estilos } from "../styles/styleBoasVindas/styleBoasVindas";
import { conteudo } from "../styles/styleBoasVindas/styleConteudo";
import { icone } from "../styles/styleBoasVindas/styleIcone";

export default function BoasVindasScreen() {
    const navigation = nav()

    return (
            <ImageBackground
            source={require('../assets/images/tela1.png')}
            style={estilos.background}
            resizeMode="cover"
            >                
                <View style={estilos.camadaEscura}/>

                <View style={conteudo.conteudo}>
                    <TouchableOpacity
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [
                            { name: 'AuthStack', state: { index: 0, routes: [{ name: 'Login' }] } },
                        ],
                    })}
                    style={icone.icone}>
                        <Text style={estilos.texto2}>Pular</Text>
                        <Ionicons name='arrow-forward' size={20} color='#fff'/>
                    </TouchableOpacity>
                    
                    <Text style={estilos.texto}>Bem Vindo a Drakos Club</Text>

                    <TouchableOpacity
                    onPress={()=>navigation.navigate('BoasVindas2')}
                    style={estilos.btn}>
                        <Text style={estilos.textoButton}>PRÓXIMO</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
    );
}