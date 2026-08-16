import { colors } from "@/styles/global";
import { router, Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";

export default function ProfileLayout() {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable onPress={() => setVisible(false)} style={styles.backdrop}>
          <Pressable style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}>
            <Text style={styles.headText}>What you want to create</Text>
            <View style={{
              flexDirection: "column",
              gap: 10,
            }}>
              <TouchableOpacity onPress={() => {
                router.push({
                  pathname: "/new-data",
                  params: {type: "post"}
                })
                setVisible(false)
              }}
              style={styles.button} >
                <Text style={styles.buttonText}>New Post</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                router.push({
                  pathname: "/new-data",
                  params: {type: "place"}
                })
                setVisible(false)
              }}
              style={styles.button} >
                <Text style={styles.buttonText}>New Place</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setVisible(false)}
              style={[styles.button, {
                backgroundColor: colors.red500,
              }]} >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

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
        name="new-data"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "add" : "add-outline"}
              size={size}
              color={color}
            />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity 
              {...props}
              onPress={() => (
                setVisible(true)
              )}
            />
          )
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
    </Tabs>
    </>
  )
}

const styles = new StyleSheet.create(
  {
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: colors.zinc800,
      borderWidth: 1,
      borderColor: colors.zinc600,
      borderRadius: 12,
    },
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)", // dim background
      justifyContent: "center",
      alignItems: "center",
    },
    headText:{
       fontFamily: "CanvaSans-Bold", fontSize: 17, color: "white", marginBottom: 20, 
    },
    button: {
      backgroundColor: colors.zinc700,
      padding: 10,
      borderRadius: 10,
    }, 
    buttonText: {
      fontFamily: "CanvaSans-Regular",
      color: colors.zinc100,
      textAlign: "center",
    }
  }
)