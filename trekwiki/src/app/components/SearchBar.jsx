import { colors } from "@/styles/global"
import { StyleSheet } from "react-native"
import { Searchbar } from "react-native-paper"

export default function CustomSearchBar({ query, setQuery, setSearch }) {
  return (
    <Searchbar style={styles.search}
      inputStyle={{
        fontFamily: "CanvaSans-Regular",
        paddingVertical: 0,
        minHeight: 0,
        color: colors.zinc100,
      }}
      placeholderTextColor={colors.zinc400}
      iconColor={colors.zinc100}

      placeholder="Search"
      onChangeText={setQuery}
      value={query}
      onSubmitEditing={() => setSearch(query)}
    />
  )
}

const styles = StyleSheet.create({
  search: {
    height: 45,
    marginHorizontal: 30,
    backgroundColor: colors.zinc800,
    borderWidth: 1,
    borderColor: colors.zinc600,
  }
})
