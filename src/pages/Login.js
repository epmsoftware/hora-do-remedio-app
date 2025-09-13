import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default function LoginCadastro({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [usuariosExistem, setUsuariosExistem] = useState(true); // assume login primeiro

  const showAlert = (titulo, mensagem) => {
    if (Platform.OS === "web") alert(`${titulo}\n\n${mensagem}`);
    else Alert.alert(titulo, mensagem);
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      showAlert("Atenção", "Preencha todos os campos!");
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);
      const user = cred.user;

      // salva usuário logado localmente
      await AsyncStorage.setItem("usuarioLogado", JSON.stringify(user));

      setEmail("");
      setSenha("");
      showAlert("Sucesso", `Bem-vindo, ${user.email}!`);

      navigation.replace("Dashboard");
    } catch (err) {
      console.log("Erro no login:", err);
      showAlert("Erro", "Usuário ou senha inválidos!");
    }
  };

  const handleCadastro = async () => {
    if (!email || !senha) {
      showAlert("Atenção", "Preencha todos os campos!");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);
      const user = cred.user;

      // salva no AsyncStorage também
      await AsyncStorage.setItem("usuarioLogado", JSON.stringify(user));

      showAlert("Sucesso", "Usuário cadastrado com sucesso!");

      setEmail("");
      setSenha("");

      // vai para o Dashboard direto
      navigation.replace("Dashboard");
    } catch (err) {
      console.log("Erro ao cadastrar:", err);
      showAlert("Erro", err.message);
    }
  };

  const alternarModo = () => setUsuariosExistem(!usuariosExistem);

  return (
    <ImageBackground
      source={require("../../assets/fundo-form.webp")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <Text style={styles.title}>{usuariosExistem ? "Login" : "Cadastro"}</Text>

        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaa"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={usuariosExistem ? handleLogin : handleCadastro}
        >
          <Text style={styles.buttonText}>
            {usuariosExistem ? "Entrar" : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={alternarModo}>
          <Text style={styles.link}>
            {usuariosExistem
              ? "Não possui conta? Cadastre-se"
              : "Já possui conta? Faça login"}
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    width: "100%", 
    height: "100%" 
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    pointerEvents: "none",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    color: "#fff", 
    marginBottom: 20 
  },
  input: {
    width: "100%",
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600" 
  },
  link: { 
    color: "#fff", 
    marginTop: 15, 
    textDecorationLine: "underline" 
  },
});