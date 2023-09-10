import { useEffect, useState } from 'react';

const useIP = () => {
  const [ip, setIp] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then((data) => {
        const i = Number(data.ip.replaceAll('.', ''));
        setIp(i);
        setLoading(false);
      })
      .catch((e) => {
        console.log('error while retrieving ip: ', e);
        setError('Error fetching IP');
        setLoading(false);
      });
  }, []);

  return { ip, loading, error };
};

export default useIP;
