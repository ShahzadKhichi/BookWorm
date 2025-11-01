import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import COLORS from "../constants/color";

export default function Loader({ size }) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.background,
      }}
    >
      <ActivityIndicator size={size || "large"} color={COLORS.primary} />
    </View>
  );
}
