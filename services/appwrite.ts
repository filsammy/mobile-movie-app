import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client()
  .setEndpoint('https://syd.cloud.appwrite.io/v1')
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const database = new Databases(client);

// Existing search tracking functions
export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', query)
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];

      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1
        }
      )
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      })
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc('count'),
    ])

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

// New saved movies functions
export const saveMovie = async (movie: Movie): Promise<boolean> => {
  try {
    // Check if movie is already saved
    const existing = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal('movie_id', movie.id)
    ]);

    if (existing.documents.length > 0) {
      return false; // Already saved
    }

    await database.createDocument(DATABASE_ID, SAVED_COLLECTION_ID, ID.unique(), {
      movie_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      saved_at: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.log('Error saving movie:', error);
    throw error;
  }
}

export const unsaveMovie = async (movieId: number): Promise<boolean> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal('movie_id', movieId)
    ]);

    if (result.documents.length > 0) {
      await database.deleteDocument(
        DATABASE_ID,
        SAVED_COLLECTION_ID,
        result.documents[0].$id
      );
      return true;
    }

    return false;
  } catch (error) {
    console.log('Error unsaving movie:', error);
    throw error;
  }
}

export const isMovieSaved = async (movieId: number): Promise<boolean> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal('movie_id', movieId)
    ]);

    return result.documents.length > 0;
  } catch (error) {
    console.log('Error checking saved status:', error);
    return false;
  }
}

export const getSavedMovies = async (): Promise<Movie[]> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.orderDesc('saved_at'),
      Query.limit(100)
    ]);

    return result.documents.map(doc => ({
      id: doc.movie_id,
      title: doc.title,
      poster_path: doc.poster_path,
      vote_average: doc.vote_average,
      release_date: doc.release_date,
      // Add other required Movie properties with defaults
      adult: false,
      backdrop_path: '',
      genre_ids: [],
      original_language: '',
      original_title: doc.title,
      overview: '',
      popularity: 0,
      video: false,
      vote_count: 0
    })) as Movie[];
  } catch (error) {
    console.log('Error getting saved movies:', error);
    return [];
  }
}

// Profile stats function
export const getUserStats = async () => {
  try {
    const [savedMovies, searchHistory] = await Promise.all([
      database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID),
      database.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.orderDesc('count'),
        Query.limit(1)
      ])
    ]);

    const totalSearches = searchHistory.documents.reduce(
      (sum, doc) => sum + (doc.count || 0), 
      0
    );

    return {
      savedCount: savedMovies.total,
      searchCount: totalSearches,
      mostSearched: searchHistory.documents.length > 0 
        ? {
            title: searchHistory.documents[0].title,
            count: searchHistory.documents[0].count,
            poster_url: searchHistory.documents[0].poster_url
          }
        : null
    };
  } catch (error) {
    console.log('Error getting user stats:', error);
    return {
      savedCount: 0,
      searchCount: 0,
      mostSearched: null
    };
  }
}