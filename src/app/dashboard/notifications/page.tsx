'use client';

import { useEffect } from 'react';
import { usePortalState } from '@/hooks/usePortalState';
import { NotificationItem } from '@/types';
import { 
  Bell, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle 
} from 'lucide-react';

export default function StudentNotifications() {
  const { notifications, markNotificationsAsRead } = usePortalState();

  // Mark all as read upon opening this view
  useEffect(() => {
    markNotificationsAsRead();
  }, []);

  const notifIcons = {
    info: <Info className="w-5 h-5 text-blue-800" />,
    success: <CheckCircle2 className="w-5 h-5 text-success-green" />,
    warning: <AlertTriangle className="w-5 h-5 text-warning-amber" />,
    error: <XCircle className="w-5 h-5 text-error-red" />
  };

  const bgStyles = {
    info: 'bg-blue-800/[0.02] border-blue-800/10',
    success: 'bg-success-green/[0.02] border-success-green/10',
    warning: 'bg-warning-amber/[0.02] border-warning-amber/10',
    error: 'bg-error-red/[0.02] border-error-red/10'
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-border-slate/60 pb-5 flex justify-between items-center">
        <div>
          <h1 className="font-outfit font-black text-2xl text-navy-950">Notifications Hub</h1>
          <p className="text-xs font-semibold text-text-slate">Monitor system logs, calendar schedules, and administrative verification notices.</p>
        </div>
        <span className="text-[10px] font-extrabold uppercase bg-surface-slate text-text-slate px-3 py-1 rounded-full border border-border-slate">
          {notifications.length} Historical Logs
        </span>
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((item: NotificationItem) => (
            <div 
              key={item.id} 
              className={`p-5 rounded-2xl border flex gap-4 items-start transition-all ${bgStyles[item.type as keyof typeof bgStyles] || bgStyles.info}`}
            >
              <div className="p-2 bg-white rounded-xl border border-border-slate/50 shrink-0">
                {notifIcons[item.type as keyof typeof notifIcons] || notifIcons.info}
              </div>

              <div className="space-y-1 flex-grow">
                <div className="flex justify-between items-center gap-4">
                  <h4 className="font-outfit font-bold text-sm text-navy-950">{item.title}</h4>
                  <span className="text-[10px] font-semibold text-text-slate shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-xs text-text-slate leading-relaxed font-semibold">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="premium-card bg-white border border-border-slate p-12 text-center space-y-4 shadow-sm max-w-xl mx-auto mt-6">
          <div className="w-12 h-12 rounded-xl bg-bg-slate text-text-slate flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6 animate-swing" />
          </div>
          <div>
            <p className="text-xs font-bold text-navy-950">Zero Notifications</p>
            <p className="text-[10px] font-semibold text-text-slate mt-1">There are no unread system alert reports in your inbox.</p>
          </div>
        </div>
      )}

    </div>
  );
}
