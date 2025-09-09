// Menu.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function Menu({ navigation }) {
  const [aberto, setAberto] = useState(false);
  const largura = aberto ? 200 : 60;

  const itens = [
    { nome: 'Dashboard', icone: 'home', tela: 'Dashboard' },
    { nome: 'Cadastros', icone: 'user', tela: 'Cadastros' },
    { nome: 'Configurações', icone: 'cog', tela: 'Configuracoes' },
  ];

  return (
    <Animated.View style={[styles.menu, { width: largura }]}>
      {/* Botão para abrir/fechar */}
      <TouchableOpacity onPress={() => setAberto(!aberto)} style={styles.toggle}>
        <MaterialIcons name={aberto ? 'arrow-back-ios' : 'menu'} size={24} color="#fff" />
      </TouchableOpacity>

      {/* Itens do menu */}
      {itens.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.item}
          onPress={() => navigation.navigate(item.tela)}
        >
          <FontAwesome5 name={item.icone} size={20} color="#fff" />
          {aberto && <Text style={styles.texto}>{item.nome}</Text>}
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#1e90ff',
    paddingTop: 50,
    zIndex: 10,
  },
  toggle: {
    padding: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  texto: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 15,
  },
});