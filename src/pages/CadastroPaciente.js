import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CadastroPaciente({ navigation, route }) {
  const [pacientes, setPacientes] = useState([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [descricao, setDescricao] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const usuario = await AsyncStorage.getItem('usuarioLogado');
        if (usuario) setUsuarioLogado(JSON.parse(usuario));

        const dados = await AsyncStorage.getItem('pacientes');
        const lista = dados ? JSON.parse(dados) : [];
        setPacientes(lista);

        if (route?.params?.paciente) {
          const p = route.params.paciente;
          setNome(p.nome);
          setIdade(p.idade);
          setPeso(p.peso);
          setAltura(p.altura);
          setEmail(p.email);
          setTelefone(p.telefone);
          setDescricao(p.descricao);
        }
      } catch (err) {
        console.log('Erro ao carregar dados:', err);
      }
    };
    carregarDados();
  }, [route?.params?.paciente]);

  const showAlert = (titulo, mensagem) => {
    if (Platform.OS === 'web') alert(`${titulo}\n\n${mensagem}`);
    else Alert.alert(titulo, mensagem);
  };

  const handleSalvar = async () => {
    if (!nome || !idade || !peso || !altura) {
      showAlert('Atenção', 'Preencha todos os campos obrigatórios!');
      return;
    }

    if (!usuarioLogado) {
      showAlert('Erro', 'Usuário não logado!');
      return;
    }

    const novoPaciente = {
      id: route?.params?.paciente?.id || Date.now().toString(),
      nome,
      idade,
      peso,
      altura,
      email,
      telefone,
      descricao,
      usuario: usuarioLogado.usuario,
    };

    const listaAtualizada = pacientes.filter(p => p.id !== novoPaciente.id);
    listaAtualizada.push(novoPaciente);

    try {
      await AsyncStorage.setItem('pacientes', JSON.stringify(listaAtualizada));
      setPacientes(listaAtualizada);

      showAlert('Sucesso', 'Paciente salvo com sucesso!');
      navigation.goBack();
    } catch (err) {
      console.log('Erro ao salvar paciente:', err);
      showAlert('Erro', 'Não foi possível salvar o paciente.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Paciente</Text>

      <TextInput
        placeholder="Nome completo *"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        placeholder="Idade *"
        style={styles.input}
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Peso (kg) *"
        style={styles.input}
        value={peso}
        onChangeText={setPeso}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Altura (m) *"
        style={styles.input}
        value={altura}
        onChangeText={setAltura}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="E-mail"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Telefone"
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Descrição"
        style={[styles.input, { height: 80 }]}
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar Paciente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.backButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Voltar para Lista</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f2f2f2', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  backButton: {
    backgroundColor: '#808080', // cinza para diferenciar
  },
});