import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function TelaInicial({ navigation }) {
  return (
    <ImageBackground 
      source={require('../../assets/fundo-form.webp')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>Hora do Remédio</Text>
        <Text style={styles.subtitle}>Gestão, Controle, Meio Ambiente!</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Ir para Login</Text>
        </TouchableOpacity>

        <StatusBar style="light" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    width: '100%', 
    height: '100%' 
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 20 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 18, 
    fontWeight: '300', 
    color: '#eee', 
    marginBottom: 30, 
    textAlign: 'center' 
  },
  button: { 
    backgroundColor: '#1e90ff', 
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 25 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600' 
  },
});