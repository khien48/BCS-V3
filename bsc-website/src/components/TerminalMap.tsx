
import { Stall } from "../pages/StallSelection";

// Sample stall data for the terminal
const stallsData: Stall[] = [
  // Ground Floor - Food Court Area
  { id: '1', number: 'A01', size: '3x3m', status: 'available', monthlyRent: 8000, area: 9, location: 'Ground Floor - Food Court', amenities: ['Water', 'Electricity', 'Ventilation'], x: 100, y: 100 },
  { id: '2', number: 'A02', size: '3x3m', status: 'occupied', monthlyRent: 8000, area: 9, location: 'Ground Floor - Food Court', amenities: ['Water', 'Electricity', 'Ventilation'], x: 140, y: 100 },
  { id: '3', number: 'A03', size: '3x3m', status: 'available', monthlyRent: 8000, area: 9, location: 'Ground Floor - Food Court', amenities: ['Water', 'Electricity', 'Ventilation'], x: 180, y: 100 },
  { id: '4', number: 'A04', size: '4x3m', status: 'bidding in progress', monthlyRent: 10000, area: 12, location: 'Ground Floor - Food Court', amenities: ['Water', 'Electricity', 'Ventilation', 'Storage'], x: 230, y: 100 },
  
  // Ground Floor - Retail Area
  { id: '5', number: 'B01', size: '2x2m', status: 'available', monthlyRent: 6000, area: 4, location: 'Ground Floor - Retail', amenities: ['Electricity'], x: 100, y: 200 },
  { id: '6', number: 'B02', size: '2x2m', status: 'available', monthlyRent: 6000, area: 4, location: 'Ground Floor - Retail', amenities: ['Electricity'], x: 130, y: 200 },
  { id: '7', number: 'B03', size: '2x2m', status: 'occupied', monthlyRent: 6000, area: 4, location: 'Ground Floor - Retail', amenities: ['Electricity'], x: 160, y: 200 },
  { id: '8', number: 'B04', size: '3x2m', status: 'available', monthlyRent: 7000, area: 6, location: 'Ground Floor - Retail', amenities: ['Electricity', 'Display Window'], x: 200, y: 200 },
  
  // Second Floor - Services
  { id: '9', number: 'C01', size: '4x4m', status: 'available', monthlyRent: 12000, area: 16, location: 'Second Floor - Services', amenities: ['Water', 'Electricity', 'Air Conditioning', 'Private Entrance'], x: 120, y: 300 },
  { id: '10', number: 'C02', size: '4x4m', status: 'occupied', monthlyRent: 12000, area: 16, location: 'Second Floor - Services', amenities: ['Water', 'Electricity', 'Air Conditioning', 'Private Entrance'], x: 180, y: 300 },
  { id: '11', number: 'C03', size: '3x4m', status: 'available', monthlyRent: 10000, area: 12, location: 'Second Floor - Services', amenities: ['Water', 'Electricity', 'Air Conditioning'], x: 240, y: 300 },
  
  // Corner Units
  { id: '12', number: 'D01', size: '5x4m', status: 'available', monthlyRent: 15000, area: 20, location: 'Corner Unit - Premium', amenities: ['Water', 'Electricity', 'Air Conditioning', 'Storage', 'Double Entry'], x: 80, y: 250 },
  { id: '13', number: 'D02', size: '4x5m', status: 'bidding in progress', monthlyRent: 15000, area: 20, location: 'Corner Unit - Premium', amenities: ['Water', 'Electricity', 'Air Conditioning', 'Storage', 'Double Entry'], x: 280, y: 150 },
];

interface TerminalMapProps {
  onStallSelect: (stall: Stall) => void;
  onStallHover: (stall: Stall | null) => void;
  selectedStall: Stall | null;
  hoveredStall: Stall | null;
}

const TerminalMap = ({ onStallSelect, onStallHover, selectedStall, hoveredStall }: TerminalMapProps) => {
  const getStallColor = (stall: Stall) => {
    if (selectedStall?.id === stall.id) return '#3b82f6'; // blue for selected
    if (hoveredStall?.id === stall.id) return '#6366f1'; // indigo for hovered
    
    switch (stall.status) {
      case 'available': return '#10b981'; // green
      case 'occupied': return '#ef4444'; // red
      case 'bidding in progress': return '#f59e0b'; // yellow
      default: return '#6b7280'; // gray
    }
  };

  const getStallSize = (stall: Stall) => {
    const [width, height] = stall.size.split('x').map(s => parseInt(s));
    return { width: width * 10, height: height * 10 }; // Scale for display
  };

  return (
    <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
      {/* Building Structure */}
      <svg width="100%" height="100%" viewBox="0 0 400 450" className="absolute inset-0">
        {/* Building Outline */}
        <rect x="50" y="50" width="300" height="350" fill="none" stroke="#374151" strokeWidth="3" rx="8" />
        
        {/* Floor Separators */}
        <line x1="50" y1="250" x2="350" y2="250" stroke="#6b7280" strokeWidth="2" strokeDasharray="5,5" />
        
        {/* Areas Labels */}
        <text x="200" y="40" textAnchor="middle" className="text-sm font-semibold fill-gray-700">
          Bicol Central Station - Terminal Layout
        </text>
        <text x="80" y="80" className="text-xs fill-gray-600">Food Court</text>
        <text x="80" y="180" className="text-xs fill-gray-600">Retail Area</text>
        <text x="80" y="280" className="text-xs fill-gray-600">Services (2nd Floor)</text>
        
        {/* Stalls */}
        {stallsData.map((stall) => {
          const size = getStallSize(stall);
          const color = getStallColor(stall);
          
          return (
            <g key={stall.id}>
              <rect
                x={stall.x}
                y={stall.y}
                width={size.width}
                height={size.height}
                fill={color}
                stroke={selectedStall?.id === stall.id ? '#1e40af' : '#374151'}
                strokeWidth={selectedStall?.id === stall.id ? 3 : 1}
                rx="2"
                className="cursor-pointer transition-all duration-200"
                onClick={() => onStallSelect(stall)}
                onMouseEnter={() => onStallHover(stall)}
                onMouseLeave={() => onStallHover(null)}
              />
              <text
                x={stall.x + size.width / 2}
                y={stall.y + size.height / 2 + 2}
                textAnchor="middle"
                className="text-xs font-medium fill-white pointer-events-none"
              >
                {stall.number}
              </text>
            </g>
          );
        })}
        
        {/* Facilities */}
        <circle cx="320" cy="380" r="8" fill="#8b5cf6" />
        <text x="335" y="385" className="text-xs fill-gray-600">Restroom</text>
        
        <circle cx="250" cy="380" r="8" fill="#06b6d4" />
        <text x="265" y="385" className="text-xs fill-gray-600">Water Station</text>
        
        <rect x="70" y="370" width="15" height="15" fill="#f97316" rx="2" />
        <text x="90" y="380" className="text-xs fill-gray-600">Fire Exit</text>
        
        {/* Entrance */}
        <rect x="190" y="395" width="20" height="8" fill="none" stroke="#374151" strokeWidth="2" />
        <text x="200" y="425" textAnchor="middle" className="text-xs fill-gray-600">Main Entrance</text>
      </svg>
      
      {/* Hover Tooltip */}
      {hoveredStall && (
        <div className="absolute bg-black/80 text-white p-2 rounded text-xs pointer-events-none z-10"
             style={{
               left: hoveredStall.x + 60,
               top: hoveredStall.y - 10,
               transform: 'translateY(-100%)'
             }}>
          <div className="font-semibold">{hoveredStall.number}</div>
          <div>{hoveredStall.size} • ₱{hoveredStall.monthlyRent.toLocaleString()}/month</div>
          <div className="text-xs opacity-75">{hoveredStall.status}</div>
        </div>
      )}
    </div>
  );
};

export default TerminalMap;
