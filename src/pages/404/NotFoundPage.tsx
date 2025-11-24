import { Home, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
	const navigate = useNavigate();

	return (
		<div className='h-screen bg-background flex items-center justify-center'>
			<div className='text-center space-y-8 px-4'>
				{/* Large animated musical note */}
				<div className='flex justify-center animate-bounce'>
					<Music2 className='h-24 w-24 text-primary' />
				</div>

				{/* Error message */}
				<div className='space-y-4'>
					<h1 className='text-7xl font-bold text-white'>404</h1>
					<h2 className='text-2xl font-semibold text-white'>Page not found</h2>
					<p className='text-neutral-400 max-w-md mx-auto'>
						Looks like this track got lost in the shuffle. Let's get you back to the music.
					</p>
				</div>

				{/* Action buttons */}
				<div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8'>
					<Button
						onClick={() => navigate(-1)}
						variant='outline'
						className='bg-white/5 hover:bg-white/10 text-white border-white/10 w-full sm:w-auto'
					>
						Go Back
					</Button>
					<Button
						onClick={() => navigate("/")}
						className='bg-primary hover:bg-primary/80 text-primary-foreground w-full sm:w-auto'
					>
						<Home className='mr-2 h-4 w-4' />
						Back to Home
					</Button>
				</div>
			</div>
		</div>
	);
}
