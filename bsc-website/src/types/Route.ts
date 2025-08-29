
export interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  duration: number; // in minutes
  fare: number;
  discountedFare: number;
  buses: string[];
  stops: string[];
  coordinates: {
    lat: number;
    lng: number;
  }[];
}
