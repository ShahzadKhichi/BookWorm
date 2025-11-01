import { View, Text } from "react-native";
import styles from "../assets/styles/profile.styles";
import { Image } from "expo-image";
import { useAuthStore } from "../store/authStore";
import { formatMemberSince } from "../lib/util";

export default function ProfileHeader() {
  const { user } = useAuthStore();

  return (
    <View style={styles.profileHeader}>
      <Image source={{ uri: user?.profileImage }} style={styles.profileImage} />
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.memberSince}>
          Joined {formatMemberSince(user?.createdAt)}
        </Text>
      </View>
    </View>
  );
}
