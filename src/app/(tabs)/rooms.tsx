import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getRoomsWithChoreCount,
  type RoomWithChoreCount,
} from "../../lib/db/client";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export default function RoomsScreen() {
  const router = useRouter();
  const [rooms, setRooms] = useState<RoomWithChoreCount[]>([]);

  const load = useCallback(async () => {
    setRooms(await getRoomsWithChoreCount());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Rooms</Text>
      </View>
      <FlatList
        data={rooms}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() =>
              router.push({ pathname: "./room/[id]", params: { id: item.id } })
            }
          >
            <View style={styles.iconBubble}>
              <Text style={styles.iconText}>{item.icon ?? "🏠"}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.count}>
                {item.total_chores === 1
                  ? "1 chore"
                  : `${item.total_chores} chores`}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundSecondary },
  header: { paddingHorizontal: spacing.base, paddingVertical: spacing.base },
  title: { ...typography.pageTitle, color: colors.textPrimary },
  list: {
    marginHorizontal: spacing.base,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderTertiary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.base,
    backgroundColor: colors.backgroundPrimary,
  },
  rowPressed: { backgroundColor: colors.backgroundSecondary },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.backgroundSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 20 },
  info: { flex: 1, gap: 2 },
  name: { ...typography.cardTitle, color: colors.textPrimary },
  count: { ...typography.caption, color: colors.textTertiary },
  chevron: { fontSize: 20, color: colors.textTertiary },
  separator: { height: 1, backgroundColor: colors.borderTertiary },
});
