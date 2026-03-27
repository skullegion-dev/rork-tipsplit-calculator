import { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation } from "@tanstack/react-query";
import createContextHook from "@nkzw/create-context-hook";

const SETTINGS_KEY = "tipsplit_settings";

export type RoundingMode = "none" | "up" | "nearest";
export type CurrencySymbol = "$" | "€" | "£" | "¥";

export interface AppSettings {
  defaultTipPercent: number;
  defaultPeopleCount: number;
  defaultTaxPercent: number;
  roundingMode: RoundingMode;
  currencySymbol: CurrencySymbol;
}

const DEFAULT_SETTINGS: AppSettings = {
  defaultTipPercent: 18,
  defaultPeopleCount: 2,
  defaultTaxPercent: 0,
  roundingMode: "none",
  currencySymbol: "$",
};

export const [SettingsProvider, useSettings] = createContextHook(() => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const settingsQuery = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      console.log("[SettingsContext] Loaded settings:", stored ? "found" : "using defaults");
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AppSettings>;
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
      return DEFAULT_SETTINGS;
    },
  });

  useEffect(() => {
    if (settingsQuery.data) {
      setSettings(settingsQuery.data);
    }
  }, [settingsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (updated: AppSettings) => {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      console.log("[SettingsContext] Saved settings");
      return updated;
    },
  });

  const updateSettings = useCallback(
    (partial: Partial<AppSettings>) => {
      const updated = { ...settings, ...partial };
      setSettings(updated);
      saveMutation.mutate(updated);
    },
    [settings, saveMutation]
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    saveMutation.mutate(DEFAULT_SETTINGS);
  }, [saveMutation]);

  const formatCurrency = useCallback(
    (amount: number) => {
      return `${settings.currencySymbol}${amount.toFixed(2)}`;
    },
    [settings.currencySymbol]
  );

  const applyRounding = useCallback(
    (amount: number) => {
      switch (settings.roundingMode) {
        case "up":
          return Math.ceil(amount);
        case "nearest":
          return Math.round(amount);
        default:
          return amount;
      }
    },
    [settings.roundingMode]
  );

  return useMemo(
    () => ({
      settings,
      updateSettings,
      resetSettings,
      formatCurrency,
      applyRounding,
      isLoading: settingsQuery.isLoading,
    }),
    [settings, updateSettings, resetSettings, formatCurrency, applyRounding, settingsQuery.isLoading]
  );
});
