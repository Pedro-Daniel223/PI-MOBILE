import React, { useState } from 'react';
import {View, Text, StyleSheet, Image,TouchableOpacity, ScrollView, Modal, TextInput} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { styleSocioModal } from '../styles/styleSocios/styleSociosModal';
import { stylesPerfil } from '../styles/stylePerfil/stylePerfil';
import { escudoDrakos, user as defaultUser } from '../data/dataPerfil';

import { useSubscription } from '../contexts/SubscriptionContext';

const user = defaultUser;

export default function PerfilScreen({ navigation }) {
  const [editingField, setEditingField] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState({ 
    name: user.name,
    email: user.email,
    phone: user.phone
  });
  const { subscription, purchaseHistory } = useSubscription();

  return (
    <View style={stylesPerfil.container}>
      {/* BACKGROUND GRADIENT */}
      <LinearGradient
        colors={['#b30000', '#5a0000', '#1a0000']}
        style={StyleSheet.absoluteFill}
      />

      {/* ENGRENAGEM - Canto superior direito */}
      <TouchableOpacity 
        style={stylesPerfil.settingsGear}
        onPress={() => navigation.navigate('Settings')}
        activeOpacity={0.8}
      >
        <BlurView intensity={60} tint="dark" style={stylesPerfil.gearBlur}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </BlurView>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={stylesPerfil.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER COM AVATAR ── */}
        <View style={stylesPerfil.header}>
          <Image source={escudoDrakos} style={stylesPerfil.drakosBg} resizeMode="contain" />
          <View style={stylesPerfil.avatarWrapper}>
            <Image source={{ uri: user.avatar }} style={stylesPerfil.avatar} />
            <TouchableOpacity style={stylesPerfil.editAvatarBtn} activeOpacity={0.8}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={stylesPerfil.username}>{user.name}</Text>
          <Text style={stylesPerfil.userStatus}>Status atual: {user.status}</Text>
        </View>

        {/* ── CARD DE BOAS-VINDAS ── */}
        <View style={stylesPerfil.welcomeCard}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={stylesPerfil.welcomeBorder} />

          <View style={stylesPerfil.welcomeHeader}>
            <Text style={stylesPerfil.welcomeTitle}>Seja bem-vindo</Text>
            <TouchableOpacity style={stylesPerfil.notifBadge} activeOpacity={0.8}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              <View style={stylesPerfil.notifDot} />
            </TouchableOpacity>
          </View>

          <Text style={stylesPerfil.welcomeBody}>
            Olá, {user.name}{'\n'}Explore as novidades, confira seus dados e aproveite ao máximo sua experiência com a gente!
          </Text>

          {/* ── ASSINATURA ATIVA ── */}
          {subscription && (
            <View style={stylesPerfil.subBadge}>
              <BlurView intensity={40} tint="dark" style={stylesPerfil.subBadgeBlur}>
                <Ionicons name="star" size={15} color="#ffd700" />
                <Text style={stylesPerfil.subBadgeText}>
                  {subscription.title} ativo
                </Text>
                <Text style={stylesPerfil.subBadgePrice}>{subscription.price}</Text>
              </BlurView>
            </View>
          )}
        </View>

        {/* ── AÇÕES RÁPIDAS COM BACKGROUND SUAVE ── */}
        <View style={stylesPerfil.actionsRow}>
          <TouchableOpacity style={stylesPerfil.actionCard}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={stylesPerfil.actionBorder} />
            <View style={stylesPerfil.actionContent}>
              <Ionicons name="card-outline" size={28} color="#fff" />
              <Text style={stylesPerfil.actionLabel}>Meu Cartão</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={stylesPerfil.actionCard}
            onPress={() => setShowHistory(prev => !prev)}
          >
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={stylesPerfil.actionBorder} />
            <View style={stylesPerfil.actionContent}>
              <Ionicons name="receipt-outline" size={28} color="#fff" />
              <Text style={stylesPerfil.actionLabel}>Minhas Compras</Text>
            </View>
          </TouchableOpacity>

           <TouchableOpacity 
            style={stylesPerfil.actionCard}
            onPress={() => navigation.navigate('Socio')}
          >
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={stylesPerfil.actionBorder} />
            <View style={stylesPerfil.actionContent}>
              <Ionicons name="people-outline" size={28} color="#fff" />
              <Text style={stylesPerfil.actionLabel}>Sócio</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── HISTÓRICO DE COMPRAS E ASSINATURAS COM BACKGROUND SUAVE ── */}
        {showHistory && (
          <View style={stylesPerfil.historySection}>
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
              style={StyleSheet.absoluteFill}
            />
            <View style={stylesPerfil.historyBorder} />
            
            <View style={stylesPerfil.historyHeader}>
              <Text style={stylesPerfil.historyTitle}>Minhas Compras e Assinaturas</Text>
              <TouchableOpacity onPress={() => setShowHistory(false)} activeOpacity={0.7}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {subscription && (
              <View style={stylesPerfil.historySubBadge}>
                <Ionicons name="star" size={15} color="#ffd700" />
                <Text style={stylesPerfil.historySubText}>
                  Assinatura ativa: {subscription.title}
                </Text>
                <Text style={stylesPerfil.historySubPrice}>{subscription.price}</Text>
              </View>
            )}

            <Text style={stylesPerfil.historyListTitle}>Histórico</Text>

            {purchaseHistory && purchaseHistory.length > 0 ? (
              purchaseHistory.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <View style={stylesPerfil.historyRow}>
                    {item.type === 'subscription' ? (
                      <Ionicons
                        name="star-outline"
                        size={22}
                        color="#ffd700"
                      />
                    ) : item.itemImages && item.itemImages[0] ? (
                      <Image source={item.itemImages[0]} style={stylesPerfil.historyProductImage} />
                    ) : (
                      <Ionicons
                        name="bag-outline"
                        size={18}
                        color="#ff2b2b"
                      />
                    )}
                    <View style={stylesPerfil.historyInfo}>
                      <Text style={stylesPerfil.historyPlan}>
                        {item.type === 'subscription' ? item.planTitle : (item.items?.length > 1 ? `${item.items.length} produtos` : item.items?.[0])}
                      </Text>
                      <Text style={stylesPerfil.historyDate}>
                        {new Date(item.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Text>
                    </View>
                    <Text style={stylesPerfil.historyPrice}>{item.price}</Text>
                  </View>
                  {idx < purchaseHistory.length - 1 && <View style={stylesPerfil.historyDivider} />}
                </React.Fragment>
              ))
            ) : (
              <View style={stylesPerfil.historyEmpty}>
                <Ionicons name="document-text-outline" size={36} color="rgba(255,255,255,0.3)" />
                <Text style={stylesPerfil.historyEmptyText}>Nenhuma compra ou assinatura ainda</Text>
              </View>
            )}
          </View>
        )}

        {/* ── DIVISOR DADOS PESSOAIS ── */}
        <View style={stylesPerfil.sectionHeaderCustom}>
          <Text style={stylesPerfil.sectionTitle}>Dados pessoais</Text>
          <TouchableOpacity style={stylesPerfil.sectionEditBtn} onPress={() => setEditModalVisible(true)} activeOpacity={0.7}>
            <Ionicons name="pencil-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ── CARD DADOS PESSOAIS ── */}
        <View style={stylesPerfil.infoCard}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={stylesPerfil.infoBorder} />

          <View style={stylesPerfil.infoRow}>
            <View style={stylesPerfil.infoLeft}>
              <Ionicons name="person-outline" size={20} color="#ffffff" />
              <View style={stylesPerfil.infoTextGroup}>
                <Text style={stylesPerfil.infoLabel}>Nome completo</Text>
                <Text style={stylesPerfil.infoValue}>{user.name}</Text>
              </View>
            </View>
          </View>

          <View style={stylesPerfil.infoDivider} />

          <View style={stylesPerfil.infoRow}>
            <View style={stylesPerfil.infoLeft}>
              <Ionicons name="mail-outline" size={20} color="#ffffff" />
              <View style={stylesPerfil.infoTextGroup}>
                <Text style={stylesPerfil.infoLabel}>Email</Text>
                <Text style={stylesPerfil.infoValue}>{user.email}</Text>
              </View>
            </View>
          </View>

          <View style={stylesPerfil.infoDivider} />

          <View style={stylesPerfil.infoRow}>
            <View style={stylesPerfil.infoLeft}>
              <Ionicons name="call-outline" size={20} color="#ffffff" />
              <View style={stylesPerfil.infoTextGroup}>
                <Text style={stylesPerfil.infoLabel}>Telefone</Text>
                <Text style={stylesPerfil.infoValue}>{user.phone}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* BOTÃO SAIR */}
        <TouchableOpacity style={stylesPerfil.logoutBtn} activeOpacity={0.8}>
          <LinearGradient
            colors={['rgba(255,0,0,0.2)', 'rgba(255,0,0,0.1)']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={stylesPerfil.logoutBorder} />
          <Ionicons name="log-out-outline" size={22} color="#ff6b6b" />
          <Text style={stylesPerfil.logoutText}>Sair da conta</Text>
          <Ionicons name="chevron-forward-outline" size={18} color="#ff6b6b" />
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
            <Text style={stylesPerfil.modalTitle}>Editar Dados Pessoais</Text>

            <View style={stylesPerfil.modalField}>
              <Text style={stylesPerfil.modalLabel}>Nome completo</Text>
              <TextInput
                style={stylesPerfil.modalInput}
                value={editedUser.name}
                onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
                placeholder="Digite seu nome"
                placeholderTextColor="rgba(0,0,0,0.4)"
              />
            </View>

            <View style={stylesPerfil.modalField}>
              <Text style={stylesPerfil.modalLabel}>Email</Text>
              <TextInput
                style={stylesPerfil.modalInput}
                value={editedUser.email}
                onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
                placeholder="Digite seu email"
                placeholderTextColor="rgba(0,0,0,0.4)"
                keyboardType="email-address"
              />
            </View>

            <View style={stylesPerfil.modalField}>
              <Text style={stylesPerfil.modalLabel}>Telefone</Text>
              <TextInput
                style={stylesPerfil.modalInput}
                value={editedUser.phone}
                onChangeText={(text) => setEditedUser({ ...editedUser, phone: text })}
                placeholder="Digite seu telefone"
                placeholderTextColor="rgba(0,0,0,0.4)"
                keyboardType="phone-pad"
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
    </View>
  );
}