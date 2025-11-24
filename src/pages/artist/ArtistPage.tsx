import { Album, Music } from "lucide-react";
import { useEffect } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SongsTabContent from "../admin/components/SongsTabContent.js";
import AlbumsTabContent from "../admin/components/AlbumsTabContent.js";
import Header from "../admin/components/Header.js";
// import DashboardStats from "../admin/components/DashboardStats.js";
import { useArtistStore } from "@/stores/useArtistStore.js";

const ArtistPage = () => {

	const { fetchAlbums, fetchSongs } = useArtistStore();

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
	}, [fetchAlbums, fetchSongs]);

	return (
		<div
			className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8'
		>
			<Header />

			{/* <DashboardStats /> */}

			<Tabs defaultValue='songs' className='space-y-6'>
				<TabsList className='p-1 bg-zinc-800/50'>
					<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700'>
						<Music className='mr-2 size-4' />
						Songs
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700'>
						<Album className='mr-2 size-4' />
						Albums
					</TabsTrigger>
				</TabsList>

				<TabsContent value='songs'>
					<SongsTabContent />
				</TabsContent>
				<TabsContent value='albums'>
					<AlbumsTabContent />
				</TabsContent>
			</Tabs>
		</div>
	);
};
export default ArtistPage;
