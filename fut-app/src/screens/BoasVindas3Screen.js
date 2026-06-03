import { Text, Image, View, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useNavigation as nav} from '@react-navigation/native';
import { estilos } from "../styles/styleBoasVindas/styleBoasVindas";
import { stylesBV3 } from "../styles/styleBoasVindas/styleBV3";

export default function BoasVindas3Screen() {
    const navigation = nav()

    return(
        <ImageBackground
        source={require('../assets/images/bemvindo3.png')}
        style={estilos.background}>
            <View style={estilos.camadaEscura}/>

            <View style={stylesBV3.conteudo}>
                <View>
                    <Text style={estilos.texto}>Sistema de compra de</Text>
                    <Text style={estilos.texto}>ingresso para estádio,</Text>
                    <Text style={estilos.texto}>objetiva e segura</Text>
                </View>

                <TouchableOpacity
                onPress={() =>
                    navigation.navigate('AuthStack', {
                    screen: 'Login',
                    })
                }
                style={estilos.btn}
                >
                <Text style={estilos.textoButton}>COMEÇAR</Text>
                </TouchableOpacity>
            </View>

        </ImageBackground>
    );
}

 