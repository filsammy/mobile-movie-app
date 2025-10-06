import React, { useEffect, useState } from "react";
import { TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { icons } from "@/constants/icons";
import { saveMovie, unsaveMovie, isMovieSaved } from "@/services/appwrite";

interface SaveButtonProps {
  movie: Movie;
  size?: number;
  onSaveChange?: (isSaved: boolean) => void;
}

const SaveButton = ({ movie, size = 6, onSaveChange }: SaveButtonProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkSavedStatus();
  }, [movie.id]);

  const checkSavedStatus = async () => {
    const saved = await isMovieSaved(movie.id);
    setIsSaved(saved);
  };

  const handleToggleSave = async () => {
    setIsLoading(true);
    try {
      if (isSaved) {
        await unsaveMovie(movie.id);
        setIsSaved(false);
        onSaveChange?.(false);
      } else {
        await saveMovie(movie);
        setIsSaved(true);
        onSaveChange?.(true);
      }
    } catch (error) {
      console.error("Error toggling save:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="small"
        color="#AB8BFF"
        className={`size-${size}`}
      />
    );
  }

  return (
    <TouchableOpacity
      onPress={handleToggleSave}
      className="bg-dark-200/80 rounded-full p-2 border border-[#AB8BFF]/100"
      activeOpacity={0.7}
    >
      <Image
        source={icons.save}
        className={`size-${size}`}
        tintColor={isSaved ? "#AB8BFF" : "#fff"}
      />
    </TouchableOpacity>
  );
};

export default SaveButton;
