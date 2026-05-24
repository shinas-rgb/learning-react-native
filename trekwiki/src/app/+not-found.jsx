import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";
import { colors, globalStyles } from "../styles/global";

export default function notFoundPage() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={[globalStyles.container, { justifyContent: "center" }]}>
        <Text style={{
          color: "white",
          fontSize: 30,
          textAlign: "center",
          marginBottom: 20,
          fontFamily: "CanvaSans-Bold"
        }}>This screen doesn't exist</Text>
        <Link href="/" style={{
          textAlign: "center",
          color: colors.blue400,
          fontSize: 18,
        }}>Go to Home</Link>
      </View>
    </>
  )
}
