-- Create bus inventory table to track available buses
CREATE TABLE public.bus_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bus_number TEXT NOT NULL UNIQUE,
    body_number TEXT NOT NULL,
    operator_name TEXT NOT NULL,
    plate_number TEXT,
    route TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
    capacity INTEGER DEFAULT 50,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create fare matrix table
CREATE TABLE public.fare_matrix (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route TEXT NOT NULL,
    destination TEXT NOT NULL,
    fare_amount DECIMAL(10,2) NOT NULL,
    distance_km DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route, destination)
);

-- Create routes table for available routes
CREATE TABLE public.routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_name TEXT NOT NULL UNIQUE,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    distance_km DECIMAL(10,2),
    estimated_duration INTEGER, -- in minutes
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lanes table for terminal lanes
CREATE TABLE public.terminal_lanes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lane_number TEXT NOT NULL UNIQUE,
    assigned_route TEXT,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample bus inventory data
INSERT INTO public.bus_inventory (bus_number, body_number, operator_name, route, status) VALUES
('001', 'BD001', 'Juan Dela Cruz', 'LEGAZPI', 'active'),
('002', 'BD002', 'Maria Santos', 'RAGAY', 'active'),
('003', 'BD003', 'Pedro Rodriguez', 'DAET', 'active'),
('004', 'BD004', 'Ana Garcia', 'PILI', 'active'),
('005', 'BD005', 'Jose Martinez', 'GOA', 'active'),
('006', 'BD006', 'Rosa Lopez', 'LEGAZPI', 'active'),
('007', 'BD007', 'Carlos Hernandez', 'RAGAY', 'maintenance'),
('008', 'BD008', 'Elena Flores', 'DAET', 'active');

-- Insert sample routes data
INSERT INTO public.routes (route_name, origin, destination, distance_km, estimated_duration) VALUES
('LEGAZPI', 'Naga Terminal', 'Legazpi City', 85.5, 120),
('RAGAY', 'Naga Terminal', 'Ragay', 45.2, 60),
('DAET', 'Naga Terminal', 'Daet', 78.3, 90),
('PILI', 'Naga Terminal', 'Pili', 15.8, 25),
('GOA', 'Naga Terminal', 'Goa', 35.7, 45);

-- Insert sample fare matrix data
INSERT INTO public.fare_matrix (route, destination, fare_amount, distance_km) VALUES
('LEGAZPI', 'Legazpi City', 150.00, 85.5),
('RAGAY', 'Ragay', 80.00, 45.2),
('DAET', 'Daet', 120.00, 78.3),
('PILI', 'Pili', 35.00, 15.8),
('GOA', 'Goa', 60.00, 35.7);

-- Insert sample terminal lanes
INSERT INTO public.terminal_lanes (lane_number, assigned_route, status) VALUES
('Lane 1', 'LEGAZPI', 'available'),
('Lane 2', 'RAGAY', 'available'),
('Lane 3', 'DAET', 'available'),
('Lane 4', 'PILI', 'available'),
('Lane 5', 'GOA', 'available'),
('Lane 6', 'LEGAZPI', 'available'),
('Lane 7', 'RAGAY', 'maintenance');

-- Add updated_at trigger for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bus_inventory_updated_at BEFORE UPDATE ON public.bus_inventory FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fare_matrix_updated_at BEFORE UPDATE ON public.fare_matrix FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_routes_updated_at BEFORE UPDATE ON public.routes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_terminal_lanes_updated_at BEFORE UPDATE ON public.terminal_lanes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_bus_inventory_route ON public.bus_inventory(route);
CREATE INDEX idx_bus_inventory_status ON public.bus_inventory(status);
CREATE INDEX idx_fare_matrix_route ON public.fare_matrix(route);
CREATE INDEX idx_routes_status ON public.routes(status);
CREATE INDEX idx_terminal_lanes_status ON public.terminal_lanes(status);