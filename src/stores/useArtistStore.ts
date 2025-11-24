import { axiosInstance } from "@/lib/axios";
import { Album, Song } from "@/types";
import { create } from "zustand";


interface MusicStore {
	songs: Song[];
	albums: Album[];
	isLoading: boolean;
	error: string | null;

	fetchSongs: () => Promise<void>;
	fetchAlbums: () => Promise<void>;
}

export const useArtistStore = create<MusicStore>((set) => ({
	songs: [],
	albums: [],
	isLoading: false,
	error: null,

	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/artist/songs");
			set({ songs: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get("/artist/albums");
			set({ albums: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));

