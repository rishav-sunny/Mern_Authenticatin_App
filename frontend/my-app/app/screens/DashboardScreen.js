import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://192.168.0.105:5000";

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        navigation.replace("Login");
        return;
      }

      try {
        const res = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        await AsyncStorage.removeItem("token");
        navigation.replace("Login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    Alert.alert("Logged out");
    navigation.replace("Login");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Dashboard
      </Text>

      {/* UI Component 1 */}
      <View style={{ padding: 15, backgroundColor: "#e0f2fe", borderRadius: 8, marginBottom: 15 }}>
        <Text style={{ fontWeight: "bold" }}>Name</Text>
        <Text>{user.name}</Text>
      </View>

      {/* UI Component 2 */}
      <View style={{ padding: 15, backgroundColor: "#dcfce7", borderRadius: 8, marginBottom: 15 }}>
        <Text style={{ fontWeight: "bold" }}>Email</Text>
        <Text>{user.email}</Text>
      </View>

      {/* UI Component 3 */}
      <View style={{ padding: 15, backgroundColor: "#fef3c7", borderRadius: 8, marginBottom: 25 }}>
        <Text style={{ fontWeight: "bold" }}>Created At</Text>
        <Text>{new Date(user.createdAt).toDateString()}</Text>
      </View>

      <TouchableOpacity
        onPress={logout}
        style={{ backgroundColor: "#dc2626", padding: 14, borderRadius: 6, alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
