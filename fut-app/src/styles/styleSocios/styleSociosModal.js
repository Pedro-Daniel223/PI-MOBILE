import { StyleSheet } from "react-native";

 export const styleSocioModal = StyleSheet.create({
  // ═══════════ Estilos do Modal ═══════════
  modal:{

  },
  
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

  // Cartão imagem dentro do modal
  modalCardImage: {
    width: '80%',
    margin: 'auto',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#b30000',
    borderRadius: 12,
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