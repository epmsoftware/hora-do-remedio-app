import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";

export default function Dashboard({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const slideAnim = useRef(new Animated.Value(-200)).current;

  const insets = useSafeAreaInsets();
  const STATUS_BAR_HEIGHT =
    Platform.OS === "android" ? StatusBar.currentHeight : insets.top;

  useEffect(() => {
    const carregarUsuario = async () => {
      const dados = await AsyncStorage.getItem("usuarioLogado");
      if (dados) setUsuario(JSON.parse(dados));
      else redirectLogin(); // força voltar para Login se não logado
    };
    const unsubscribe = navigation.addListener("focus", carregarUsuario);
    return unsubscribe;
  }, [navigation]);

  const redirectLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "TelaInicial" }],
      })
    );
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("usuarioLogado");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "TelaInicial" }],
      })
    );
  };

  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
    Animated.timing(slideAnim, {
      toValue: menuAberto ? -200 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* CABEÇALHO FIXO ABAIXO DA STATUS BAR */}
      <View style={[styles.header, { paddingTop: STATUS_BAR_HEIGHT }]}>
        <TouchableOpacity onPress={toggleMenu} style={styles.barsButton}>
          <Icon name="bars" size={24} color="#1e90ff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hora do Remédio</Text>
      </View>

      {/* MENU LATERAL RETRÁTIL ABAIXO DO CABEÇALHO */}
      <Animated.View
        style={[
          styles.menu,
          {
            top: STATUS_BAR_HEIGHT + 60,
            left: slideAnim,
            paddingBottom: insets.bottom + 10, // respeita barra inferior
          },
        ]}
      >
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            if (menuAberto) toggleMenu(); // fecha o menu
            navigation.navigate("Dashboard"); // vai para dashboard
          }}
        >
          <Icon name="home" size={18} color="#fff" />
          <Text style={styles.menuText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => {
            if (menuAberto) toggleMenu(); // fecha o menu
            navigation.navigate("ListaPacientes"); // vai para dashboard
          }}
        >
          <Icon name="user" size={18} color="#fff" />
          <Text style={styles.menuText}>Pacientes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => alert("Em breve...")}
        >
          <Icon name="users" size={18} color="#fff" />
          <Text style={styles.menuText}>Usuários</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => alert("Em breve...")}
        >
          <Icon name="cog" size={18} color="#fff" />
          <Text style={styles.menuText}>Configurações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Icon name="sign-out-alt" size={18} color="red" />
          <Text style={[styles.menuText, { color: "red" }]}>Sair</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* CONTEÚDO PRINCIPAL */}
      <View
        style={[
          styles.conteudo,
          { marginTop: STATUS_BAR_HEIGHT + 60, paddingBottom: insets.bottom },
        ]}
      >
        {usuario ? (
          <>
            <Text style={styles.title}>Bem-vindo, {usuario.usuario}!</Text>
            <Text style={styles.info}>Aqui você verá apenas seus dados.</Text>
          </>
        ) : (
          <Text style={styles.title}>Carregando usuário...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },

  header: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 5,
    zIndex: 10,
  },
  barsButton: { marginRight: 15 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1e90ff" },

  menu: {
    position: "absolute",
    width: 200,
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    zIndex: 9,
    borderRadius: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  menuText: { fontSize: 16, color: "#fff", fontWeight: "600", marginLeft: 8 },

  conteudo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  info: { fontSize: 16, marginBottom: 20 },
});