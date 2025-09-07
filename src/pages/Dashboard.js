import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const dados = await AsyncStorage.getItem('usuarioLogado');
        if (dados) setUsuario(JSON.parse(dados));
      } catch (err) {
        console.log('Erro ao carregar usuário:', err);
      }
    };

    const unsubscribe = navigation.addListener('focus', carregarUsuario);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('usuarioLogado');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {usuario ? (
        <>
          <Text style={styles.title}>Bem-vindo, {usuario.usuario}!</Text>
          <Text style={styles.info}>Aqui você verá apenas seus dados.</Text>
        </>
      ) : (
        <Text style={styles.title}>Carregando usuário...</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: '#1e90ff', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});