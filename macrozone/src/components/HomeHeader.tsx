import { globalStyles } from "@/styles/global"
import { View, Text, StyleSheet } from "react-native"

export default function HomeHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: "long",
    month: "long",
    day: 'numeric'
  })

  return (
    <View style={globalStyles.header}>
      <Text style={styles.date}>{currentDate}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  date: {
    fontSize: 14,
    color: '#a0a0b0',
    marginTop: 4,
    marginBottom: 30,
  }
})
