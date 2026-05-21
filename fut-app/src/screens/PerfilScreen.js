import React, { useState } from 'react';
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
import { BlurView } from 'expo-blur';

import NavbarGlass from '../components/NavbarGlass';

const escudoDrakos = require('../assets/img/Escudo_Drakos.png');

const user = {
  name: 'fernando freitas',
  email: 'fernando.drks@email.com',
  phone: '+55 21 99999-7203',
  cpf: '121.019.269-42',
  avatar: 'https://i.pravatar.cc/150?img=12',
  status: 'Não-sócio',
};

export default function PerfilScreen({ navigation }) {
  const [editingField, setEditingField] = useState(null);

  return (
    <View style={styles.container}>
      {/* BACKGROUND GRADIENT */}
      <LinearGradient
        colors={['#b30000', '#5a0000', '#1a0000']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER COM AVATAR ── */}
        <View style={styles.header}>
          <Image source={escudoDrakos} style={styles.drakosBg} resizeMode="contain" />
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.userStatus}>Status atual: {user.status}</Text>
        </View>

        {/* ── CARD DE BOAS-VINDAS ── */}
        <View style={styles.welcomeCard}>
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.01)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.2)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.innerBorder} />

          <View style={styles.welcomeHeader}>
            <Text style={styles.welcomeTitle}>Seja bem-vindo</Text>
            <TouchableOpacity style={styles.notifBadge} activeOpacity={0.8}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          <Text style={styles.welcomeBody}>
            Olá, {user.name}{'\n'}Explore o app e aproveite!
          </Text>

          <View style={styles.welcomeActions}>
            <TouchableOpacity style={styles.badgeBtn}>
              <BlurView intensity={30} tint="dark" style={styles.badgeBlur}>
                <Ionicons name="mail-outline" size={15} color="#fff" />
                <Text style={styles.badgeText}>54 mensagens</Text>
                <View style={styles.badgeNumber}>
                  <Text style={styles.badgeNumberText}>8</Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── AÇÕES RÁPIDAS ── */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard}>
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.07)', 'transparent']}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.2)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.innerBorder} />
            <Ionicons name="card-outline" size={28} color="#fff" />
            <Text style={styles.actionLabel}>Meu Cartão</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.07)', 'transparent']}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.2)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.innerBorder} />
            <Ionicons name="settings-outline" size={28} color="#fff" />
            <Text style={styles.actionLabel}>Preferências</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.07)', 'transparent']}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.2)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.innerBorder} />
            <Ionicons name="people-outline" size={28} color="#fff" />
            <Text style={styles.actionLabel}>Sócio</Text>
          </TouchableOpacity>
        </View>

        {/* ── DIVISOR ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dados pessoais</Text>
          <View style={styles.sectionLine} />
        </View>

        {/* ── DADOS PESSOAIS ── */}
        <View style={styles.infoCard}>
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.01)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.15)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.innerBorder} />

          {/* Nome completo */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="person-outline" size={20} color="#ff2b2b" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Nome completo</Text>
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editRowBtn}
              onPress={() => setEditingField(editingField === 'name' ? null : 'name')}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil-outline" size={16} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoDivider} />

          {/* Email */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="mail-outline" size={20} color="#ff2b2b" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editRowBtn}
              onPress={() => setEditingField(editingField === 'email' ? null : 'email')}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil-outline" size={16} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoDivider} />

          {/* Telefone */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="call-outline" size={20} color="#ff2b2b" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editRowBtn}
              onPress={() => setEditingField(editingField === 'phone' ? null : 'phone')}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil-outline" size={16} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoDivider} />

          {/* CPF */}
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="card-outline" size={20} color="#ff2b2b" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>CPF</Text>
                <Text style={styles.infoValue}>{user.cpf}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editRowBtn}
              onPress={() => setEditingField(editingField === 'cpf' ? null : 'cpf')}
              activeOpacity={0.7}
            >
              <Ionicons name="pencil-outline" size={16} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── BOTÃO SAIR ── */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* NAVBAR */}
      <NavbarGlass navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 110,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    gap: 20,
  },

  /* ── HEADER ── */
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
  },
  drakosBg: {
    position: 'absolute',
    width: 220,
    height: 220,
    opacity: 0.12,
    right: -60,
    top: -30,
    transform: [{ rotate: '-12deg' }],
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#880000',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1a0000',
  },
  username: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  userStatus: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    textAlign: 'center',
  },

  /* ── WELCOME CARD ── */
  welcomeCard: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginTop: 4,
    shadowColor: '#ff2b2b',
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    padding: 20,
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  notifBadge: {
    position: 'relative',
    padding: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  notifDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff2b2b',
    borderWidth: 1.5,
    borderColor: '#1a0000',
  },
  welcomeBody: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 16,
  },
  welcomeActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeBtn: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  badgeBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  badgeNumber: {
    backgroundColor: '#880000',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  badgeNumberText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },

  /* ── AÇÕES RÁPIDAS ── */
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 20,
    paddingHorizontal: 8,
    minHeight: 105,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },

  /* ── SECTION HEADER ── */
  sectionHeader: {
    marginBottom: 4,
    marginTop: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sectionLine: {
    marginTop: 6,
    width: 36,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#ff2b2b',
    shadowColor: '#ff2b2b',
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },

  /* ── INFO CARD ── */
  infoCard: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoTextGroup: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  infoDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginHorizontal: 18,
  },
  editRowBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  /* ── LOGOUT ── */
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,0,0,0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,0,0,0.25)',
    gap: 8,
  },
  logoutText: {
    color: '#ff2b2b',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
