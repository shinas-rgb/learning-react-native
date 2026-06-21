import { FlatList, Overlay, Image, Pressable, StyleSheet, Text, View, Modal } from "react-native";
import React, { useState, useEffect, use } from "react"
import CustomSearchBar from "./components/SearchBar";
import { colors } from "@/styles/global";
import Loading from "./components/Loading";
import { Ionicons } from '@expo/vector-icons';
import Pagination from "./components/Pagination";
import { Link, router } from "expo-router";
import api from "@/api/api";
import { useAppToast } from "./hooks/useAppToast";

export default function ExploreScreen() {
  const [query, setQuery] = useState("")
  const [search, setSearch] = useState("")
  const [places, setPlaces] = useState([])
  const [page, setPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)

  const [difficulty, setDifficulty] = useState("")
  const [season, setSeason] = useState("")
  const { success, error } = useAppToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.get(`/places/`, {
          params: {
            page,
            q: search,
            difficulty: difficulty,
            bestSeason: season,
          }
        })
        setPlaces(res.data.data.places)
        setPage(res.data.data.page)
        setTotalPages(res.data.data.totalPages)
        setTotalItems(res.data.data.totalItmes)
      } catch (err) {
        const message = err.response?.data?.message || "Something went wrong"
        error(message)
      } finally {
        setVisible(false)
        setLoading(false)
      }
    }

    fetchData()
  }, [search, page, difficulty, season])

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable onPress={() => setVisible(false)} style={styles.backdrop}>
          <Pressable style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}>
            <View >
              <Text style={{ fontFamily: "CanvaSans-Bold", fontSize: 18, color: colors.zinc100, marginBottom: 10, }}>Difficulty</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {["Easy", "Moderate", "Hard"].map((item) => (
                  <Pressable key={item} onPress={() => {
                    item !== difficulty ? setDifficulty(item) : setDifficulty("")
                  }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                      backgroundColor: item === difficulty ? colors.zinc100 : colors.zinc700,
                    }}>
                    <Text style={{ fontFamily: "CanvaSans-Regular", fontSize: 16, color: item === difficulty ? colors.zinc900 : colors.zinc100 }}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={{ marginTop: 20, }}>
              <Text style={{ fontFamily: "CanvaSans-Bold", fontSize: 18, color: colors.zinc100, marginBottom: 10, }}>Season</Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {["Monsoon", "Winter", "Autonm", "Summer"].map((item) => (
                  <Pressable key={item} onPress={() => {
                    item !== season ? setSeason(item) : setSeason("")
                  }}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 20,
                      backgroundColor: item === season ? colors.zinc100 : colors.zinc700,
                    }}>
                    <Text style={{ fontFamily: "CanvaSans-Regular", fontSize: 16, color: item === season ? colors.zinc900 : colors.zinc100 }}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <FlatList
        style={styles.container}
        data={places}
        keyExtractor={(item) => item._id}

        // search bar
        ListHeaderComponent={
          <View style={styles.search}>
            <CustomSearchBar query={query} setQuery={setQuery} setSearch={setSearch} />
            <View
              style={{ flexDirection: "row-reverse", justifyContent: "space-between", marginTop: 20, }}>
              <Pressable onPress={() => setVisible(true)}>
                <Ionicons name="options" size={25} color={colors.zinc100} />
              </Pressable>
              <Text style={{ fontFamily: "CanvaSans-Regular", fontSize: 16, color: "white" }}>{totalItems} places found</Text>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingTop: 30, paddingBottom: 50 }}

        // place card
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/place/${item._id}`)}
            style={({ pressed }) => [
              styles.placeCard,
              {
                backgroundColor: pressed ? colors.zinc700 : colors.zinc800
              }]}>
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
          </Pressable>
        )}

        ListEmptyComponent={
          <View>
            <Text style={{ color: "white", fontSize: 16, }}>No places found</Text>
          </View>
        }

        // pagination
        ListFooterComponent={
          <>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            <Pressable style={{ marginBottom: 10, marginTop: 20, flexDirection: "row-reverse" }} onPress={() => router.push('add-place')}>
              <Text style={{ fontFamily: "CanvaSans-Regular", color: colors.blue400, fontSize: 16, }}>Add a missing place</Text>
            </Pressable>
          </>
        }
      />
    </>
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
    marginBottom: 20,
    width: "100%"
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // dim background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: colors.zinc800,
    borderWidth: 1,
    borderColor: colors.zinc600,
    borderRadius: 12,
  },
})
