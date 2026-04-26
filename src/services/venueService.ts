/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Papa from 'papaparse';
import { Venue, GeocodeCache, CSV_URL, CACHE_KEY } from '../types';

export const fetchVenues = async (): Promise<Venue[]> => {
  const response = await fetch(CSV_URL);
  const csvData = await response.text();
  
  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const venues: Venue[] = results.data.map((row: any, index: number) => ({
          id: `venue-${index}`,
          name: row["Mekan Adı"] || row["Mekan Adı "] || "",
          district: row["İlçe"] || row["İlçe "] || "",
          serviceType: row["Hizmet Seçeneği"] || "",
          featuredProducts: row["Öne Çıkan Ürünler"] || "",
          address: row["Adres"] || "",
          phone: row["Telefon"] || "",
          workingHours: row["Çalışma Saatleri"] || "",
        }));
        resolve(venues.filter(v => v.name && v.address));
      },
      error: (err: any) => reject(err),
    });
  });
};

export const getGeocode = async (address: string, cache: GeocodeCache): Promise<{ lat: number; lng: number } | null> => {
  // Check cache first
  if (cache[address]) {
    return cache[address];
  }

  try {
    const fullAddress = `${address}, Istanbul, Turkey`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`;
    
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
        'User-Agent': 'GlutensizIstanbulApp/1.0'
      }
    });
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
      return result;
    }
  } catch (error) {
    console.error(`Geocoding error for ${address}:`, error);
  }
  
  return null;
};

export const saveCache = (cache: GeocodeCache) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const loadCache = (): GeocodeCache => {
  const data = localStorage.getItem(CACHE_KEY);
  return data ? JSON.parse(data) : {};
};

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
