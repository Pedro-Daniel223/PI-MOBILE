import React, { useState } from 'react';
import {View, Text, StyleSheet, Image,TouchableOpacity, ScrollView, Modal, TextInput} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { styleSocioModal } from '../styles/styleSocios/styleSociosModal';

import NavbarGlass from '../components/NavbarGlass';
import { useSubscription } from '../contexts/SubscriptionContext';

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
  const [showHistory, setShowHistory] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const { subscription, purchaseHistory } = useSubscription();

  return (
    <View style={styles.container}>
      {/* BACKGROUND GRADIENT */}
      <LinearGradient
        colors={['#b30000', '#5a0000', '#1a0000']}
        style={StyleSheet.absoluteFill}
      />

      {/* ENGRENAGEM - Canto superior direito */}
      <TouchableOpacity 
        style={styles.settingsGear}
        onPress={() => navigation.navigate('Settings')}
        activeOpacity={0.8}
      >
        <BlurView intensity={60} tint="dark" style={styles.gearBlur}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </BlurView>
      </TouchableOpacity>

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
          <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.25)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.welcomeBorder} />

          <View style={styles.welcomeHeader}>
            <Text style={styles.welcomeTitle}>Seja bem-vindo</Text>
            <TouchableOpacity style={styles.notifBadge} activeOpacity={0.8}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          <Text style={styles.welcomeBody}>
            Olá, {user.name}{'\n'}Explore as novidades, confira seus dados e aproveite ao máximo sua experiência com a gente!
          </Text>

          {/* ── ASSINATURA ATIVA ── */}
          {subscription && (
            <View style={styles.subBadge}>
              <BlurView intensity={40} tint="dark" style={styles.subBadgeBlur}>
                <Ionicons name="star" size={15} color="#ffd700" />
                <Text style={styles.subBadgeText}>
                  {subscription.title} ativo
                </Text>
                <Text style={styles.subBadgePrice}>{subscription.price}</Text>
              </BlurView>
            </View>
          )}
        </View>

        {/* ── AÇÕES RÁPIDAS COM BACKGROUND SUAVE ── */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.actionBorder} />
            <View style={styles.actionContent}>
              <Ionicons name="card-outline" size={28} color="#fff" />
              <Text style={styles.actionLabel}>Meu Cartão</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => setShowHistory(prev => !prev)}
          >
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.actionBorder} />
            <View style={styles.actionContent}>
              <Ionicons name="receipt-outline" size={28} color="#fff" />
              <Text style={styles.actionLabel}>Minhas Compras</Text>
            </View>
          </TouchableOpacity>

           <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Socio')}
          >
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.actionBorder} />
            <View style={styles.actionContent}>
              <Ionicons name="people-outline" size={28} color="#fff" />
              <Text style={styles.actionLabel}>Sócio</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── HISTÓRICO DE COMPRAS E ASSINATURAS COM BACKGROUND SUAVE ── */}
        {showHistory && (
          <View style={styles.historySection}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.historyBorder} />
            
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Minhas Compras e Assinaturas</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)} activeOpacity={0.7}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {subscription && (
              <View style={styles.historySubBadge}>
                <Ionicons name="star" size={15} color="#ffd700" />
                <Text style={styles.historySubText}>
                  Assinatura ativa: {subscription.title}
                </Text>
                <Text style={styles.historySubPrice}>{subscription.price}</Text>
              </View>
            )}

            <Text style={styles.historyListTitle}>Histórico</Text>

            {purchaseHistory && purchaseHistory.length > 0 ? (
              purchaseHistory.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <View style={styles.historyRow}>
                    <Ionicons
                      name={item.type === 'subscription' ? 'star-outline' : 'bag-outline'}
                      size={18}
                      color={item.type === 'subscription' ? '#ffd700' : '#ff2b2b'}
                    />
                    <View style={styles.historyInfo}>
                      <Text style={styles.historyPlan}>
                        {item.type === 'subscription' ? item.planTitle : (item.items?.length > 1 ? `${item.items.length} produtos: ${item.items.join(', ')}` : item.items?.[0])}
                      </Text>
                      <Text style={styles.historyDate}>
                        {new Date(item.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                    <Text style={styles.historyPrice}>{item.price}</Text>
                  </View>
                  {idx < purchaseHistory.length - 1 && <View style={styles.historyDivider} />}
                </React.Fragment>
              ))
            ) : (
              <View style={styles.historyEmpty}>
                <Ionicons name="document-text-outline" size={36} color="rgba(255,255,255,0.3)" />
                <Text style={styles.historyEmptyText}>Nenhuma compra ou assinatura ainda</Text>
              </View>
            )}
          </View>
        )}

        {/* ── DIVISOR DADOS PESSOAIS ── */}
        <View style={styles.sectionHeaderCustom}>
          <Text style={styles.sectionTitle}>Dados pessoais</Text>
          <TouchableOpacity style={styles.sectionEditBtn} onPress={() => setEditModalVisible(true)} activeOpacity={0.7}>
            <Ionicons name="pencil-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── CARD DADOS PESSOAIS ── */}
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

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="person-outline" size={20} color="#ffffff" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Nome completo</Text>
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="mail-outline" size={20} color="#ffffff" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="call-outline" size={20} color="#ffffff" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <Ionicons name="document-text-outline" size={20} color="#ffffff" />
              <View style={styles.infoTextGroup}>
                <Text style={styles.infoLabel}>CPF</Text>
                <Text style={styles.infoValue}>{user.cpf}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* BOTÃO SAIR */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* MODAL EDITAR DADOS PESSOAIS */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styleSocioModal.modalOverlay}>
          <View style={styleSocioModal.modalContainer}>
            <Text style={styles.modalTitle}>Editar Dados Pessoais</Text>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Nome completo</Text>
              <TextInput
                style={styles.modalInput}
                value={editedUser.name}
                onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
                placeholder="Digite seu nome"
                placeholderTextColor="rgba(0,0,0,0.4)"
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Email</Text>
              <TextInput
                style={styles.modalInput}
                value={editedUser.email}
                onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
                placeholder="Digite seu email"
                placeholderTextColor="rgba(0,0,0,0.4)"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>Telefone</Text>
              <TextInput
                style={styles.modalInput}
                value={editedUser.phone}
                onChangeText={(text) => setEditedUser({ ...editedUser, phone: text })}
                placeholder="Digite seu telefone"
                placeholderTextColor="rgba(0,0,0,0.4)"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalLabel}>CPF</Text>
              <TextInput
                style={styles.modalInput}
                value={editedUser.cpf}
                onChangeText={(text) => setEditedUser({ ...editedUser, cpf: text })}
                placeholder="Digite seu CPF"
                placeholderTextColor="rgba(0,0,0,0.4)"
                keyboardType="numeric"
              />
            </View>

            <View style={styleSocioModal.modalButtons}>
              <TouchableOpacity
                style={styleSocioModal.fecharButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styleSocioModal.fecharButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styleSocioModal.assinarButton}
                onPress={() => {
                  setEditModalVisible(false);
                }}
              >
                <Text style={styleSocioModal.assinarButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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

  settingsGear: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  gearBlur: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

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
    right: -30,
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

  welcomeCard: {
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginTop: 4,
    shadowColor: '#ff0000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
    padding: 20,
  },
  innerBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  welcomeBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
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

  subBadge: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 14,
  },
  subBadgeBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
    backgroundColor: 'rgba(255,215,0,0.08)',
    gap: 8,
  },
  subBadgeText: {
    color: '#800000',
    fontSize: 13,
    fontWeight: '700',
  },
  subBadgePrice: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '600',
  },

  /* ── AÇÕES RÁPIDAS COM BACKGROUND SUAVE ── */
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 16,
    paddingHorizontal: 8,
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  actionBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  actionContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },

  sectionHeaderCustom: {
    marginBottom: 4,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sectionEditBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  infoCard: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoTextGroup: {
    marginLeft: 14,
    flex: 1,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  infoValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginHorizontal: 18,
  },

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

  /* ── HISTÓRICO COM BACKGROUND SUAVE ── */
  historySection: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 16,
  },
  historyBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  historyTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  historySubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,215,0,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
    marginBottom: 14,
    gap: 8,
  },
  historySubText: {
    color: '#ffd700',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  historySubPrice: {
    color: '#ffd700',
    fontSize: 13,
    fontWeight: '700',
  },
  historyListTitle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  historyInfo: {
    flex: 1,
  },
  historyPlan: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  historyDate: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    marginTop: 1,
  },
  historyPrice: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  historyDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 2,
  },
  historyEmpty: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  historyEmptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    textAlign: 'center',
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalField: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    fontWeight: '600',
  },
  modalInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
  },
});