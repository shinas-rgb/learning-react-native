import { View, Text, StyleSheet, ScrollView, Image, FlatList, ActivityIndicator, Dimensions } from "react-native";
import { colors } from "../../styles/global";
import { useCallback, useEffect, useState } from "react";
import Loading from "../components/Loading";
import api from "@/api/api";
import { Link, useFocusEffect } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

// craeate a post model and apis

export default function HomeScreen() {
  const [posts, setPosts] = useState([])
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [currentIntex, setCurrentIntex] = useState(0)
  const defaultImg =  "https://res.cloudinary.com/dyqumsdla/image/upload/v1786527430/hike_uploads/uo37wvuqsquyasoh6m0w.jpg"
  const { width } = Dimensions.get("window");
  const courosalWidth = width - 44
  
  const loadPosts = async () => {
      if(!hasMore) {
        return
      }

      setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: "20"
      })

      if (cursor) {
        params.set("cursor", cursor)
      }

      const res = await api.get(`/posts?${params.toString()}`)

      setPosts(prev => [
        ...prev,
        ...res.data.data.posts
      ])

      setCursor(res.data.data.nextCursor)
      setHasMore(res.data.data.hasMore)

    } catch (error) {
      console.log(error)
      const message = error.response?.data?.message || "Something went wrong"
      console.log(message)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadPosts()
    }, [])
  )

  function PostCard({ post }) {
    return (
      <View style={styles.postCardContainer}>
        <View style={styles.postCard}>
          <View style={styles.headPost}>
            <Image source={{ uri: post.author.image.url || defaultImg }} style={{
              objectFit: "cover",
              width: 30,
              height: 30,
              borderRadius: 150,
            }} />
            <Link href={`/user/${post.author._id}`} style={styles.postUserName}>
              <Text>{post.author.name || "User"}</Text>
            </Link>
          </View>
          <View style={{
            marginHorizontal: 10,
            flexDirection: "column",
            gap: 10,
          }}>
            <Text style={styles.postReviewText}>{post.description}</Text>
            <View style={{
              flexDirection: "row",
              gap: 5,
              justifyContent: "center"
            }}>
              <FlatList
                data={post.images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.public_id}
                renderItem={({item}) => (
                  <View style={{width: courosalWidth}}>
                  <Image source={{uri: item.url}} style={{
                    width: "100%",
                    height: 400,
                    borderRadius: 10,
                  }}
                  resizeMethod="cover"
                  />
                  </View>
                )}
              />
            </View>
            <Link href={`/place/${post.place._id}`}>
            <Text style={styles.text}>Place: {post.place.title || "None"}</Text>
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
      // style={styles.postCardContainer}
      style={styles.container}
      data={posts}
      keyExtractor={item => item._id}
      renderItem={({item}) => (
        <View style={styles.container}>
        <PostCard post={item}/>
        </View>
      )}
      onEndReached={loadPosts}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? <ActivityIndicator /> : null
      }
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.zinc900,
  },
  header:{
    paddingTop: 50,
  },
  headText: {
    fontFamily: "Alpino-Bold",
    color: "white",
    fontSize: 30,
    textAlign: "center"
  },
  postCardContainer: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 15,
  },
  postCard: {
    borderWidth: 1,
    borderColor: colors.zinc800,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingVertical: 15,
  },
  headPost: {
    flexDirection: "row",
    paddingLeft: 10,
    gap: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
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
  }
})
