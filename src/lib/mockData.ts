export interface MockFarmer {
  id: number;
  name: string;
  phone: string;
  village: string;
  farm_size_acres: number;
  primary_crop: string;
  status: 'green' | 'yellow' | 'red';
  last_soil_test_date: string;
  notes: string;
}

export interface MockSoilTest {
  id: number;
  farmer_id: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  test_date: string;
}

export interface MockRecommendation {
  id: number;
  farmer_id: number;
  crop: string;
  total_cost: number;
  cost_saving: number;
  whatsapp_sent: boolean;
  farmer_confirmed: boolean;
  expected_yield_min: number;
  expected_yield_max: number;
  fertilizer_mix: string;
  created_at: string;
}

const baseDate = new Date('2026-03-30T08:00:00Z');

function dayOffset(days: number) {
  return new Date(baseDate.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

export const mockFarmers: MockFarmer[] = [
  { id: 1, name: 'Ravi Kumar', phone: '9000000001', village: 'Palacode', farm_size_acres: 2.0, primary_crop: 'maize', status: 'red', last_soil_test_date: dayOffset(0), notes: 'Critical nitrogen and delayed irrigation at vegetative stage.' },
  { id: 2, name: 'Meena Lakshmi', phone: '9000000002', village: 'Pennagaram', farm_size_acres: 1.5, primary_crop: 'groundnut', status: 'yellow', last_soil_test_date: dayOffset(12), notes: 'Soil card aging, moderate phosphorus stress.' },
  { id: 3, name: 'Arul Selvan', phone: '9000000003', village: 'Harur', farm_size_acres: 3.0, primary_crop: 'maize', status: 'green', last_soil_test_date: dayOffset(24), notes: 'On track, advised split urea application.' },
  { id: 4, name: 'Karthik Raj', phone: '9000000004', village: 'Morappur', farm_size_acres: 2.3, primary_crop: 'millet', status: 'yellow', last_soil_test_date: dayOffset(36), notes: 'Rainfall uncertainty in flowering window.' },
  { id: 5, name: 'Priya Devi', phone: '9000000005', village: 'Papireddipatti', farm_size_acres: 1.2, primary_crop: 'maize', status: 'red', last_soil_test_date: dayOffset(48), notes: 'Urgent, potassium shortfall and dry spell risk.' },
  { id: 6, name: 'Murugan', phone: '9000000006', village: 'Nallampalli', farm_size_acres: 2.8, primary_crop: 'groundnut', status: 'green', last_soil_test_date: dayOffset(60), notes: 'Good moisture retention profile.' },
  { id: 7, name: 'Selvi', phone: '9000000007', village: 'Pappireddipatti', farm_size_acres: 1.7, primary_crop: 'cotton', status: 'yellow', last_soil_test_date: dayOffset(72), notes: 'Needs follow-up for dealer availability-constrained mix.' },
  { id: 8, name: 'Gopal', phone: '9000000008', village: 'Karimangalam', farm_size_acres: 2.1, primary_crop: 'maize', status: 'green', last_soil_test_date: dayOffset(84), notes: 'Expected high compliance.' },
  { id: 9, name: 'Saranya', phone: '9000000009', village: 'Palacode', farm_size_acres: 1.9, primary_crop: 'groundnut', status: 'yellow', last_soil_test_date: dayOffset(96), notes: 'Soil report older than 2 seasons.' },
  { id: 10, name: 'Manikandan', phone: '9000000010', village: 'Pennagaram', farm_size_acres: 2.6, primary_crop: 'maize', status: 'red', last_soil_test_date: dayOffset(108), notes: 'High urgency cluster alert.' },
  { id: 11, name: 'Dhanush', phone: '9000000011', village: 'Harur', farm_size_acres: 1.3, primary_crop: 'millet', status: 'green', last_soil_test_date: dayOffset(9), notes: 'Newly onboarded and responsive.' },
  { id: 12, name: 'Kaviya', phone: '9000000012', village: 'Morappur', farm_size_acres: 2.4, primary_crop: 'cotton', status: 'yellow', last_soil_test_date: dayOffset(15), notes: 'Inconsistent input usage history.' },
];

export const mockSoilTests: MockSoilTest[] = mockFarmers.map((farmer, index) => ({
  id: index + 1,
  farmer_id: farmer.id,
  nitrogen: Math.max(62 - index * 2, 32),
  phosphorus: Math.max(36 - index, 18),
  potassium: Math.max(146 - index * 3, 88),
  ph: Number((6.5 + (index % 4) * 0.4).toFixed(1)),
  test_date: dayOffset(index * 7),
}));

export const mockRecommendations: MockRecommendation[] = mockFarmers.slice(0, 10).map((farmer, index) => ({
  id: 100 + index,
  farmer_id: farmer.id,
  crop: farmer.primary_crop,
  total_cost: 6200 + index * 90,
  cost_saving: 1600 - index * 40,
  whatsapp_sent: index % 2 === 0,
  farmer_confirmed: index % 3 === 0,
  expected_yield_min: 10,
  expected_yield_max: 18,
  fertilizer_mix: JSON.stringify([
    { name: 'Urea', quantity_kg: 45 - index % 3, price_per_kg: 6.5, total_cost: 292.5 },
    { name: 'DAP', quantity_kg: 25 + (index % 2), price_per_kg: 28, total_cost: 700 },
  ]),
  created_at: dayOffset(index * 4),
}));

export function getMockFarmerById(id: number) {
  return mockFarmers.find((farmer) => farmer.id === id) || null;
}

export function getMockSoilHistoryByFarmerId(farmerId: number) {
  return mockSoilTests.filter((test) => test.farmer_id === farmerId);
}

export function getMockRecommendationsByFarmerId(farmerId: number) {
  return mockRecommendations.filter((rec) => rec.farmer_id === farmerId);
}
