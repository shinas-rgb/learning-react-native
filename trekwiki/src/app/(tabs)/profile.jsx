import api from "@/api/api";
import { colors } from "@/styles/global";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Image, Pressable, FlatList } from "react-native";
import Loading from "../components/Loading";
import { Ionicons } from '@expo/vector-icons';
import { Link, router, useFocusEffect } from "expo-router";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [places, setPlaces] = useState([])
  const [option, setOption] = useState("posts")
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState(null)

  // useFocusEffect(
  //   useCallback(() => {
  //     fetchData()
  //   }, [])
  // )
  const fetchData = async () => {
    try {
      const res = await api.get('/users')
      setUserProfile(res.data.data.user)
      const reviewRes = await api.get('/reviews')
      setReviews(reviewRes.data.data)
      const placeRes = await api.get('/places/user')
      setPlaces(placeRes.data.data)
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong"
      console.log(message)
      console.log(error)
    } finally {
    }
  }

  async function loadPosts() {
    try {
      if (!hasMore) {
        return
      }

      const params = new URLSearchParams({
        limit: "20",
        userId: userProfile._id,
      })

      if (cursor) {
        params.set("cursor", cursor)
      }

      const postRes = await api.get(`/posts/user?${params.toString()}`)

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
              <Text>{post.place.title || "None"}</Text>
            </Link>
          </View>
        </View>
      </View>
    )
  }

  if (loading) {
    return <Loading />
  }
  return (
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
         <Image source={{ uri: userProfile.image.url}} style={styles.imageStyle} />
         <Text style={styles.boldText}>{userProfile.name}</Text>
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
               id: userProfile._id,
               opt: "followers"
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
               id: userProfile._id,
               opt: "following"
             }
           }}>
             <Text style={styles.regularNumText}>Following</Text>
             </Link>
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
            </View>
          </View>
        )}
        ListFooterComponent={
          loading ? <ActivityIndicator /> : null
        }
      />
    // <ScrollView style={styles.container}>
    //     <View>
    //       {option == "posts" && (
    //         <>
    //       {reviews.length > 0 ? (
    //         <>
    //           {reviews.map((review) => (
    //             <View key={review._id} style={styles.card}>
    //               <Text style={{
    //                 color: colors.zinc300,
    //                 fontFamily: "CanvaSans-Bold"
    //               }}>{review.placeTitle}</Text>
    //               <Text style={{
    //                 color: colors.zinc400,
    //                 fontFamily: "CanvaSans-Regular"
    //               }}>{review.review}</Text>
    //               <Text style={{
    //                 color: colors.zinc400,
    //                 fontFamily: "CanvaSans-Regular"
    //               }}>Rating: {review.rating}</Text>
    //             </View>
    //           ))}
    //         </>
    //       ) : (
    //         <Text style={{
    //           color: colors.zinc500,
    //           marginVertical: 5,
    //         }}>You havn't reviewed places</Text>
    //       )}
    //         </>
    //       )}
    //       {option == "created" && (
    //         <>
    //       {places.length > 0 ? (
    //         <>
    //           {places.map((place) => (
    //             <View key={place._id} style={styles.card}>
    //               <Text style={{
    //                 color: colors.zinc300,
    //                 fontFamily: "CanvaSans-Bold"
    //               }}>{place.title}</Text>
    //               <Text style={{
    //                 color: colors.zinc400,
    //                 fontFamily: "CanvaSans-Regular"
    //               }}>Rating: {place.rating.toFixed(2)}</Text>
    //             </View>
    //           ))}
    //         </>
    //       ) : (
    //         <Text style={{
    //           color: colors.zinc500,
    //           marginVertical: 5,
    //         }}>You havn't created any places</Text>
    //       )}
    //         </>
    //       )}
    //     </View>
    //   </View>
    // </ScrollView>
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
    marginBottom: 15,
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
