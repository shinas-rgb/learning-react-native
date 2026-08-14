import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { colors } from "../styles/global";
import { ToastProvider } from "react-native-toast-notifications";

export default function RootLayout() {
  const [loaded] = useFonts({
    'CanvaSans-Regular': require('../../assets/fonts/canva-sans-regular.otf'),
    'CanvaSans-Medium': require('../../assets/fonts/canva-sans-medium.otf'),
    'CanvaSans-Bold': require('../../assets/fonts/canva-sans-bold.otf'),
  })

  if (!loaded) return null;
  return (
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
      <Stack >
        {/* screenOptions={{ headerShown: false }} */}
        <Stack.Screen name="index" options={{ title: "Home", headerShown: false, }} />
        <Stack.Screen name="(tabs)" options={{
          title: "Options",
          headerStyle: { backgroundColor: colors.zinc800 },
          headerTintColor: colors.zinc100
        }} />
        <Stack.Screen name="explore" options={{
          title: "Explore",
          headerStyle: { backgroundColor: colors.zinc800 },
          headerTintColor: colors.zinc100
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
    </ToastProvider>
  )
}
