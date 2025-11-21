import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { HomeIcon, Library, Search } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

const LeftSidebar = () => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();
	const { initializeQueue, setCurrentSong, currentSong } = usePlayerStore();

	const [query, setQuery] = useState("");
	const [results, setResults] = useState<{ songs: any[]; albums: any[] }>({
		songs: [],
		albums: [],
	});
	const [isSearching, setIsSearching] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	const searchMedia = useCallback(async (text: string) => {
		if (!text.trim()) {
			setResults({ songs: [], albums: [] });
			setShowDropdown(false);
			return;
		}

		setIsSearching(true);
		try {
			const res = await axiosInstance.get(`/search/${encodeURIComponent(text)}`);
			setResults({
				songs: res.data?.updatedSongs || [],
				albums: res.data?.updatedAlbums || [],
			});
			setShowDropdown(true);
		} catch (err: any) {
			toast.error("Search failed: " + err.message);
		} finally {
			setIsSearching(false);
		}
	}, []);

	useEffect(() => {
		const delay = setTimeout(() => {
			searchMedia(query);
		}, 400);
		return () => clearTimeout(delay);
	}, [query, searchMedia]);

	// Close dropdown on outside click
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
				setShowDropdown(false);
			}
		};
		document.addEventListener("click", handler);
		return () => document.removeEventListener("click", handler);
	}, []);

	return (
		<div className='h-full flex flex-col gap-2 relative'>
			{/* Navigation menu */}
			<div className='rounded-lg p-4 relative' ref={searchRef}>
				<div className='space-y-2'>
					<Link
						to={"/"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-white/10",
							})
						)}
					>
						<HomeIcon className='mr-2 size-5' />
						<span className='hidden md:inline'>Home</span>
					</Link>

					{/* Search bar */}
					<div className='relative mt-3'>
						<Search className='absolute left-3 top-2.5 text-zinc-400 h-4 w-4' />
						<Input
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onFocus={() => query && setShowDropdown(true)}
							placeholder='Search songs or albums...'
							className='pl-9 bg-white/5 border-white/10 text-sm text-white focus:bg-white/10 transition-colors'
						/>

						{/* Dropdown search results */}
						{showDropdown && (
							<div className='absolute z-50 mt-2 w-full bg-black/90 backdrop-blur-md border border-white/10 rounded-md shadow-lg max-h-64 overflow-y-auto'>
								{isSearching ? (
									<p className='p-3 text-sm text-zinc-400'>Searching...</p>
								) : (
									<>
										{results.albums.length === 0 && results.songs.length === 0 ? (
											<p className='p-3 text-sm text-zinc-500'>No results found</p>
										) : (
											<>
												{/* Albums */}
												{results.albums.map((album) => (
													<Link
														to={`/albums/${album._id}`}
														key={album._id}
														onClick={() => setShowDropdown(false)}
														className='flex items-center gap-3 p-2 hover:bg-white/10 cursor-pointer transition-colors'
													>
														<img
															src={album.imageUrl}
															alt='Album'
															className='w-10 h-10 rounded-md object-cover'
														/>
														<div className='flex-1 min-w-0'>
															<p className='font-medium truncate text-white'>
																{album.title}
															</p>
															<p className='text-xs text-zinc-400 truncate'>
																Album • {album.artist}
															</p>
														</div>
													</Link>
												))}

												{/* Songs */}
												{results.songs.map((song) => (
													<div
														key={song._id}
														onClick={() => {
															initializeQueue([song]);
															setCurrentSong(song);
															setShowDropdown(false);
														}}
														className={cn(
															"flex items-center gap-3 p-2 hover:bg-white/10 cursor-pointer transition-colors",
															currentSong?._id === song._id &&
															"bg-white/10 border border-primary/50"
														)}
													>
														<img
															src={song.imageUrl}
															alt='Song'
															className='w-10 h-10 rounded-md object-cover'
														/>
														<div className='flex-1 min-w-0'>
															<p className='font-medium truncate text-white'>
																{song.title}
															</p>
															<p className='text-xs text-zinc-400 truncate'>
																Song • {song.artist}
															</p>
														</div>
													</div>
												))}
											</>
										)}
									</>
								)}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Library section */}
			<div className='flex-1 rounded-lg p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center text-white px-2'>
						<Library className='size-5 mr-2' />
						<span className='hidden md:inline'>Playlists</span>
					</div>
				</div>

				<ScrollArea className='h-[calc(100vh-300px)]'>
					<div className='space-y-2'>
						{isLoading ? (
							<PlaylistSkeleton />
						) : (
							albums.map((album) => (
								<Link
									to={`/albums/${album._id}`}
									key={album._id}
									className='p-2 hover:bg-white/10 rounded-md flex items-center gap-3 group cursor-pointer transition-colors'
								>
									<img
										src={album.imageUrl}
										alt='Playlist img'
										className='size-12 rounded-md object-cover'
									/>
									<div className='flex-1 min-w-0 hidden md:block'>
										<p className='font-medium truncate text-white'>{album.title}</p>
										<p className='text-sm text-zinc-400 truncate'>
											Album • {album.artist}
										</p>
									</div>
								</Link>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};

export default LeftSidebar;
