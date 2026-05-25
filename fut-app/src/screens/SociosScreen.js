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
import { stylesSocio } from '../styles/styleSocios/stylesSocios';
import { styleSocioModal } from '../styles/styleSocios/styleSociosModal';

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
    <View style={stylesSocio.container}>
      {/* Fundo cinza claro */}
      <View style={stylesSocio.background} />

      {/* Marca d'água do escudo Drakos */}
      <Image
        source={escudoDrakos}
        style={stylesSocio.drakosBackground}
        resizeMode="contain"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={stylesSocio.content}
      >
        {/* Botão voltar */}
        <TouchableOpacity style={stylesSocio.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>

        {/* Título "PLANOS sócio-Torcedor" */}
        <View style={stylesSocio.titleContainer}>
          <Text style={stylesSocio.titleLine1}>PLANOS</Text>
          <View style={stylesSocio.titleLine2}>
            <Text style={stylesSocio.titleSocio}>sócio-</Text>
            <Text style={stylesSocio.titleTorcedor}>Torcedor</Text>
          </View>
        </View>

      {/* ─────────── Lista de cards de planos ─────────── */}
      {dadosPlano.map((plan) => (
        <View key={plan.id} style={[stylesSocio.planCard, { backgroundColor: plan.cardColor }]}>
          
          {/* ── Lado esquerdo do card: título, badge de vagas, descrição e botão VER MAIS ── */}
          <View style={stylesSocio.cardLeft}>
            <Text style={[stylesSocio.planTitle, { color: plan.textColor }]}>{plan.title}</Text>
            <View style={stylesSocio.cardBadge}>
              <Text style={[stylesSocio.cardBadgeText, { color: plan.textColor }]}>{plan.vagas}</Text>
            </View>
            <Text style={[stylesSocio.planDescription, { color: plan.textColor }]}>{plan.description}</Text>
            <TouchableOpacity
              style={stylesSocio.verMaisButton}
              onPress={() => openModal(plan)}
            >
              <Text style={stylesSocio.verMaisText}>VER MAIS</Text>
            </TouchableOpacity>
          </View>
      
          {/* ── Lado direito do card: cartão do plano ── */}
          <View style={stylesSocio.cardRight}>
            <Image
              source={plan.cardImage}
              style={stylesSocio.cardPlanImage}
              resizeMode="contain"
            />
          </View>
      
        </View>
      ))}

        {/* ─────────────────────────────────────────────── */}

        {/* Rodapé informativo */}
        <View style={stylesSocio.footerNote}>
          <Text style={stylesSocio.footerText}>
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
        <View style={styleSocioModal.modalOverlay}>
          {/* Container branco do modal */}
          <View style={styleSocioModal.modalContainer}>
            {/* Título do plano */}
            <Text style={styleSocioModal.modalPlanTitle}>{selectedPlan?.title}</Text>

            {/* Descrição do plano */}
            <Text style={styleSocioModal.modalPlanDescription}>
              {selectedPlan?.description}
            </Text>

            {/* Cartão ilustrativo dentro do modal */}
            <Image source={selectedPlan?.cardImage} style={styleSocioModal.modalCardImage} />

            {/* Título da lista de benefícios */}
            <Text style={styleSocioModal.beneficiosTitle}>Benefícios</Text>

            {/* Lista de benefícios com scroll */}
            <ScrollView style={styleSocioModal.beneficiosList} showsVerticalScrollIndicator={false}>
              {selectedPlan?.beneficios.map((beneficio, index) => (
                <View key={index} style={styleSocioModal.beneficioItem}>
                  <Text style={styleSocioModal.bulletPoint}>•</Text>
                  <Text style={styleSocioModal.beneficioText}>{beneficio}</Text>
                </View>
              ))}
            </ScrollView>

            {/* Rodapé do modal: preço + botões */}
            <View style={styleSocioModal.modalFooter}>
              <Text style={styleSocioModal.modalPrice}>{selectedPlan?.price}</Text>

              <View style={styleSocioModal.modalButtons}>
                {/* Botão Fechar */}
                <TouchableOpacity style={styleSocioModal.fecharButton} onPress={closeModal}>
                  <Text style={styleSocioModal.fecharButtonText}>Fechar</Text>
                </TouchableOpacity>

                {/* Botão Assinar */}
                <TouchableOpacity style={styleSocioModal.assinarButton}>
                  <Text style={styleSocioModal.assinarButtonText}>Assinar</Text>
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