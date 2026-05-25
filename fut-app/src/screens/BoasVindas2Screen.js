import { StyleSheet, View, TouchableOpacity, Text, Image, ImageBackground } from "react-native";
import { useNavigation as nav} from "@react-navigation/native";
import { estilos} from "../styles/styleBoasVindas/styles";

export default function BoasVindas2Screen(){
    const navegation = nav()

    return(
        <ImageBackground
        source={require('../assets/images/bemvindo2.png')}
        style={estilos.background}
        resizeMode="cover"
        >
            <View style={estilos.camadaEscura}/>
            
            <View style={stylesBV2.conteudo}>
                <View>
                    <Text style={estilos.texto}>Realize compras de produtos</Text>
                    <Text style={estilos.texto}>oficias do clube!</Text>
                </View>
                <TouchableOpacity
                onPress={()=> navegation.navigate('BoasVindas3')} 
                style={estilos.btn}>
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
        height: '45%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 100
    }
});