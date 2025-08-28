import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';

export default function App() {
  return (
    <ImageBackground 
      source={require('./assets/fundo-form.webp')}
      style={styles.background}
      resizeMode='cover'
    >
    <View style={styles.container}>
      <Text style={styles.title}>Hora do Remédio</Text>
      <Text style={styles.subtitle}>Gestão, Controle, Meio Ambiente!</Text>
      <StatusBar style="auto" />
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#eee',
    textAlign: 'center',
  },
});