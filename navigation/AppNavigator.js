import React from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useApp } from "../context/AppContext";

import RoleSelectionScreen from "../screens/RoleSelectionScreen";
import PatientHomeScreen from "../screens/patient/PatientHomeScreen";
import PatternRecallScreen from "../screens/patient/PatternRecallScreen";
import FaceNameMatchScreen from "../screens/patient/FaceNameMatchScreen";
import CaregiverHomeScreen from "../screens/caregiver/CaregiverHomeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { role, loading } = useApp();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0F6E56" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!role && (
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        )}
        {role === "patient" && (
          <>
            <Stack.Screen name="PatientHome" component={PatientHomeScreen} />
            <Stack.Screen name="PatternRecall" component={PatternRecallScreen} />
            <Stack.Screen name="FaceNameMatch" component={FaceNameMatchScreen} />
          </>
        )}
        {role === "caregiver" && (
          <Stack.Screen name="CaregiverHome" component={CaregiverHomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
