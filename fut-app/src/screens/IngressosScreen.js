import { View, Text, FlatList, StyleSheet } from 'react-native';

// default é a exportação padrão do módulo, ou seja, quando importamos esse arquivo em outro lugar,
// ele vai importar essa função por padrão. Isso é útil para exportar um componente principal de um arquivo, como é o caso do IngressosScreen aqui.
// Dessa forma, quando importamos IngressosScreen em App.js, estamos importando essa função diretamente, sem precisar usar chaves {}.
export default function IngressosScreen({ navigation }) {

    const dados = [
        { id: '1',nome: 'Ingresso 1', lugar: 'Setor A, Assento 10', dia: '20/10/2024', hora: '19:00' },
        { id: '2', nome: 'Ingresso 2', lugar: 'Setor B, Assento 5', dia: '20/10/2024', hora: '19:00' },
        { id: '3', nome: 'Ingresso 3', lugar: 'Setor C, Assento 15', dia: '20/10/2024', hora: '19:00' },
        { id: '4', nome: 'Ingresso 4', lugar: 'Setor D, Assento 20', dia: '20/10/2024', hora: '19:00' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Ingressos</Text>
            {/* Lista de ingressos usa FlatList como se fosse um loop para pegar os dados de um array */}
            <FlatList 
                data={dados}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.nome}>{item.nome}</Text>
                        <Text style={styles.lugar}>{item.lugar}</Text>
                        <Text style={styles.data}>{item.dia} - {item.hora}</Text>
                    </View>
                )}
            />
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
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
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
});