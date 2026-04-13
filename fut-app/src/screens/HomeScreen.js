import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import NavbarGlass from '../components/NavbarGlass';
import GlassCard from '../components/CardGlass';




export default function Home({ navigation }) {
  return (
    <View style={styles.container}>

      {/* BACKGROUND */}
      <LinearGradient
        colors={['#b30000', '#5a0000', '#1a0000']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.content}>

        {/* HEADER */}
        <GlassCard style={styles.headerCard}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.statusTitle}>Status atual:</Text>
            <Text style={styles.statusText}>Não-sócio</Text>
          </View>

          <Ionicons name="notifications-outline" size={22} color="#fff" />
        </GlassCard>

        {/* WELCOME */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeText}>Seja bem-vindo</Text>
          <Text style={styles.nameText}>fernando ferreiras</Text>
          <Text style={styles.subText}>aproveite nosso app</Text>
        </View>

        {/* CARDS */}
        <View style={styles.row}>

          <GlassCard style={styles.card}>
            <Ionicons name="storefront-outline" size={26} color="#fff" />
            <Text style={styles.cardTitle}>Drakos Store</Text>
            <Text style={styles.cardDesc}>Veja produtos</Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>VER</Text>
            </TouchableOpacity>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Ionicons name="ticket-outline" size={26} color="#fff" />
            <Text style={styles.cardTitle}>Ingressos</Text>
            <Text style={styles.cardDesc}>Eventos disponíveis</Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>VER</Text>
            </TouchableOpacity>
          </GlassCard>

        </View>

        {/* CARD GRANDE */}
        <GlassCard style={styles.bigCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Seja sócio</Text>
            <Text style={styles.cardDesc}>
              Torne-se sócio e pague menos
            </Text>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>VER</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: 'https://via.placeholder.com/120x80' }}
            style={styles.cardImage}
          />
        </GlassCard>

      </ScrollView>

      {/* NAVBAR */}
      <NavbarGlass navigation={navigation} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 50,
    borderRadius: 22,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 12,
  },

  statusTitle: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },

  statusText: {
    color: '#fff',
    fontWeight: '700',
  },

  welcome: {
    marginTop: 20,
    marginBottom: 20,
  },

  welcomeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },

  nameText: {
    color: '#fff',
    fontSize: 20,
  },

  subText: {
    color: '#fff',
    opacity: 0.7,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  card: {
    width: '48%',
    borderRadius: 20,
  },

  bigCard: {
    flexDirection: 'row',
    marginTop: 10,
    borderRadius: 20,
    alignItems: 'center',
  },

  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },

  cardDesc: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 5,
  },

  button: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 12,
  },

  cardImage: {
    width: 100,
    height: 70,
  },
});