import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import api from "@/api/api";
import { colors } from "@/styles/global";
import { Ionicons } from '@expo/vector-icons';

import { ScrollView, StyleSheet, Text, View, Image, Pressable, FlatList } from "react-native";
import { Link, router, useFocusEffect } from "expo-router";
import { checkUser } from "@/utils/auth";

// fix followed

export default function UserProfile() {
  const { id } = useLocalSearchParams()
  const [userProfile, setUserProfile] = useState(null)
  const [user, setUser] = useState(null)
  const [places, setPlaces] = useState([])
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [option, setOption] = useState("posts")
  const [followed, setFollowed] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      console.log("IN fetchData")
      if (await checkUser()) {
        const userRes = await api.get('/users')
        setUser(userRes.data.data.user)
        setFollowed(
          userRes.data.data.user.followings?.some(
            usr => usr._id === id
          )
        )
      }

      const res = await api.get(`/users/user/profile/${id}`)
      console.log("userProfile")
      console.log(res.data.data.filteredUser)
      setUserProfile(res.data.data.filteredUser)

      // setUserProfile(res.data.data.filteredUser)
      // setPlaces(res.data.data.filteredPlaces)
      // setReviews(res.data.data.filteredReviews)

    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong"
      console.log(error)
      console.log(message)
    } finally {
      setLoading(false)
    }
  }

  async function loadPosts() {
    console.log("User Profile")
    console.log(userProfile)
    try {
      setLoading(true)
      console.log("IN loadPost")
      if (!hasMore) {
        return
      }

      const params = new URLSearchParams({
        limit: "20",
        userId: id,
      })

      if (cursor) {
        params.set("cursor", cursor)
      }

      const postRes = await api.get(`/posts/user?${params.toString()}`)
      console.log("posts: ")
      console.log(postRes.data.data.posts)

      setPosts(prev => [
        ...prev,
        ...postRes.data.data.posts
      ])

      setCursor(postRes.data.data.nextCursor)
      setHasMore(postRes.data.data.hasMore)
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong"
      console.log(error)
      console.log(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initData = async () => {
      try {
      await fetchData()
      await loadPosts()
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
    initData()
  }, [])

  function PostCard({ post }) {
    return (
      <View style={styles.postCardContainer}>
        <View style={styles.postCard}>
          <View style={{
            flexDirection: "column",
            gap: 10,
          }}>
            <View style={{
            }}>
              <Image source={{ uri: post.images[0].url }} style={{
                width: 150,
                height: 150,
                borderRadius: 10,
                objectFit: "cover",
              }}
              />
            </View>
            <Link href={`/place/${post.place._id}`} style={styles.text}>
              <Text>Place: {post.place.title || "None"}</Text>
            </Link>
          </View>
        </View>
      </View>
    )
  }

  const manageUser = async () => {
    try {
      if (!followed) {
        if (!user) {
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

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: userProfile.name || "User"
        }}
      />
      <FlatList
        style={styles.container}
        data={posts}
        numColumns={2}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <PostCard post={item} />
          </View>
        )}
        onEndReached={loadPosts}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={() => (
          <View style={styles.container}>
            <View style={styles.profileCard}>
              <Image source={{ uri: userProfile.image.url }} style={styles.imageStyle} />
              <Text style={styles.boldText}>{userProfile.name || "User"}</Text>
              <Text style={styles.paraText}>{userProfile.bio}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <View style={{ flexDirection: "column" }}>
                  <Text style={styles.boldNumText}>{posts.length}</Text>
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
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 10, paddingHorizontal: 20, }}>
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

            <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
              <Pressable onPress={() => setOption("posts")}>
                <Ionicons name={option == "posts" ? "grid" : "grid-outline"} size={28} color="white" />
              </Pressable>
              <Pressable onPress={() => setOption("saved")}>
                <Ionicons name={option == "saved" ? "bookmark" : "bookmark-outline"} size={28} color="white" />
              </Pressable>
              <Pressable onPress={() => setOption("created")}>
                <Ionicons name={option == "created" ? "create" : "create-outline"} size={28} color="white" />
              </Pressable>
            </View>

            <View>
              <Text
                style={{
                  color: colors.zinc100,
                  fontFamily: "CanvaSans-Bold",
                  fontSize: 24,
                  textTransform: "capitalize",
                  marginVertical: 10,
                }}>
                {option}{option !== "posts" && " Places"}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          loading ? <ActivityIndicator /> : null
        }
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.zinc900,
    paddingHorizontal: 10,
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
  },
  postCardContainer: {
    flex: 1,
    flexDirection: "column",
  },
  postCard: {
    borderWidth: 1,
    borderColor: colors.zinc800,
    borderRadius: 10,
    paddingBottom: 10,
  },
  headPost: {
    flexDirection: "row",
    // paddingLeft: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: colors.zinc800,
  },
  postUserName: {
    fontFamily: "CanvaSans-Bold",
    color: "white",
    fontSize: 18,
    marginTop: 5,
  },
  postReviewText: {
    fontFamily: "CanvaSans-Regular",
    color: "white",
    fontSize: 16,
    marginTop: 20,
  },
  text: {
    fontFamily: "CanvaSans-Regular",
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  }
})
