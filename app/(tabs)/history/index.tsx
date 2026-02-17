import React, { useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
  Share,
} from "react-native";
import { Clock, Trash2, Users, Receipt, Share2, X } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { useTheme } from "@/hooks/useColorScheme";
import { useHistory } from "@/contexts/HistoryContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Calculation } from "@/types/calculation";

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { calculations, removeCalculation, clearHistory } = useHistory();
  const { formatCurrency, settings } = useSettings();

  const handleClear = useCallback(() => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all saved calculations?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            clearHistory();
            console.log("[History] Cleared all history");
          },
        },
      ]
    );
  }, [clearHistory]);

  const handleDelete = useCallback(
    (item: Calculation) => {
      Alert.alert(
        "Delete Calculation",
        `Remove the ${formatCurrency(item.total)} bill from history?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              }
              removeCalculation(item.id);
            },
          },
        ]
      );
    },
    [removeCalculation, formatCurrency]
  );

  const handleShare = useCallback(
    async (item: Calculation) => {
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      const lines = [
        `Bill Split Summary`,
        `──────────────`,
        `Subtotal: ${formatCurrency(item.billAmount)}`,
        `Tip (${item.tipPercent}%): ${formatCurrency(item.tipAmount)}`,
      ];
      if (item.taxPercent > 0) {
        lines.push(`Tax (${item.taxPercent}%): ${formatCurrency(item.taxAmount)}`);
      }
      lines.push(`Total: ${formatCurrency(item.total)}`);
      if (item.numberOfPeople > 1) {
        lines.push(`──────────────`);
        lines.push(`Per Person (${item.numberOfPeople}): ${formatCurrency(item.perPerson)}`);
      }
      const text = lines.join("\n");

      try {
        if (Platform.OS === "web") {
          await Clipboard.setStringAsync(text);
          Alert.alert("Copied!", "Bill summary copied to clipboard.");
        } else {
          await Share.share({ message: text, title: "TipSplit Summary" });
        }
        console.log("[History] Shared item:", item.id);
      } catch (err) {
        console.log("[History] Share error:", err);
      }
    },
    [formatCurrency]
  );

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
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
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
        countBadge: {
          alignSelf: "flex-start" as const,
          backgroundColor: colors.surfaceAlt,
          borderRadius: 10,
          paddingHorizontal: 12,
          paddingVertical: 6,
          marginBottom: 16,
        },
        countText: {
          fontSize: 13,
          fontWeight: "600" as const,
          color: colors.textSecondary,
        },
        emptyContainer: {
          flex: 1,
          alignItems: "center" as const,
          justifyContent: "center" as const,
          paddingTop: 80,
        },
        emptyIconBg: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.surfaceAlt,
          alignItems: "center" as const,
          justifyContent: "center" as const,
          marginBottom: 16,
        },
        emptyTitle: {
          fontSize: 18,
          fontWeight: "700" as const,
          color: colors.text,
          marginBottom: 6,
        },
        emptySubtitle: {
          fontSize: 14,
          color: colors.textMuted,
          textAlign: "center" as const,
          lineHeight: 20,
          paddingHorizontal: 40,
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
          flexDirection: "row" as const,
          justifyContent: "space-between" as const,
          alignItems: "center" as const,
          marginBottom: 12,
        },
        cardDate: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 6,
        },
        cardDateText: {
          fontSize: 13,
          color: colors.textMuted,
          fontWeight: "500" as const,
        },
        cardHeaderActions: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 6,
        },
        cardPeople: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 4,
          backgroundColor: colors.surfaceAlt,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
        },
        cardPeopleText: {
          fontSize: 12,
          fontWeight: "600" as const,
          color: colors.textSecondary,
        },
        cardBody: {
          flexDirection: "row" as const,
          justifyContent: "space-between" as const,
          alignItems: "flex-end" as const,
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
          fontWeight: "800" as const,
          color: colors.text,
        },
        cardDetails: {
          fontSize: 12,
          color: colors.textSecondary,
          marginTop: 4,
        },
        cardRight: {
          alignItems: "flex-end" as const,
        },
        cardPerPersonLabel: {
          fontSize: 11,
          fontWeight: "600" as const,
          color: colors.accent,
          textTransform: "uppercase" as const,
          letterSpacing: 0.5,
          marginBottom: 2,
        },
        cardPerPersonValue: {
          fontSize: 26,
          fontWeight: "800" as const,
          color: colors.highlight,
        },
        cardActions: {
          flexDirection: "row" as const,
          marginTop: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          gap: 8,
        },
        cardActionButton: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 5,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          backgroundColor: colors.surfaceAlt,
        },
        cardActionText: {
          fontSize: 12,
          fontWeight: "600" as const,
          color: colors.textSecondary,
        },
        cardDeleteButton: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 5,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          backgroundColor: colors.surfaceAlt,
          marginLeft: "auto" as const,
        },
        cardDeleteText: {
          fontSize: 12,
          fontWeight: "600" as const,
          color: colors.accentDark,
        },
        clearButton: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          justifyContent: "center" as const,
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
          fontWeight: "600" as const,
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
          <View style={styles.cardHeaderActions}>
            <View style={styles.cardPeople}>
              <Users size={12} color={colors.textSecondary} />
              <Text style={styles.cardPeopleText}>
                {item.numberOfPeople} {item.numberOfPeople === 1 ? "person" : "people"}
              </Text>
            </View>
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
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.cardActionButton}
            onPress={() => handleShare(item)}
            activeOpacity={0.7}
            testID={`share-${item.id}`}
          >
            <Share2 size={14} color={colors.textSecondary} />
            <Text style={styles.cardActionText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cardDeleteButton}
            onPress={() => handleDelete(item)}
            activeOpacity={0.7}
            testID={`delete-${item.id}`}
          >
            <X size={14} color={colors.accentDark} />
            <Text style={styles.cardDeleteText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
    [styles, colors, formatDate, formatCurrency, handleShare, handleDelete]
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
        ListHeaderComponent={
          calculations.length > 0 ? (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {calculations.length} saved calculation{calculations.length !== 1 ? "s" : ""}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Receipt size={36} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No calculations yet</Text>
            <Text style={styles.emptySubtitle}>
              Your saved bill splits will appear here. Start by calculating a tip on the Calculate tab.
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
              <Text style={styles.clearButtonText}>Clear All History</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
}
