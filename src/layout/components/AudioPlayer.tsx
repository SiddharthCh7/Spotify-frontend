import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const { currentSong, isPlaying, playNext } = usePlayerStore();

	// handle play/pause logic safely
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			// wait until the audio can play to avoid AbortError
			const tryPlay = () => {
				audio
					.play()
					.catch((err) => {
						if (err.name !== "AbortError") {
							console.error("Playback failed:", err);
						}
					});
			};

			if (audio.readyState >= 2) {
				tryPlay();
			} else {
				audio.addEventListener("canplay", tryPlay, { once: true });
			}
		} else {
			audio.pause();
		}
	}, [isPlaying]);

	// handle song end → play next
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleEnded = () => playNext();
		audio.addEventListener("ended", handleEnded);

		return () => audio.removeEventListener("ended", handleEnded);
	}, [playNext]);

	// handle new song load
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !currentSong) return;

		const isSongChange = prevSongRef.current !== currentSong.audioUrl;
		if (!isSongChange) return;

		audio.src = currentSong.audioUrl;
		audio.currentTime = 0;
		prevSongRef.current = currentSong.audioUrl;

		if (isPlaying) {
			audio
				.play()
				.catch((err) => {
					if (err.name !== "AbortError") {
						console.error("Playback failed:", err);
					}
				});
		}
	}, [currentSong, isPlaying]);

	return <audio ref={audioRef} preload="auto" />;
};

export default AudioPlayer;
