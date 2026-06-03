import { StyleSheet } from "react-native";
import { scaleFont } from "../../utils/fontScale";

export const estilos = StyleSheet.create({
    texto: {
        color: '#fff',
        fontSize: scaleFont(36),
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    texto2: {
        color: '#fff',
        fontSize: scaleFont(20),
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    // ... é um operador de espalhamento que copia todas as propriedades de StyleSheet.absoluteFillObject para o objeto camadaEscura
    camadaEscura: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    btn: {
        backgroundColor: '#fff',
        padding: 12,
        width: '50%',
        alignItems: 'center',
        borderRadius: 50,
    },
    textoButton: {
        color: '#880000',
        fontSize: scaleFont(20),
        fontFamily: 'Roboto',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    textoImg: {
        color: '#880000',
        fontSize: scaleFont(32),
        fontWeight: 'bold',
    },
});
