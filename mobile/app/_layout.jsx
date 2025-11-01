import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../store/authStore";
import { useEffect, useRef } from "react";
import Loader from "../components/Loader";

import { useFonts } from "expo-font";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const mounted = useRef(false);
  const { checkAuth, user, token, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const inAuthScreen = segments[0] === "(auth)";
    const isSigned = user && token;
    if (!isSigned && !inAuthScreen) {
      router.replace("(auth)");
    } else if (isSigned && inAuthScreen) {
      router.replace("(tabs)");
    }
  }, [user, token, segments]); //

  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });
  //check auth

  useEffect(() => {
    console.log(segments);
    checkAuth();
  }, [isCheckingAuth]);

  if (isCheckingAuth) return <Loader size={"large"} />;
  if (!fontsLoaded) return <Loader />;

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
