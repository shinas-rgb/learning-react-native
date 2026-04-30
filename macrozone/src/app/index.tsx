import { Text, View, StyleSheet } from "react-native";
import * as Device from "expo-device"
import { globalStyles, colors } from "@/styles/global";
import HomeHeader from "@/components/HomeHeader";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Macrozone</Text>
      <Text>{Device.brand}</Text>
      <HomeHeader />
      <Link href={'/meals'} style={globalStyles.link}>
        Go to meals
      </Link>
      <Link href={'/add-meals'} style={globalStyles.link}>
        Add Meals
      </Link>
    </View>
  );
}

