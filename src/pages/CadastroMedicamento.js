import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";

export default function CadastroMedicamento({ navigation, route }) {
  const [medicamentos, setMedicamentos] = useState([]);
  const [nome, setNome] = useState("");
  const [validade, setValidade] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [frequencia, setFrequencia] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [horarios, setHorarios] = useState("");
  const [descricao, setDescricao] = useState("");
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const pacienteId = route?.params?.pacienteId || null; // vincular ao paciente
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const usuario = await AsyncStorage.getItem("usuarioLogado");
        if (usuario) setUsuarioLogado(JSON.parse(usuario));

        const dados = await AsyncStorage.getItem("medicamentos");
        const lista = dados ? JSON.parse(dados) : [];
        setMedicamentos(lista);

        if (route?.params?.medicamento) {
          const m = route.params.medicamento;
          setNome(m.nome);
          setValidade(m.validade);
          setQuantidade(m.quantidade);
          setFrequencia(m.frequencia);
          setDosagem(m.dosagem);
          setHorarios(m.horarios);
          setDescricao(m.descricao);
        }
      } catch (err) {
        console.log("Erro ao carregar medicamentos:", err);
      }
    };
    carregarDados();
  }, [route?.params?.medicamento]);

  const showAlert = (titulo, mensagem) => {
    if (Platform.OS === "web") alert(`${titulo}\n\n${mensagem}`);
    else Alert.alert(titulo, mensagem);
  };

  const handleSalvar = async () => {
    if (!nome || !quantidade || !frequencia || !dosagem) {
      showAlert("Atenção", "Preencha todos os campos obrigatórios!");
      return;
    }
    if (!usuarioLogado || !pacienteId) {
      showAlert("Erro", "Usuário ou paciente não definido!");
      return;
    }

    const novoMedicamento = {
      id: route?.params?.medicamento?.id || Date.now().toString(),
      nome,
      validade,
      quantidade,
      frequencia,
      dosagem,
      horarios,
      descricao,
      usuario: usuarioLogado.uid,
      pacienteId,
      alertaAtivo: true, // padrão ativo
    };

    const listaAtualizada = medicamentos.filter(m => m.id !== novoMedicamento.id);
    listaAtualizada.push(novoMedicamento);

    try {
      await AsyncStorage.setItem("medicamentos", JSON.stringify(listaAtualizada));
      setMedicamentos(listaAtualizada);
      showAlert("Sucesso", "Medicamento salvo com sucesso!");

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "ListaMedicamentos", params: { pacienteId } }],
        })
      );
    } catch (err) {
      console.log("Erro ao salvar medicamento:", err);
      showAlert("Erro", "Não foi possível salvar o medicamento.");
    }
  };

  const handleVoltar = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "ListaMedicamentos", params: { pacienteId } }],
      })
    );
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: insets.bottom + 20 },
      ]}
    >
      <Text style={styles.title}>Cadastro de Medicamento</Text>

      <TextInput placeholder="Nome *" style={styles.input} value={nome} onChangeText={setNome} />
      <TextInput placeholder="Validade" style={styles.input} value={validade} onChangeText={setValidade} />
      <TextInput placeholder="Quantidade *" style={styles.input} value={quantidade} onChangeText={setQuantidade} keyboardType="numeric" />
      <TextInput placeholder="Frequência (em horas) *" style={styles.input} value={frequencia} onChangeText={setFrequencia} keyboardType="numeric" />
      <TextInput placeholder="Dosagem *" style={styles.input} value={dosagem} onChangeText={setDosagem} />
      <TextInput placeholder="Horários (ex: 08:00, 14:00, 20:00)" style={styles.input} value={horarios} onChangeText={setHorarios} />
      <TextInput placeholder="Descrição" style={[styles.input, { height: 80 }]} value={descricao} onChangeText={setDescricao} multiline />

      <TouchableOpacity style={styles.button} onPress={handleSalvar}>
        <Text style={styles.buttonText}>Salvar Medicamento</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.backButton]} onPress={handleVoltar}>
        <Text style={styles.buttonText}>Voltar para Lista</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f2f2f2", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", padding: 12, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, marginBottom: 15, backgroundColor: "#fff" },
  button: { backgroundColor: "#1e90ff", paddingVertical: 12, paddingHorizontal: 15, borderRadius: 25, marginTop: 10, width: "100%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  backButton: { backgroundColor: "#808080" },
});