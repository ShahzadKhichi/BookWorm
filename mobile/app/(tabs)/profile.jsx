import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { BASE_URL } from "../../constants/api";
import Loader from "../../components/Loader";
import ProfileHeader from "../../components/ProfileHeader";
import { useEffect, useState } from "react";
import styles from "../../assets/styles/profile.styles";
import LogoutButton from "../../components/LogoutButton";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/color";
import { Image } from "expo-image";
import { formatPublishDate } from "../../lib/util";

export default function profile() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [delteId, setDeleteId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const { token } = useAuthStore();
  const [totalBooks, setTotalBooks] = useState(0);

  const router = useRouter();

  const fetchRecomendations = async (pageNum = 1, refresh = false) => {
    try {
      if (pageNum == 1) setIsLoading(true);
      else if (refresh) setRefreshing(true);

      const res = await fetch(
        BASE_URL + "book/user?page=" + pageNum + "&limit=4",
        {
          method: "Get",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      const unique =
        refresh || pageNum == 1
          ? data.books
          : Array.from(
              new Set([...books, ...data.books].map((book) => book._id))
            ).map((id) =>
              [...books, ...data.books].find((book) => book._id === id)
            );
      setBooks(unique);
      setHasMore(unique.length < data.totalBooks);

      setTotalBooks(data.totalBooks);
      setPage(pageNum);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecomendations();
  }, []);

  const loadMore = async () => {
    await fetchRecomendations(page + 1);
  };

  const handleDelete = async (id) => {
    try {
      console.log(id);

      setDeleteId(id);
      const res = await fetch(BASE_URL + "book/" + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setBooks((pre) => pre.filter((book) => book._id != id));
      Alert.alert("Success", "Recommendation deleted");
    } catch (error) {
      console.log("failed to delete ", error);
    } finally {
      setDeleteId(null);
    }
  };
  const confirmDelete = (id) => {
    Alert.alert("logout", "Are you sure to delete?", [
      { text: "Cancel", style: "cancel" },
      { text: "delete", onPress: () => handleDelete(id), style: "destructive" },
    ]);
  };

  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={14}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }

    return stars;
  };

  const renderBook = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRating(item.rating)}</View>
        <Text style={styles.bookCaption}>{item.caption}</Text>
        <Text style={styles.bookDate}>{formatPublishDate(item.createdAt)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item._id)}
        disabled={delteId == item._id}
      >
        {delteId == item._id ? (
          <ActivityIndicator size={"small"} color={COLORS.primary} />
        ) : (
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecomendations(1, true);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutButton />
      {/* You recommendation */}
      <View style={styles.booksHeader}>
        <Text style={styles.bookTitle}>Your Recommendations</Text>
        <Text style={styles.booksCount}>{totalBooks} books</Text>
      </View>
      {/* books */}
      {isLoading ? (
        <Loader size={"large"} />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item._id}
          renderItem={renderBook}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.booksList}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="book-outline"
                size={50}
                color={COLORS.textSecondary}
              />
              <Text style={styles.emptyText}>No Recommendation yet</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/create")}
              >
                <Text style={styles.addButtonText}>Add your First Book</Text>
              </TouchableOpacity>
            </View>
          }
          ListFooterComponent={
            hasMore && books.length > 0 ? (
              <ActivityIndicator
                style={styles.footerLoader}
                size={"small"}
                color={COLORS.primary}
              />
            ) : null
          }
        />
      )}
    </View>
  );
}
