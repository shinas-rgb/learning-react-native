import { useToast } from "react-native-toast-notifications";
import { colors } from "../../styles/global.ts";

export const useAppToast = () => {
  const toast = useToast();

  const success = (message) => {
    toast.show(message, {
      type: "custom",
      style: {
        backgroundColor: colors.green500,
        paddingHorizontal: 40,
        borderRadius: 999,
      },
      textStyle: {
        color: "white",
        fontFamily: "CanvaSans-Regular",
      },
    });
  };

  const error = (message) => {
    toast.show(message, {
      type: "custom",
      style: {
        backgroundColor: colors.red500,
        paddingHorizontal: 40,
        borderRadius: 999,
      },
      textStyle: {
        color: "white",
        fontFamily: "CanvaSans-Regular",
      },
    });
  };

  return { success, error };
};
