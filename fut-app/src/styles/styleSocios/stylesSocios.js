import { StyleSheet } from "react-native";

 export const stylesSocio = StyleSheet.create({
  // ─────── Layout principal ───────
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 100, // Espaço para o NavbarGlass
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
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
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
    fontSize: 30,
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
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 0.3,
  },

  planDescription: {
    fontSize: 16,   
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.5,
  },

  // ─────── Lado direito do card: imagem do cartão ───────
  cardRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Imagem do cartão de plano)
  cardPlanImage: {
    width: 100,
    height: 69,
    borderWidth: 1,
    borderColor: 'rgb(255, 255, 255)',
    borderRadius: 8,
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
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 18,
  },
 });
