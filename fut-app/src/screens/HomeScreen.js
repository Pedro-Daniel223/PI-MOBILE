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
// import GlassCard from '../components/CardGlass';
import GlassCarousel from '../components/GlassCarousel';
import CardProfileWelcome from '../components/CardProfileWelcome';
import CardActionGlass from '../components/cardActionGlass';



export default function Home({ navigation }) {
  return (
    <View style={styles.container}>

      {/* BACKGROUND */}
      <LinearGradient
        colors={['#b30000', '#5a0000', '#1a0000']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView contentContainerStyle={styles.content}>


        <CardProfileWelcome />


        {/* CARDS */}
        <View style={styles.row}>

          <CardActionGlass
              icon="storefront-outline"
              title="Drakos Store"
              desc="Veja produtos"
              style={{ width: '48%' }}
            />

            <CardActionGlass
              icon="ticket-outline"
              title="Ingressos"
              desc="Eventos disponíveis"
              style={{ width: '48%' }}
            />

        </View>

        {/* CARD GRANDE */}
          <GlassCarousel />

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