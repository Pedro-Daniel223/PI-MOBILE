import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation as nav} from '@react-navigation/native'; 

// default é a exportação padrão do módulo, ou seja, quando importamos esse arquivo em outro lugar,
// ele vai importar essa função por padrão. Isso é útil para exportar um componente principal de um arquivo, como é o caso do IngressosScreen aqui.
// Dessa forma, quando importamos IngressosScreen em App.js, estamos importando essa função diretamente, sem precisar usar chaves {}.
export default function IngressosScreen() {
    const navigation = nav()
    const dados = [
        { id: '1',nome: 'Arquibancada', lugar: 'Assento 10', dia: '20/10/2024', hora: '19:00', local: 'Mangueirão', valor: 'R$50.00' },
        { id: '2', nome: 'Camarote', lugar: 'Assento 5', dia: '20/10/2024', hora: '19:00', local: 'Mangueirão', valor: 'R$100.00' },
        { id: '3', nome: 'Torcida', lugar: 'Assento 15', dia: '20/10/2024', hora: '19:00', local: 'Mangueirão', valor: 'R$30.00' },
        { id: '4', nome: 'Lado de fora', lugar: 'Assento 20', dia: '20/10/2024', hora: '19:00', local: 'Mangueirão', valor: 'Grátis' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Ingressos</Text>
            <View>
                <Image
                    source={require('../assets/images/drakos.png')}
                    style={styles.img}
                />

                <Image
                    source={require('../assets/images/palmeiras.png')}
                    style={styles.img}
                />
            </View>

            {/* Lista de ingressos usa FlatList como se fosse um loop para pegar os dados de um array */}
            <FlatList 
                data={dados}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.nome}>{item.nome}</Text>
                        <Text style={styles.lugar}>{item.lugar}</Text>
                        <Text style={styles.data}>{item.dia} - {item.hora} - {item.local}</Text>
                        <Text style={styles.data}>{item.valor}</Text>

                        <TouchableOpacity
                        style={styles.btn}
                        onPress={() =>alert(`${item.nome} Adicionado ao carrinho\nCarrinho ainda em desenvolvimento 🤖`)}>
                            <Text style={styles.textoBtn}>Comprar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <View>
                <Text style={styles.teste}>Compre ingressos</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 30,
        marginTop: 40,
    },
    titulo: {
        fontSize: 26,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    img: {
        width: '50%',
        height: '25%',
        borderRadius: 100
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        margin: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        alignSelf: 'center',
        width: '93%'
    },
    nome: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    lugar: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    data: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    btn: {
        backgroundColor: '#880000',
        padding: 12,
        margin: 8,
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'center',
        width: '60%',
    },
    textoBtn: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
});