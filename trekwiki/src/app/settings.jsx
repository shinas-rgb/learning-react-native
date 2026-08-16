import { colors } from "@/styles/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { useAuth } from "./context/AuthContext";

export default function ProfilePage() {
  const {logout} = useAuth()
  const navigation = useNavigation()
  const toast = useToast()

  async function logOut() {
    await AsyncStorage.removeItem("token")
    toast.show("Logout successful", {
      type: "custom",
      style: {
        backgroundColor: colors.green400,
        paddingHorizontal: 40,
        borderRadius: 999,
      },
      textStyle: {
        color: "white",
        fontFamily: "CanvaSans-Regular"
      }
    })
    logout()
    router.replace('/test')
  }
  return (
    <View style={styles.container}>
      <Pressable onPress={logOut}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? colors.red500 : colors.red600 }]}>
        <Text style={{
          color: "white",
          textAlign: "center",
          fontFamily: "CanvaSans-Regular",
          fontSize: 16,
        }}>Log Out</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.zinc900,
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 20,
    marginVertical: 30,
  }
})
