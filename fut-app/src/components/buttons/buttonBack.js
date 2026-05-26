import { TouchableOpacity } from 'react';
import { stylesSocio } from '../../styles/styleSocios/stylesSocios';
import { Ionicons } from '@expo/vector-icons';

{/* Botão voltar */}
export function btnBack({ onPress }) {
    return (
      <TouchableOpacity
      style={stylesSocio.backButton}
      onPress={onPress}>
        <Ionicons name="arrow-back" size={20} color="#000" />
      </TouchableOpacity>
    );
}