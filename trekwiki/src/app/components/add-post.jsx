import { colors } from "@/styles/global"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { useAppToast } from "../hooks/useAppToast"
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router"
import api from "@/api/api"
import { SearchBar } from "react-native-screens"


function PlaceSelector({
  places, visible, setVisible, value, onSelect, search, setSearch, setSelectedPlace
}) {
  const filteredPlaces = places.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

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
            <View style={{
              flexDirection: "column",
              gap: 10,
            }}>
              <View style={{flexDirection: "row", gap: 5, justifyContent: "space-between"}}>
                    <TextInput
                      onChangeText={setSearch}
                      value={search}
                      placeholder="Search place..."
                      placeholderTextColor={colors.zinc400}
                      style={styles.input}
                    />
                    <Pressable onPress={() => setSearch("")}
                    style={{marginTop: 6}}>
                      <Ionicons name="close-circle" size={24} color={colors.red400}/>
                    </Pressable>
              </View>
                    <FlatList
                    style={{
                      maxHeight: 200,
                    }}
                      data={!search && filteredPlaces}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            // onChange(item._id)
                            setSearch(item.title);
                            setSelectedPlace(item)
                            setVisible(false)
                          }}
                          style={{
                            marginVertical: 5,
                            borderWidth: 1,
                            padding: 10,
                            borderRadius: 10,
                            borderColor: colors.zinc600,
                            backgroundColor: colors.zinc700,
                          }}
                        >
                          <Text style={styles.text}>{item.title}</Text>
                        </TouchableOpacity>
                      )}
                    />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      <Pressable
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? colors.zinc800 : colors.zinc700 }]}>
        <Text style={{ color: colors.zinc100, textAlign: "center", fontFamily: "CanvaSans-Bold", fontSize: 15, }}>
          {/* {loading ? (
            <ActivityIndicator size="small" color="black" />
          ) : (
            "Select place"
          )} */}
            Select place
        </Text>
      </Pressable>
    </>
  )
}

export default function AddPostScreen() {
  const { control, handleSubmit, } = useForm()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [places, setPlaces] = useState([])
  const { success, error } = useAppToast()
  const [selectedPlace, setSelectedPlace] = useState(null)
const [visible, setVisible] = useState(false)
  const [search, setSearch] = useState("")

  const fetchPlaces = async () => {
    try {
      const res = await api.get(`/places/titles`)
      setPlaces(res.data.data)
    } catch (error) {
      console.log(error)
      const message = error.response?.data?.message || "Something went wrong"
      console.log(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaces()
  }, [])

  async function onSubmit(data) {
    setLoading(true)
    try {
      if (!data.description) {
        error("Description required")
        return
      }

      if (!images || images.length === 0) {
        error("Select atleast one image")
        return
      }

      if(!search || search === ""){
        error("Select a place")
        return
      } 

      const formData = new FormData()

      images.forEach((image, i) => {
        formData.append("images", {
          uri: image.uri,
          type: image.mimeType || "image/jpeg",
          name: image.fileName || `image-${i}.jpg`,
        })
      })

      formData.append("description", data.description)
      formData.append("placeId", selectedPlace._id)

      if(!selectedPlace._id) {
        error("Select place from the list")
        return
      }
      const res = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      success(res.data.message)
      router.push('/')
    } catch (err) {
      console.log(err)
      const message = err.response?.data?.message || "Something went wrong"
    error(message)
    console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets);
    }
  };

  const removeImage = (uri) => {
    setImages((prev) => prev.filter((image) => image.uri !== uri));
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Modal transparent visible={loading}>
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </Modal>
        <View style={{ flexDirection: "column", gap: 10, }}>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Description"
              textContentType="name"
              onBlur={onBlur}
              placeholderTextColor={colors.zinc400}
              style={styles.input}
              multiline={true}
              numberOfLines={10}
            />
          )} />
        <Pressable title="Add Images" onPress={pickImage} style={({ pressed }) => ({
          backgroundColor: pressed ? colors.blue400 : colors.blue300,
          padding: 10,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.zinc300,
        })} >
          <Text style={{ color: colors.zinc900, fontFamily: "CanvaSans-Bold", textAlign: "center" }}>Add Images</Text>
        </Pressable>

        {images.length > 0 && (
          <ScrollView horizontal>
            {images.map((img) => (
              <View
                key={img.uri} >
                <Image
                  source={{ uri: img.uri }}
                  style={{
                    width: 80,
                    height: 80,
                    margin: 5,
                    borderRadius: 8,
                  }}
                />
                <Ionicons name="trash" style={{ position: "absolute", right: 10, top: 10 }} size={20} color={colors.red500}
                  onPress={() => removeImage(img.uri)} />
              </View>
            ))}
          </ScrollView>
        )}

          {search !== "" && (
            <Text style={[styles.text, {
              backgroundColor: colors.zinc950,
              padding: 15,
              borderWidth: 1,
              borderColor: colors.zinc800,
              borderRadius: 10,
            }]}>{search}</Text>
          )}
          <Controller
            control={control}
            name="place"
            render={({ field: { onChange, value } }) => (
              <PlaceSelector
              places={places}
              visible={visible}
              setVisible={setVisible}
                value={value}
                search={search}
                setSearch={setSearch}
                onSelect={onChange}
                setSelectedPlace={setSelectedPlace}
              />
            )}
          />
        {/* Submit button */}
        <Pressable
          onPress={handleSubmit(onSubmit)}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? colors.violet500 : colors.violet400, marginTop: 20 }]}>
          <Text style={{ color: colors.zinc100, textAlign: "center", fontFamily: "CanvaSans-Bold", fontSize: 15, }}>
            {loading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              "Submit"
            )}
          </Text>
        </Pressable>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.zinc900,
    paddingHorizontal: 20,
    paddingVertical: 150,
  },
  input: {
    backgroundColor: colors.zinc800,
    borderWidth: 1,
    borderColor: colors.zinc700,
    borderRadius: 12,
    paddingHorizontal: 15,
    color: "white",
    fontFamily: "CanvaSans-Regular",
    fontSize: 16,
  flex: 1,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.zinc500,
    marginBottom: 40,
  },
  title: {
    color: colors.zinc200,
    fontFamily: "CanvaSans-Bold",
    fontSize: 18,
    marginVertical: 10,
  },
  text: {
    fontFamily: "CanvaSans-Regular",
    color: colors.zinc300,
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: colors.zinc800,
      borderWidth: 1,
      borderColor: colors.zinc600,
      borderRadius: 12,
    },
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)", // dim background
      justifyContent: "center",
      alignItems: "center",
    },
    headText:{
       fontFamily: "CanvaSans-Bold", fontSize: 17, color: "white", marginBottom: 20, 
    },
    button: {
      backgroundColor: colors.zinc700,
      padding: 10,
      borderRadius: 10,
    }, 
    buttonText: {
      fontFamily: "CanvaSans-Regular",
      color: colors.zinc100,
      textAlign: "center",
    }
})