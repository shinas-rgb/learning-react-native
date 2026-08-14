import api from "@/api/api";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/styles/global";

export default function FollowingPage() {
  const { id, opt } = useLocalSearchParams()
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [option, setOption] = useState(opt || "followers")

  useEffect(() => {
    const fetchData = async () => {
    try {
      const res = await api.get(`/users/user/profile/${id}`)
      setUserProfile(res.data.data.filteredUser)
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong"
      console.log(message)
    } finally {
      setLoading(false)
    }}
    fetchData()
  }, [id])

  if(loading) {
    return <Loading />
  }
  return (
    <>
      <Stack.Screen
        options={{
          title: userProfile.name,
          headerStyle: { backgroundColor: colors.zinc800 },
          headerTintColor: colors.zinc100
        }} />
        <ScrollView style={styles.container}>
          <View style={styles.head}>
            <Pressable onPress={() => setOption("followers")}>
            <Text style={option === "followers" ? styles.selectedHeadText : styles.normalHeadText}>Followers</Text>
            </Pressable>
            <Pressable onPress={() => setOption("following")}>
            <Text style={option === "following" ? styles.selectedHeadText : styles.normalHeadText}>Following</Text>
            </Pressable>
          </View>
        <View style={{ height: 1, backgroundColor: colors.zinc500, marginBottom: 30, marginTop: 10, }}></View>
        {option === "followers" && (
          <>
        {userProfile.totalFollowers > 0 ? (
          <>
          {userProfile.followers.map((usr) => (
          <Pressable onPress={() => router.push(`/user/${usr._id}`)}
          key={usr._id} style={({pressed}) => [
            styles.userContainer, {
              borderColor: pressed ? colors.zinc600 : colors.zinc700,
            }]}>
            <Image source={{uri: usr.image.url}} style={styles.image}/>
            <Text style={[styles.normalHeadText, {marginTop: 12}]}>{usr.name}</Text>
          </Pressable>
          ))}
          </>
        ):(
          <View>
            <Text style={styles.normalHeadText}>No followeres</Text>
          </View>
        )}
          </>
        )}

        {option === "following" && (
          <>
        {userProfile.totalFollowings > 0 ? (
          <>
          {userProfile.followings.map((usr) => (
          <Pressable onPress={() => router.push(`/user/${usr._id}`)}
          key={usr._id} style={({pressed}) => [
            styles.userContainer, {
              borderColor: pressed ? colors.zinc600 : colors.zinc700,
            }]}>
            <Image source={{uri: usr.image.url}} style={styles.image}/>
            <Text style={[styles.normalHeadText, {marginTop: 12}]}>{usr.name}</Text>
          </Pressable>
          ))}
          </>
        ):(
          <View>
            <Text style={styles.normalHeadText}>No followings</Text>
          </View>
        )}
          </>
        )}
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
  head: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  selectedHeadText: {
    fontFamily: "CanvaSans-Bold",
    color: colors.zinc100,
    fontSize: 18,
  },
  normalHeadText: {
    fontFamily: "CanvaSans-Regular",
    color: colors.zinc100,
    fontSize: 18,
  },
  userContainer: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.zinc800,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 10,
  },
  image: {
    objectFit: "cover",
    height: 50,
    width: 50,
    borderRadius: 150,
  }
})