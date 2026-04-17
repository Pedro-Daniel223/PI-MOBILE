import React, { useRef, useEffect } from 'react';
import { Animated, View, Dimensions } from 'react-native';

const ITEM_WIDTH = 280;
const SPEED = 0.5; // ajuste velocidade

export default function InfiniteProductCarousel({ data, renderItem }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const offset = useRef(0);
  const listRef = useRef(null);

  useEffect(() => {
    let animationId;

    const animate = () => {
      offset.current += SPEED;

      // loop infinito suave
      const maxOffset = data.length * ITEM_WIDTH;

      if (offset.current >= maxOffset) {
        offset.current = 0;
      }

      listRef.current?.scrollToOffset({
        offset: offset.current,
        animated: false, // IMPORTANTE
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [data]);

  return (
    <Animated.FlatList
      ref={listRef}
      data={data}
      horizontal
      keyExtractor={(_, i) => i.toString()}
      renderItem={renderItem}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false} // trava interação pra não quebrar fluidez
      getItemLayout={(_, index) => ({
        length: ITEM_WIDTH,
        offset: ITEM_WIDTH * index,
        index,
      })}
      contentContainerStyle={{
        paddingHorizontal: 10,
      }}
    />
  );
}