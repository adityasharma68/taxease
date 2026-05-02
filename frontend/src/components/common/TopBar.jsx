// src/components/common/TopBar.jsx — All page titles including new pages
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bell } from "lucide-react";

const PAGE_TITLES = {
  "/client/dashboard":    { title:"Overview",            sub:"Welcome back!" },
  "/client/upload":       { title:"Upload Documents",    sub:"Add files for your CA" },
  "/client/filings":      { title:"Filing History",      sub:"All your tax filings" },
  "/client/payments":     { title:"Payments",            sub:"Invoices and billing" },
  "/client/calendar":     { title:"Compliance Calendar", sub:"Upcoming deadlines" },
  "/client/chat":         { title:"Chat Support",        sub:"Message your CA" },
  "/client/profile":      { title:"Profile & KYC",       sub:"Manage your business details" },
  "/admin/dashboard":     { title:"Admin Overview",      sub:"Platform at a glance" },
  "/admin/clients":       { title:"Manage Clients",      sub:"All registered clients" },
  "/admin/filings":       { title:"All Filings",         sub:"Platform-wide filings" },
  "/admin/tasks":         { title:"Assign Tasks",        sub:"Delegate work to accountants" },
  "/admin/reports":       { title:"Reports & Analytics", sub:"Insights and delay reports" },
  "/admin/reminders":     { title:"Reminder Control",    sub:"Manage compliance notifications" },
  "/admin/inbox":         { title:"Document Inbox",      sub:"Review client uploads" },
  "/accountant/dashboard":{ title:"My Dashboard",        sub:"Your assigned work" },
  "/accountant/tasks":    { title:"My Tasks",            sub:"Filings assigned to you" },
  "/accountant/documents":{ title:"Client Documents",    sub:"Review uploaded files" },
  "/accountant/chat":     { title:"Client Chat",         sub:"Communicate with clients" },
};

const TopBar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] || { title:"Dashboard", sub:"" };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Mobile: left pad for hamburger button */}
      <div className="md:ml-0 ml-10">
        <h1 className="text-lg font-bold text-slate-900">{page.title}</h1>
        {page.sub && <p className="text-xs text-slate-400">{page.sub}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors">
          <Bell size={18} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {user?.name?.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};
export default TopBar;
