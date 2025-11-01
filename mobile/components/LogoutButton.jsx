import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import styles from "../assets/styles/profile.styles";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "expo-router";

export default function LogoutButton() {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  const confirmLogout = () => {
    Alert.alert("logout", "Are you sure to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "logout", onPress: () => handleLogout(), style: "destructive" },
    ]);
  };
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Text style={styles.logoutText}>logout</Text>
    </TouchableOpacity>
  );
}
