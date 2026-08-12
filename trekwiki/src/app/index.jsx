import { ImageBackground, View, Text, Pressable, StyleSheet } from "react-native";
import snowImg from "@assets/images/snow.jpg"
import { Link } from "expo-router";
import { colors } from "../styles/global";
import { checkUser } from "../utils/auth.js"
import { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkUser().then(setUser)
  }, [])

  return (
    <View style={styles.container}>
      <ImageBackground
        source={snowImg}
        resizeMode="cover"
        style={styles.image}
      >
        {user ? (
          <Link href="profile" asChild>
            <Pressable style={styles.loginButton}>
              {/* <Text style={styles.loginButtonText}>
                Profile
              </Text> */}
              <Ionicons name="settings-outline" size={28} color="white"/>
            </Pressable>
          </Link>
        ) : (
          <Link href="auth" asChild>
            <Pressable style={styles.loginButton}>
              <Text style={styles.loginButtonText}>
                Log In
              </Text>
            </Pressable>
          </Link>
        )}
        <Text style={styles.title}>Travel Without Limits</Text>
        <Text style={styles.subText}>Wiki pidea for hikers, where you can find adventerous and hidden spots to visit</Text>
        <Link href="/explore" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>
              Explore the world
            </Text>
          </Pressable>
        </Link>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.zinc900,
  },
  title: {
    marginTop: 70,
    marginLeft: 20,
    width: 280,
    fontSize: 60,
    fontFamily: "CanvaSans-Bold",
    color: "white",
  },
  subText: {
    paddingLeft: 20,
    marginTop: 24,
    fontSize: 16,
    color: colors.zinc300,
    fontFamily: "CanvaSans-Regular",
    width: 230,
  },
  button: {
    alignSelf: "stretch",
    backgroundColor: "white",
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: "auto",
    marginBottom: 60,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "CanvaSans-Bold",
    fontSize: 18,
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    display: "flex",
    flexDirection: "coloumn",
  },
  loginButton: {
    // backgroundColor: colors.blue400,
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    // borderRadius: 15,
    // borderColor: colors.blue500,
    // borderWidth: 1,
    alignSelf: "flex-end",
    marginTop: 50,
    marginRight: 30,
  },
  loginButtonText: {
    color: "white",
    fontFamily: "CanvaSans-Bold",
  }
})
