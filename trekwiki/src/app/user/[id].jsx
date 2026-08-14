import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import api from "@/api/api";
import { colors } from "@/styles/global";
import { Ionicons } from '@expo/vector-icons';

import { ScrollView, StyleSheet, Text, View, Image, Pressable } from "react-native";
import { Link, router, useFocusEffect } from "expo-router";
import { checkUser } from "@/utils/auth";

export default function UserProfile() {
  const { id } = useLocalSearchParams()
  const [userProfile, setUserProfile] = useState(null)
  const [user, setUser] = useState(null)
  const [places, setPlaces] = useState([])
  const [reviews, setReviews] = useState([])
  const [option, setOption] = useState("posts")
  const [followed, setFollowed] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
    try {
      if(!user) {
        setUser(await checkUser())
      }

      if(user) {
        console.log("Yes user")
        const userRes = await api.get('/users')
        setUser(userRes.data.data.user)
        setFollowed(
          userRes.data.data.user.followings?.some(
            usr => usr._id === id
          )
        )
      }

      const res = await api.get(`/users/user/profile/${id}`)
      
      setUserProfile(res.data.data.filteredUser)
      setPlaces(res.data.data.filteredPlaces)
      setReviews(res.data.data.filteredReviews)

    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong"
      console.log(error)
      console.log(message)
    } finally {
      setLoading(false)
    }}
    fetchData()
  }, [])

  const manageUser = async () => {
    try {
      if(!followed) {
        if(!user) {
          return router.push(`/auth`)
        }
      setLoading(true)
        const res = await api.post(`/users/follow/${id}`)
        setUser(res.data.data.user)
        setUserProfile(res.data.data.targetUser)
        setFollowed(true)
      } else {
        const res = await api.delete(`/users/unfollow/${id}`)
        setUser(res.data.data.user)
        setUserProfile(res.data.data.targetUser)
        setFollowed(false)
      }
      setLoading(false)
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong"
      console.log(message)
      console.log(error)
    }
  }

  if(loading) {
    return <Loading />
  }

  return (
      <>
      <Stack.Screen
        options={{
          title: userProfile.name
        }}
      />
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <Image source={{ uri: userProfile.image.url}} style={styles.imageStyle} />
        <Text style={styles.boldText}>{userProfile.name}</Text>
        <Text style={styles.paraText}>{userProfile.bio}</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.boldNumText}>{reviews.length}</Text>
            <Text style={styles.regularNumText}>Posts</Text>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.boldNumText}>{userProfile.totalFollowers}</Text>
          <Link href={{
            pathname: `/user/following`,
            params: {
              id,
              opt: "followers",
            }
          }}>
            <Text style={styles.regularNumText}>Followers</Text>
          </Link>
          </View>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.boldNumText}>{userProfile.totalFollowings}</Text>
          <Link href={{
            pathname: `/user/following`,
            params: {
              id,
              opt: "following"
            }
          }}>
            <Text style={styles.regularNumText}>Following</Text>
            </Link>
          </View>
        </View>
        <View style={{flexDirection: "row", justifyContent: "space-between", gap: 10, paddingHorizontal: 20,}}>
            {followed ? (
              <Pressable onPress={() => manageUser()}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: pressed ? colors.blue600 : colors.blue500 }
                ]}>
                <Text style={styles.paraText}>Unfollow</Text>
              </Pressable>
            ) : (
              <Pressable onPress={() => manageUser()}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: pressed ? colors.blue600 : colors.blue500 }
                ]}>
                <Text style={styles.paraText}>Follow</Text>
              </Pressable>
            )}
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
                  }}>{review.placeName}</Text>
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
      </>
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
