import { Text, View, StyleSheet } from "react-native";
import * as Device from "expo-device"

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
      <Text>Hi</Text>
      <Text>{Device.deviceName}</Text>
      <Text>{Device.brand}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
