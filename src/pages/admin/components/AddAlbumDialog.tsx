import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { Plus, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface SongInput {
	title: string;
	duration: string;
	audioFile: File | null;
}

const AddAlbumDialog = () => {
	const [albumDialogOpen, setAlbumDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isSongDialogOpen, setIsSongDialogOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const audioInputRef = useRef<HTMLInputElement>(null);

	const [newAlbum, setNewAlbum] = useState({
		title: "",
		artist: "",
		releaseYear: new Date().getFullYear(),
	});

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [songs, setSongs] = useState<SongInput[]>([]);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) setImageFile(file);
	};

	const handleAddSong = () => {
		setSongs((prev) => [
			...prev,
			{ title: "", duration: "0", audioFile: null },
		]);
	};

	const handleSongChange = (index: number, field: keyof SongInput, value: any) => {
		const updated = [...songs];
		updated[index][field] = value;
		setSongs(updated);
	};

	const handleSubmit = async () => {
		setIsLoading(true);

		try {
			if (!imageFile) {
				toast.error("Please upload an album image");
				return;
			}
			if (!newAlbum.title || !newAlbum.artist) {
				toast.error("Please fill album details");
				return;
			}

			// Step 1: Create album
			const formData = new FormData();
			formData.append("title", newAlbum.title);
			formData.append("artist", newAlbum.artist);
			formData.append("releaseYear", newAlbum.releaseYear.toString());
			formData.append("imageFile", imageFile);

			const albumRes = await axiosInstance.post("/admin/create_album", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			const albumId = albumRes.data?.album?._id || albumRes.data?._id;
			if (!albumId) throw new Error("Album ID not returned");

			// Step 2: Upload songs for the created album
			for (const song of songs) {
				if (!song.audioFile || !song.title) continue;

				const songForm = new FormData();
				songForm.append("title", song.title);
				songForm.append("artist", newAlbum.artist);
				songForm.append("duration", song.duration);
				songForm.append("albumId", albumId);
				songForm.append("audioFile", song.audioFile);
				songForm.append("imageFile", imageFile); // same cover

				await axiosInstance.post("/admin/create_song", songForm, {
					headers: { "Content-Type": "multipart/form-data" },
				});
			}

			toast.success("Album and songs uploaded successfully");

			setNewAlbum({ title: "", artist: "", releaseYear: new Date().getFullYear() });
			setImageFile(null);
			setSongs([]);
			setAlbumDialogOpen(false);
		} catch (error: any) {
			toast.error("Failed: " + error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
			<DialogTrigger asChild>
				<Button className='bg-violet-500 hover:bg-violet-600 text-white'>
					<Plus className='mr-2 h-4 w-4' />
					Add Album
				</Button>
			</DialogTrigger>

			<DialogContent className='bg-zinc-900 border-zinc-700 max-h-[85vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Add New Album</DialogTitle>
					<DialogDescription>Include multiple songs in this album</DialogDescription>
				</DialogHeader>

				{/* Image uploader */}
				<div className='space-y-4 py-4'>
					<input
						type='file'
						ref={fileInputRef}
						onChange={handleImageSelect}
						accept='image/*'
						className='hidden'
					/>
					<div
						className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
						onClick={() => fileInputRef.current?.click()}
					>
						<div className='text-center'>
							<div className='p-3 bg-zinc-800 rounded-full inline-block mb-2'>
								<Upload className='h-6 w-6 text-zinc-400' />
							</div>
							<div className='text-sm text-zinc-400 mb-2'>
								{imageFile ? imageFile.name : "Upload album artwork"}
							</div>
							<Button variant='outline' size='sm' className='text-xs'>
								Choose File
							</Button>
						</div>
					</div>

					{/* Album fields */}
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Album Title</label>
						<Input
							value={newAlbum.title}
							onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Artist</label>
						<Input
							value={newAlbum.artist}
							onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>
					<div className='space-y-2'>
						<label className='text-sm font-medium'>Release Year</label>
						<Input
							type='number'
							value={newAlbum.releaseYear}
							onChange={(e) =>
								setNewAlbum({ ...newAlbum, releaseYear: parseInt(e.target.value) })
							}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					{/* Songs uploader */}
					<div className='border-t border-zinc-800 pt-4 mt-4'>
						<div className='flex justify-between items-center mb-3'>
							<h3 className='text-md font-medium text-zinc-300'>Songs</h3>
							<Button
								variant='outline'
								size='sm'
								onClick={handleAddSong}
								className='border-zinc-600 text-zinc-300'
							>
								<Plus className='mr-1 h-4 w-4' /> Add Song
							</Button>
						</div>

						{songs.map((song, index) => (
							<div
								key={index}
								className='p-3 border border-zinc-700 rounded-lg mb-3 space-y-2 bg-zinc-800'
							>
								<div className='flex justify-between items-center'>
									<span className='text-sm text-zinc-400'>Song {index + 1}</span>
									<Button
										variant='ghost'
										size='sm'
										className='text-red-400'
										onClick={() =>
											setSongs((prev) => prev.filter((_, i) => i !== index))
										}
									>
										Remove
									</Button>
								</div>
								<Input
									placeholder='Song Title'
									value={song.title}
									onChange={(e) => handleSongChange(index, "title", e.target.value)}
									className='bg-zinc-900 border-zinc-700'
								/>
								<Input
									type='number'
									placeholder='Duration (seconds)'
									value={song.duration}
									onChange={(e) => handleSongChange(index, "duration", e.target.value)}
									className='bg-zinc-900 border-zinc-700'
								/>
								<Button
									variant='outline'
									size='sm'
									className='w-full border-zinc-700 text-zinc-300'
									onClick={() => audioInputRef.current?.click()}
								>
									{song.audioFile ? song.audioFile.name : "Upload Audio File"}
								</Button>
								<input
									type='file'
									ref={audioInputRef}
									accept='audio/*'
									className='hidden'
									onChange={(e) =>
										handleSongChange(index, "audioFile", e.target.files?.[0] || null)
									}
								/>
							</div>
						))}
					</div>
				</div>

				<DialogFooter>
					<Button variant='outline' onClick={() => setAlbumDialogOpen(false)} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						onClick={handleSubmit}
						className='bg-violet-500 hover:bg-violet-600'
						disabled={isLoading}
					>
						{isLoading ? "Creating..." : "Add Album & Songs"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
export default AddAlbumDialog;
