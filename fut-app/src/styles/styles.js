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
        fontSize: 20,
        fontFamily: 'Roboto',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
});