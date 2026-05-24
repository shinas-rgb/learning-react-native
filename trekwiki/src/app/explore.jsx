import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react"
import CustomSearchBar from "./components/SearchBar";
import { colors } from "@/styles/global";
import { useToast } from "react-native-toast-notifications";
import axios from "axios"
import Loading from "./components/Loading";
import { Ionicons } from '@expo/vector-icons';
import Pagination from "./components/Pagination";

export default function ExploreScreen() {
  const toast = useToast()
  const [query, setQuery] = useState("")
  const [search, setSearch] = useState("")
  const [places, setPlaces] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // toast.show(search, {
    //   type: "custom",
    //   style: {
    //     backgroundColor: colors.zinc100,
    //     paddingHorizontal: 40,
    //     borderRadius: 999,
    //   },
    //   textStyle: {
    //     color: "black",
    //     fontFamily: "CanvaSans-Regular"
    //   }
    // })

    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`http://192.168.1.10:8080/api/places/`, {
          params: {
            page,
            q: search,
          }
        })
        setPlaces(res.data.data.places)
        setPage(res.data.data.page)
        setTotalPages(res.data.data.totalPages)
      } catch (error) {
        const message = error.response?.data?.message || "Something went wrong"
        console.log(message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [search, page])

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <FlatList
      style={styles.container}
      data={places}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={
        <View style={styles.search}>
          <CustomSearchBar query={query} setQuery={setQuery} setSearch={setSearch} />
        </View>
      }

      contentContainerStyle={{ paddingTop: 30, paddingBottom: 50 }}
      renderItem={({ item }) => (
        <View style={styles.placeCard}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.placeTitle}>{item.title}</Text>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <Text style={{ color: colors.zinc400 }}>{item.rating.toFixed(2)}</Text>
              <Ionicons name="star" size={15} color={colors.amber400} />
            </View>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-around", marginTop: 20 }}>
            {item.images.slice(0, 2).map((image) => (
              <Image source={{ uri: image.url }} key={image.url}
                style={{
                  width: 120,
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 20,
                }}
              />
            ))}
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View>
          <Text style={{ color: "white", fontSize: 16, }}>No places found</Text>
        </View>
      }
      ListFooterComponent={
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.zinc900,
    paddingHorizontal: 20,
  },
  placeCard: {
    padding: 20,
    backgroundColor: colors.zinc800,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.zinc700,
  },
  placeTitle: {
    color: "white",
    fontFamily: "CanvaSans-Bold",
    fontSize: 20,
  },
  search: {
    marginBottom: 40,
  }
})
