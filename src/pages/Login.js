import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginCadastro({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usuariosExistem, setUsuariosExistem] = useState(false);

  const showAlert = (titulo, mensagem) => {
    if (Platform.OS === 'web') alert(`${titulo}\n\n${mensagem}`);
    else Alert.alert(titulo, mensagem);
  };

  // Verifica se há usuários cadastrados ao montar ou voltar para a tela
  useEffect(() => {
    const verificarUsuarios = async () => {
      try {
        const dados = await AsyncStorage.getItem('usuarios');
        setUsuariosExistem(dados ? JSON.parse(dados).length > 0 : false);
      } catch (err) {
        console.log('Erro ao verificar usuários:', err);
      }
    };
    const unsubscribe = navigation.addListener('focus', verificarUsuarios);
    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    if (!username || !password) {
      showAlert('Atenção', 'Preencha todos os campos!');
      return;
    }

    try {
      const dados = await AsyncStorage.getItem('usuarios');

      if (!dados) {
        showAlert('Atenção', 'Nenhum usuário cadastrado!');
        setUsuariosExistem(false);
        return;
      }

      const usuarios = JSON.parse(dados);
      const usuarioValido = usuarios.find(u => u.usuario === username && u.senha === password);

      if (usuarioValido) {
        // Salva usuário logado
        await AsyncStorage.setItem('usuarioLogado', JSON.stringify(usuarioValido));
        setUsername('');
        setPassword('');
        showAlert('Sucesso', `Bem-vindo, ${usuarioValido.usuario}!`);

        // Vai para o Dashboard
        navigation.replace('Dashboard');
      } else {
        showAlert('Erro', 'Usuário ou senha inválidos!');
      }
    } catch (err) {
      console.log('Erro no login:', err);
      showAlert('Erro', 'Ocorreu um problema no login.');
    }
  };

  const handleCadastro = async () => {
    if (!username || !password) {
      showAlert('Atenção', 'Preencha todos os campos!');
      return;
    }

    try {
      const dados = await AsyncStorage.getItem('usuarios');
      const usuarios = dados ? JSON.parse(dados) : [];

      if (usuarios.find(u => u.usuario === username)) {
        showAlert('Erro', 'Usuário já existe!');
        return;
      }

      usuarios.push({ usuario: username, senha: password });
      await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));

      showAlert('Sucesso', 'Usuário cadastrado com sucesso!');

      // Limpa campos
      setUsername('');
      setPassword('');

      // Ativa modo login automaticamente
      setUsuariosExistem(true);
    } catch (err) {
      console.log('Erro ao cadastrar usuário:', err);
      showAlert('Erro', 'Não foi possível cadastrar usuário.');
    }
  };

  // Alterna entre login e cadastro manualmente
  const alternarModo = () => setUsuariosExistem(!usuariosExistem);

  return (
    <ImageBackground
      source={require('../../assets/fundo-form.webp')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>{usuariosExistem ? 'Login' : 'Cadastro'}</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuário"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={usuariosExistem ? handleLogin : handleCadastro}
        >
          <Text style={styles.buttonText}>{usuariosExistem ? 'Entrar' : 'Cadastrar'}</Text>
        </TouchableOpacity>

        {/* Link para alternar entre login e cadastro */}
        <TouchableOpacity onPress={alternarModo}>
          <Text style={styles.link}>
            {usuariosExistem ? 'Não possui conta? Cadastre-se' : 'Já possui conta? Faça login'}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', pointerEvents: 'none' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#1e90ff', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  link: { color: '#fff', marginTop: 15, textDecorationLine: 'underline' },
});