import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import NavbarGlass from '../components/NavbarGlass';


export default function PerfilScreen() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <NavbarGlass />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>Drako</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.infoText}>Email: </Text>
                    <Text style={styles.infoValue}>drako@example.com</Text>
                </View>
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
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 20,
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    info: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
    infoText: {
        fontSize: 20,
        marginBottom: 10,
    },
    infoValue: {
        fontSize: 18,
        color: '#666',
    },
});