import { ImageBackground, View, Text, Pressable, StyleSheet } from "react-native";
import snowImg from "@assets/images/snow.jpg"
import { Link, router } from "expo-router";
import { colors } from "../styles/global";

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={snowImg}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.title}>Travel Without Limits</Text>
        <Text style={styles.subText}>Wiki pidea for hikers, where you can find adventerous and hidden spots to visit</Text>
          <Pressable onPress={() => router.push(`/auth`)}
           style={({pressed}) => [
          styles.button, {
              backgroundColor: pressed ? colors.zinc100 : "white",
              borderWidth: pressed ? 1 : 1,
              borderColor: pressed ? colors.blue400 : colors.blue300,
          }]}>
            <Text style={styles.buttonText}>
              Get Started
            </Text>
          </Pressable>
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
    marginTop: 130,
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
