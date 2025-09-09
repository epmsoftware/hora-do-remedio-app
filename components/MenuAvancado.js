// MenuAvancado.js
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function MenuAvancado({ navigation }) {
  const [aberto, setAberto] = useState(false);
  const larguraAnim = useRef(new Animated.Value(60)).current;

  const toggleMenu = () => {
    Animated.timing(larguraAnim, {
      toValue: aberto ? 60 : 220,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setAberto(!aberto);
  };

  const itens = [
    { nome: 'Dashboard', icone: 'home', tela: 'Dashboard' },
    {
      nome: 'Cadastros',
      icone: 'folder',
      submenu: [
        { nome: 'Usuários', icone: 'user', tela: 'Usuarios' },
        { nome: 'Medicamentos', icone: 'capsules', tela: 'Medicamentos' },
        { nome: 'Histórico', icone: 'history', tela: 'Historico' },
      ],
    },
    { nome: 'Configurações', icone: 'cog', tela: 'Configuracoes' },
  ];

  return (
    <Animated.View style={[styles.menu, { width: larguraAnim }]}>
      {/* Botão abrir/fechar */}
      <TouchableOpacity onPress={toggleMenu} style={styles.toggle}>
        <MaterialIcons name={aberto ? 'arrow-back-ios' : 'menu'} size={24} color="#fff" />
      </TouchableOpacity>

      {/* Itens do menu */}
      {itens.map((item, index) => (
        <View key={index}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => item.submenu ? null : navigation.navigate(item.tela)}
          >
            <FontAwesome5 name={item.icone} size={20} color="#fff" />
            {aberto && <Text style={styles.texto}>{item.nome}</Text>}
          </TouchableOpacity>

          {/* Submenu se existir */}
          {item.submenu && aberto && (
            <View style={styles.submenu}>
              {item.submenu.map((sub, subIndex) => (
                <TouchableOpacity
                  key={subIndex}
                  style={styles.itemSubmenu}
                  onPress={() => navigation.navigate(sub.tela)}
                >
                  <FontAwesome5 name={sub.icone} size={16} color="#fff" />
                  <Text style={styles.textoSubmenu}>{sub.nome}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
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
  toggle: { padding: 10, marginBottom: 20, alignItems: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 15 },
  texto: { color: '#fff', fontSize: 16, marginLeft: 15 },
  submenu: { paddingLeft: 30 },
  itemSubmenu: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  textoSubmenu: { color: '#fff', fontSize: 14, marginLeft: 10 },
});