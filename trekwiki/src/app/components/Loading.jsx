import { colors } from "@/styles/global";
import { ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Loading() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, justifyContent: "center", backgroundColor: colors.zinc950 }}>
        <ActivityIndicator size="large" color="white" />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
