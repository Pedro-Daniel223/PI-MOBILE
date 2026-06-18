import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { dadosJogos } from '../data/dataIngresso';
import { stylesIngresso } from '../styles/styleIngresso/styleIngresso';
import { stylesIngressoModal } from '../styles/styleIngresso/styleIngressoModal';
import { decrease, increase, calculateTotal } from '../services/ingressosService/allIngressoService';

export default function IngressosScreen({ navigation }) {
  const navigationRef = useNavigation();
  
  // Estado para controlar o jogo selecionado (padrão: primeiro da lista)
  const [selectedGame, setSelectedGame] = useState(dadosJogos[0]);
  const [quantities, setQuantities] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Renderiza toda a interface superior como cabeçalho da FlatList
  const renderHeader = () => (
    <View style={{ backgroundColor: '#FFFFFF' }}>
      {/* HEADER - Título da tela de ingressos */}
      <View style={stylesIngresso.header}>
        <Text style={stylesIngresso.headerTitle}>INGRESSOS - PARTIDA PRINCIPAL</Text>
      </View>

      {/* CARD DOS TIMES - Exibição dos escudos e nomes dos times */}
      <View style={stylesIngresso.teamsCard}>
        <View style={stylesIngresso.teamContainer}>
          <Image
            source={selectedGame?.homeImg ? selectedGame.homeImg : { uri: 'https://placeholder.com/80' }}
            style={stylesIngresso.teamLogo}
            resizeMode="contain"
          />
          <Text style={stylesIngresso.teamName}>{(selectedGame?.homeName ?? 'Mandante').toUpperCase()}</Text>
        </View>

        <Text style={stylesIngresso.vsText}>VS</Text>

        <View style={stylesIngresso.teamContainer}>
          <Image
            source={selectedGame?.awayImg ? selectedGame.awayImg : { uri: 'https://placeholder.com/80' }}
            style={stylesIngresso.teamLogo}
            resizeMode="contain"
          />
          <Text style={stylesIngresso.teamName}>{(selectedGame?.awayName ?? 'Visitante').toUpperCase()}</Text>
        </View>
      </View>

      {/* INFO DA PARTIDA - Data, horário e local do jogo */}
      <View style={stylesIngresso.infoCard}>
        <Text style={stylesIngresso.infoDate}>{selectedGame?.dia}</Text>
        <Text style={stylesIngresso.infoTime}>{selectedGame?.hora} (Horário Local)</Text>
        <Text style={stylesIngresso.infoLocation}>{selectedGame?.local}</Text>
      </View>

      {/* SELEÇÃO DE JOGO - Dropdown para escolher entre os jogos disponíveis */}
      <Text style={stylesIngresso.sectionLabel}>ESCOLHA O JOGO:</Text>
      <TouchableOpacity
        style={[stylesIngresso.dropdown, { backgroundColor: '#F2F2F7' }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={stylesIngresso.dropdownText}>
          {selectedGame ? `${selectedGame.homeName} X ${selectedGame.awayName}` : 'Escolha o jogo'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#000000" />
      </TouchableOpacity>

      {/* MODAL DE SELEÇÃO DE JOGO - Popup com lista de jogos */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={stylesIngressoModal.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={stylesIngressoModal.modalContainer}>
            <Text style={stylesIngresso.modalTitle}>Selecionar Jogo</Text>
            {dadosJogos.map((jogo) => (
              <TouchableOpacity
                key={jogo.id}
                style={stylesIngressoModal.modalItem}
                onPress={() => {
                  setSelectedGame(jogo);
                  setModalVisible(false);
                }}
              >
                <Text style={stylesIngressoModal.modalItemText}>
                  {jogo.homeName} X {jogo.awayName}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={stylesIngressoModal.modalCancel}
              onPress={() => setModalVisible(false)}
            >
              <Text style={stylesIngressoModal.modalCancelText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL DE COMPRA BEM-SUCEDIDA */}
      <Modal
        visible={successModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <TouchableOpacity
          style={stylesIngressoModal.successModalOverlay}
          activeOpacity={1}
          onPress={() => setSuccessModalVisible(false)}
        >
          <View style={stylesIngressoModal.successModalContainer}>
            <Text style={stylesIngressoModal.successModalTitle}>Sucesso!</Text>
            <Text style={stylesIngressoModal.successModalSubtitle}>Compra realizada com sucesso!</Text>
            <TouchableOpacity
              style={stylesIngressoModal.successModalButton}
              onPress={() => setSuccessModalVisible(false)}
            >
              <Text style={stylesIngressoModal.successModalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* SELEÇÃO DE INGRESSO - Label da seção de ingressos */}
      <Text style={stylesIngresso.sectionLabel}>ESCOLHA O SEU INGRESSO:</Text>
    </View>
  );

  const handlePurchase = () => {
    const total = calculateTotal(selectedGame?.ingressos ?? [], quantities);
    if (total > 0) {
      setSuccessModalVisible(true);
    }
  };

  return (
    <View style={stylesIngresso.container}>
      <FlatList
        style={{ flex: 1, backgroundColor: '#FFFFFF' }}
        showsVerticalScrollIndicator={false}
        data={selectedGame?.ingressos ?? []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        renderItem={({ item }) => {
          const qtd = quantities[item.id] || 0;

          return (
            <View style={[stylesIngresso.ingressoCard, { mx: 16, marginHorizontal: 16 }]}>
              <View style={stylesIngresso.ingressoInfo}>
                <Text style={stylesIngresso.ingressoNome}>{item.nome}</Text>
                <Text style={stylesIngresso.ingressoLugar}>{item.lugar}</Text>
                <Text style={stylesIngresso.ingressoValor}>{item.valor}</Text>
              </View>

              <View style={stylesIngresso.stepperCompact}>
                <TouchableOpacity style={stylesIngresso.stepperButtonCompact} onPress={() => decrease(quantities, setQuantities, item.id)}>
                  <Ionicons name="remove" size={16} color="#ffffff" />
                </TouchableOpacity>
                <Text style={stylesIngresso.quantityTextCompact}>{qtd}</Text>
                <TouchableOpacity style={stylesIngresso.stepperButtonCompact} onPress={() => increase(quantities, setQuantities, item.id)}>
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
      <View style={stylesIngresso.buyContainer}>
        <TouchableOpacity style={stylesIngresso.buyButton} onPress={handlePurchase}>
          <Text style={stylesIngresso.buyButtonText}>
            COMPRAR INGRESSO - R$ {calculateTotal(selectedGame?.ingressos ?? [], quantities).toFixed(2).replace('.', ',')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}