import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  Switch,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function ListaMedicamentos({ navigation, route }) {
  const [medicamentos, setMedicamentos] = useState([]);
  const pacienteId = route.params?.pacienteId || null;
  const insets = useSafeAreaInsets();

  const carregarMedicamentos = async () => {
    try {
      const dados = await AsyncStorage.getItem("medicamentos");
      const usuarioLogado = await AsyncStorage.getItem("usuarioLogado");
      const usuario = usuarioLogado ? JSON.parse(usuarioLogado) : null;

      if (dados && usuario) {
        const listaCompleta = JSON.parse(dados);
        const listaFiltrada = listaCompleta.filter(
          m => m.usuario === usuario.uid && m.pacienteId === pacienteId
        );
        setMedicamentos(listaFiltrada);
      } else {
        setMedicamentos([]);
      }
    } catch (err) {
      console.log("Erro ao carregar medicamentos:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", carregarMedicamentos);
    return unsubscribe;
  }, [navigation]);

  const excluirMedicamento = async (id) => {
    const isWeb = Platform.OS === "web";
    const confirm = isWeb
      ? window.confirm("Deseja realmente excluir este medicamento?")
      : await new Promise(resolve =>
          Alert.alert("Confirmar exclusão", "Deseja realmente excluir este medicamento?", [
            { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
            { text: "Excluir", style: "destructive", onPress: () => resolve(true) },
          ])
        );

    if (!confirm) return;

    try {
      const dados = await AsyncStorage.getItem("medicamentos");
      const lista = dados ? JSON.parse(dados) : [];
      const listaAtualizada = lista.filter(m => m.id !== id);
      await AsyncStorage.setItem("medicamentos", JSON.stringify(listaAtualizada));
      carregarMedicamentos();
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível excluir o medicamento!");
    }
  };

  const toggleAlerta = async (id) => {
    try {
      const listaAtualizada = medicamentos.map(m =>
        m.id === id ? { ...m, alertaAtivo: !m.alertaAtivo } : m
      );
      await AsyncStorage.setItem("medicamentos", JSON.stringify(listaAtualizada));
      setMedicamentos(listaAtualizada);
    } catch (err) {
      console.log(err);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text>Dosagem: {item.dosagem}</Text>
        <Text>Frequência: {item.frequencia}h</Text>
        <Text>Quantidade: {item.quantidade}</Text>
        {item.horarios ? <Text>Horários: {item.horarios}</Text> : null}
        {item.validade ? <Text>Validade: {item.validade}</Text> : null}
        {item.descricao ? <Text>Descrição: {item.descricao}</Text> : null}
      </View>
      <View style={styles.acoes}>
        <Switch value={item.alertaAtivo} onValueChange={() => toggleAlerta(item.id)} />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#1e90ff", marginBottom: 5 }]}
          onPress={() => navigation.navigate("CadastroMedicamento", { medicamento: item, pacienteId })}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "red" }]}
          onPress={() => excluirMedicamento(item.id)}
        >
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {medicamentos.length === 0 ? (
        <Text style={styles.msg}>Nenhum medicamento cadastrado.</Text>
      ) : (
        <FlatList
          data={medicamentos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
        />
      )}

      <View style={[styles.bottomButtons, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: "#1e90ff" }]}
          onPress={() => navigation.navigate("CadastroMedicamento", { pacienteId })}
        >
          <Text style={styles.navButtonText}>Novo Medicamento</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: "#808080" }]}
          onPress={() => navigation.navigate("ListaPacientes")}
        >
          <Text style={styles.navButtonText}>Voltar Pacientes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(0,0,0,0.2)" }
      : { elevation: 3 }),
  },
  nome: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  acoes: { justifyContent: "center", alignItems: "center", marginLeft: 10 },
  button: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "bold" },
  msg: { textAlign: "center", fontSize: 18, marginTop: 20, color: "#555" },
  bottomButtons: {
    position: "absolute",
    bottom: 0,
    left: 10,
    right: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  navButtonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});