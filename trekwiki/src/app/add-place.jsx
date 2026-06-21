import { colors } from "@/styles/global";
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Button, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Checkbox } from "expo-checkbox";
import api from "@/api/api";
import { useAppToast } from "./hooks/useAppToast"
import { router } from "expo-router";

export default function AddPlaceScreen() {
  const { control, handleSubmit, } = useForm()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const { success, error } = useAppToast()

  const [difficulty, setDifficulty] = useState({
    Easy: false,
    Moderate: false,
    Hard: false
  })
  const [season, setSeason] = useState({
    Autumn: false,
    Winter: false,
    Summer: false,
    Monsoon: false,
  })

  const [features, setFeatures] = useState([''])
  const [tips, setTips] = useState([''])

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      if (!data.title) {
        error("Title is required")
        return
      }
      if (!data.description) {
        error("Description is required")
        return
      }
      if (!data.lon || !data.lat) {
        error("Coordinates is required")
        return
      }

      const bestSeasons = Object.keys(season).filter(key => season[key])
      const difficulties = Object.keys(difficulty).filter(key => difficulty[key])

      if (bestSeasons.length < 1) {
        error("Select atlesast one season")
        return
      }
      if (difficulties.length < 1) {
        error("Select atlesast one difficulty")
        return
      }

      if (!data.duration) {
        error("Duration is required")
        return
      }
      if (!data.distance) {
        error("Distance is required")
        return
      }
      if (!images || images.length === 0) {
        error("Select atleast one image")
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

      formData.append("title", data.title ?? "")
      formData.append("description", data.description ?? "")
      formData.append("lon", data.lon ?? "")
      formData.append("lat", data.lat ?? "")
      formData.append("season", data.season ?? "")
      formData.append("time", data.time ?? "")
      formData.append("route", data.route ?? "")
      formData.append("duration", data.duration ?? "")
      formData.append("distance", data.distance ?? "")

      formData.append("difficulty", JSON.stringify(difficulties))
      formData.append("bestSeason", JSON.stringify(bestSeasons))
      formData.append("tips", JSON.stringify(tips))
      formData.append("features", JSON.stringify(features))


      const res = await api.post('/places', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      success(res.data.message)
      router.push("/")
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong"
      error(message)
      console.log("ERROR", err)
      console.log("CODE", err.code)
      console.log("RESPONSE:", err.response?.data);
      console.log("STATUS:", err.response?.status);
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

  const updateFeature = (text, index) => {
    const updated = [...features]
    updated[index] = text
    setFeatures(updated)
  }

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateTip = (text, index) => {
    const updated = [...tips]
    updated[index] = text
    setTips(updated)
  }

  const addTip = () => {
    setTips([...tips, '']);
  };

  const removeTip = (index) => {
    setTips(tips.filter((_, i) => i !== index));
  };

  return (
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
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Place title"
              textContentType="name"
              onBlur={onBlur}
              placeholderTextColor={colors.zinc400}
              style={styles.input}
            />
          )} />
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

        <View style={{ flexDirection: "row", gap: 5 }}>
          <Controller
            control={control}
            name="lon"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="Longitude"
                keyboardType="numeric"
                onBlur={onBlur}
                placeholderTextColor={colors.zinc400}
                style={[styles.input, { flex: 1 }]}
              />
            )} />

          <Controller
            control={control}
            name="lat"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="Lattitude"
                keyboardType="numeric"
                onBlur={onBlur}
                placeholderTextColor={colors.zinc400}
                style={[styles.input, { flex: 1 }]}
              />
            )} />
        </View>

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

        <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10 }}>
          <View>
            <Text style={styles.title}>Best Season</Text>
            <View style={{ flexDirection: "column", gap: 10, }}>
              {Object.keys(season).map(item => (
                <View key={item} style={{ flexDirection: "row", gap: 8, }}>
                  <Checkbox
                    value={season[item]}
                    onValueChange={value =>
                      setSeason(prev => ({
                        ...prev,
                        [item]: value,
                      }))}
                    color={season[item] ? colors.emerald400 : undefined}
                    style={{
                      borderRadius: 6
                    }}
                  />
                  <Text style={styles.text}>{item} </Text>
                </View>
              ))}
            </View>
          </View>
          <View>
            <Text style={styles.title}>Difficulty</Text>
            <View style={{ flexDirection: "column", gap: 10, }}>
              {Object.keys(difficulty).map(item => (
                <View key={item} style={{ flexDirection: "row", gap: 8, }}>
                  <Checkbox
                    value={difficulty[item]}
                    onValueChange={value =>
                      setDifficulty(prev => ({
                        ...prev,
                        [item]: value,
                      }))}
                    color={difficulty[item] ? colors.emerald400 : undefined}
                    style={{
                      borderRadius: 6
                    }}
                  />
                  <Text style={styles.text}>{item} </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* season */}
        <Controller
          control={control}
          name="season"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Short about the season"
              keyboardType="default"
              onBlur={onBlur}
              placeholderTextColor={colors.zinc400}
              style={[styles.input]}
              multiline={true}
              numberOfLines={2}
            />
          )} />

        {/* best time */}
        <Controller
          control={control}
          name="time"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Short about the best time"
              keyboardType="default"
              onBlur={onBlur}
              placeholderTextColor={colors.zinc400}
              style={[styles.input]}
              multiline={true}
              numberOfLines={2}
            />
          )} />

        {/* best route */}
        <Controller
          control={control}
          name="route"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              onChangeText={onChange}
              value={value}
              placeholder="Short about the best route"
              keyboardType="default"
              onBlur={onBlur}
              placeholderTextColor={colors.zinc400}
              style={[styles.input]}
              multiline={true}
              numberOfLines={2}
            />
          )} />

        {/* duration */}
        <View style={{ flexDirection: "row", gap: 5 }}>
          <Controller
            control={control}
            name="duration"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="Duration"
                keyboardType="numeric"
                onBlur={onBlur}
                placeholderTextColor={colors.zinc400}
                style={[styles.input, { flex: 1 }]}
              />
            )} />

          {/* distance */}
          <Controller
            control={control}
            name="distance"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="Distance"
                keyboardType="numeric"
                onBlur={onBlur}
                placeholderTextColor={colors.zinc400}
                style={[styles.input, { flex: 1 }]}
              />
            )} />
        </View>

        {/* features */}
        {/* 123 */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.title}>Features</Text>
            <TouchableOpacity onPress={addFeature} style={{ flexDirection: "row-reverse" }}>
              <Text style={{ fontSize: 40, color: colors.lime400, fontFamily: "CanvaSans-Bold", marginLeft: 5 }}>+</Text>
            </TouchableOpacity>
          </View>
          {features.map((feature, index) => (
            <View key={index} style={{ flexDirection: "row" }}>
              <TextInput
                onChangeText={(text) => updateFeature(text, index)}
                value={feature}
                placeholder={`Feature ${index + 1}`}
                keyboardType="default"
                placeholderTextColor={colors.zinc400}
                style={[styles.input, { marginVertical: 5, flex: 1 }]}
                multiline={true}
                numberOfLines={2}
              />
              <TouchableOpacity onPress={() => removeFeature(index)}>
                <Text style={{ fontSize: 16, marginLeft: 10, marginTop: 10 }}>❌</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={styles.title}>Tips</Text>
            <TouchableOpacity onPress={addTip} style={{ flexDirection: "row-reverse" }}>
              <Text style={{ fontSize: 40, color: colors.lime400, fontFamily: "CanvaSans-Bold", marginLeft: 5 }}>+</Text>
            </TouchableOpacity>
          </View>
          {tips.map((tip, index) => (
            <View key={index} style={{ flexDirection: "row" }}>
              <TextInput
                onChangeText={(text) => updateTip(text, index)}
                value={tip}
                placeholder={`Tip ${index + 1}`}
                keyboardType="default"
                placeholderTextColor={colors.zinc400}
                style={[styles.input, { marginVertical: 5, flex: 1 }]}
                multiline={true}
                numberOfLines={2}
              />
              <TouchableOpacity onPress={() => removeTip(index)}>
                <Text style={{ fontSize: 16, marginLeft: 10, marginTop: 10 }}>❌</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Submit button */}
        <Pressable
          onPress={handleSubmit(onSubmit)}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? colors.violet500 : colors.violet400 }]}>
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.zinc900,
    paddingHorizontal: 20,
    paddingVertical: 20,
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
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.zinc500,
    marginBottom: 70,
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
  }
})
