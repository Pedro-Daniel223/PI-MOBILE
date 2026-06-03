import { StyleSheet, View, TouchableOpacity, Text, Image, ImageBackground } from "react-native";
import { useNavigation as nav} from "@react-navigation/native";
import { estilos} from "../styles/styleBoasVindas/styleBoasVindas";
import { stylesBV2 } from "../styles/styleBoasVindas/styleBV2";

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

 