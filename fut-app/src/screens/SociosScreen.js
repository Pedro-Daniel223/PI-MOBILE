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
import { useSubscription } from '../contexts/SubscriptionContext';

const escudoDrakos = require('../assets/img/Escudo_Drakos.png');

const plans = [
  {
    id: '1',
    title: 'Plano OURO',
    description: 'Acesso completo aos jogos do time B, encontros exclusivos com atletas e experiências VIP em dias de jogo.',
    price: 'R$ 99,90/mês',
  },
  {
    id: '2',
    title: 'Plano PRATA',
    description: 'Acesso prioritário aos jogos do time principal, descontos na loja oficial e conteúdo exclusivo da temporada.',
    price: 'R$ 79,90/mês',
  },
  {
    id: '3',
    title: 'Plano DIAMANTE',
    description: 'Acesso VIP total a todos os jogos, encontros exclusivos, experiências premium, camarote aberto e atendimento personalizado.',
    price: 'R$ 199,90/mês',
  },
];

const beneficios = [
  'Acesso a todos os jogos do time principal',
  'Prioridade na compra de ingressos',
  'Encontros exclusivos com atletas',
  'Treinos abertos exclusivos',
  'Descontos na loja oficial',
  'Certificado de sócio oficial Drakos',
  'Experiências VIP em dias de jogo',
  'Conteúdo exclusivo da temporada',
  'Acesso VIP ao camarote',
  'Atendimento personalizado e suporte preferencial',
  'Convivência com o elenco do time principal',
];

export default function SociosScreen({ navigation }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [assinarModalVisible, setAssinarModalVisible] = useState(false);
  const { confirmSubscription } = useSubscription();

  const openModal = (plan) => {
    setSelectedPlan(plan);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPlan(null);
  };

  const openAssinarModal = (plan) => {
    setSelectedPlan(plan);
    setAssinarModalVisible(true);
  };

  const closeAssinarModal = () => {
    setAssinarModalVisible(false);
  };

  const handleConfirmarAssinatura = () => {
    if (selectedPlan) {
      confirmSubscription(selectedPlan);
    }
    closeAssinarModal();
  };

  return (
    <View style={styles.container}>
      {/* Fundo cinza-claro */}
      <View style={styles.background} />

      {/* Marca d'água Drakos */}
      <Image 
        source={escudoDrakos}
        style={styles.drakosBackground}
        resizeMode="contain"
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Botão Voltar com sombra */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>

        {/* Título Principal */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleLine1}>PLANOS</Text>
          <View style={styles.titleLine2}>
            <Text style={styles.titleSocio}>sócio-</Text>
            <Text style={styles.titleTorcedor}>Torcedor</Text>
          </View>
        </View>

        {/* Barra de Categorias Preta com Ícones */}
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

        {/* Cards de Planos */}
        {plans.map((plan) => (
          <View key={plan.id} style={styles.planCard}>
            {/* Lado Esquerdo - Texto */}
            <View style={styles.cardLeft}>
              <Text style={styles.planTitle}>{plan.title}</Text>
              <Text style={styles.planDescription}>{plan.description}</Text>
            </View>

            {/* Lado Direito - Ilustração do Cartão */}
            <View style={styles.cardRight}>
              <View style={styles.cardIllustration}>
                <View style={styles.cardMock}>
                  <View style={styles.cardLogo}>
                    <View style={styles.cardLogoRed} />
                  </View>
                  <Text style={styles.cardText}>CRN CARD</Text>
                  <View style={styles.dragonIcon}>
                    <Ionicons name="flame-outline" size={28} color="#b30000" />
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Rodapé informativo */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            Planos PRATA, GOLD e DIAMANTE — escolha o seu e faça parte do time Drakos.
          </Text>
        </View>
      </ScrollView>

      {/* MODAL DE DETALHES DO PLANO */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Título do plano */}
          <Text style={styles.modalPlanTitle}>{selectedPlan?.title}</Text>
            <Text style={styles.modalPlanDescription}>
              Escolha seu plano — PRATA, GOLD ou DIAMANTE — e tenha acesso a benefícios exclusivos, descontos e experiências que só o torcedor de verdade merece.
            </Text>

            {/* Cartão ilustrativo */}
            <View style={styles.modalCardMock}>
              <View style={styles.modalCardLogo}>
                <View style={styles.modalCardLogoRed} />
              </View>
              <Text style={styles.modalCardText}>CRN CARD</Text>
              <View style={styles.modalDragonIcon}>
                <Ionicons name="flame-outline" size={32} color="#b30000" />
              </View>
            </View>

            {/* Título Benefícios */}
            <Text style={styles.beneficiosTitle}>Benefícios</Text>

            {/* Lista de Benefícios */}
            <ScrollView style={styles.beneficiosList} showsVerticalScrollIndicator={false}>
              {beneficios.map((beneficio, index) => (
                <View key={index} style={styles.beneficioItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.beneficioText}>{beneficio}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Preço e Botões */}
            <View style={styles.modalFooter}>
              <Text style={styles.modalPrice}>{selectedPlan?.price}</Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.fecharButton} onPress={closeModal}>
                  <Text style={styles.fecharButtonText}>Fechar</Text>
                </TouchableOpacity>
                
<TouchableOpacity 
                  style={styles.assinarButton}
                  onPress={() => {
                    closeModal();
                    openAssinarModal(selectedPlan);
                  }}
                >
                  <Text style={styles.assinarButtonText}>Assinar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL DE ASSINATURA */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={assinarModalVisible}
        onRequestClose={closeAssinarModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.assinarModalContainer}>
            <TouchableOpacity style={styles.backButton} onPress={closeAssinarModal}>
              <Ionicons name="arrow-back" size={20} color="#000" />
            </TouchableOpacity>

            <Text style={styles.assinarTitle}>Assinar Plano</Text>
            <Text style={styles.assinarPlanName}>{selectedPlan?.title || 'OURO'}</Text>

            <View style={styles.formCard}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nome Completo</Text>
                <View style={styles.input}>
                  <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                  <Text style={styles.inputText}>João Silva</Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={styles.input}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                  <Text style={styles.inputText}>joao@email.com</Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Forma de Pagamento</Text>
                <View style={styles.paymentOptions}>
                  <TouchableOpacity style={styles.paymentOption}>
                    <Ionicons name="card" size={24} color="#b30000" />
                    <Text style={styles.paymentText}>Cartão de Crédito</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.paymentOption}>
                    <Ionicons name="wallet-outline" size={24} color="#666" />
                    <Text style={styles.paymentText}>Pix</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Resumo do Pedido</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Plano {selectedPlan?.title || 'OURO'}</Text>
                  <Text style={styles.summaryValue}>{selectedPlan?.price || 'R$ 99,99'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total</Text>
                  <Text style={styles.summaryTotal}>{selectedPlan?.price || 'R$ 99,99'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmarAssinatura}>
                <Text style={styles.confirmButtonText}>Confirmar Assinatura</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <NavbarGlass navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
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

  planCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
    marginBottom: 8,
  },

  planDescription: {
    fontSize: 12,
    color: '#555',
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

  cardRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardIllustration: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardMock: {
    width: 90,
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    transform: [{ rotate: '8deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 0.5,
    borderColor: '#ddd',
    alignItems: 'center',
  },

  cardLogo: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  cardLogoRed: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#b30000',
  },

  cardText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },

  dragonIcon: {
    marginTop: 20,
    alignItems: 'center',
  },

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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: '85%',
  },

  modalPlanTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },

  modalPlanDescription: {
    fontSize: 13,
    color: '#555',
    marginBottom: 12,
    lineHeight: 18,
  },

  modalVerMais: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },

  modalVerMaisText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b30000',
  },

  modalCardMock: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },

  modalCardLogo: {
    flexDirection: 'row',
    marginBottom: 12,
  },

  modalCardLogoRed: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#b30000',
  },

  modalCardText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },

  modalDragonIcon: {
    marginTop: 16,
  },

  beneficiosTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },

  beneficiosList: {
    maxHeight: 280,
    marginBottom: 24,
  },

  beneficioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },

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

  assinarModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },

  assinarTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },

  assinarPlanName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b30000',
    marginBottom: 30,
  },

  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  inputContainer: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },

  inputIcon: {
    marginRight: 12,
  },

  inputText: {
    fontSize: 16,
    color: '#333',
  },

  paymentOptions: {
    flexDirection: 'row',
    gap: 12,
  },

  paymentOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  paymentText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },

  summaryCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#555',
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  summaryTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#b30000',
  },

  confirmButton: {
    backgroundColor: '#b30000',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },

  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});