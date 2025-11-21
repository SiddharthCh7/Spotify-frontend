import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";

const MainLayout = () => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	return (
		<div className='h-screen flex flex-col font-sans'>
			<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-4 gap-4'>
				{/* left sidebar */}
				<ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30} className="rounded-xl glass overflow-hidden h-full">
					<LeftSidebar />
				</ResizablePanel>

				<ResizableHandle className='w-2 bg-transparent transition-colors hover:bg-white/10 rounded-full' />

				{/* Main content */}
				<ResizablePanel defaultSize={isMobile ? 80 : 60} className="rounded-xl glass overflow-hidden h-full">
					<Outlet />
				</ResizablePanel>

				{!isMobile && (
					<>
						<ResizableHandle className='w-2 bg-transparent transition-colors hover:bg-white/10 rounded-full' />
					</>
				)}
			</ResizablePanelGroup>

			<PlaybackControls />
		</div>
	);
};
export default MainLayout;
