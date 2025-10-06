import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getUserStats } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import React from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: any;
}

const StatCard = ({ label, value, icon }: StatCardProps) => (
  <View className="bg-dark-200 rounded-2xl p-5 flex-1 items-center justify-center">
    <Image source={icon} className="size-8 mb-3" tintColor="#AB8BFF" />
    <Text className="text-3xl font-bold text-white mb-1">{value}</Text>
    <Text className="text-sm text-gray-400">{label}</Text>
  </View>
);

const Profile = () => {
  const { data: stats, loading } = useFetch(getUserStats);

  return (
    <View className="bg-primary flex-1">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="w-full flex-row justify-center mt-20 items-center mb-10">
          <Image source={icons.logo} className="w-12 h-10" />
        </View>

        {/* Profile Header */}
        <View className="items-center mb-8">
          <View className="bg-darkAccent rounded-full p-6 mb-4">
            <Image source={icons.person} className="size-16" tintColor="#fff" />
          </View>
          <Text className="text-white text-2xl font-bold">
            Movie Enthusiast
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            Exploring the world of cinema
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#AB8BFF" className="my-10" />
        ) : (
          <>
            {/* Stats Section */}
            <Text className="text-white text-xl font-bold mb-4">
              Your Stats
            </Text>
            <View className="flex-row gap-4 mb-6">
              <StatCard
                label="Saved Movies"
                value={stats?.savedCount || 0}
                icon={icons.save}
              />
              <StatCard
                label="Searches"
                value={stats?.searchCount || 0}
                icon={icons.search}
              />
            </View>

            {/* Most Searched Movie */}
            {stats?.mostSearched && (
              <View className="mb-6">
                <Text className="text-white text-xl font-bold mb-4">
                  Most Searched
                </Text>
                <View className="bg-dark-200 rounded-2xl p-4 flex-row items-center">
                  <Image
                    source={{ uri: stats.mostSearched.poster_url }}
                    className="w-20 h-28 rounded-lg mr-4"
                    resizeMode="cover"
                  />
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg mb-1">
                      {stats.mostSearched.title}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      Searched {stats.mostSearched.count} times
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Activity Section */}
            <Text className="text-white text-xl font-bold mb-4">Activity</Text>
            <View className="bg-dark-200 rounded-2xl p-5">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-gray-400">Total Interactions</Text>
                <Text className="text-white font-bold text-lg">
                  {(stats?.savedCount || 0) + (stats?.searchCount || 0)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400">Member Since</Text>
                <Text className="text-white font-bold">2024</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Profile;
