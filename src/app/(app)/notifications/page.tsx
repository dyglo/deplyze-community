import { Bell, Calendar, Heart, ShieldAlert } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    { id: 1, type: 'prayer', text: 'Someone added an "Amen" to your prayer request.', time: '2h ago', icon: Heart },
    { id: 2, type: 'event', text: 'Reminder: Global Prayer Circle starts in 30 minutes.', time: '1h ago', icon: Calendar },
    { id: 3, type: 'community', text: '5 people near you joined the Local Hub today.', time: '5h ago', icon: ShieldAlert },
    { id: 4, type: 'activity', text: 'Your status has been updated to "Active Member".', time: '1d ago', icon: Bell },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
      
      {/* Sidebar Filters */}
      <div className="w-full md:w-56 shrink-0">
         <h1 className="text-2xl font-bold tracking-tighter mb-8 uppercase">Notifications</h1>
         
         <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2 px-3">Filter By</h3>
            
            <button className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-black text-white text-sm font-bold w-full text-left">
               <span>All Notifications</span>
               <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">4</span>
            </button>
            <button className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-neutral-50 text-neutral-600 text-sm font-bold w-full text-left transition-colors">
               <span>Prayer Updates</span>
            </button>
            <button className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-neutral-50 text-neutral-600 text-sm font-bold w-full text-left transition-colors">
               <span>Events</span>
            </button>
            <button className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-neutral-50 text-neutral-600 text-sm font-bold w-full text-left transition-colors">
               <span>Community</span>
            </button>
         </div>
         
         <div className="mt-8 pt-6 border-t border-neutral-100">
            <button className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 hover:text-black">
               Mark all as read
            </button>
         </div>
      </div>

      {/* Main Content List */}
      <div className="flex-1 bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
         <div className="flex flex-col">
            {notifications.map((notif, index) => (
              <div 
                key={notif.id} 
                className={`flex gap-5 p-6 hover:bg-neutral-50/50 transition-colors group cursor-pointer ${index !== notifications.length - 1 ? 'border-b border-neutral-100' : ''}`}
              >
                 <div className="shrink-0 w-10 h-10 rounded-full bg-neutral-100 flex flex-col items-center justify-center border border-neutral-200">
                    <notif.icon className="w-4 h-4 text-black" />
                 </div>
                 <div className="flex flex-col gap-1.5 justify-center">
                    <p className="text-sm text-black font-medium leading-relaxed">{notif.text}</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{notif.time}</span>
                 </div>
              </div>
            ))}

            {notifications.length === 0 && (
               <div className="py-32 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                     <Bell className="w-6 h-6 text-neutral-300" />
                  </div>
                  <p className="text-sm font-medium text-black">You&apos;re all caught up!</p>
                  <p className="text-xs text-neutral-500 font-medium mt-1">No new notifications.</p>
               </div>
            )}
         </div>
      </div>

    </div>
  );
}
