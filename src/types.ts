/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Venue {
  id: string;
  name: string;
  district: string;
  serviceType: string;
  featuredProducts: string;
  address: string;
  phone: string;
  workingHours: string;
  lat?: number;
  lng?: number;
}

export interface GeocodeCache {
  [address: string]: {
    lat: number;
    lng: number;
  };
}

export const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRUtsT7w6iVOZkr4x16Lv6cE5gLwxb8Bom9jlZrhW2DxarY9RpA18AIJxbiiS8s3VFD9fNHTAARLps6/pub?output=csv";
export const CACHE_KEY = "istanbul_gluten_free_geocode_cache";
