import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Shield, Info, DollarSign, Lock, Smartphone } from "lucide-react-native";
import { useTheme } from "@/hooks/useColorScheme";

export default function SettingsScreen() {
  const { colors } = useTheme();

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
          fontWeight: "600",
          color: colors.textSecondary,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginBottom: 12,
        },
        card: {
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
        },
        cardRow: {
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 14,
          marginBottom: 18,
        },
        cardRowLast: {
          marginBottom: 0,
        },
        cardIconBg: {
          width: 40,
          height: 40,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
        },
        cardContent: {
          flex: 1,
        },
        cardTitle: {
          fontSize: 16,
          fontWeight: "700",
          color: colors.text,
          marginBottom: 4,
        },
        cardDescription: {
          fontSize: 14,
          color: colors.textSecondary,
          lineHeight: 20,
        },
        privacyCard: {
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
        },
        privacyHeader: {
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        },
        privacyIconBg: {
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: colors.highlightBg,
          alignItems: "center",
          justifyContent: "center",
        },
        privacyTitle: {
          fontSize: 18,
          fontWeight: "800",
          color: colors.text,
        },
        privacyText: {
          fontSize: 15,
          color: colors.textSecondary,
          lineHeight: 24,
        },
        privacyHighlight: {
          fontWeight: "700",
          color: colors.text,
        },
        divider: {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: 16,
        },
        bulletRow: {
          flexDirection: "row",
          alignItems: "flex-start",
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
        footer: {
          alignItems: "center",
          marginTop: 12,
        },
        footerText: {
          fontSize: 13,
          color: colors.textMuted,
          textAlign: "center",
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
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View
                style={[styles.cardIconBg, { backgroundColor: colors.highlightBg }]}
              >
                <DollarSign size={20} color={colors.accent} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>TipSplit</Text>
                <Text style={styles.cardDescription}>
                  Quickly split restaurant bills with tip and tax. Simple, fast, and
                  private.
                </Text>
              </View>
            </View>
            <View style={[styles.cardRow, styles.cardRowLast]}>
              <View
                style={[styles.cardIconBg, { backgroundColor: colors.surfaceAlt }]}
              >
                <Info size={20} color={colors.textSecondary} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Paid App — $0.99</Text>
                <Text style={styles.cardDescription}>
                  One-time purchase. No subscriptions, no ads, no hidden costs.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Policy</Text>
          <View style={styles.privacyCard}>
            <View style={styles.privacyHeader}>
              <View style={styles.privacyIconBg}>
                <Shield size={24} color={colors.accent} />
              </View>
              <Text style={styles.privacyTitle}>Your Privacy</Text>
            </View>
            <Text style={styles.privacyText}>
              This is a{" "}
              <Text style={styles.privacyHighlight}>
                paid app ($0.99 one-time purchase)
              </Text>
              . No personal data is collected, stored, or transmitted — everything
              stays on your device.
            </Text>
            <View style={styles.divider} />
            <View style={styles.bulletRow}>
              <Lock size={16} color={colors.accent} style={styles.bulletIcon} />
              <Text style={styles.bulletText}>
                No data collection — your calculations never leave your device
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Smartphone
                size={16}
                color={colors.accent}
                style={styles.bulletIcon}
              />
              <Text style={styles.bulletText}>
                No internet required — works completely offline
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Shield size={16} color={colors.accent} style={styles.bulletIcon} />
              <Text style={styles.bulletText}>
                No ads, no tracking, no analytics — just a simple tool
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with care for a better dining experience
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}
