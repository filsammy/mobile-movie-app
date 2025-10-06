import { ActivityIndicator, FlatList, Image, View, Text } from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import MovieCard from "@/components/MovieCard";
import useFetch from "@/services/useFetch";
import { getSavedMovies } from "@/services/appwrite";

const Saved = () => {
  const {
    data: savedMovies,
    loading,
    error,
    refetch,
  } = useFetch(getSavedMovies);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        data={savedMovies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className="px-5"
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          marginBottom: 10,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center mb-5">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <Text className="text-2xl text-white font-bold mb-5">
              Saved Movies
            </Text>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#AB8BFF"
                className="my-5"
              />
            )}

            {error && (
              <Text className="text-red-500 my-3">Error: {error.message}</Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="flex justify-center items-center mt-20">
              <Image
                source={icons.save}
                className="size-16 mb-4"
                tintColor="#AB8BFF"
              />
              <Text className="text-gray-500 text-base text-center">
                No saved movies yet
              </Text>
              <Text className="text-gray-600 text-sm text-center mt-2 px-10">
                Start exploring and save your favorite movies
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Saved;
