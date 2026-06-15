import { Dimensions } from 'react-native';
import { DS } from './rootLoja';

// Dimensões da tela para cálculos responsivos

// Exporta largura e altura da tela, além de alturas específicas para o hero e banner de campanha
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

// Altura do hero é 108% da largura para manter proporção cinematográfica
export const HERO_HEIGHT = SCREEN_WIDTH * 1.08;

// Dimensões dos banners de campanha, com largura total menos margens e altura fixa para um visual impactante
export const CAMPAIGN_HEIGHT = 160;
export const CAMPAIGN_WIDTH  = SCREEN_WIDTH - DS.spacing.lg * 2;

// Dimensões dos cards de produto, mantendo proporção de 1.52 para um visual elegante
export const CARD_WIDTH = (SCREEN_WIDTH - DS.spacing.lg * 2 - 12) / 2;
export const CARD_HEIGHT = CARD_WIDTH * 1.52;
