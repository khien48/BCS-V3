
-- Insert sample data into bus_schedules table
INSERT INTO public.bus_schedules (bus_no, body_no, operator, bound, lane, time, time_type, date) VALUES
('BUS-001', 'BD-101', 'Juan Dela Cruz', 'LEGAZPI', 'Lane 1', '06:00', 'AM', CURRENT_DATE),
('BUS-002', 'BD-102', 'Maria Santos', 'RAGAY', 'Lane 2', '06:30', 'AM', CURRENT_DATE),
('BUS-003', 'BD-103', 'Pedro Garcia', 'DAET', 'Lane 3', '07:00', 'AM', CURRENT_DATE),
('BUS-004', 'BD-104', 'Ana Reyes', 'PILI', 'Lane 1', '07:30', 'AM', CURRENT_DATE),
('BUS-005', 'BD-105', 'Carlos Lopez', 'GOA', 'Lane 2', '08:00', 'AM', CURRENT_DATE),
('BUS-006', 'BD-106', 'Rosa Martinez', 'LEGAZPI', 'Lane 3', '02:00', 'PM', CURRENT_DATE),
('BUS-007', 'BD-107', 'Miguel Torres', 'RAGAY', 'Lane 1', '02:30', 'PM', CURRENT_DATE),
('BUS-008', 'BD-108', 'Linda Cruz', 'DAET', 'Lane 2', '03:00', 'PM', CURRENT_DATE),
('BUS-009', 'BD-109', 'Roberto Silva', 'PILI', 'Lane 3', '03:30', 'PM', CURRENT_DATE),
('BUS-010', 'BD-110', 'Carmen Flores', 'GOA', 'Lane 1', '04:00', 'PM', CURRENT_DATE);
