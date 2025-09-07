import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function NovoMedicamento({ navigation }) {
  const [nome, setNome] = useState('');
  const [horario, setHorario] = useState('');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      const dados = await AsyncStorage.getItem('usuarioLogado');
      if (dados) setUsuario(JSON.parse(dados));
    };
    carregarUsuario();
  }, []);

  const handleSalvar = async () => {
    if (!nome || !horario) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    try {
      const dados = await AsyncStorage.getItem('medicamentos');
      const todosMedicamentos = dados ? JSON.parse(dados) : {};
      const userId = usuario.usuario;

      if (!todosMedicamentos[userId]) todosMedicamentos[userId] = [];

      const novoMedicamento = {
        id: todosMedicamentos[userId].length + 1,
        nome,
        horario
      };

      todosMedicamentos[userId].push(novoMedicamento);

      await AsyncStorage.setItem('medicamentos', JSON.stringify(todosMedicamentos));

      Alert.alert('Sucesso', 'Medicamento cadastrado!');
      setNome('');
      setHorario('');
      navigation.goBack();

    } catch (err) {
      console.log('Erro ao salvar medicamento:', err);
      Alert.alert('Erro', 'Não foi possível salvar o medicamento.');
    }
  };

  if (!usuario) return <Text>Carregando usuário...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Medicamento</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do medicamento"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Horário (ex: 08:00)"
        value={horario}
        onChangeText={setHorario}
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#aaa', padding: 10, marginBottom: 15, borderRadius: 8 },
  button: { backgroundColor: '#1e90ff', padding: 12, borderRadius: 25, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' }
});