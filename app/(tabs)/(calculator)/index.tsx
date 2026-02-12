import React, { useState, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Animated,
  Keyboard,
} from "react-native";
import { Users, Percent, DollarSign, Receipt } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { useTheme } from "@/hooks/useColorScheme";
import { useHistory } from "@/contexts/HistoryContext";
import { Calculation } from "@/types/calculation";

const TIP_PRESETS = [15, 18, 20] as const;

function triggerHaptic() {
  if (Platform.OS !== "web") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

function triggerSelectionHaptic() {
  if (Platform.OS !== "web") {
    Haptics.selectionAsync();
  }
}

export default function CalculatorScreen() {
  const { colors } = useTheme();
  const { addCalculation } = useHistory();

  const [billText, setBillText] = useState<string>("");
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [customTip, setCustomTip] = useState<boolean>(false);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
  const [taxText, setTaxText] = useState<string>("");

  const saveAnim = useRef(new Animated.Value(0)).current;

  const billAmount = useMemo(() => {
    const val = parseFloat(billText);
    return isNaN(val) ? 0 : val;
  }, [billText]);

  const taxPercent = useMemo(() => {
    const val = parseFloat(taxText);
    return isNaN(val) ? 0 : val;
  }, [taxText]);

  const results = useMemo(() => {
    const tipAmount = billAmount * (tipPercent / 100);
    const taxAmount = billAmount * (taxPercent / 100);
    const total = billAmount + tipAmount + taxAmount;
    const perPerson = numberOfPeople > 0 ? total / numberOfPeople : total;
    return {
      subtotal: billAmount,
      tipAmount,
      taxAmount,
      total,
      perPerson,
    };
  }, [billAmount, tipPercent, taxPercent, numberOfPeople]);

  const handleTipPreset = useCallback((percent: number) => {
    triggerHaptic();
    setTipPercent(percent);
    setCustomTip(false);
  }, []);

  const handleCustomTip = useCallback(() => {
    triggerHaptic();
    setCustomTip(true);
  }, []);

  const handleTipSlider = useCallback((value: number) => {
    triggerSelectionHaptic();
    setTipPercent(value);
  }, []);

  const handlePeopleChange = useCallback((delta: number) => {
    triggerHaptic();
    setNumberOfPeople((prev) => Math.max(1, Math.min(20, prev + delta)));
  }, []);

  const handleSave = useCallback(() => {
    if (billAmount <= 0) return;
    triggerHaptic();

    const calc: Calculation = {
      id: Date.now().toString(),
      billAmount,
      tipPercent,
      taxPercent,
      numberOfPeople,
      subtotal: results.subtotal,
      tipAmount: results.tipAmount,
      taxAmount: results.taxAmount,
      total: results.total,
      perPerson: results.perPerson,
      createdAt: new Date().toISOString(),
    };
    addCalculation(calc);
    console.log("[Calculator] Saved calculation:", calc.id);

    Animated.sequence([
      Animated.timing(saveAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(saveAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [billAmount, tipPercent, taxPercent, numberOfPeople, results, addCalculation, saveAnim]);

  const formatCurrency = useCallback((amount: number) => {
    return `$${amount.toFixed(2)}`;
  }, []);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scroll: {
          flex: 1,
        },
        scrollContent: {
          padding: 20,
          paddingBottom: 40,
        },
        section: {
          marginBottom: 24,
        },
        sectionLabel: {
          fontSize: 13,
          fontWeight: "600" as const,
          color: colors.textSecondary,
          textTransform: "uppercase" as const,
          letterSpacing: 0.8,
          marginBottom: 10,
        },
        billInputContainer: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          backgroundColor: colors.surface,
          borderRadius: 16,
          borderWidth: 2,
          borderColor: colors.inputBorder,
          paddingHorizontal: 16,
          paddingVertical: 4,
        },
        billInputContainerFocused: {
          borderColor: colors.accent,
        },
        dollarIcon: {
          marginRight: 8,
        },
        billInput: {
          flex: 1,
          fontSize: 36,
          fontWeight: "700" as const,
          color: colors.text,
          paddingVertical: 16,
        },
        tipRow: {
          flexDirection: "row" as const,
          gap: 10,
        },
        tipButton: {
          flex: 1,
          paddingVertical: 14,
          borderRadius: 12,
          backgroundColor: colors.surface,
          borderWidth: 1.5,
          borderColor: colors.border,
          alignItems: "center" as const,
          justifyContent: "center" as const,
        },
        tipButtonActive: {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
        },
        tipButtonText: {
          fontSize: 16,
          fontWeight: "700" as const,
          color: colors.textSecondary,
        },
        tipButtonTextActive: {
          color: "#FFFFFF",
        },
        customTipContainer: {
          marginTop: 14,
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
        },
        customTipHeader: {
          flexDirection: "row" as const,
          justifyContent: "space-between" as const,
          alignItems: "center" as const,
          marginBottom: 12,
        },
        customTipLabel: {
          fontSize: 15,
          fontWeight: "600" as const,
          color: colors.text,
        },
        customTipValue: {
          fontSize: 18,
          fontWeight: "800" as const,
          color: colors.accent,
        },
        sliderTrack: {
          height: 6,
          backgroundColor: colors.inputBg,
          borderRadius: 3,
          overflow: "hidden" as const,
        },
        sliderFill: {
          height: "100%" as const,
          backgroundColor: colors.accent,
          borderRadius: 3,
        },
        sliderTouchable: {
          height: 40,
          justifyContent: "center" as const,
        },
        sliderLabels: {
          flexDirection: "row" as const,
          justifyContent: "space-between" as const,
          marginTop: 4,
        },
        sliderLabelText: {
          fontSize: 11,
          color: colors.textMuted,
        },
        peopleContainer: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          justifyContent: "space-between" as const,
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
        },
        peopleLeft: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 10,
        },
        peopleLabelText: {
          fontSize: 16,
          fontWeight: "600" as const,
          color: colors.text,
        },
        peopleControls: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 14,
        },
        peopleButton: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.inputBg,
          alignItems: "center" as const,
          justifyContent: "center" as const,
          borderWidth: 1,
          borderColor: colors.border,
        },
        peopleButtonDisabled: {
          opacity: 0.4,
        },
        peopleButtonText: {
          fontSize: 22,
          fontWeight: "700" as const,
          color: colors.accent,
          lineHeight: 24,
        },
        peopleCount: {
          fontSize: 24,
          fontWeight: "800" as const,
          color: colors.text,
          minWidth: 36,
          textAlign: "center" as const,
        },
        taxInputContainer: {
          flexDirection: "row" as const,
          alignItems: "center" as const,
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 16,
          paddingVertical: 4,
        },
        taxInput: {
          flex: 1,
          fontSize: 18,
          fontWeight: "600" as const,
          color: colors.text,
          paddingVertical: 14,
        },
        taxSuffix: {
          fontSize: 16,
          fontWeight: "600" as const,
          color: colors.textMuted,
          marginLeft: 4,
        },
        resultsCard: {
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: colors.cardShadow,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 1,
          shadowRadius: 12,
          elevation: 4,
        },
        resultRow: {
          flexDirection: "row" as const,
          justifyContent: "space-between" as const,
          alignItems: "center" as const,
          paddingVertical: 8,
        },
        resultLabel: {
          fontSize: 15,
          color: colors.textSecondary,
          fontWeight: "500" as const,
        },
        resultValue: {
          fontSize: 17,
          color: colors.text,
          fontWeight: "600" as const,
        },
        divider: {
          height: 1,
          backgroundColor: colors.border,
          marginVertical: 8,
        },
        totalRow: {
          flexDirection: "row" as const,
          justifyContent: "space-between" as const,
          alignItems: "center" as const,
          paddingVertical: 8,
        },
        totalLabel: {
          fontSize: 16,
          color: colors.text,
          fontWeight: "700" as const,
        },
        totalValue: {
          fontSize: 20,
          color: colors.text,
          fontWeight: "800" as const,
        },
        perPersonContainer: {
          marginTop: 12,
          backgroundColor: colors.highlightBg,
          borderRadius: 16,
          padding: 18,
          alignItems: "center" as const,
        },
        perPersonLabel: {
          fontSize: 13,
          fontWeight: "600" as const,
          color: colors.accent,
          textTransform: "uppercase" as const,
          letterSpacing: 1,
          marginBottom: 4,
        },
        perPersonValue: {
          fontSize: 40,
          fontWeight: "800" as const,
          color: colors.highlight,
          letterSpacing: -1,
        },
        perPersonSub: {
          fontSize: 13,
          color: colors.textSecondary,
          marginTop: 2,
        },
        saveButton: {
          marginTop: 16,
          backgroundColor: colors.accent,
          borderRadius: 14,
          paddingVertical: 16,
          alignItems: "center" as const,
          justifyContent: "center" as const,
          flexDirection: "row" as const,
          gap: 8,
        },
        saveButtonDisabled: {
          opacity: 0.5,
        },
        saveButtonText: {
          fontSize: 17,
          fontWeight: "700" as const,
          color: "#FFFFFF",
        },
        savedBadge: {
          position: "absolute" as const,
          top: -8,
          right: -8,
          backgroundColor: colors.success,
          borderRadius: 12,
          paddingHorizontal: 10,
          paddingVertical: 4,
        },
        savedBadgeText: {
          fontSize: 11,
          fontWeight: "700" as const,
          color: "#FFFFFF",
        },
      }),
    [colors]
  );

  const [billFocused, setBillFocused] = useState(false);

  return (
    <View style={styles.container} testID="calculator-screen">
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Bill Amount</Text>
          <View
            style={[
              styles.billInputContainer,
              billFocused && styles.billInputContainerFocused,
            ]}
          >
            <DollarSign
              size={24}
              color={billFocused ? colors.accent : colors.textMuted}
              style={styles.dollarIcon}
            />
            <TextInput
              style={styles.billInput}
              value={billText}
              onChangeText={setBillText}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onFocus={() => setBillFocused(true)}
              onBlur={() => setBillFocused(false)}
              onSubmitEditing={() => Keyboard.dismiss()}
              testID="bill-input"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tip Percentage</Text>
          <View style={styles.tipRow}>
            {TIP_PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.tipButton,
                  !customTip && tipPercent === preset && styles.tipButtonActive,
                ]}
                onPress={() => handleTipPreset(preset)}
                activeOpacity={0.7}
                testID={`tip-${preset}`}
              >
                <Text
                  style={[
                    styles.tipButtonText,
                    !customTip &&
                      tipPercent === preset &&
                      styles.tipButtonTextActive,
                  ]}
                >
                  {preset}%
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.tipButton, customTip && styles.tipButtonActive]}
              onPress={handleCustomTip}
              activeOpacity={0.7}
              testID="tip-custom"
            >
              <Text
                style={[
                  styles.tipButtonText,
                  customTip && styles.tipButtonTextActive,
                ]}
              >
                Custom
              </Text>
            </TouchableOpacity>
          </View>
          {customTip && (
            <View style={styles.customTipContainer}>
              <View style={styles.customTipHeader}>
                <Text style={styles.customTipLabel}>Custom Tip</Text>
                <Text style={styles.customTipValue}>{tipPercent}%</Text>
              </View>
              <CustomSlider
                value={tipPercent}
                min={0}
                max={50}
                onValueChange={handleTipSlider}
                trackColor={colors.inputBg}
                fillColor={colors.accent}
              />
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>0%</Text>
                <Text style={styles.sliderLabelText}>25%</Text>
                <Text style={styles.sliderLabelText}>50%</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Number of People</Text>
          <View style={styles.peopleContainer}>
            <View style={styles.peopleLeft}>
              <Users size={20} color={colors.accent} />
              <Text style={styles.peopleLabelText}>Split between</Text>
            </View>
            <View style={styles.peopleControls}>
              <TouchableOpacity
                style={[
                  styles.peopleButton,
                  numberOfPeople <= 1 && styles.peopleButtonDisabled,
                ]}
                onPress={() => handlePeopleChange(-1)}
                disabled={numberOfPeople <= 1}
                activeOpacity={0.7}
                testID="people-minus"
              >
                <Text style={styles.peopleButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.peopleCount}>{numberOfPeople}</Text>
              <TouchableOpacity
                style={[
                  styles.peopleButton,
                  numberOfPeople >= 20 && styles.peopleButtonDisabled,
                ]}
                onPress={() => handlePeopleChange(1)}
                disabled={numberOfPeople >= 20}
                activeOpacity={0.7}
                testID="people-plus"
              >
                <Text style={styles.peopleButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tax (Optional)</Text>
          <View style={styles.taxInputContainer}>
            <Percent size={18} color={colors.textMuted} />
            <TextInput
              style={styles.taxInput}
              value={taxText}
              onChangeText={setTaxText}
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              testID="tax-input"
            />
            <Text style={styles.taxSuffix}>%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Results</Text>
          <View style={styles.resultsCard}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Subtotal</Text>
              <Text style={styles.resultValue}>
                {formatCurrency(results.subtotal)}
              </Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>
                Tip ({tipPercent}%)
              </Text>
              <Text style={styles.resultValue}>
                {formatCurrency(results.tipAmount)}
              </Text>
            </View>
            {taxPercent > 0 && (
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>
                  Tax ({taxPercent}%)
                </Text>
                <Text style={styles.resultValue}>
                  {formatCurrency(results.taxAmount)}
                </Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(results.total)}
              </Text>
            </View>

            <View style={styles.perPersonContainer}>
              <Text style={styles.perPersonLabel}>Per Person</Text>
              <Text style={styles.perPersonValue}>
                {formatCurrency(results.perPerson)}
              </Text>
              <Text style={styles.perPersonSub}>
                split {numberOfPeople} way{numberOfPeople > 1 ? "s" : ""}
              </Text>
            </View>

            <View>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  billAmount <= 0 && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                disabled={billAmount <= 0}
                activeOpacity={0.8}
                testID="save-button"
              >
                <Receipt size={18} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save to History</Text>
              </TouchableOpacity>
              <Animated.View
                style={[
                  styles.savedBadge,
                  {
                    opacity: saveAnim,
                    transform: [
                      {
                        scale: saveAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ]}
                pointerEvents="none"
              >
                <Text style={styles.savedBadgeText}>Saved!</Text>
              </Animated.View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
  trackColor: string;
  fillColor: string;
}

function CustomSlider({
  value,
  min,
  max,
  onValueChange,
  trackColor,
  fillColor,
}: CustomSliderProps) {
  const trackRef = useRef<View>(null);
  const fillWidth = ((value - min) / (max - min)) * 100;

  const handlePress = useCallback(
    (evt: { nativeEvent: { locationX: number } }) => {
      trackRef.current?.measure((_x, _y, width) => {
        if (width > 0) {
          const ratio = Math.max(0, Math.min(1, evt.nativeEvent.locationX / width));
          const newVal = Math.round(min + ratio * (max - min));
          onValueChange(newVal);
        }
      });
    },
    [min, max, onValueChange]
  );

  const responder = useRef(
    React.useMemo(() => {
      return {
        onStartShouldSetResponder: () => true,
        onMoveShouldSetResponder: () => true,
        onResponderGrant: (evt: { nativeEvent: { locationX: number } }) => handlePress(evt),
        onResponderMove: (evt: { nativeEvent: { locationX: number } }) => handlePress(evt),
      };
    }, [handlePress])
  ).current;

  return (
    <View
      ref={trackRef}
      style={{
        height: 40,
        justifyContent: "center" as const,
      }}
      {...responder}
    >
      <View
        style={{
          height: 6,
          backgroundColor: trackColor,
          borderRadius: 3,
          overflow: "hidden" as const,
        }}
      >
        <View
          style={{
            height: "100%" as const,
            width: `${fillWidth}%`,
            backgroundColor: fillColor,
            borderRadius: 3,
          }}
        />
      </View>
      <View
        style={{
          position: "absolute" as const,
          left: `${fillWidth}%`,
          marginLeft: -12,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: fillColor,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
      />
    </View>
  );
}
