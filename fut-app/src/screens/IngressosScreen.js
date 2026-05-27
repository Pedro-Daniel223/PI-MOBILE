import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { dadosIngresso } from '../data/dataIngresso';
import { estilos } from '../styles/styles';
import Svg, { Path } from 'react-native-svg';
import NavbarGlass from '../components/NavbarGlass';

// default é a exportação padrão do módulo, ou seja, quando importamos esse arquivo em outro lugar,
// ele vai importar essa função por padrão. Isso é útil para exportar um componente principal de um arquivo, como é o caso do IngressosScreen aqui.
// Dessa forma, quando importamos IngressosScreen em App.js, estamos importando essa função diretamente, sem precisar usar chaves {}.
export default function IngressosScreen({navigation}) {

    const [quantidades, setQuantidades] = useState({});

    function quantidadeDiminui(id) {
        const qtd = quantidades[id] || 1;
        if (qtd > 1) {
            setQuantidades({...quantidades, [id]: qtd - 1});
        }
    }

    function quantidadeAumenta(id) {
        const qtd = quantidades[id] || 1;
        if (qtd < 10) {
            setQuantidades({...quantidades, [id]: qtd + 1});
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Ingressos</Text>

            <FlatList 
                data={dadosIngresso}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <View style={StyleSheet.absoluteFill}>
                            <Svg height="100%" width="100%" viewBox="0 0 350 200" preserveAspectRatio="none">
                                <Path
                                    d="M20,0 
                                       H330 
                                       a20,20 0 0 1 20,20 
                                       V85 
                                       a15,15 0 0 0 0,30 
                                       V180 
                                       a20,20 0 0 1 -20,20 
                                       H20 
                                       a20,20 0 0 1 -20,-20 
                                       V115 
                                       a15,15 0 0 0 0,-30 
                                       V20 
                                       a20,20 0 0 1 20,-20 
                                       Z"
                                    fill="#880000"
                                />
                            </Svg>
                        </View>

                        <View style={styles.content}>
                            <View style={styles.containerImg}>
                                <Image source={item.imgDrakos} style={styles.img} />
                                <Ionicons name="close" size={40} color="#ddd" />
                                <Image source={item.img} style={styles.img} />
                            </View>

                            <Text style={styles.nome}>{item.nome}</Text>
                            <Text style={styles.lugar}>{item.lugar}</Text>

                            <View style={styles.dataHoraContainer}>
                                <Ionicons name="calendar-outline" size={20} color="#ddd" />
                                <Text style={styles.data}>{item.dia}</Text>
                                <Text style={styles.data}>-</Text>
                                <Ionicons name="time-outline" size={20} color="#ddd" />
                                <Text style={styles.hora}>{item.hora}</Text>
                            </View>

                            <Text style={styles.valor}>{item.valor}</Text>

                            <View style={styles.qtdButtonContainer}>
                                <View style={styles.qtdButton}>
                                    <TouchableOpacity
                                        onPress={() => quantidadeDiminui(item.id)}>
                                        <Ionicons name="remove-circle-outline" size={40} color="#fff" />
                                    </TouchableOpacity>
                                    <Text style={styles.textoQtd}>{quantidades[item.id] || 1}</Text>
                                    <TouchableOpacity
                                        onPress={() => quantidadeAumenta(item.id)}>
                                        <Ionicons name="add-circle-outline" size={40} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                                
                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() => alert(`${quantidades[item.id]} ingressos para ${item.nome} adicionados ao carrinho`)}>
                                    <Text style={styles.textoBtn}>Comprar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            /> {/* Final da FlatList */}
  
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingTop: 30,
        paddingBottom: 110, // Espaço para a navbar
        marginBottom: 10, // Para a navbar ficar sobreposta
    },
    titulo: {
        fontSize: 32,
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    lugar: {
        fontSize: 20,
        color: '#eee',
    },
    dataHoraContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    data: {
        fontSize: 20,
        color: '#ddd',
    },
    hora: {
        fontSize: 20,
        color: '#ddd',
    },
    valor: {
        fontSize: 24,
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
        fontSize: 20,
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
        fontSize: 32,
    },
});