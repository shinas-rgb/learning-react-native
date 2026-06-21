import { colors } from "@/styles/global";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient"
import { Controller, useForm } from "react-hook-form"
import { useState } from "react";
import api from "../api/api.js"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "expo-router";

export default function LoginPage() {
  const { control, handleSubmit, formState: { errors } } = useForm()
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const { success, error } = useAppToast()

  async function onSubmit(data) {
    try {
      setLoading(true)
      if (mode === 'signup') {
        const res = await api.post('/users/signup', {
          name: data.name,
          email: data.email,
          password: data.password
        })
        success(res.data.message)
        setMode("login")
      }
      if (mode === 'login') {
        const res = await api.post('/users/login', {
          email: data.email,
          password: data.password
        })
        success(res.data.message)
        await AsyncStorage.setItem("token", res.data.data.token)
        navigation.navigate("index")
      }
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong"
      error(message)
    } finally {
      setLoading(false)
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      error("Invalid email")
      return;
    }
    if (data.password.length < 4) {
      alert('Password must be at least 8 characters');
      return;
    }
    console.log(data)
  }
  return (
    <LinearGradient
      colors={[colors.zinc700, colors.zinc950]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}>
      <View style={{ alignItems: "center", marginTop: 80, }}>
        <Text style={styles.title}>Trek Wiki</Text>
      </View>
      <View style={styles.card}>
        <Text style={{
          color: "white",
          fontFamily: "CanvaSans-Bold",
          fontSize: 25,
          marginBottom: 20,
        }}>
          {mode === 'login' ? (
            'Log into your account'
          ) : (
            'Create a new account'
          )}
        </Text>
        {mode === 'signup' && (
          <View style={{ marginVertical: 5, }}>
            <Text style={styles.text}>Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onChangeText={onChange}
                  value={value}
                  placeholder="your name"
                  textContentType="name"
                  onBlur={onBlur}
                  placeholderTextColor={colors.zinc600}
                  style={styles.input}
                />
              )} />
          </View>
        )}
        <View style={{ marginVertical: 5, }}>
          <Text style={styles.text}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                placeholder="name@domain"
                textContentType="emailAddress"
                onBlur={onBlur}
                placeholderTextColor={colors.zinc600}
                style={styles.input}
              />
            )} />
        </View>
        <View style={{ marginVertical: 5, }}>
          <Text style={styles.text}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onChangeText={onChange}
                value={value}
                textContentType="password"
                secureTextEntry
                placeholder="* * * *"
                onBlur={onBlur}
                placeholderTextColor={colors.zinc600}
                style={styles.input}
              />
            )} />
        </View>
        <Pressable
          onPress={handleSubmit(onSubmit)}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? colors.zinc400 : colors.zinc300 }]}>
          <Text style={{ color: "black", textAlign: "center", fontFamily: "CanvaSans-Bold", fontSize: 15, }}>
            {loading ? (
              <ActivityIndicator size="small" color="black" />
            ) : (
              <>
                {mode === 'login' ? (
                  'Sign In'
                ) : (
                  'Sign Up'
                )}
              </>
            )}
          </Text>
        </Pressable>
        <Text style={{ color: colors.zinc300, fontFamily: "CanvaSans-Regular" }}>
          {mode === 'login' ? (
            "Don't have and account ?"
          ) : (
            "Already have an account ?"
          )}
          {mode === 'login' ? (
            <Pressable
              onPress={() => setMode('signup')}>
              <Text style={{ marginLeft: 10, color: colors.blue400, fontFamily: "CanvaSans-Regular" }}>
                Sign Up
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setMode('login')}>
              <Text style={{ marginLeft: 10, color: colors.blue400, fontFamily: "CanvaSans-Regular" }}>
                login
              </Text>
            </Pressable>
          )}
        </Text>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "linear-gradient(180deg,rgba(9, 9, 11, 1) 0%, rgba(63, 63, 70, 1) 100%)",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "CanvaSans-Bold",
    fontSize: 40,
    color: "white",
  },
  card: {
    backgroundColor: colors.zinc900,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
    marginBottom: 130,
    borderWidth: 1,
    borderColor: colors.zinc800,
  },
  input: {
    color: "white",
    backgroundColor: colors.zinc800,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  text: {
    color: colors.zinc300,
    fontFamily: "CanvaSans-Regular",
    marginVertical: 10,
    fontSize: 15,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 15,
  }
})
