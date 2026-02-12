import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import createContextHook from "@nkzw/create-context-hook";
import { Calculation } from "@/types/calculation";

const HISTORY_KEY = "tipsplit_history";
const MAX_HISTORY = 10;

export const [HistoryProvider, useHistory] = createContextHook(() => {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(HISTORY_KEY);
      console.log("[HistoryContext] Loaded history from storage:", stored ? "found" : "empty");
      return stored ? (JSON.parse(stored) as Calculation[]) : [];
    },
  });

  useEffect(() => {
    if (historyQuery.data) {
      setCalculations(historyQuery.data);
    }
  }, [historyQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (updated: Calculation[]) => {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      console.log("[HistoryContext] Saved history, count:", updated.length);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  const { mutate } = saveMutation;

  const addCalculation = useCallback(
    (calc: Calculation) => {
      const updated = [calc, ...calculations].slice(0, MAX_HISTORY);
      setCalculations(updated);
      mutate(updated);
    },
    [calculations, mutate]
  );

  const clearHistory = useCallback(() => {
    setCalculations([]);
    mutate([]);
  }, [mutate]);

  return {
    calculations,
    addCalculation,
    clearHistory,
    isLoading: historyQuery.isLoading,
  };
});
