import api from "@/api/api";
import { colors } from "@/styles/global";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Loading from "../components/Loading";

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [reviews, setReviews] = useState([])
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
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

  if (loading) {
    return <Loading />
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={{
        fontFamily: "CanvaSans-Bold",
        color: "white",
        fontSize: 30,
        marginVertical: 30,
      }}>
        Hey {user.name}!</Text>
      <View style={{ marginVertical: 20 }}>
        <Text
          style={{
            color: colors.zinc200,
            fontFamily: "CanvaSans-Bold",
            fontSize: 20,
          }}>
          Reviews</Text>
        <View>
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
        </View>
      </View>
      <View style={{ marginVertical: 20 }}>
        <Text
          style={{
            color: colors.zinc200,
            fontFamily: "CanvaSans-Bold",
            fontSize: 20,
          }}>
          Places</Text>
        <View>
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
  }
})
