export const fetchData = async url => {
  const FULL_URL = 'http://localhost:3000/' + url;
  const response = await fetch(FULL_URL);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};
