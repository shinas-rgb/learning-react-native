import { colors } from "@/styles/global";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Pagination({ page, totalPages, setPage }) {
  const end = page + 2 >= totalPages ? totalPages : page + 2
  const start = Math.max(page - 2, 1)
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i)
  return (
    <View style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {totalPages !== 0 && (
        <Pressable onPress={() => setPage(1)}
          style={[{
            backgroundColor: page == 1 ? colors.zinc200 : colors.zinc700,
          }, styles.button]}>
          <Text style={{ color: page == 1 ? "black" : "white" }}>1</Text>
        </Pressable>
      )}
      {page > 3 && (
        <Text style={{ color: "white", marginHorizontal: 2 }}>...</Text>
      )}
      {numbers.map((number, index) => (
        <View key={index} style={{ marginHorizontal: 3 }}>
          {number != 1 && number != totalPages && (
            <Pressable onPress={() => setPage(number)}
              style={[{
                backgroundColor: page == number ? colors.zinc200 : colors.zinc700,
              }, styles.button]}>
              <Text style={{ color: page == number ? "black" : "white" }}>{number}</Text>
            </Pressable>
          )}
        </View>
      ))}
      {page < totalPages - 3 && (
        <Text style={{ color: "white", marginHorizontal: 2 }}>...</Text>
      )}
      {totalPages !== 1 && totalPages !== 0 && (
        <Pressable onPress={() => setPage(totalPages)}
          style={[{
            backgroundColor: page == totalPages ? colors.zinc200 : colors.zinc700,
          }, styles.button]}>
          <Text style={{ color: page == totalPages ? "black" : "white" }}>{totalPages}</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.zinc600,
  }
})

