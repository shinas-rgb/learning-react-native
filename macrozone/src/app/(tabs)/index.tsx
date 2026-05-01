import HomeHeader from "@/components/HomeHeader";
import MacroGrid from "@/components/MacroGrid";
import { globalStyles } from "@/styles/global";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView style={[globalStyles.container, {
      flex: 1,
    }]}>
      <Text style={globalStyles.title}>MacroZone</Text>
      <HomeHeader />
      <MacroGrid />
    </ScrollView>
  )
}
