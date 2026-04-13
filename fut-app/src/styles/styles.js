import { StyleSheet } from "react-native";

export const estilos = StyleSheet.create({
    texto: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    texto2: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    camadaEscura: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)'
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
        fontSize: 20,
        fontFamily: 'Roboto'
    },
});