import { colors } from "@/styles/global";
import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function ProfileLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.zinc900,
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontFamily: "Alpino-Bold",
          fontSize: 30,
        },
        headerTitleAlign: "center",
        tabBarStyle: {
          backgroundColor: colors.zinc900,
          borderColor: colors.zinc800,
        height: 88,
        },
        tabBarActiveTintColor: colors.blue400,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "TREK WIKI",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }} />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color={color}
            />
          ),
        }} />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }} />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }} />
    </Tabs>
  )
}
