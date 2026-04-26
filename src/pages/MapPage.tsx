/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Clock, 
  ShoppingBag, 
  Utensils, 
  Navigation, 
  ChevronRight,
  Info,
  Loader2,
  X
} from 'lucide-react';
import { Venue, GeocodeCache } from '../types';
import { fetchVenues, getGeocode, loadCache, saveCache, delay } from '../services/venueService';
import { cn } from '../lib/utils';

// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to handle flyTo and openPopup
function MapController({ activeVenueId, venues }: { activeVenueId: string | null, venues: Venue[] }) {
  const map = useMap();
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (activeVenueId) {
      const venue = venues.find(v => v.id === activeVenueId);
      if (venue && venue.lat && venue.lng) {
        map.flyTo([venue.lat, venue.lng], 16, {
          duration: 1.5
        });
        
        // Find is difficult directly, we might need a workaround or markers state
        // For now, let's just fly. The user clicking common behavior handles popup.
      }
    }
  }, [activeVenueId, venues, map]);

  return null;
}

export default function MapPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [processedCount, setProcessedCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVenueId, setActiveVenueId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const rawVenues = await fetchVenues();
        const cache = loadCache();
        
        // Initial setup with cached coordinates
        const initialVenues = rawVenues.map(v => {
          const cached = cache[v.address];
          return cached ? { ...v, ...cached } : v;
        });
        setVenues(initialVenues);

        // Geocoding missing ones
        let updatedCache = { ...cache };
        let count = 0;
        let hasNewGeocodes = false;

        for (const venue of rawVenues) {
          count++;
          setProcessedCount(count);

          if (!cache[venue.address]) {
            const coords = await getGeocode(venue.address, updatedCache);
            if (coords) {
              updatedCache[venue.address] = coords;
              hasNewGeocodes = true;
              
              setVenues(prev => prev.map(v => 
                v.id === venue.id ? { ...v, ...coords } : v
              ));
            }
            // Mandatory 2s delay for Nominatim
            await delay(2000);
          }
        }

        if (hasNewGeocodes) {
          saveCache(updatedCache);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Initialization failed:", error);
        setLoading(false);
      }
    };

    init();
  }, []);

  const filteredVenues = venues.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const venuesWithCoords = filteredVenues.filter(v => v.lat && v.lng);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden text-slate-800">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/" className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Utensils className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
            Glutensiz <span className="text-emerald-600">İstanbul</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              {loading ? "Mekanlar İşleniyor" : "Veri Senkronize"}
            </span>
            <div className="flex items-center gap-3">
              <div className="w-32 lg:w-48 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <motion.div 
                   className="bg-emerald-500 h-full"
                   initial={{ width: 0 }}
                   animate={{ width: loading ? `${(processedCount / venues.length) * 100}%` : "100%" }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-600 tabular-nums">
                {processedCount}/{venues.length} mekan
              </span>
            </div>
          </div>
          <nav className="flex gap-2">
            <Link to="/" className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">AÇILIŞ</Link>
            <button className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">HARİTA</button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar: Venue List */}
        <aside 
          className={cn(
            "absolute inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-2xl lg:shadow-none transition-transform duration-300 lg:static lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4 border-b border-slate-100 bg-slate-50/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Mekan veya ilçe ara..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/30 divide-y divide-slate-100 scrollbar-thin scrollbar-thumb-slate-200">
            {filteredVenues.length === 0 ? (
              <div className="p-12 text-center">
                 <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6 text-slate-300" />
                 </div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sonuç Yok</p>
              </div>
            ) : (
              filteredVenues.map((venue) => (
                <div 
                  key={venue.id}
                  onClick={() => {
                    setActiveVenueId(venue.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={cn(
                    "p-5 cursor-pointer transition-all relative group",
                    activeVenueId === venue.id 
                      ? "bg-white border-l-4 border-emerald-500 shadow-md z-10" 
                      : "hover:bg-white border-l-4 border-transparent"
                  )}
                >
                  <h3 className={cn(
                    "font-bold transition-colors mb-0.5",
                    activeVenueId === venue.id ? "text-emerald-700" : "text-slate-900 group-hover:text-emerald-600"
                  )}>{venue.name}</h3>
                  <p className="text-[11px] font-medium text-slate-400 mb-3 flex items-center gap-1 uppercase tracking-wider">
                     <MapPin className="w-3 h-3" /> {venue.district}, İstanbul
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className={cn(
                      "px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-tighter",
                      venue.serviceType.includes("Market") ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                      {venue.serviceType.split(',')[0]}
                    </span>
                    {venue.featuredProducts && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-md uppercase tracking-tighter">
                         Öne Çıkan Ürünler
                      </span>
                    )}
                  </div>
                  <ChevronRight className={cn(
                    "absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all opacity-0",
                    activeVenueId === venue.id ? "opacity-100 text-emerald-500 translate-x-0" : "group-hover:opacity-40 -translate-x-2"
                  )} />
                </div>
              ))
            )}
          </div>
          
          <footer className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full animate-pulse", loading ? "bg-amber-500" : "bg-emerald-500")} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {loading ? "Senkronize Ediliyor" : "Bağlantı Aktif"}
                </span>
             </div>
             <button className="text-[10px] font-bold text-emerald-600 hover:underline">VERİ KAYNAĞI</button>
          </footer>
        </aside>

        {/* Map Container */}
        <main className="flex-1 relative bg-[#F2F4F7]">
          <div className="w-full h-full p-4 lg:p-6 pb-2 relative z-10">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-slate-300/30 border border-white">
              <MapContainer 
                center={[41.0082, 28.9784]} 
                zoom={11} 
                className="w-full h-full"
                zoomControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapController activeVenueId={activeVenueId} venues={venues} />
                
                {venuesWithCoords.map((venue) => (
                  <Marker 
                    key={venue.id} 
                    position={[venue.lat!, venue.lng!]}
                    eventHandlers={{
                      click: () => {
                        setActiveVenueId(venue.id);
                      }
                    }}
                  >
                    <Tooltip direction="top" offset={[0, -32]} opacity={1} className="custom-tooltip">
                      {venue.name} | {venue.district}
                    </Tooltip>
                    <Popup className="custom-popup" maxWidth={300} minWidth={280}>
                      <div className="flex flex-col bg-white overflow-hidden">
                        <div className={cn(
                          "px-5 py-4 flex justify-between items-start text-white relative",
                          venue.serviceType.includes("Market") ? "bg-blue-600" : "bg-emerald-600"
                        )}>
                          <div>
                             <div className="flex items-center gap-2 mb-1.5 opacity-80">
                                {venue.serviceType.includes("Market") ? <ShoppingBag className="w-3.5 h-3.5" /> : <Utensils className="w-3.5 h-3.5" />}
                                <span className="text-[9px] font-bold uppercase tracking-[0.15em]">{venue.serviceType}</span>
                             </div>
                             <h4 className="font-display font-bold text-lg leading-tight pr-4">{venue.name}</h4>
                          </div>
                        </div>
                        
                        <div className="p-5 space-y-4">
                          {venue.featuredProducts && (
                            <div className="flex items-start gap-3">
                               <div className="mt-1 text-slate-300 shrink-0"><Utensils className="w-4 h-4 text-emerald-500" /></div>
                               <div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Öne Çıkan Ürün</p>
                                  <p className="text-xs font-semibold text-slate-700 italic">"{venue.featuredProducts}"</p>
                               </div>
                            </div>
                          )}

                          <div className="space-y-3 pt-1">
                             <div className="flex items-start gap-4">
                                <MapPin className="w-4 h-4 text-slate-300 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-slate-600 leading-normal">{venue.address}</p>
                             </div>
                             
                             {venue.phone && (
                                <div className="flex items-center gap-4">
                                   <Phone className="w-4 h-4 text-slate-300 shrink-0" />
                                   <p className="text-[11px] text-slate-600 font-medium">{venue.phone}</p>
                                </div>
                             )}
                          </div>

                          <div className="bg-slate-50 p-2.5 rounded-lg flex justify-between items-center border border-slate-100">
                             <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase">AÇILIŞ</span>
                             </div>
                             <span className="text-[11px] font-bold text-emerald-600">{venue.workingHours || "Belirtilmemiş"}</span>
                          </div>

                          <a 
                            href={`https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                          >
                             <Navigation className="w-4 h-4" /> YOL TARİFİ AL
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="absolute top-10 left-10 z-[1000] lg:hidden">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-3 bg-white shadow-2xl rounded-2xl text-slate-900 border border-slate-100"
            >
              <Navigation className="w-5 h-5 rotate-45" />
            </button>
          </div>
          
          <div className="absolute right-10 bottom-10 z-[1000] flex flex-col gap-3">
             <button className="w-12 h-12 bg-white shadow-2xl rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all active:scale-95 border border-slate-50">
                <ChevronRight className="w-6 h-6 rotate-[-90deg]" />
             </button>
             <button className="w-12 h-12 bg-white shadow-2xl rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-all active:scale-95 border border-slate-50">
                <ChevronRight className="w-6 h-6 rotate-90" />
             </button>
          </div>
        </main>
      </div>
    </div>
  );
}
