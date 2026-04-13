import { StyleSheet, View, TouchableOpacity, Text, Image, ImageBackground } from "react-native";
import { useNavigation as nav} from "@react-navigation/native";
import { estilos} from "../styles/styles";

export default function BoasVindas2Screen(){
    const navegation = nav()

    return(
        <ImageBackground
        source={require('../assets/images/bemvindo2.png')}
        style={stylesBV2.background}
        resizeMode="cover"
        >
            <View style={estilos.camadaEscura}/>
            
            <View style={stylesBV2.conteudo}>
                <Text style={estilos.texto}>Realize compras de produtos, oficias do clube!</Text>
                <TouchableOpacity style={estilos.btn}>
                    <Text style={estilos.textoButton}>PRÓXIMO</Text>
                </TouchableOpacity>
            </View>

        </ImageBackground>
    )
};


const stylesBV2 = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end'
    },
    conteudo: {
        width: '100%',
        height: '60%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 100
    }
});