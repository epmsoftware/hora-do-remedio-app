// MenuProfissional.js
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function MenuProfissional({ navigation, telaAtual, tema = 'claro' }) {
  const [aberto, setAberto] = useState(false);
  const larguraAnim = useRef(new Animated.Value(60)).current;

  const cores = {
    claro: { fundo: '#1e90ff', ativo: '#87cefa', texto: '#fff', submenu: '#63b8ff' },
    escuro: { fundo: '#0d3b66', ativo: '#1f78b4', texto: '#fff', submenu: '#166494' },
  };

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
        { nome: 'Paciente', icone: 'user-injured', tela: 'ListaPacientes' },
        { nome: 'Usuários', icone: 'user', tela: 'Usuarios' },
        { nome: 'Medicamentos', icone: 'capsules', tela: 'Medicamentos' },
      ],
    },
    { nome: 'Configurações', icone: 'cog', tela: 'Configuracoes' },
  ];

  const cor = cores[tema];

  return (
    <Animated.View style={[styles.menu, { width: larguraAnim, backgroundColor: cor.fundo }]}>
      {/* Botão abrir/fechar */}
      <TouchableOpacity onPress={toggleMenu} style={styles.toggle}>
        <MaterialIcons name={aberto ? 'arrow-back-ios' : 'menu'} size={24} color={cor.texto} />
      </TouchableOpacity>

      <ScrollView>
        {itens.map((item, index) => (
          <View key={index}>
            <TouchableOpacity
              style={[
                styles.item,
                telaAtual === item.tela && { backgroundColor: cor.ativo },
              ]}
              onPress={() => item.submenu ? null : navigation.navigate(item.tela)}
            >
              <FontAwesome5 name={item.icone} size={20} color={cor.texto} />
              {aberto && <Text style={styles.texto}>{item.nome}</Text>}
            </TouchableOpacity>

            {item.submenu && aberto && (
              <View style={styles.submenu}>
                {item.submenu.map((sub, subIndex) => (
                  <TouchableOpacity
                    key={subIndex}
                    style={[
                      styles.itemSubmenu,
                      telaAtual === sub.tela && { backgroundColor: cor.submenu },
                    ]}
                    onPress={() => navigation.navigate(sub.tela)}
                  >
                    <FontAwesome5 name={sub.icone} size={16} color={cor.texto} />
                    <Text style={styles.textoSubmenu}>{sub.nome}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    paddingTop: 50,
    zIndex: 10,
  },
  toggle: { padding: 10, marginBottom: 20, alignItems: 'center' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 8, marginVertical: 3, marginHorizontal: 5 },
  texto: { color: '#fff', fontSize: 16, marginLeft: 15 },
  submenu: { paddingLeft: 25 },
  itemSubmenu: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderRadius: 5, marginVertical: 2 },
  textoSubmenu: { color: '#fff', fontSize: 14, marginLeft: 10 },
});