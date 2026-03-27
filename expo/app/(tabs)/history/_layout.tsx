import { Stack } from "expo-router";
import React from "react";
import { useTheme } from "@/hooks/useColorScheme";

export default function HistoryLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "History",
          headerTitleStyle: { fontWeight: "800" as const, fontSize: 20 },
        }}
      />
    </Stack>
  );
}
