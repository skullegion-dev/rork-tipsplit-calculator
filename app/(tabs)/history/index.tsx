import React, { useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { Clock, Trash2, Users, Receipt } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useColorScheme";
import { useHistory } from "@/contexts/HistoryContext";
import { Calculation } from "@/types/calculation";

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { calculations, clearHistory } = useHistory();

  const handleClear = useCallback(() => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all saved calculations?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            clearHistory();
          },
        },
      ]
    );
  }, [clearHistory]);

  const formatCurrency = useCallback((amount: number) => {
    return `$${amount.toFixed(2)}`;
  }, []);

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        listContent: {
          padding: 20,
          paddingBottom: 40,
        },
        emptyContainer: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 80,
        },
        emptyIconBg: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.surfaceAlt,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        },
        emptyTitle: {
          fontSize: 18,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 6,
        },
        emptySubtitle: {
          fontSize: 14,
          color: colors.textMuted,
          textAlign: "center",
          lineHeight: 20,
        },
        card: {
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: colors.border,
        },
        cardHeader: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        },
        cardDate: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        },
        cardDateText: {
          fontSize: 13,
          color: colors.textMuted,
          fontWeight: "500",
        },
        cardPeople: {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          backgroundColor: colors.surfaceAlt,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
        },
        cardPeopleText: {
          fontSize: 12,
          fontWeight: "600",
          color: colors.textSecondary,
        },
        cardBody: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
        },
        cardLeft: {
          flex: 1,
        },
        cardBillLabel: {
          fontSize: 12,
          color: colors.textMuted,
          marginBottom: 2,
        },
        cardBillValue: {
          fontSize: 22,
          fontWeight: "800",
          color: colors.text,
        },
        cardDetails: {
          fontSize: 12,
          color: colors.textSecondary,
          marginTop: 4,
        },
        cardRight: {
          alignItems: "flex-end",
        },
        cardPerPersonLabel: {
          fontSize: 11,
          fontWeight: "600",
          color: colors.accent,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 2,
        },
        cardPerPersonValue: {
          fontSize: 26,
          fontWeight: "800",
          color: colors.highlight,
        },
        clearButton: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 14,
          marginTop: 8,
          borderWidth: 1,
          borderColor: colors.border,
        },
        clearButtonText: {
          fontSize: 15,
          fontWeight: "600",
          color: colors.accentDark,
        },
      }),
    [colors]
  );

  const renderItem = useCallback(
    ({ item }: { item: Calculation }) => (
      <View style={styles.card} testID={`history-item-${item.id}`}>
        <View style={styles.cardHeader}>
          <View style={styles.cardDate}>
            <Clock size={14} color={colors.textMuted} />
            <Text style={styles.cardDateText}>{formatDate(item.createdAt)}</Text>
          </View>
          <View style={styles.cardPeople}>
            <Users size={12} color={colors.textSecondary} />
            <Text style={styles.cardPeopleText}>
              {item.numberOfPeople} {item.numberOfPeople === 1 ? "person" : "people"}
            </Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardLeft}>
            <Text style={styles.cardBillLabel}>Bill Total</Text>
            <Text style={styles.cardBillValue}>{formatCurrency(item.total)}</Text>
            <Text style={styles.cardDetails}>
              {formatCurrency(item.billAmount)} + {item.tipPercent}% tip
              {item.taxPercent > 0 ? ` + ${item.taxPercent}% tax` : ""}
            </Text>
          </View>
          <View style={styles.cardRight}>
            <Text style={styles.cardPerPersonLabel}>Per Person</Text>
            <Text style={styles.cardPerPersonValue}>
              {formatCurrency(item.perPerson)}
            </Text>
          </View>
        </View>
      </View>
    ),
    [styles, colors, formatDate, formatCurrency]
  );

  const keyExtractor = useCallback((item: Calculation) => item.id, []);

  return (
    <View style={styles.container} testID="history-screen">
      <FlatList
        data={calculations}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Receipt size={36} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No calculations yet</Text>
            <Text style={styles.emptySubtitle}>
              Your saved bill splits will appear here
            </Text>
          </View>
        }
        ListFooterComponent={
          calculations.length > 0 ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              activeOpacity={0.7}
              testID="clear-history"
            >
              <Trash2 size={16} color={colors.accentDark} />
              <Text style={styles.clearButtonText}>Clear History</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}
