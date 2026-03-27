import { useColorScheme as useRNColorScheme } from "react-native";
import Colors from "@/constants/colors";

export function useTheme() {
  const scheme = useRNColorScheme();
  const isDark = scheme === "dark";
  const colors = isDark ? Colors.dark : Colors.light;
  return { colors, isDark };
}
