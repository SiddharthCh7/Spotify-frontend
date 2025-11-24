import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";

const AdminPage = () => {
	const { isAdmin, isLoading } = useAuthStore();

	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
		fetchStats();
	}, [fetchAlbums, fetchSongs, fetchStats]);

	if (!isAdmin && !isLoading) return <div>Unauthorized</div>;

	return (
		<div className='min-h-screen bg-gradient-to-b from-zinc-900/50 via-zinc-900/50 to-black/50 text-zinc-100 p-8'>
			<Header />

			<DashboardStats />

			<Tabs defaultValue='songs' className='space-y-6'>
				<TabsList className='p-1 bg-white/5 border border-white/10'>
					<TabsTrigger value='songs' className='data-[state=active]:bg-white/10 data-[state=active]:text-white hover:bg-white/5 transition-colors'>
						<Music className='mr-2 size-4' />
						Songs
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-white/10 data-[state=active]:text-white hover:bg-white/5 transition-colors'>
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
export default AdminPage;
