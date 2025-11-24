import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, Settings, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

const Topbar = () => {
	const { isAdmin } = useAuthStore();
	

	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10'
		>
			<div className='flex gap-2 items-center'>
				<img src='/logo.png' className='size-8' alt='Spotify logo' />
				Lyrik
			</div>
			<SignedIn>
				<Link to="/settings">
					<div className="flex gap-2 items-center cursor-pointer hover:opacity-80">
						<Settings className="w-6 h-6" />
						<span>Settings</span>
					</div>
				</Link>

				<Link to="/artist">
				<div className="flex gap-2 items-center cursor-pointer hover:opacity-80">
					<UserPlus className="w-6 h-6" />
					<span>Artist</span>
				</div>
				</Link>
			</SignedIn>
			<div className='flex items-center gap-4'>
				{isAdmin && (
					<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
						<LayoutDashboardIcon className='size-4  mr-2' />
						Admin Dashboard
					</Link>
				)}

				<SignedOut>
					<SignInOAuthButtons />
				</SignedOut>

				<UserButton />
			</div>
		</div>
	)
}
export default Topbar;
