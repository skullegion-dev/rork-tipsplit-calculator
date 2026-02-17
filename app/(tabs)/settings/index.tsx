import React, { useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from "react-native";
import {
  Shield,
  Info,
  DollarSign,
  Lock,
  Smartphone,
  ChevronRight,
  RotateCcw,
  CircleDollarSign,
  Users,
  Percent,
  ArrowUpCircle,
  Star,
  MessageSquare,
  Heart,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useColorScheme";
import { useSettings, RoundingMode, CurrencySymbol } from "@/contexts/SettingsContext";

const CURRENCY_OPTIONS: { label: string; value: CurrencySymbol }[] = [
  { label: "$ USD", value: "$" },
  { label: "€ EUR", value: "€" },
  { label: "£ GBP", value: "£" },
  { label: "¥ JPY", value: "¥" },
];

const ROUNDING_OPTIONS: { label: string; value: RoundingMode; desc: string }[] = [
  { label: "None", value: "none", desc: "Exact amount" },
  { label: "Round Up", value: "up", desc: "Always round up" },
  { label: "Nearest", value: "nearest", desc: "Round to nearest dollar" },
];

const TIP_OPTIONS = [10, 15, 18, 20, 22, 25] as const;
const PEOPLE_OPTIONS = [1, 2, 3, 4, 5, 6] as const;

function triggerHaptic() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

export default function SettingsScreen() {
  const { colors } = useTheme();
  const { settings, updateSettings, resetSettings } = useSettings();

  const handleResetDefaults = useCallback(() => {
    Alert.alert(
      "Reset Settings",
      "This will restore all settings to their default values.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            triggerHaptic();
            resetSettings();
            console.log("[Settings] Reset to defaults");
          },
        },
      ]
    );
  }, [resetSettings]);

  const handleRateApp = useCallback(() => {
    triggerHaptic();
    if (Platform.OS === "ios") {
      Linking.openURL("https://apps.apple.com/app/id0000000000?action=write-review");
    } else if (Platform.OS === "android") {
      Linking.openURL("https://play.google.com/store/apps/details?id=com.tipsplit.app");
    } else {
      Alert.alert("Thank you!", "We appreciate your support.");
    }
  }, []);

  const handleFeedback = useCallback(() => {
    triggerHaptic();
    Linking.openURL("mailto:support@tipsplit.app?subject=TipSplit%20Feedback");
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollContent: {
          padding: 20,
          paddingBottom: 60,
        },
        section: {
          marginBottom: 28,
        },
        sectionTitle: {
          fontSize: 13,
          fontWeight: "600" as const,
          color: colors.textSecondary,
          textTransform: "uppercase" as const,
          letterSpacing: 0.8,
          marginBottom: 12,
        },
        card: {
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 18,
          borderWidth: 1,
          borderColor: colors.border,
        },
        settingRow: {
          marginBottom: 20,
        },
        settingRowLast: {
          marginBottom: 0,
        },
        settingHeader: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 10,
          marginBottom: 10,
        },
        settingIconBg: {
          width: 36,
          height: 36,
          borderRadius: 10,
          alignItems: "center" as const,
          justifyContent: "center" as const,
        },
        settingLabel: {
          fontSize: 15,
          fontWeight: "700" as const,
          color: colors.text,
        },
        settingDesc: {
          fontSize: 12,
          color: colors.textMuted,
          marginTop: 1,
        },
        chipRow: {
          flexDirection: "row" as const,
          flexWrap: "wrap" as const,
          gap: 8,
        },
        chip: {
          paddingHorizontal: 14,
          paddingVertical: 9,
          borderRadius: 10,
          backgroundColor: colors.inputBg,
          borderWidth: 1.5,
          borderColor: colors.border,
        },
        chipActive: {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        },
        chipText: {
          fontSize: 14,
          fontWeight: "600" as const,
          color: colors.textSecondary,
        },
        chipTextActive: {
          color: "#FFFFFF",
        },
        divider: {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: 18,
        },
        linkRow: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          justifyContent: "space-between" as const,
          paddingVertical: 14,
        },
        linkRowBorder: {
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        linkLeft: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 12,
        },
        linkIconBg: {
          width: 36,
          height: 36,
          borderRadius: 10,
          alignItems: "center" as const,
          justifyContent: "center" as const,
        },
        linkText: {
          fontSize: 16,
          fontWeight: "600" as const,
          color: colors.text,
        },
        linkSubtext: {
          fontSize: 12,
          color: colors.textMuted,
          marginTop: 1,
        },
        privacyCard: {
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
        },
        privacyHeader: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 12,
          marginBottom: 16,
        },
        privacyIconBg: {
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: colors.highlightBg,
          alignItems: "center" as const,
          justifyContent: "center" as const,
        },
        privacyTitle: {
          fontSize: 18,
          fontWeight: "800" as const,
          color: colors.text,
        },
        privacyText: {
          fontSize: 15,
          color: colors.textSecondary,
          lineHeight: 24,
        },
        privacyHighlight: {
          fontWeight: "700" as const,
          color: colors.text,
        },
        privacyDivider: {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: 16,
        },
        bulletRow: {
          flexDirection: "row" as const,
          alignItems: "flex-start" as const,
          gap: 10,
          marginBottom: 10,
        },
        bulletIcon: {
          marginTop: 2,
        },
        bulletText: {
          flex: 1,
          fontSize: 14,
          color: colors.textSecondary,
          lineHeight: 20,
        },
        resetButton: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          justifyContent: "center" as const,
          gap: 8,
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 14,
          borderWidth: 1,
          borderColor: colors.border,
        },
        resetButtonText: {
          fontSize: 15,
          fontWeight: "600" as const,
          color: colors.accentDark,
        },
        footer: {
          alignItems: "center" as const,
          marginTop: 12,
        },
        footerText: {
          fontSize: 13,
          color: colors.textMuted,
          textAlign: "center" as const,
        },
        versionText: {
          fontSize: 12,
          color: colors.textMuted,
          marginTop: 6,
        },
      }),
    [colors]
  );

  return (
    <View style={styles.container} testID="settings-screen">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Default Values</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingHeader}>
                <View style={[styles.settingIconBg, { backgroundColor: colors.highlightBg }]}>
                  <Percent size={18} color={colors.accent} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Default Tip</Text>
                  <Text style={styles.settingDesc}>Pre-selected when you open the app</Text>
                </View>
              </View>
              <View style={styles.chipRow}>
                {TIP_OPTIONS.map((tip) => (
                  <TouchableOpacity
                    key={tip}
                    style={[styles.chip, settings.defaultTipPercent === tip && styles.chipActive]}
                    onPress={() => {
                      triggerHaptic();
                      updateSettings({ defaultTipPercent: tip });
                    }}
                    activeOpacity={0.7}
                    testID={`default-tip-${tip}`}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        settings.defaultTipPercent === tip && styles.chipTextActive,
                      ]}
                    >
                      {tip}%
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingHeader}>
                <View style={[styles.settingIconBg, { backgroundColor: colors.surfaceAlt }]}>
                  <Users size={18} color={colors.textSecondary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Default Party Size</Text>
                  <Text style={styles.settingDesc}>Number of people to split between</Text>
                </View>
              </View>
              <View style={styles.chipRow}>
                {PEOPLE_OPTIONS.map((count) => (
                  <TouchableOpacity
                    key={count}
                    style={[styles.chip, settings.defaultPeopleCount === count && styles.chipActive]}
                    onPress={() => {
                      triggerHaptic();
                      updateSettings({ defaultPeopleCount: count });
                    }}
                    activeOpacity={0.7}
                    testID={`default-people-${count}`}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        settings.defaultPeopleCount === count && styles.chipTextActive,
                      ]}
                    >
                      {count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingHeader}>
                <View style={[styles.settingIconBg, { backgroundColor: colors.highlightBg }]}>
                  <CircleDollarSign size={18} color={colors.accent} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Currency</Text>
                  <Text style={styles.settingDesc}>Symbol used for amounts</Text>
                </View>
              </View>
              <View style={styles.chipRow}>
                {CURRENCY_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.chip, settings.currencySymbol === opt.value && styles.chipActive]}
                    onPress={() => {
                      triggerHaptic();
                      updateSettings({ currencySymbol: opt.value });
                    }}
                    activeOpacity={0.7}
                    testID={`currency-${opt.value}`}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        settings.currencySymbol === opt.value && styles.chipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={[styles.settingRow, styles.settingRowLast]}>
              <View style={styles.settingHeader}>
                <View style={[styles.settingIconBg, { backgroundColor: colors.surfaceAlt }]}>
                  <ArrowUpCircle size={18} color={colors.textSecondary} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Rounding</Text>
                  <Text style={styles.settingDesc}>How per-person amounts are rounded</Text>
                </View>
              </View>
              <View style={styles.chipRow}>
                {ROUNDING_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.chip, settings.roundingMode === opt.value && styles.chipActive]}
                    onPress={() => {
                      triggerHaptic();
                      updateSettings({ roundingMode: opt.value });
                    }}
                    activeOpacity={0.7}
                    testID={`rounding-${opt.value}`}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        settings.roundingMode === opt.value && styles.chipTextActive,
                      ]}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={[styles.linkRow, styles.linkRowBorder]}
              onPress={handleRateApp}
              activeOpacity={0.7}
              testID="rate-app"
            >
              <View style={styles.linkLeft}>
                <View style={[styles.linkIconBg, { backgroundColor: "#FFF3E0" }]}>
                  <Star size={18} color="#FF9800" />
                </View>
                <View>
                  <Text style={styles.linkText}>Rate TipSplit</Text>
                  <Text style={styles.linkSubtext}>Help others discover TipSplit</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.linkRow, styles.linkRowBorder]}
              onPress={handleFeedback}
              activeOpacity={0.7}
              testID="send-feedback"
            >
              <View style={styles.linkLeft}>
                <View style={[styles.linkIconBg, { backgroundColor: "#E3F2FD" }]}>
                  <MessageSquare size={18} color="#2196F3" />
                </View>
                <View>
                  <Text style={styles.linkText}>Send Feedback</Text>
                  <Text style={styles.linkSubtext}>Let us know how we can improve</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkRow}
              onPress={handleResetDefaults}
              activeOpacity={0.7}
              testID="reset-settings"
            >
              <View style={styles.linkLeft}>
                <View style={[styles.linkIconBg, { backgroundColor: colors.surfaceAlt }]}>
                  <RotateCcw size={18} color={colors.textSecondary} />
                </View>
                <View>
                  <Text style={styles.linkText}>Reset All Settings</Text>
                  <Text style={styles.linkSubtext}>Restore factory defaults</Text>
                </View>
              </View>
              <ChevronRight size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Data</Text>
          <View style={styles.privacyCard}>
            <View style={styles.privacyHeader}>
              <View style={styles.privacyIconBg}>
                <Shield size={24} color={colors.accent} />
              </View>
              <Text style={styles.privacyTitle}>Your Privacy Matters</Text>
            </View>
            <Text style={styles.privacyText}>
              TipSplit is a{" "}
              <Text style={styles.privacyHighlight}>fully offline app</Text>. No personal
              data is collected, stored on servers, or transmitted anywhere. Everything stays
              on your device.
            </Text>
            <View style={styles.privacyDivider} />
            <View style={styles.bulletRow}>
              <Lock size={16} color={colors.accent} style={styles.bulletIcon} />
              <Text style={styles.bulletText}>
                All calculations are stored locally on your device only
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Smartphone size={16} color={colors.accent} style={styles.bulletIcon} />
              <Text style={styles.bulletText}>
                No internet connection required — works completely offline
              </Text>
            </View>
            <View style={[styles.bulletRow, { marginBottom: 0 }]}>
              <Shield size={16} color={colors.accent} style={styles.bulletIcon} />
              <Text style={styles.bulletText}>
                No ads, no tracking, no analytics — just a simple, private tool
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.settingHeader}>
              <View style={[styles.settingIconBg, { backgroundColor: colors.highlightBg }]}>
                <DollarSign size={18} color={colors.accent} />
              </View>
              <View>
                <Text style={styles.settingLabel}>TipSplit</Text>
                <Text style={styles.settingDesc}>
                  Quick & easy bill splitting with tip and tax
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={styles.footerText}>Made with</Text>
            <Heart size={12} color={colors.accent} fill={colors.accent} />
            <Text style={styles.footerText}>for better dining</Text>
          </View>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
