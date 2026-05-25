import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NavbarGlass from '../components/NavbarGlass';
import { dadosPlano } from '../data/dataSocios';

const escudoDrakos = require('../assets/img/Escudo_Drakos.png');

export default function SociosScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlan(null);
  };

  return (
    <View style={styles.container}>
      {/* Fundo cinza claro */}
      <View style={styles.background} />

      {/* Marca d'água do escudo Drakos */}
      <Image
        source={escudoDrakos}
        style={styles.drakosBackground}
        resizeMode="contain"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Botão voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>

        {/* Título "PLANOS sócio-Torcedor" */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleLine1}>PLANOS</Text>
          <View style={styles.titleLine2}>
            <Text style={styles.titleSocio}>sócio-</Text>
            <Text style={styles.titleTorcedor}>Torcedor</Text>
          </View>
        </View>

        {/* Barra de categorias: Ingressos / Produtos / Descontos */}
        <View style={styles.categoryBar}>
          <View style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Ionicons name="ticket-outline" size={22} color="#666" />
            </View>
            <Text style={styles.categoryText}>Ingressos</Text>
          </View>

          <View style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Ionicons name="bag-outline" size={22} color="#666" />
            </View>
            <Text style={styles.categoryText}>Produtos</Text>
          </View>

          <View style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <Ionicons name="pricetag-outline" size={22} color="#666" />
            </View>
            <Text style={styles.categoryText}>Descontos</Text>
          </View>
        </View>

      {/* ─────────── Lista de cards de planos ─────────── */}
      {dadosPlano.map((plan) => (
        <View key={plan.id} style={[styles.planCard, { backgroundColor: plan.cardColor }]}>
          
          {/* ── Lado esquerdo do card: título, badge de vagas, descrição e botão VER MAIS ── */}
          <View style={styles.cardLeft}>
            <Text style={[styles.planTitle, { color: plan.textColor }]}>{plan.title}</Text>
            <View style={styles.cardBadge}>
              <Text style={[styles.cardBadgeText, { color: plan.textColor }]}>{plan.vagas}</Text>
            </View>
            <Text style={[styles.planDescription, { color: plan.textColor }]}>{plan.description}</Text>
            <TouchableOpacity
              style={styles.verMaisButton}
              onPress={() => openModal(plan)}
            >
              <Text style={styles.verMaisText}>VER MAIS</Text>
            </TouchableOpacity>
          </View>
      
          {/* ── Lado direito do card: cartão do plano ── */}
          <View style={styles.cardRight}>
            <Image
              source={plan.cardImage}
              style={styles.cardPlanImage}
              resizeMode="contain"
            />
          </View>
      
        </View>
      ))}

        {/* ─────────────────────────────────────────────── */}

        {/* Rodapé informativo */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            Torcer é mais que acompanhar um jogo. É fazer parte de uma torcida apaixonada.
          </Text>
        </View>
      </ScrollView>

      {/* ═══════════ MODAL DE DETALHES DO PLANO ═══════════ */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        {/* Overlay escuro do modal */}
        <View style={styles.modalOverlay}>
          {/* Container branco do modal */}
          <View style={styles.modalContainer}>
            {/* Título do plano */}
            <Text style={styles.modalPlanTitle}>{selectedPlan?.title}</Text>

            {/* Descrição do plano */}
            <Text style={styles.modalPlanDescription}>
              {selectedPlan?.description}
            </Text>

            {/* Cartão ilustrativo dentro do modal */}
            <Image source={selectedPlan?.cardImage} style={styles.modalCardImage} />

            {/* Título da lista de benefícios */}
            <Text style={styles.beneficiosTitle}>Benefícios</Text>

            {/* Lista de benefícios com scroll */}
            <ScrollView style={styles.beneficiosList} showsVerticalScrollIndicator={false}>
              {selectedPlan?.beneficios.map((beneficio, index) => (
                <View key={index} style={styles.beneficioItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.beneficioText}>{beneficio}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Rodapé do modal: preço + botões */}
            <View style={styles.modalFooter}>
              <Text style={styles.modalPrice}>{selectedPlan?.price}</Text>

              <View style={styles.modalButtons}>
                {/* Botão Fechar */}
                <TouchableOpacity style={styles.fecharButton} onPress={closeModal}>
                  <Text style={styles.fecharButtonText}>Fechar</Text>
                </TouchableOpacity>

                {/* Botão Assinar */}
                <TouchableOpacity style={styles.assinarButton}>
                  <Text style={styles.assinarButtonText}>Assinar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* ═══════════════════════════════════════════════════════ */}

      <NavbarGlass navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  // ─────── Layout principal ───────
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 110, // Espaço para o NavbarGlass
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f5f5f5',
  },

  drakosBackground: {
    position: 'absolute',
    width: 300,
    height: 300,
    opacity: 0.15,
    right: -80,
    top: -30,
    transform: [{ rotate: '-15deg' }],
    zIndex: 0,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 140,
  },

  // ─────── Botão voltar ───────
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // ─────── Título "PLANOS sócio-Torcedor" ───────
  titleContainer: {
    marginBottom: 30,
  },

  titleLine1: {
    fontFamily: 'serif',
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 1,
  },

  titleLine2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: -8,
  },

  titleSocio: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },

  titleTorcedor: {
    fontFamily: 'serif',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8b0000',
  },

  // ─────── Barra de categorias (Ingressos / Produtos / Descontos) ───────
  categoryBar: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 50,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    marginBottom: 30,
  },

  categoryItem: {
    alignItems: 'center',
  },

  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },

  plansSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    letterSpacing: 1,
    marginBottom: 16,
  },

  // ─────── Card de plano ───────
  planCard: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },

  cardLeft: {
    flex: 2,
    paddingRight: 12,
  },

  planTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },

  // Badge "Limitado a X vagas" dentro do card
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 10,
  },

  cardBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 0.3,
  },

  planDescription: {
    fontSize: 12,   
    lineHeight: 16,
    marginBottom: 16,
  },

  verMaisButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },

  verMaisText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.5,
  },

  // ─────── Lado direito do card: ilustração do cartão ───────
  // ─────── Lado direito do card: imagem do cartão ───────
  cardRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Imagem do cartão de plano (mesma medida do mock antigo: ~90×140)
  cardPlanImage: {
    width: 100,
    height: 150,
    transform: [{ rotate: '90deg' }],
  },

  // ─────── Rodapé informativo da tela ───────
  footerNote: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
  },

  footerText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },

  // ═══════════ Estilos do Modal ═══════════
  // Overlay escuro semi-transparente
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  // Container branco com bordas arredondadas no topo
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: '85%',
  },

  // Título do plano dentro do modal
  modalPlanTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },

  // Descrição do plano dentro do modal
  modalPlanDescription: {
    fontSize: 13,
    color: '#555',
    marginBottom: 12,
    lineHeight: 18,
  },

  // Link "VER MAIS" do modal
  modalVerMais: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },

  modalVerMaisText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b30000',
  },

  // Cartão ilustrativo do modal
  modalCardImage: {
    width: '80%',
    margin: 'auto',
    marginBottom: 20,
  },

  // Título "Benefícios"
  beneficiosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },

  // Lista de benefícios com scroll
  beneficiosList: {
    maxHeight: 280,
    marginBottom: 24,
  },

  // Item individual da lista de benefícios
  beneficioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  // Bullet point "•"
  bulletPoint: {
    fontSize: 16,
    color: '#b30000',
    marginRight: 10,
    fontWeight: 'bold',
  },

  beneficioText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },

  // Rodapé do modal: preço + botões
  modalFooter: {
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    paddingTop: 16,
  },

  modalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  // Botão "Fechar" do modal
  fecharButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  fecharButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },

  // Botão "Assinar" do modal
  assinarButton: {
    flex: 1,
    backgroundColor: '#b30000',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  assinarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});