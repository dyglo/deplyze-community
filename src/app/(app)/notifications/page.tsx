import { Bell, Calendar, Heart } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    { id: 1, type: 'prayer', text: 'Someone added an "Amen" to your prayer request.', time: '2h ago', icon: Heart },
    { id: 2, type: 'event', text: 'Reminder: Global Prayer Circle starts in 30 minutes.', time: '1h ago', icon: Calendar },
    { id: 3, type: 'activity', text: 'Your status has been updated to "Active Member".', time: '1d ago', icon: Bell },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-12 md:py-24">
      <h1 className="text-4xl font-bold tracking-tighter mb-4 uppercase">Notifications</h1>
      <p className="text-neutral-500 text-sm font-medium mb-16">Updates on your activity and community events.</p>

      <div className="flex flex-col border-t border-neutral-100">
         {notifications.map((notif) => (
           <div key={notif.id} className="flex gap-6 py-8 border-b border-neutral-100 items-start group">
              <div className="shrink-0 p-3 bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
                 <notif.icon className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="flex flex-col gap-1">
                 <p className="text-sm text-neutral-800 font-medium leading-relaxed">{notif.text}</p>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">{notif.time}</span>
              </div>
           </div>
         ))}

         {notifications.length === 0 && (
            <div className="py-24 text-center">
               <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest">No notifications yet.</p>
            </div>
         )}
      </div>
    </div>
  );
}
