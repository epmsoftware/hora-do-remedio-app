import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ListaPacientes({ navigation }) {
  const [pacientes, setPacientes] = useState([]);
  const insets = useSafeAreaInsets(); // pega os insets da tela

  const carregarPacientes = async () => {
    try {
      const dados = await AsyncStorage.getItem('pacientes');
      const usuarioLogado = await AsyncStorage.getItem('usuarioLogado');
      const usuario = usuarioLogado ? JSON.parse(usuarioLogado) : null;

      if (dados) {
        const listaCompleta = JSON.parse(dados);
        const listaFiltrada = usuario
          ? listaCompleta.filter(p => p.usuario === usuario.usuario)
          : listaCompleta;
        setPacientes(listaFiltrada);
      } else {
        setPacientes([]);
      }
    } catch (err) {
      console.log('Erro ao carregar pacientes:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarPacientes);
    return unsubscribe;
  }, [navigation]);

  const excluirPaciente = async (id) => {
    const isWeb = Platform.OS === 'web';
    const confirm = isWeb
      ? window.confirm('Deseja realmente excluir este paciente?')
      : await new Promise(resolve =>
          Alert.alert(
            'Confirmar exclusão',
            'Deseja realmente excluir este paciente?',
            [
              { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Excluir', style: 'destructive', onPress: () => resolve(true) },
            ]
          )
        );

    if (!confirm) return;

    try {
      const dadosPacientes = await AsyncStorage.getItem('pacientes');
      const lista = dadosPacientes ? JSON.parse(dadosPacientes) : [];
      const listaAtualizada = lista.filter(p => p.id !== id);
      await AsyncStorage.setItem('pacientes', JSON.stringify(listaAtualizada));
      carregarPacientes();
    } catch (err) {
      console.log(err);
      if (isWeb) alert('Erro ao excluir paciente!');
      else Alert.alert('Erro', 'Erro ao excluir paciente!');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text>Idade: {item.idade} anos</Text>
        <Text>Peso: {item.peso} kg | Altura: {item.altura} m</Text>
        {item.email ? <Text>Email: {item.email}</Text> : null}
        {item.telefone ? <Text>Telefone: {item.telefone}</Text> : null}
        {item.descricao ? <Text>Descrição: {item.descricao}</Text> : null}
      </View>
      <View style={styles.acoes}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#1e90ff', marginBottom: 5 }]}
          onPress={() => navigation.navigate('CadastroPaciente', { paciente: item })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red' }]}
          onPress={() => excluirPaciente(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {pacientes.length === 0 ? (
        <Text style={styles.msg}>Nenhum paciente cadastrado.</Text>
      ) : (
        <FlatList
          data={pacientes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: insets.bottom + 140 }} // garante espaço seguro
        />
      )}

      {/* BOTÕES FIXOS NA PARTE INFERIOR */}
      <View style={[styles.bottomButtons, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: '#1e90ff' }]}
          onPress={() => navigation.navigate('CadastroPaciente')}
        >
          <Text style={styles.navButtonText}>Novo Paciente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: '#808080' }]}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.navButtonText}>Voltar ao Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 4px rgba(0,0,0,0.2)' }
      : { elevation: 3 }),
  },
  nome: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  acoes: { justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  button: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  msg: { textAlign: 'center', fontSize: 18, marginTop: 20, color: '#555' },

  bottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButton: { 
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  navButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});