import { Pressable, StyleSheet, Text, View } from "react-native";
import type { ChoreWithFreshness } from "../lib/db/client";
import { getFreshness } from "../lib/freshness";
import { colors } from "../theme/colors";
import { spacing } from "../theme/spacing";
import { typography } from "../theme/typography";
import { FreshnessPill } from "./freshness-pill";

interface Props {
  chore: ChoreWithFreshness;
  onComplete: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function ChoreRow({ chore, onComplete, onEdit }: Props) {
  const { status } = getFreshness(
    chore.freshness_days,
    chore.last_completed_at,
  );

  return (
    <View style={styles.row}>
      <Pressable
        style={styles.info}
        onPress={onEdit ? () => onEdit(chore.id) : undefined}
        accessibilityLabel={onEdit ? `Edit ${chore.name}` : undefined}
      >
        <Text style={styles.name}>{chore.name}</Text>
        <View style={styles.meta}>
          {chore.duration_minutes !== null && (
            <Text style={styles.duration}>{chore.duration_minutes} min</Text>
          )}
          <FreshnessPill status={status} />
        </View>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.doneBtn,
          pressed && styles.doneBtnPressed,
        ]}
        onPress={() => onComplete(chore.id)}
        accessibilityLabel={`Mark ${chore.name} as done`}
      >
        <Text style={styles.doneBtnText}>Done</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.base,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.backgroundPrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderTertiary,
  },
  info: { flex: 1, gap: spacing.xs },
  name: { ...typography.cardTitle, color: colors.textPrimary },
  meta: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  duration: { ...typography.caption, color: colors.textTertiary },
  doneBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.backgroundInfo,
    borderWidth: 1,
    borderColor: colors.borderInfo,
  },
  doneBtnPressed: { opacity: 0.7 },
  doneBtnText: { ...typography.caption, color: colors.textInfo },
});
