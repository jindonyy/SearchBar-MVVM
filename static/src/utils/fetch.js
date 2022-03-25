export const fetchData = async path => {
  const FULL_URL = 'http://localhost:3000/' + path;
  const response = await fetch(FULL_URL);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};
