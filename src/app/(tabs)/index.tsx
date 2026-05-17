import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRooms } from "../../lib/db/client";
import type { Room } from "../../lib/db/schema";
import { colors } from "../../theme/colors";

export default function HomeScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    getRooms().then(setRooms).catch(console.error);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Seeded rooms</Text>
      </View>
      <FlatList
        data={rooms}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.icon}>{item.icon ?? "🏠"}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundSecondary },
  header: { padding: 16 },
  title: { fontSize: 24, fontWeight: "500", color: colors.textPrimary },
  list: { paddingHorizontal: 16, gap: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: colors.backgroundPrimary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderTertiary,
  },
  icon: { fontSize: 24 },
  name: { fontSize: 16, color: colors.textPrimary },
});
