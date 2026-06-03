import { useState, useEffect } from 'react';
import { Dimensions, PixelRatio } from 'react-native';

export function getFontScale() {
  return PixelRatio.getFontScale(); // ou Dimensions.get('window').fontScale
}

export function scaleFont(size, fontScale = getFontScale(), baseWidth = 375) {
  const { width } = Dimensions.get('window');
  const scaleFactor = width / baseWidth; // adapta por largura de tela
  const scaled = Math.round(size * scaleFactor * fontScale);
  // opcional: limitar para evitar fontes gigantes ou minúsculas
  const min = Math.round(size * 0.85);
  const max = Math.round(size * 1.8);
  return Math.min(max, Math.max(min, scaled));
}

// Hook reativo (atualiza quando dimensões mudam)
export function useFontScale() {
  const [fontScale, setFontScale] = useState(getFontScale());
  useEffect(() => {
    const onChange = () => setFontScale(getFontScale());
    const sub = Dimensions.addEventListener?.('change', onChange);
    return () => {
      if (sub && sub.remove) sub.remove();
      else Dimensions.removeEventListener?.('change', onChange);
    };
  }, []);
  return fontScale;
}