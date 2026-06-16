import { StyleSheet } from 'react-native';
import { scaleFont } from "../../utils/fontScale";

export const stylesIngresso = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingTop: 30,
        paddingBottom: 100, // Espaço para a navbar
        marginBottom: 10, // Para a navbar ficar sobreposta
    },
  titulo: {
    fontSize: scaleFont(32),
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#880000',
    },
    // Ajustado para ser apenas o wrapper do ticket
    cardContainer: {
        width: '90%',
        height: 290, // Altura fixa para o SVG não distorcer
        marginVertical: 10,
        alignSelf: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerImg: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 30,
        marginBottom: 8,
        alignItems: 'center',
        width: '100%',
    },
    img: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#fff'
    },
  nome: {
    fontSize: scaleFont(28),
    fontWeight: 'bold',
        color: '#fff',
    },
  lugar: {
    fontSize: scaleFont(20),
    color: '#eee',
    },
    dataHoraContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
  data: {
    fontSize: scaleFont(20),
    color: '#ddd',
    },
  hora: {
    fontSize: scaleFont(20),
    color: '#ddd',
    },
  valor: {
    fontSize: scaleFont(24),
    fontWeight: 'bold',
        color: '#fff',
        marginTop: 5,
    },
    btn: {
        backgroundColor: '#fff', // Botão branco para contrastar com o ticket vermelho
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 20,
    },
  textoBtn: {
    color: '#880000',
    fontSize: scaleFont(20),
    fontWeight: 'bold'
    },
    qtdButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    qtdButton: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
  textoQtd: {
    color: '#fff',
    fontSize: scaleFont(32),
    },
});