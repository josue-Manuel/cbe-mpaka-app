import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Meditation from './pages/Meditation';
import MeditationHistory from './pages/MeditationHistory';
import Announcements from './pages/Announcements';
import Activities from './pages/Activities';
import Prayer from './pages/Prayer';
import Cantiques from './pages/Cantiques';
import Contacts from './pages/Contacts';
import Community from './pages/Community';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import Splash from './pages/Splash';
import Gallery from './pages/Gallery';
import Archives from './pages/Archives';
import ArchivesCategory from './pages/ArchivesCategory';
import Testimonies from './pages/Testimonies';
import About from './pages/About';
import Offline from './pages/Offline';
import Admin from './pages/Admin';
import Contributions from './pages/Contributions';
import { ProfileProvider } from './context/ProfileContext';
import { AppDataProvider } from './context/AppDataContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';

import { AdminAssistant } from './components/AdminAssistant';
import { UserNotificationsManager } from './components/UserNotificationsManager';

export default function App() {
  return (
    <AppDataProvider>
      <NotificationProvider>
        <ThemeProvider>
          <ProfileProvider>
            <UserNotificationsManager />
            <HashRouter>
              <Routes>
                <Route index element={<Splash />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/app" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="meditation" element={<Meditation />} />
                  <Route path="meditation/history" element={<MeditationHistory />} />
                  <Route path="announcements" element={<Announcements />} />
                  <Route path="activities" element={<Activities />} />
                  <Route path="prayer" element={<Prayer />} />
                  <Route path="cantiques" element={<Cantiques />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="community" element={<Community />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="profile/edit" element={<ProfileEdit />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="archives" element={<Archives />} />
                  <Route path="archives/:categoryId" element={<ArchivesCategory />} />
                  <Route path="testimonies" element={<Testimonies />} />
                  <Route path="about" element={<About />} />
                  <Route path="offline" element={<Offline />} />
                  <Route path="admin" element={<Admin />} />
                  <Route path="contributions" element={<Contributions />} />
                </Route>
              </Routes>
            </HashRouter>
          </ProfileProvider>
        </ThemeProvider>
      </NotificationProvider>
    </AppDataProvider>
  );
}
