import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChoreRow } from "../../components/chore-row";
import {
  createCompletion,
  getChoresWithFreshnessByRoom,
  type ChoreWithFreshness,
} from "../../lib/db/client";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [chores, setChores] = useState<ChoreWithFreshness[]>([]);
  const [roomName, setRoomName] = useState("");
  const [roomIcon, setRoomIcon] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    const data = await getChoresWithFreshnessByRoom(id);
    setChores(data);
    if (data.length > 0) {
      setRoomName(data[0].room_name);
      setRoomIcon(data[0].room_icon);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleComplete = useCallback(
    async (choreId: string) => {
      await createCompletion(choreId);
      load();
    },
    [load],
  );

  const handleEdit = useCallback(
    (choreId: string) => {
      router.push({ pathname: "./chore/[id]", params: { id: choreId } });
    },
    [router],
  );

  const handleAddChore = useCallback(() => {
    router.push({
      pathname: "./chore/[id]",
      params: { id: "new", room_id: id },
    });
  }, [router, id]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Rooms</Text>
        </Pressable>
        <View style={styles.titleRow}>
          <View style={styles.titleLeft}>
            {roomIcon ? <Text style={styles.titleIcon}>{roomIcon}</Text> : null}
            <Text style={styles.title}>{roomName}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.addBtn,
              pressed && styles.addBtnPressed,
            ]}
            onPress={handleAddChore}
          >
            <Text style={styles.addBtnText}>+ Add chore</Text>
          </Pressable>
        </View>
      </View>

      {chores.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No chores in this room yet.</Text>
          <Text style={styles.emptyHint}>
            Tap "+ Add chore" to get started.
          </Text>
        </View>
      ) : (
        <FlatList
          data={chores}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <ChoreRow
              chore={item}
              onComplete={handleComplete}
              onEdit={handleEdit}
            />
          )}
          style={styles.card}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundSecondary },
  header: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.base,
    gap: spacing.xs,
  },
  backBtn: { alignSelf: "flex-start" },
  backText: { ...typography.body, color: colors.textInfo },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleLeft: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  titleIcon: { fontSize: 24 },
  title: { ...typography.pageTitle, color: colors.textPrimary },
  addBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.backgroundInfo,
    borderWidth: 1,
    borderColor: colors.borderInfo,
  },
  addBtnPressed: { opacity: 0.7 },
  addBtnText: { ...typography.caption, color: colors.textInfo },
  card: {
    marginHorizontal: spacing.base,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.borderTertiary,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  emptyText: { ...typography.body, color: colors.textTertiary },
  emptyHint: { ...typography.caption, color: colors.textTertiary },
});
