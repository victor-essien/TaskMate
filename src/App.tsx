import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContex";
import {ThemeProvider, useTheme} from "./context/ThemeContext"
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import SignIn from "./components/SignIn";
import Home from "./pages/Home";
import CreateTeam from "./components/CreateTeam";
import Calendar from "./pages/Calendar";
import { Task, Team, Profile, CreateTask, ViewTeam } from "./pages";


const AppContent = () => {
  const { theme, toggleTheme } = useTheme(); // Access theme context here

  const location = useLocation();
  const showSidebar = location.pathname !== "/";
 

  return (
    <div
      data-theme={theme}
      className="h-screen w-screen bg-bgColor flex flex-col overflow-auto"
    >
      {/* <button
        className="px-4 py-2 bg-blue-500 text-text rounded"
        onClick={toggleTheme}
      >
        Toggle Theme
      </button> */}
      <AuthProvider>
        <div className="w-full flex lg:gap-4  pb-12 h-full">
          {showSidebar && (
            <div className="hidden lg:w-48 h-full md:flex flex-col overflow-hidden">
              <Sidebar />
            </div>
          )}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add"
                element={
                  <ProtectedRoute>
                    <CreateTask />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/create-team"
                element={
                  <ProtectedRoute>
                    
                    <CreateTeam />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/task/:taskId"
                element={
                  <ProtectedRoute>
                    <Task />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <Team />
                  </ProtectedRoute>
                }
              />

                <Route
                path="/team/:teamId"
                element={
                  <ProtectedRoute>
                    <ViewTeam />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<div className="text-text flex justify-center text-3xl">404 - Page Not Found</div>} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </div>
  );
};


const App = () => (
  <ThemeProvider>
  
      <AppContent />
    
  </ThemeProvider>
);

export default App;
