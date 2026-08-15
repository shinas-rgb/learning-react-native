import { Redirect, router, Stack, usePathname } from "expo-router";
import { useFonts } from 'expo-font';
import { colors } from "../styles/global";
import { ToastProvider } from "react-native-toast-notifications";
import { useEffect, useState } from "react";
import { checkUser } from "@/utils/auth";
import { JwtPayload } from "jwt-decode";
import { AuthProvider, useAuth } from "./context/AuthContext";

function Navigation() {
  const {user, loading} = useAuth()
  const pathName = usePathname()
  const publicRoutes = ["/test", "/auth"]

  useEffect(() => {
  if(loading) {
    return
  }

  if(!user && !publicRoutes.includes(pathName)) {
    router.replace("/test")
    return
  }

 if(user && publicRoutes.includes(pathName)){
    router.replace("/")
    return
  }

  }, [user, loading, pathName])

  if(loading) {
    return null
  }

  return (
    <Stack >
      <Stack.Screen name="test" options={{ title: "Test", headerShown: false, }} />
      <Stack.Screen name="(tabs)" options={{
        title: "HomeTabs",
        headerShown: false,
      }} />
      <Stack.Screen name="place/[id]" options={{
        headerStyle: { backgroundColor: colors.zinc800 },
        headerTintColor: colors.zinc100
      }} />
      <Stack.Screen name="user/[id]" options={{
        headerStyle: { backgroundColor: colors.zinc800 },
        headerTintColor: colors.zinc100
      }} />
      <Stack.Screen name="add-place" options={{
        title: "Add new place",
        headerStyle: { backgroundColor: colors.zinc800 },
        headerTintColor: colors.zinc100
      }} />
      <Stack.Screen name="edit-profile" options={{
        title: "Edit Profile",
        headerStyle: { backgroundColor: colors.zinc800 },
        headerTintColor: colors.zinc100
      }} />
      <Stack.Screen name="auth" options={{ title: "Auth", headerShown: false }} />
      <Stack.Screen name="+not-found" options={{
        headerStyle: { backgroundColor: colors.zinc800 },
        headerTintColor: colors.zinc100
      }} />
    </Stack>
  )
}

export default function RootLayout() {
  const [loaded] = useFonts({
    'CanvaSans-Regular': require('../../assets/fonts/canva-sans-regular.otf'),
    'CanvaSans-Medium': require('../../assets/fonts/canva-sans-medium.otf'),
    'CanvaSans-Bold': require('../../assets/fonts/canva-sans-bold.otf'),
    'Rosalia': require('../../assets/fonts/Rosalia.otf'),
    'Alpino-Regular': require('../../assets/fonts/Alpino-Regular.otf'),
    'Alpino-Bold': require('../../assets/fonts/Alpino-Bold.otf'),
    'Alpino-Black': require('../../assets/fonts/Alpino-Black.otf'),
  })

  useEffect(() => {
    if (!loaded) {
      return
    }
  })

  if(!loaded) {
    return null
  }

  return (
    <AuthProvider>
      <ToastProvider
        placement="top"
        duration={3000}
        animationType="slide-in"

        successColor="#22c55e"
        dangerColor="#ef4444"
        warningColor="#f59e0b"
        normalColor="#27272a"

        textStyle={{
          fontSize: 16,
          fontFamily: 'CanvaSans-Regular',
        }}

        offsetTop={60}
      >
        <Navigation />
      </ToastProvider>
    </AuthProvider>
  )
}
