
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "@/context/AuthContext";
import { AuthStatus } from "@/types";

const Layout = () => {
  const { status } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {status === AuthStatus.LOADING ? (
          <div className="flex justify-center items-center h-full min-h-[60vh]">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-debate-light border-t-debate rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
              </div>
              <p className="mt-4 text-debate font-medium">Loading DebateHub...</p>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
