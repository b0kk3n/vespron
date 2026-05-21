import { StyleSheet, Text, View } from "react-native";
import type { FreshnessStatus } from "../lib/freshness";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const pillStyles: Record<
  Exclude<FreshnessStatus, "untracked">,
  { bg: string; text: string }
> = {
  fresh: { bg: colors.freshBg, text: colors.freshText },
  amber: { bg: colors.amberBg, text: colors.amberText },
  due: { bg: colors.coralBg, text: colors.coralText },
};

const labels: Record<Exclude<FreshnessStatus, "untracked">, string> = {
  fresh: "Fresh",
  amber: "Soon",
  due: "Due",
};

interface Props {
  status: FreshnessStatus;
}

export function FreshnessPill({ status }: Props) {
  if (status === "untracked") return null;
  const { bg, text } = pillStyles[status];
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{labels[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
    alignSelf: "flex-start",
  },
  label: {
    ...typography.small,
  },
});
