import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export async function checkUser() {
  const token = await AsyncStorage.getItem("token")
  if (!token) return null
  try {
    return jwtDecode(token)
  } catch (error) {
    return null
  }
}
