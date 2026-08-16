import { useLocalSearchParams } from "expo-router"
import AddPlaceScreen from "../components/add-place"
import AddPostScreen from "../components/add-post"
import { StyleSheet, View } from "react-native"
import { colors } from "@/styles/global"

export default function NewDataScreen() {
  const {type} = useLocalSearchParams()
  return (
    <View style={styles.container}>
    {type === "post" && <AddPostScreen />}
    {type === "place" && <AddPlaceScreen />}
</View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.zinc900,
  },
})