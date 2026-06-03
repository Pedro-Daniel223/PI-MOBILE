import { Image, View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation as nav} from '@react-navigation/native';
import { estilos } from "../styles/styleBoasVindas/styles";

export default function BoasVindasScreen() {
    const navigation = nav()

    return (
            <ImageBackground
            source={require('../assets/images/tela1.png')}
            style={estilos.background}
            resizeMode="cover"
            >                
                <View style={estilos.camadaEscura}/>

                <View style={styles.conteudo}>
                    <TouchableOpacity
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [
                            { name: 'AuthStack', state: { index: 0, routes: [{ name: 'Login' }] } },
                        ],
                    })}
                    style={styles.icone}>
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


const styles = StyleSheet.create({
    conteudo: {
        width: '90%',
        height: '80%',
        margin: 12,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginBottom: 100
    },
    icone: {
        display:"flex",
        flexDirection:"row",
        gap: 8,
        alignItems: 'flex-end',
        alignSelf: 'flex-end'
    }
});