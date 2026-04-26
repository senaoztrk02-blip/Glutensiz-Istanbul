/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { MapPin, Utensils, ShoppingBag, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 -right-24 w-[32rem] h-[32rem] bg-slate-50 rounded-full blur-3xl opacity-50" />
      </div>

      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-emerald-500/20">
            G
          </div>
          <span className="font-display font-bold text-2xl tracking-tight">Glutensiz <span className="text-emerald-600">İstanbul</span></span>
        </div>
        <Link 
          to="/map" 
          className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-slate-800 transition-all hover:shadow-lg active:scale-95"
        >
          Haritayı Aç
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-100">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            İSTANBUL'UN EN GÜNCEL REHBERİ
          </div>
          
          <h1 className="text-6xl lg:text-8xl font-display font-bold leading-[0.95] mb-8 text-slate-900">
            Şehri Güvenle <br />
            <span className="text-emerald-500">Keşfet.</span>
          </h1>
          
          <p className="text-xl text-slate-500 leading-relaxed max-w-lg mb-12">
            İstanbul'daki glütensiz kafe, restoran ve marketleri tek bir akıllı haritada buluşturduk. 
            Dilediğiniz lezzete güvenle ulaşmak artık çok daha kolay.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link 
              to="/map" 
              className="px-10 py-5 bg-emerald-500 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-emerald-600 shadow-2xl shadow-emerald-500/30 transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Hemen Başlayın <ArrowRight className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-4 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover grayscale" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-900">50+ Mekan</p>
                <p className="text-slate-400 text-xs font-medium">Veriler Güncelleniyor</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="aspect-[4/5] rounded-[2.5rem] bg-slate-100 relative overflow-hidden shadow-2xl skew-y-1 lg:-rotate-2">
            <img 
              src="https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=1000&auto=format&fit=crop" 
              alt="İstanbul" 
              className="absolute inset-0 w-full h-full object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />
            
            <div className="absolute bottom-8 left-8 right-8">
               <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">Canlı Harita</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold leading-tight">Glütensiz dünyanı keşfetmeye buradan başla.</h3>
               </div>
            </div>
          </div>

          <div className="absolute -top-12 -right-8 p-5 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 flex items-center gap-4 animate-bounce-slow">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-tight">Yüksek Kalite</p>
              <p className="text-xs text-slate-400 font-medium whitespace-nowrap">Onaylı Mekanlar</p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
           <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center text-white text-[10px] font-bold">G</div>
           <span className="font-display font-bold text-slate-900 tracking-tight text-sm">Glutensiz İstanbul</span>
        </div>
        <div className="flex gap-10 text-xs font-bold uppercase tracking-widest text-slate-400">
          <a href="#" className="hover:text-emerald-500 transition-colors">Hakkımızda</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">İletişim</a>
          <a href="#" className="hover:text-emerald-500 transition-colors">İşletme Ekle</a>
        </div>
        <p className="text-slate-300 text-[11px] font-medium italic">Powered by OpenStreetMap & Nominatim</p>
      </footer>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
