import { useState } from "react";
import { X, Search, Map, MapPin } from "lucide-react";
import { Input } from "./ui/input";

interface HeroSectionProps {
  onSearch: (searchTerm: string) => void;
  onRouteSelect: (route: string) => void;
}

const HeroSection = ({
  onSearch,
  onRouteSelect
}: HeroSectionProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchIconHover, setSearchIconHover] = useState(false);
  const [locationIconHover, setLocationIconHover] = useState(false);
  
  const routes = ["All Routes", "Legazpi", "Polangui", "Pili", "Goa", "Lagonoy", "Daet", "Sipocot", "Baao", "Iriga"];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const handleRouteSelect = (route: string) => {
    onRouteSelect(route === "All Routes" ? "" : route);
    setDropdownOpen(false);
  };
  
  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };
  
  return (
    <div className="hero-section w-full relative bg-gray-400" style={{
      backgroundImage: "url('/lovable-uploads/38954ef8-b614-49d2-9a10-ef9c9bf6f516.png')",
      height: "300px",
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="container mx-auto px-4 py-16 relative z-10 bg-transparent">
        <div className="bg-transparent p-6 rounded-lg shadow-lg">
          <div className="text-white mb-8">
            <h1 className="text-4xl font-bold drop-shadow-lg">TRIP SCHEDULE</h1>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="relative min-w-[180px] md:w-64">
              <button 
                className="bg-white/90 backdrop-blur-sm w-full text-gray-700 py-3 px-4 rounded-md flex justify-between items-center shadow-md" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setLocationIconHover(true)}
                onMouseLeave={() => setLocationIconHover(false)}
              >
                <span>Select Trip Routes</span>
                <MapPin 
                  className={`text-gray-700 transition-all duration-300 ${
                    locationIconHover ? 'scale-125 text-primary' : ''
                  }`}
                  size={22}
                />
              </button>
              
              {dropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg animate-fade-in">
                  <ul className="py-1">
                    {routes.map(route => (
                      <li 
                        key={route} 
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2" 
                        onClick={() => handleRouteSelect(route)}
                      >
                        <Map size={16} className="text-primary transition-transform duration-300 hover:scale-110" />
                        {route}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSearch} className="flex-1 relative">
              <div className="relative">
                <div 
                  className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10"
                >
                  <Search 
                    className={`text-gray-500 animate-pulse-slow transition-all duration-300 ${
                      searchIconHover ? 'scale-110 text-primary' : ''
                    }`}
                    size={22}
                    onMouseEnter={() => setSearchIconHover(true)}
                    onMouseLeave={() => setSearchIconHover(false)}
                  />
                </div>
                <Input 
                  type="text" 
                  className="block w-full h-[48px] rounded-md py-3 pl-12 pr-10 bg-white/90 backdrop-blur-sm text-gray-900 placeholder-gray-400 shadow-md" 
                  placeholder="Search Route, Trip, Code" 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  onFocus={() => setSearchIconHover(true)}
                  onBlur={() => setSearchIconHover(false)}
                />
                {searchTerm && (
                  <button 
                    type="button" 
                    className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                    onClick={clearSearch}
                  >
                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
