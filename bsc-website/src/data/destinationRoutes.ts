export interface DestinationRoute {
  id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  regularFare: string;
  discountedFare: string | null;
  estimatedDuration: string;
  distance: string;
}

export const destinationRoutes: DestinationRoute[] = [
  {
    id: "pili",
    name: "Pili",
    coordinates: { lat: 13.5833, lng: 123.2833 },
    regularFare: "₱25 / ₱30",
    discountedFare: null,
    estimatedDuration: "30 mins",
    distance: "15 km"
  },
  {
    id: "baao",
    name: "Baao",
    coordinates: { lat: 13.4553, lng: 123.3658 },
    regularFare: "₱60",
    discountedFare: "₱50",
    estimatedDuration: "1 hr",
    distance: "25 km"
  },
  {
    id: "bula",
    name: "Bula",
    coordinates: { lat: 13.4667, lng: 123.2833 },
    regularFare: "₱30 / ₱35",
    discountedFare: null,
    estimatedDuration: "45 mins",
    distance: "20 km"
  },
  {
    id: "nabua",
    name: "Nabua",
    coordinates: { lat: 13.4000, lng: 123.3667 },
    regularFare: "₱90",
    discountedFare: "₱70",
    estimatedDuration: "1.5 hrs",
    distance: "35 km"
  },
  {
    id: "bato",
    name: "Bato",
    coordinates: { lat: 13.3167, lng: 123.3667 },
    regularFare: "₱100",
    discountedFare: "₱80",
    estimatedDuration: "2 hrs",
    distance: "45 km"
  },
  {
    id: "tigaon",
    name: "Tigaon",
    coordinates: { lat: 13.6333, lng: 123.5000 },
    regularFare: "₱80 / ₱100",
    discountedFare: "₱80",
    estimatedDuration: "1.5 hrs",
    distance: "40 km"
  },
  {
    id: "goa",
    name: "Goa",
    coordinates: { lat: 13.7167, lng: 123.5000 },
    regularFare: "₱95 / ₱60",
    discountedFare: null,
    estimatedDuration: "1.25 hrs",
    distance: "35 km"
  },
  {
    id: "lagonoy",
    name: "Lagonoy",
    coordinates: { lat: 13.7667, lng: 123.5333 },
    regularFare: "₱108 / ₱120",
    discountedFare: null,
    estimatedDuration: "2 hrs",
    distance: "50 km"
  },
  {
    id: "polangui",
    name: "Polangui",
    coordinates: { lat: 13.2833, lng: 123.4833 },
    regularFare: "₱130 / ₱220",
    discountedFare: null,
    estimatedDuration: "2.5 hrs",
    distance: "65 km"
  },
  {
    id: "camalig",
    name: "Camalig",
    coordinates: { lat: 13.1500, lng: 123.5667 },
    regularFare: "₱180",
    discountedFare: "₱160",
    estimatedDuration: "3 hrs",
    distance: "80 km"
  },
  {
    id: "oas",
    name: "Oas",
    coordinates: { lat: 13.2167, lng: 123.5000 },
    regularFare: "₱145",
    discountedFare: null,
    estimatedDuration: "2.5 hrs",
    distance: "70 km"
  },
  {
    id: "guinobatan",
    name: "Guinobatan",
    coordinates: { lat: 13.1667, lng: 123.5833 },
    regularFare: "₱210",
    discountedFare: null,
    estimatedDuration: "3.5 hrs",
    distance: "90 km"
  },
  {
    id: "legazpi",
    name: "Legazpi",
    coordinates: { lat: 13.1391, lng: 123.7445 },
    regularFare: "₱210–₱220",
    discountedFare: "₱160–₱190",
    estimatedDuration: "4 hrs",
    distance: "100 km"
  },
  {
    id: "tabaco",
    name: "Tabaco",
    coordinates: { lat: 13.3500, lng: 123.7333 },
    regularFare: "₱220",
    discountedFare: "₱175",
    estimatedDuration: "3.5 hrs",
    distance: "95 km"
  },
  {
    id: "daraga",
    name: "Daraga",
    coordinates: { lat: 13.1667, lng: 123.7167 },
    regularFare: "₱200",
    discountedFare: "₱160",
    estimatedDuration: "3.5 hrs",
    distance: "90 km"
  },
  {
    id: "balatan",
    name: "Balatan",
    coordinates: { lat: 13.2000, lng: 123.7000 },
    regularFare: "₱200",
    discountedFare: "₱160",
    estimatedDuration: "3.5 hrs",
    distance: "90 km"
  },
  {
    id: "sabang",
    name: "Sabang",
    coordinates: { lat: 13.7000, lng: 123.2000 },
    regularFare: "₱50",
    discountedFare: null,
    estimatedDuration: "1 hr",
    distance: "25 km"
  },
  {
    id: "iriga",
    name: "Iriga",
    coordinates: { lat: 13.4167, lng: 123.4167 },
    regularFare: "₱90 / ₱70",
    discountedFare: "₱70",
    estimatedDuration: "1.5 hrs",
    distance: "35 km"
  },
  {
    id: "buhi",
    name: "Buhi",
    coordinates: { lat: 13.4333, lng: 123.5167 },
    regularFare: "₱60",
    discountedFare: null,
    estimatedDuration: "1.25 hrs",
    distance: "30 km"
  }
];