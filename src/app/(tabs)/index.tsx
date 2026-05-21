import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChoreRow } from "../../components/chore-row";
import {
  createCompletion,
  getChoresWithFreshness,
  type ChoreWithFreshness,
} from "../../lib/db/client";
import { getFreshness, needsAttention } from "../../lib/freshness";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

interface RoomSection {
  room_id: string;
  room_name: string;
  room_icon: string | null;
  chores: ChoreWithFreshness[];
}

function groupByRoom(chores: ChoreWithFreshness[]): RoomSection[] {
  const map = new Map<string, RoomSection>();
  for (const chore of chores) {
    if (!map.has(chore.room_id)) {
      map.set(chore.room_id, {
        room_id: chore.room_id,
        room_name: chore.room_name,
        room_icon: chore.room_icon,
        chores: [],
      });
    }
    map.get(chore.room_id)!.chores.push(chore);
  }
  return Array.from(map.values());
}

export default function HomeScreen() {
  const [sections, setSections] = useState<RoomSection[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const all = await getChoresWithFreshness();
    const due = all.filter((c) =>
      needsAttention(
        getFreshness(c.freshness_days, c.last_completed_at).status,
      ),
    );
    setSections(groupByRoom(due));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleComplete = useCallback(
    async (id: string) => {
      await createCompletion(id);
      load();
    },
    [load],
  );

  const allCaughtUp = !loading && sections.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
      </View>

      {allCaughtUp ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>✓</Text>
          <Text style={styles.emptyTitle}>All caught up</Text>
          <Text style={styles.emptySubtitle}>
            No chores need attention right now.
          </Text>
        </View>
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(s) => s.room_id}
          contentContainerStyle={styles.list}
          renderItem={({ item: section }) => (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                {section.room_icon ? (
                  <Text style={styles.sectionIcon}>{section.room_icon}</Text>
                ) : null}
                <Text style={styles.sectionTitle}>{section.room_name}</Text>
              </View>
              <View style={styles.card}>
                {section.chores.map((chore) => (
                  <ChoreRow
                    key={chore.id}
                    chore={chore}
                    onComplete={handleComplete}
                  />
                ))}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundSecondary },
  header: { paddingHorizontal: spacing.base, paddingVertical: spacing.base },
  title: { ...typography.pageTitle, color: colors.textPrimary },
  list: { padding: spacing.base, gap: spacing.lg },
  section: { gap: spacing.sm },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sectionIcon: { fontSize: 16 },
  sectionTitle: {
    ...typography.cardTitle,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderTertiary,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.xxl,
  },
  emptyIcon: { fontSize: 40, color: colors.freshFill },
  emptyTitle: { ...typography.pageTitle, color: colors.textPrimary },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
});
