import api from "@/api/api";
import { colors } from "@/styles/global";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Image, Pressable } from "react-native";
import Loading from "../components/Loading";
import { Ionicons } from '@expo/vector-icons';
import { Link, router, useFocusEffect } from "expo-router";

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const [places, setPlaces] = useState([])
  const [option, setOption] = useState("posts")
  const [loading, setLoading] = useState(true)
  const defaultImg = "https://res.cloudinary.com/dyqumsdla/image/upload/v1786527430/hike_uploads/uo37wvuqsquyasoh6m0w.jpg" 

  useFocusEffect(
    useCallback(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/users')
        setUser(res.data.data.user)
        const reviewRes = await api.get('/reviews')
        setReviews(reviewRes.data.data)
        const placeRes = await api.get('/places/user')
        setPlaces(placeRes.data.data)
      } catch (error) {
        const message = error.response?.data?.message || "Something went wrong"
        console.log(message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
)

  if (loading) {
    return <Loading />
  }
  return (
    <ScrollView style={styles.container}>
      {/* <Text style={{
        fontFamily: "CanvaSans-Bold",
        color: "white",
        fontSize: 30,
        marginVertical: 30,
      }}>
        Hey {user.name}!</Text> */}
      <View style={styles.profileCard}>
        {/* <Image source={{ uri: "https://res.cloudinary.com/dyqumsdla/image/upload/v1786527430/hike_uploads/uo37wvuqsquyasoh6m0w.jpg" }} style={styles.imageStyle} /> */}
        <Image source={{ uri: user.image.url || defaultImg}} style={styles.imageStyle} />
        <Text style={styles.boldText}>{user.name || "User"}</Text>
        <Text style={styles.paraText}>{user.bio || "No description"}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.boldNumText}>{reviews.length}</Text>
            <Text style={styles.regularNumText}>Posts</Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.boldNumText}>{user.followers || 0}</Text>
            <Text style={styles.regularNumText}>Followers</Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.boldNumText}>{user.followings || 0}</Text>
            <Text style={styles.regularNumText}>Followings</Text>
          </View>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between", gap: 10, paddingHorizontal: 20,}}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? colors.zinc700 : colors.zinc600 }
          ]}>
          <Text style={styles.paraText}>Your Activity</Text>
        </Pressable>
        <Pressable onPress={() => router.push(`/edit-profile`)}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? colors.blue600 : colors.blue500 }
          ]}>
          <Text style={styles.paraText}>Edit Profile</Text>
        </Pressable>
        </View>
        </View>

        <View style={{flexDirection: "row", justifyContent: "space-around"}}>
          <Pressable onPress={() => setOption("posts")}>
          <Ionicons name={option == "posts" ? "grid" : "grid-outline"} size={28} color="white"/>
          </Pressable>
          <Pressable onPress={() =>setOption("saved")}>
          <Ionicons name={option == "saved" ? "bookmark" : "bookmark-outline"} size={28} color="white"/>
          </Pressable>
          <Pressable onPress={() =>setOption("created")}>
          <Ionicons name={option == "created" ? "create" : "create-outline"} size={28} color="white"/>
          </Pressable>
        </View>

      <View style={{ marginVertical: 20 }}>
        <Text
          style={{
            color: colors.zinc100,
            fontFamily: "CanvaSans-Bold",
            fontSize: 24,
            textTransform: "capitalize",
            marginVertical: 10,
          }}>
          {option} {option !== "posts" && " Places"}</Text>
        <View>
          {option == "posts" && (
            <>
          {reviews.length > 0 ? (
            <>
              {reviews.map((review) => (
                <View key={review._id} style={styles.card}>
                  <Text style={{
                    color: colors.zinc300,
                    fontFamily: "CanvaSans-Bold"
                  }}>{review.placeTitle}</Text>
                  <Text style={{
                    color: colors.zinc400,
                    fontFamily: "CanvaSans-Regular"
                  }}>{review.review}</Text>
                  <Text style={{
                    color: colors.zinc400,
                    fontFamily: "CanvaSans-Regular"
                  }}>Rating: {review.rating}</Text>
                </View>
              ))}
            </>
          ) : (
            <Text style={{
              color: colors.zinc500,
              marginVertical: 5,
            }}>You havn't reviewed places</Text>
          )}
            </>
          )}
          {option == "created" && (
            <>
          {places.length > 0 ? (
            <>
              {places.map((place) => (
                <View key={place._id} style={styles.card}>
                  <Text style={{
                    color: colors.zinc300,
                    fontFamily: "CanvaSans-Bold"
                  }}>{place.title}</Text>
                  <Text style={{
                    color: colors.zinc400,
                    fontFamily: "CanvaSans-Regular"
                  }}>Rating: {place.rating.toFixed(2)}</Text>
                </View>
              ))}
            </>
          ) : (
            <Text style={{
              color: colors.zinc500,
              marginVertical: 5,
            }}>You havn't created any places</Text>
          )}
            </>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.zinc900,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.zinc800,
    padding: 10,
    marginVertical: 10,
    borderRadius: 20,
    flexDirection: "column",
    gap: 6,
  },
  profileCard: {
    flexDirection: "column",
    gap: 10,
    marginVertical: 20,
    paddingVertical: 20,
    backgroundColor: colors.zinc800,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.zinc700,
  },
  imageStyle: {
    display: "block",
    width: 100,
    height: 100,
    objectFit: "conver",
    borderRadius: 200,
    marginLeft: "auto",
    marginRight: "auto",
  },
  boldText: {
    color: colors.zinc100,
    fontFamily: "CanvaSans-Bold",
    fontSize: 24,
    textAlign: "center",
  },
  paraText: {
    color: colors.zinc100,
    fontFamily: "CanvaSans-Regular",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.blue500,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 10,
  flex: 1,
  },
  boldNumText: {
    color: colors.zinc100,
    fontFamily: "CanvaSans-Bold",
    fontSize: 18,
    textAlign: "center",
  },
  regularNumText: {
    color: colors.zinc300,
    fontFamily: "CanvaSans-Regular",
    fontSize: 14,
  }
})
