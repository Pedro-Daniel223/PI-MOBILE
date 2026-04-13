import { Image, View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { useNavigation as nav} from '@react-navigation/native';
import { estilos } from "../styles/styles";

export default function BoasVindasScreen() {
    const navigation = nav()

    return (
            <ImageBackground
            source={require('../assets/images/tela1.png')}
            style={styles.background}
            resizeMode="cover"
            >                
                <View style={estilos.camadaEscura}/>

                <View style={styles.conteudo}>
                <Text style={estilos.texto}>Bem Vindo a Drakos Club</Text>
                    <TouchableOpacity
                    onPress={()=> navigation.navigate('BoasVindas2')}
                    style={estilos.btn}>
                        <Text style={estilos.textoButton}>PRÓXIMO</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
    );
}


const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },

    conteudo: {
        width: '100%',
        height: '40%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 100
    },
});