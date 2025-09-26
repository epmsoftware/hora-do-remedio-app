import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaInicial from '../pages/TelaInicial';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CadastroPaciente from '../pages/CadastroPaciente';
import ListaPacientes from '../pages/ListaPacientes';
import CadastroMedicamento from '../pages/CadastroMedicamento';
import ListaMedicamentos from '../pages/ListaMedicamentos';

const Stack = createNativeStackNavigator();

export default function Rotas() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tela de entrada */}
        <Stack.Screen name="TelaInicial" component={TelaInicial} />
        {/* Autenticação */}
        <Stack.Screen name="Login" component={Login} />
        {/* Área protegida após login */}
        <Stack.Screen name="Dashboard" component={Dashboard} />

        <Stack.Screen name="CadastroPaciente" component={CadastroPaciente} />

        <Stack.Screen name="ListaPacientes" component={ListaPacientes} />

        <Stack.Screen name='CadastroMedicamento' component={CadastroMedicamento} />

        <Stack.Screen name='ListaMedicamentos' component={ListaMedicamentos} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}