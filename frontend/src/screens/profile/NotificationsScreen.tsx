import React from 'react';
import { useAppState } from '../../context/AppStateContext.js';
import { useLanguage } from '../../context/LanguageContext.js';
import { useVoice } from '../../context/VoiceContext.js';
import { Header } from '../../components/layout/Header.js';
import { Bell, Volume2, ShoppingBag, Sparkles, Check, Users } from 'lucide-react';

export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationRead, navigateTo } = useAppState();
  const { playChime, speak } = useVoice();

  const handleNotifClick = (notif: typeof notifications[0]) => {
    playChime('tap');
    markNotificationRead(notif.id);
    if (notif.audio_text) {
      speak(notif.audio_text);
    } else {
      speak(notif.message);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-5 h-5 text-artisan-terracotta" />;
      case 'festival':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'b2b':
        return <Users className="w-5 h-5 text-artisan-indigo" />;
      default:
        return <Bell className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-stone-50 select-none pb-8">
      <Header
        title="Notifications & Alerts"
        showBack={true}
        onBack={() => navigateTo('home')}
        audioGuideText="Here are your latest order updates, festival demand alerts and wholesale inquiries. Tap any alert to listen."
      />

      <div className="p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center my-4">
            <span className="text-3xl block mb-2">🔔</span>
            <h4 className="font-extrabold text-stone-900 text-sm">No new notifications</h4>
            <p className="text-xs text-stone-700 mt-1">You're all caught up!</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleNotifClick(n)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-start space-x-3 active:scale-98 ${
                n.read
                  ? 'bg-white border-stone-200/80 shadow-sm opacity-80'
                  : 'bg-gradient-to-r from-orange-50/50 to-white border-artisan-terracotta shadow-md'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center shrink-0 mt-0.5">
                {getNotifIcon(n.type)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-stone-900 text-xs leading-snug">
                    {n.title}
                  </h4>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      speak(n.audio_text || n.message);
                    }}
                    className="p-1 rounded-full text-artisan-terracotta hover:bg-stone-100"
                    title="Play Voice"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-stone-700 font-medium mt-1 leading-relaxed">
                  {n.message}
                </p>

                <span className="text-[10px] text-stone-700 font-semibold mt-1 block">
                  {n.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
