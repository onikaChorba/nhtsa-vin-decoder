const BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';

export const fetchVinData = async (vin: string) => {
  const response = await fetch(`${BASE_URL}/decodevin/${vin}?format=json`);
  const data = await response.json();
  return data;
};

export const fetchVariables = async () => {
  const response = await fetch(`${BASE_URL}/getvehiclevariablelist?format=json`);
  const data = await response.json();
  return data.Results;
};