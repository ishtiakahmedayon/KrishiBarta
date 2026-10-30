export interface PriceItem {
  id: number;
  name: string;
  name_possessive: string;
  price: number;
  unit: string;
  category: string;
  lastUpdated?: string;
}

export interface PesticideItem {
  id: number;
  crop: string;
  pest: string;
  pesticide_name: string;
  dosage: string;
  precaution: string;
}

export interface KrishiOfficeItem {
  id: number;
  name: string;
  district: string;
  address: string;
  phone: string;
  services: string;
}

export type PriceCategory = 'সবজি' | 'মশলা' | 'শস্য' | 'অন্যান্য';

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PATCH';
  path: string;
  description: string;
  authRequired: boolean;
  sampleBody?: string;
  sampleQuery?: string;
}
