import React, { UseState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const SociosScreen = () => {
    const [PlanosPrataExpanded, setPlanosPrataExpanded] = UseState(false);

    const beneficiosPrata = [
        '5% de desconto em produtos oficiais',
        '10% de desconto em ingressos para jogos em casa',
        'Acesso antencipado a notícias e conteúdos exclusivos',
    ];
    