import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../styles/global";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.zinc900,
  },
  header:{
    paddingTop: 50,
  },
  headText: {
    fontFamily: "Alpino-Bold",
    color: "white",
    fontSize: 30,
    textAlign: "center"
  },
})
