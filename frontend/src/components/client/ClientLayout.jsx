import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import TopBar  from "../common/TopBar";
import SessionProvider from "../common/SessionProvider";

const ClientLayout = () => (
  <div className="min-h-screen flex" style={{ background: "var(--bg-base)" }}>
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0 md:ml-60 transition-all duration-300">
      <TopBar />
      <main className="flex-1 p-5 md:p-7 overflow-auto">
        <SessionProvider>
          <Outlet />
        </SessionProvider>
      </main>
    </div>
  </div>
);
export default ClientLayout;
