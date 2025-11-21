import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage.js";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout.js";
import AlbumPage from "./pages/album/AlbumPage.js";
import AdminPage from "./pages/admin/AdminPage.js";

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage.js";
import AudioPlayer from "./layout/components/AudioPlayer.js";

import ArtistPage from "./pages/artist/ArtistPage.js";
import SettingsPage from "./pages/settings/SettingsPage.js";

function App() {
	return (
		<>
		<AudioPlayer />
			<Routes>
				<Route
					path='/sso-callback'
					element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
				/>
				<Route path='/auth-callback' element={<AuthCallbackPage />} />
				<Route path='/admin' element={<AdminPage />} />
				<Route path='/artist' element={<ArtistPage />} />
				<Route path="/settings" element={<SettingsPage />} />

				<Route element={<MainLayout />}>
					<Route path='/' element={<HomePage />} />
					<Route path='/albums/:albumId' element={<AlbumPage />} />
					<Route path='*' element={<NotFoundPage />} />
				</Route>
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
