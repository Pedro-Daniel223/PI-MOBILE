import React, { useRef, useEffect } from 'react';
import {
  View,
  Animated,
  PanResponder,
} from 'react-native';

const ITEM_WIDTH = 280;
const AUTO_SPEED = 0.3;

export default function InfiniteProductCarousel({ data, renderItem }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const currentOffset = useRef(0);

  const animationRef = useRef(null);
  const timeoutRef = useRef(null);

  const isDragging = useRef(false);

  const loopData = [...data, ...data, ...data];

  // 🔥 ANIMAÇÃO
  const startAutoScroll = () => {
    const animate = () => {
      if (isDragging.current) return;

      currentOffset.current -= AUTO_SPEED;

      const maxWidth = data.length * ITEM_WIDTH;
      const resetPoint = -maxWidth;

      if (Math.abs(currentOffset.current) >= maxWidth * 2) {
        currentOffset.current = resetPoint;
      }

      translateX.setValue(currentOffset.current);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const stopAutoScroll = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // ⏳ delay inteligente
  const scheduleResume = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (!isDragging.current) {
        startAutoScroll();
      }
    }, 1000); // 👈 4 segundos (pode mudar pra 5000)
  };

  useEffect(() => {
    startAutoScroll();

    return () => {
      stopAutoScroll();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // 🖐️ TOQUE
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        isDragging.current = true;

        stopAutoScroll();

        // cancela qualquer retorno automático
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      },

      onPanResponderMove: (_, gesture) => {
        const newOffset = currentOffset.current + gesture.dx;
        translateX.setValue(newOffset);
      },

      onPanResponderRelease: (_, gesture) => {
        currentOffset.current += gesture.dx;

        isDragging.current = false;

        // 👇 só volta depois de um tempo
        scheduleResume();
      },
    })
  ).current;

  return (
    <View style={{ overflow: 'hidden' }} {...panResponder.panHandlers}>
      <Animated.View
        style={{
          flexDirection: 'row',
          transform: [{ translateX }],
        }}
      >
        {loopData.map((item, index) => (
          <View key={index} style={{ width: ITEM_WIDTH }}>
            {renderItem({ item })}
          </View>
        ))}
      </Animated.View>
    </View>
  );
}