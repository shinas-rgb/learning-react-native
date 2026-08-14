import { colors } from "@/styles/global";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Loading from "../components/Loading";
import { Ionicons } from '@expo/vector-icons';
import api from "@/api/api";
import { Controller, useForm } from "react-hook-form";
import { useAppToast } from "../hooks/useAppToast";
import { checkUser } from "@/utils/auth";

export default function PlacePage() {
  const { id } = useLocalSearchParams()
  const [loading, setLoading] = useState(true)
  const [place, setPlace] = useState(null)
  const [rate, setRate] = useState(1)
  const [reviews, setReviews] = useState([])
  const [isBook, setIsBook] = useState(false)
  const [isRev, setIsRev] = useState(false)
  const [user, setUser] = useState(null)
  const [createdBy, setCreatedBy] = useState(null)
  const [newReview, setNewReview] = useState(null)
  const { control, handleSubmit, formState: { errors } } = useForm()
    const defaultImg = "https://res.cloudinary.com/dyqumsdla/image/upload/v1786527430/hike_uploads/uo37wvuqsquyasoh6m0w.jpg" 
const {success, error} = useAppToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if(!user){
          const usr = await checkUser()
          setUser(await checkUser())
        }

        const placeRes = await api.get(`/places/${id}`)
        setPlace(placeRes.data.data.place)
        setCreatedBy(placeRes.data.data.createdUser.user)
        setReviews(placeRes.data.data.reviews)

        if (user) {
          const userRes = await api.get('/users')
          setUser(userRes.data.data.user)

          setIsBook(
            userRes.data.data.user.bookmarks?.some(
              b => b === id || b._id === id
            )
          )

          setIsRev(
            placeRes.data.data.reviews.some(b => b.userId === userRes.data.data.user._id ? true : false)
          )
        }
        setLoading(false)
      } catch (error) {
        const message = error.response?.data?.message || "Something went wrong"
        console.log(message)
        console.log(error)
      } finally {
      }
    }
    fetchData()
  }, [newReview])

  async function setupBookmark() {
    try {
      if (isBook) {
        const res = await api.post(`users/bookmarks/remove/${id}`)
        setUser(res.data.data)
        setIsBook(false)
      success(res.data.message)
      } else {
        const res = await api.post(`users/bookmarks/add/${id}`)
        setUser(res.data.data)
        setIsBook(true)
      success(res.data.message)
      }
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong"
    error(message)
    }
  }

  async function addReview(data) {
    try {
      setLoading(true)
      const res = await api.post(`/reviews/${id}`, {
        rating: rate,
        review: data.review,
      })
      setNewReview(res.data.data)
    success(res.data.message)
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong"
    error(message)
    }
  }

  async function deleteReview() {
    try {
      setLoading(true)
      const placeId = (place._id)
      const res = await api.delete(`/reviews/${placeId}`)
      setNewReview(res.data.data)
    success(res.data.message)
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong"
      console.log(message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: place?.title
        }}
      />
      <ScrollView style={styles.container}>
        {/* first image */}
        <Image source={{ uri: place.images[0].url }} style={styles.imageStyle} />

        {/* description */}
        <Text style={styles.descriptionText
        }>{place.description}</Text>

        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 15,
        }}>
          {/* rating */}
          <View style={styles.ratingView}>
            <Text style={{
            }}>Rating: {place.rating.toFixed(2)}</Text>
            <Ionicons name="star" size={18} color={colors.amber400} />
          </View>

          {/* bookmark */}
          {user && (
            <Pressable onPress={setupBookmark}>
              <Ionicons name={isBook ? "bookmark" : "bookmark-outline"} size={30} color={colors.zinc300} style={{ marginRight: 15 }} />
            </Pressable>
          )}

        </View>

        {/* coordinates */}
        <View style={{ marginBottom: 20, flexDirection: "column", gap: 5 }}>
          <Text style={{ fontFamily: "CanvaSans-Bold", fontSize: 20, color: colors.zinc100 }}>Coordinates</Text>
          <Text style={{ fontFamily: "CanvaSans-Regular", color: colors.zinc100, marginLeft: 5, }}
          >{place.location.coordinates[0]}°E {place.location.coordinates[1]}°N </Text>
        </View>

        {/* images */}
        <View style={{
          flexDirection: "column",
          gap: 20,
        }}>
          {place.images.slice(1,).map((image) => (
            <Image key={image.public_id} source={{ uri: image.url }} style={styles.imageStyle} />
          ))}
        </View>

        <View style={{ height: 1, backgroundColor: colors.zinc700, marginVertical: 30 }}></View>

        {/* duration & disctance */}
        <View style={styles.tableView} >
          <View style={styles.tableCol} >
            <Text style={styles.tableH}>Duration</Text>
            <Text style={styles.tableD}>{place.duration} Hours</Text>
          </View>

          <View style={styles.tableCol} >
            <Text style={styles.tableH}>Distance</Text>
            <Text style={styles.tableD}>{place.distance} KiloMeters</Text>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: colors.zinc700, marginVertical: 30 }}></View>

        {/* details */}
        <View>
          <Text style={styles.tableH}>Key Details</Text>
          <View style={{ flexDirection: "column", gap: 5, marginVertical: 10, }}>
            <Text style={styles.detailsT}>Difficulty: {place.difficulty[0]} {place.difficulty[1]}</Text>
            <Text style={styles.detailsT}>Best season: {place.bestSeason[0]} {place.bestSeason[1]} {place.bestSeason[2]} {place.bestSeason[3]}</Text>
            <Text style={styles.detailsT}>Best time: {place.bestTime || "Any time"}</Text>
            <Text style={styles.detailsT}>Route: {place.route}</Text>
          </View>
        </View>

        {/* tips */}
        {place.tips.length > 1 && (
          <View style={{
            flexDirection: "column", gap: 10, marginVertical: 30,
          }}>
            <Text style={styles.tableH}>Tips</Text>
            {place.tips.map((tip, index) => (
              <Text key={tip} style={{
                fontFamily: "CanvaSans-Regular",
                color: colors.zinc200,
                fontSize: 17,
                marginLeft: 5,
              }}>{index + 1}. {tip}</Text>
            ))}
          </View>
        )}

        {/* Author */}
        <View>
          <Text style={{
            fontFamily: "CanvaSans-Bold",
            color: colors.zinc100,
            fontSize: 18
          }} >Author :</Text>
          <Pressable onPress={() =>
            user?._id === createdBy._id  
            ? router.push(`/profile`)
            : router.push(`/user/${createdBy._id}`)
          }
           style={({pressed}) => [{flexDirection: "row", gap: 20, marginVertical: 10, marginLeft: 10, padding: 10,
            backgroundColor: pressed ? colors.zinc300 : colors.zinc200, borderRadius: 10,
          }]}>
            <Image source={{uri: createdBy.image.url || defaultImg}} style={{objectFit: "cover", width: 40, height: 40, borderRadius: 150}} />
            <Text style={{
            fontFamily: "CanvaSans-Regular",
            color: colors.zinc950,
            fontSize: 18,
            marginTop: 10,
            }}>{createdBy.name || "User"}</Text>
          </Pressable>
        </View>

        <View style={{
          backgroundColor: colors.zinc800, paddingTop: 20, borderRadius: 10, paddingHorizontal: 10,
          borderWidth: 1, borderColor: colors.zinc700, marginVertical: 20
        }}>
          {/* add review */}
          {user ? (
            <>
              {!isRev ? (
                <>
                  <Controller
                    control={control}
                    name="review"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        onChangeText={onChange}
                        value={value}
                        placeholder="Add a review"
                        textContentType="review"
                        onBlur={onBlur}
                        placeholderTextColor={colors.zinc400}
                        style={styles.input}
                      />
                    )} />

                  {/* rating */}
                  <View style={{ flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 15 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Pressable key={star} onPress={() => setRate(star)}>
                        <Ionicons name={star <= rate ? "star" : "star-outline"} size={30} color={colors.amber400} />
                      </Pressable>
                    ))}
                  </View>

                  {/* post button */}
                  <Pressable onPress={handleSubmit(addReview)}>
                    <View style={{ flexDirection: "row-reverse", marginRight: 10, marginVertical: 15, gap: 5 }}>
                      <Ionicons name="send-outline" size={22} color={colors.zinc100} />
                      <Text style={{ color: colors.zinc300, fontFamily: "CanvaSans-Bold", fontSize: 18 }}>Post</Text>
                    </View>
                  </Pressable>
                </>
              ) : (
                <View>
                  <Text style={{ fontFamily: "CanvaSans-Regular", color: colors.zinc100, fontSize: 16, textAlign: "center", marginBottom: 20, }}>You already reviewed this place</Text>
                </View>
              )}
            </>
          ) : (
            <Pressable onPress={() => router.push('/auth')}>
              <Text style={{ fontFamily: "CanvaSans-Regular", color: colors.zinc100, fontSize: 16, textAlign: "center", marginBottom: 20, }}>
                You are not logged in to add review
              </Text>
            </Pressable>
          )}
        </View >

        {/* reviews */}
        {
          reviews.length > 0 ? (
            <View style={{ flexDirection: "column", gap: 15 }}>
              <Text style={styles.tableH}>Reviews</Text>
              <View style={{ flexDirection: "column", gap: 10 }}>
                {reviews.map((review, index) => (
                  <View key={index} style={{
                    backgroundColor: colors.zinc700, paddingVertical: 10, paddingHorizontal: 15,
                    borderRadius: 10, flexDirection: "column", gap: 8
                  }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Link href={`/user/${review.userId}`}>
                      <Text style={{ fontFamily: "CanvaSans-Bold", fontSize: 18, color: colors.zinc100 }}>{review.userName || "Anonymous"}</Text>
                  </Link>
                      <View style={{ flexDirection: "row", gap: 5 }}>
                        <Text style={{ fontFamily: "CanvaSans-Regular", color: colors.zinc100, fontSize: 18 }}>
                          {review.rating}
                        </Text>
                        <Ionicons name="star" color={colors.zinc100} size={18} />
                      </View>
                    </View>
                    <Text style={{ fontFamily: "CanvaSans-Regular", fontSize: 18, color: colors.zinc200, marginLeft: 10 }}>{review.review}</Text>
                    {user?._id === review.userId && (
                      <Pressable style={{ flexDirection: "row-reverse" }} onPress={() => deleteReview(review._id)}>
                        <Ionicons name="trash" size={20} color={colors.red500} />
                      </Pressable>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ fontFamily: "CanvaSans-Regular", color: colors.zinc100, fontSize: 18, textAlign: "center" }}>No reviews yet</Text>
            </View>
          )
        }

        <View style={{ height: 60 }} />
      </ScrollView >
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.zinc900,
    padding: 10,
  },
  imageStyle: {
    width: "100%",
    height: 200,
    objectFit: "conver",
    borderRadius: 20,
  },
  descriptionText: {
    color: colors.zinc300,
    fontFamily: "CanvaSans-Regular",
    fontSize: 18,
    marginVertical: 20,
  },
  ratingView: {
    flexDirection: "row",
    backgroundColor: colors.zinc100,
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    gap: 4,
  },
  tableView: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  tableCol: {
    flexDirection: "column",
    gap: 10,
  },
  tableH: {
    fontFamily: "CanvaSans-Bold",
    color: colors.zinc100,
    fontSize: 20,
  },
  tableD: {
    fontFamily: "CanvaSans-Regular",
    color: colors.zinc100,
  },
  detailsT: {
    color: colors.zinc200,
    fontFamily: "CanvaSans-Regular",
    marginLeft: 5,
    fontSize: 17,
  },
  input: {
    backgroundColor: colors.zinc700,
    paddingHorizontal: 10,
    color: colors.zinc100,
    fontFamily: "CanvaSans-Regular",
    fontSize: 17,
  }
})
