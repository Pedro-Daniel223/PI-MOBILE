import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { dadosIngresso } from '../data/dataIngresso';
import { stylesIngresso } from '../styles/styleIngresso/styleIngresso';
import Svg, { Path } from 'react-native-svg';

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
        <View style={stylesIngresso.container}>
            <Text style={stylesIngresso.titulo}>Ingressos</Text>

            <FlatList 
                data={dadosIngresso}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={stylesIngresso.cardContainer}>
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

                        <View style={stylesIngresso.content}>
                            <View style={stylesIngresso.containerImg}>
                                <Image source={item.imgDrakos} style={stylesIngresso.img} />
                                <Ionicons name="close" size={40} color="#ddd" />
                                <Image source={item.img} style={stylesIngresso.img} />
                            </View>

                            <Text style={stylesIngresso.nome}>{item.nome}</Text>
                            <Text style={stylesIngresso.lugar}>{item.lugar}</Text>

                            <View style={stylesIngresso.dataHoraContainer}>
                                <Ionicons name="calendar-outline" size={20} color="#ddd" />
                                <Text style={stylesIngresso.data}>{item.dia}</Text>
                                <Text style={stylesIngresso.data}> - </Text>
                                <Ionicons name="time-outline" size={20} color="#ddd" />
                                <Text style={stylesIngresso.data}>{item.hora}</Text>
                            </View>

                            <Text style={stylesIngresso.valor}>{item.valor}</Text>

                            <View style={stylesIngresso.qtdButtonContainer}>
                                <View style={stylesIngresso.qtdButton}>
                                    <TouchableOpacity
                                        onPress={() => quantidadeDiminui(item.id)}>
                                        <Ionicons name="remove-circle-outline" size={40} color="#fff" />
                                    </TouchableOpacity>
                                    <Text style={stylesIngresso.textoQtd}>{quantidades[item.id] || 1}</Text>
                                    <TouchableOpacity
                                        onPress={() => quantidadeAumenta(item.id)}>
                                        <Ionicons name="add-circle-outline" size={40} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                                
                                <TouchableOpacity
                                    style={stylesIngresso.btn}
                                    onPress={() => alert(`${quantidades[item.id]} ingressos para ${item.nome} adicionados ao carrinho`)}>
                                    <Text style={stylesIngresso.textoBtn}>Comprar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            /> {/* Final da FlatList */}
  
        </View>
    );
}

