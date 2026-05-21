import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createChecklist,
  getChecklistsWithChoreCount,
  type ChecklistWithChoreCount,
} from "../../lib/db/client";
import { colors } from "../../theme/colors";
import { spacing } from "../../theme/spacing";
import { typography } from "../../theme/typography";

export default function ChecklistsScreen() {
  const router = useRouter();
  const [checklists, setChecklists] = useState<ChecklistWithChoreCount[]>([]);
  const [newName, setNewName] = useState("");
  const inputRef = useRef<TextInput>(null);

  const load = useCallback(async () => {
    setChecklists(await getChecklistsWithChoreCount());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = useCallback(async () => {
    const name = newName.trim();
    if (!name) return;
    await createChecklist(name);
    setNewName("");
    inputRef.current?.blur();
    load();
  }, [newName, load]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Checklists</Text>
      </View>

      <FlatList
        data={checklists}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() =>
              router.push({
                pathname: "./checklist/[id]",
                params: { id: item.id },
              })
            }
          >
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
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No checklists yet.</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.createRow}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="New checklist name…"
              placeholderTextColor={colors.textTertiary}
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleCreate}
              returnKeyType="done"
            />
            <Pressable
              style={({ pressed }) => [
                styles.addBtn,
                pressed && styles.addBtnPressed,
              ]}
              onPress={handleCreate}
            >
              <Text style={styles.addBtnText}>Add</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundSecondary },
  header: { paddingHorizontal: spacing.base, paddingVertical: spacing.base },
  title: { ...typography.pageTitle, color: colors.textPrimary },
  list: { marginHorizontal: spacing.base, gap: spacing.base },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.base,
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderTertiary,
  },
  rowPressed: { backgroundColor: colors.backgroundSecondary },
  info: { flex: 1, gap: 2 },
  name: { ...typography.cardTitle, color: colors.textPrimary },
  count: { ...typography.caption, color: colors.textTertiary },
  chevron: { fontSize: 20, color: colors.textTertiary },
  separator: { height: spacing.sm },
  empty: { paddingVertical: spacing.xxl, alignItems: "center" },
  emptyText: { ...typography.body, color: colors.textTertiary },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.base,
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderTertiary,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
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
});
