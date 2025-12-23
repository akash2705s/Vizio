// Get IP
const getIp = async () => {
  const url = `${process.env.REACT_APP_GET_IP_URL}/?format=json`;
  const jsonCall = await fetch(url);
  const response = await jsonCall.json();
  return response.ip || '';
};

export default getIp;
