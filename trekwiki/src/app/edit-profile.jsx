import { colors } from "@/styles/global";
import { useEffect, useState } from "react";
import Loading from "./components/Loading";
import api from "@/api/api";
import { Controller, useForm } from "react-hook-form";

import { ActivityIndicator, Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAppToast } from "./hooks/useAppToast"
import { router } from "expo-router";

export default function EditProfile() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const { control, handleSubmit, reset} = useForm({
        defaultValues: {
            name: user?.name || "",
            bio: user?.bio || ""
        }
    })
    const [image, setImage] = useState()
    const [pfp, setPfp] = useState()
    const defaultImg = "https://res.cloudinary.com/dyqumsdla/image/upload/v1786527430/hike_uploads/uo37wvuqsquyasoh6m0w.jpg" 
  const { success, error } = useAppToast()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/users')
                setUser(res.data.data.user)
                setPfp(res.data.data.user.image.url)

                reset({
                    name: res.data.data.user.name || "",
                    bio: res.data.data.user.bio || "",
                })

            } catch (error) {
                const message = error.response?.data?.message || "Something went wrong"
                console.log(message)
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const profileButton = () => {
        Alert.alert(
            'Profile photo',
            'Update your profile photo',
            [
                {
                    text: "Remove photo",
                    onPress: () => {
                        setImage(undefined)
                    setPfp(defaultImg)
                    }
                },
                {
                    text: "Add photo",
                    onPress: pickImage,
                }
            ]
        )
    }

    const onSubmit = async (data) => {
        try {
            setLoading(true)
            const formData = new FormData()

            if(image) {
            formData.append("image", { uri: image.uri,
                type: image.mimeType ?? "image/jpeg",
                name: image.fileName ?? `image.jpg`,
            })
            }

            formData.append("name", data.name)
            formData.append("bio", data.bio)
            formData.append("pfp", pfp)

            const res = await api.put('/users', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
            })

            success(res.data.message)
            router.back()
        } catch (err) {
      const message = err.response?.data?.message || "Something went wrong"
            error(message)
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

    if (loading) {
        return <Loading />
    }
    return (
        <View style={styles.container}>
            <View 
            style={{marginTop: "auto", marginBottom: "auto", 
                backgroundColor: colors.zinc800, padding: 14, borderRadius: 24,
                borderWidth: 1, borderColor: colors.zinc700
            }}>
            <Pressable onPress={profileButton}
                style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
            >
                <Image source={{ uri: image?.uri ? image.uri : pfp ? pfp : defaultImg}} style={styles.imageStyle} />
            </Pressable>
            <View style={{ flexDirection: "column", gap: 14, marginTop: 20 }}>
                <View style={[styles.input, { paddingVertical: 10 }]}>
                    <Text style={styles.text}>{user.email}</Text>
                </View>

                <Text style={styles.title}>Name</Text>
                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            onChangeText={onChange}
                            value={value}
                            placeholder="Name"
                            textContentType="name"
                            onBlur={onBlur}
                            placeholderTextColor={colors.zinc400}
                            style={styles.input}
                        />
                    )} />

                <Text style={styles.title}>Bio</Text>
                <Controller
                    control={control}
                    name="bio"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            onChangeText={onChange}
                            value={value}
                            placeholder="Bio"
                            textContentType="name"
                            onBlur={onBlur}
                            placeholderTextColor={colors.zinc400}
                            style={styles.input}
                            multiline={true}
                            numberOfLines={4}
                        />
                    )} />


                {/* Submit button */}
                <Pressable
                    onPress={handleSubmit(onSubmit)}
                    style={({ pressed }) => [
                        styles.button,
                        { backgroundColor: pressed ? colors.violet500 : colors.violet400 }]}>
                    <Text style={{ color: colors.zinc100, textAlign: "center", fontFamily: "CanvaSans-Bold", fontSize: 15, }}>
                        {loading ? (
                            <ActivityIndicator size="small" color="black" />
                        ) : (
                            "Submit"
                        )}
                    </Text>
                </Pressable>
            </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.zinc900,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    input: {
        backgroundColor: colors.zinc900,
        borderWidth: 1,
        borderColor: colors.zinc950,
        borderRadius: 12,
        paddingHorizontal: 15,
        color: "white",
        fontFamily: "CanvaSans-Regular",
        fontSize: 16,
    },
    button: {
        borderRadius: 20,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colors.zinc500,
        marginTop: 10,
    },
    title: {
        color: colors.zinc200,
        fontFamily: "CanvaSans-Bold",
        fontSize: 20,
        marginTop: 10,
    },
    text: {
        fontFamily: "CanvaSans-Regular",
        color: colors.zinc300,
        fontSize: 16,
    },
    imageStyle: {
        display: "block",
        width: 100,
        height: 100,
        objectFit: "conver",
        borderRadius: 200,
        marginLeft: "auto",
        marginRight: "auto",
    },
})
