import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContex";
import {ThemeProvider, useTheme} from "./context/ThemeContext"
import ProtectedRoute from "./components/ProtectedRoute";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./context/AuthContex";
import Sidebar from "./components/Sidebar";
import SignIn from "./components/SignIn";
import Home from "./pages/Home";
import CreateTeam from "./components/CreateTeam";
import Calendar from "./pages/Calendar";
import { Task, Team, Profile, CreateTask, ViewTeam , CreateTeamTask} from "./pages";


const AppContent = () => {
  const { theme, toggleTheme } = useTheme(); // Access theme context here
  const { user } = useAuth();
  console.log('see',user)
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
   
        <div className="w-full flex lg:gap-4  pb-12 h-full">
          {showSidebar && (
            <div className="hidden lg:w-48 h-full md:flex flex-col overflow-hidden">
              <Sidebar />
            </div>
          )}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={user ? <Home /> : <SignIn />} />
               <Route element={<ProtectedRoute />}>

              
              <Route
                path="/home"
                element={
                    <Home />
                }
              />
              <Route
                path="/calendar"
                element={
                 
                    <Calendar />
                  
                }
              />
              <Route
                path="/add"
                element={
                  
                    <CreateTask />
                  
                }
              />
               <Route
                path="/create-team"
                element={
                  
                    
                    <CreateTeam />
                  
                }
              />
               <Route
                path="/task/:taskId"
                element={
                 
                    <Task />
                  
                }
              />

              <Route
                path="/team"
                element={
                    <Team />
                  
                }
              />

                <Route
                path="/team/:teamId"
                element={
                  
                    <ViewTeam />
                }
              />
               <Route
                path="/create-task"
                element={
                 
                    <CreateTeamTask />
                }
              />
              <Route
                path="/profile"
                element={
                 
                    <Profile />
               }
              />
              <Route path="*" element={<div className="text-text flex justify-center text-3xl">404 - Page Not Found</div>} />
              </Route>
            </Routes>
          </div>
        </div>
      
    </div>
  );
};


const App = () => (
  <ThemeProvider>
  
      <AppContent />
    
  </ThemeProvider>
);

export default App;
