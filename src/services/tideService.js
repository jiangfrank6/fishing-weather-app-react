// You'll need to replace this with your WorldTides API key
const WORLDTIDES_API_KEY = 'a0ffb31a-7bd9-4bcc-a1a4-e5b70e347bcb';
const BASE_URL = 'https://www.worldtides.info/api/v3';

export const getTideData = async (lat, lon) => {
  try {
    // Get both heights and extremes for the next 24 hours
    const response = await fetch(
      `${BASE_URL}?heights&extremes&date=today&lat=${lat}&lon=${lon}&days=1&key=${WORLDTIDES_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch tide data');
    }

    const data = await response.json();

    if (data.status !== 200) {
      throw new Error(data.error || 'Failed to fetch tide data');
    }

    // Process the tide data
    const currentTime = new Date();
    const nextExtreme = data.extremes?.find(extreme => new Date(extreme.date) > currentTime);
    const prevExtreme = data.extremes?.findLast(extreme => new Date(extreme.date) <= currentTime);

    // Determine if tide is rising or falling
    const tideStatus = prevExtreme && nextExtreme
      ? (nextExtreme.height > prevExtreme.height ? 'Rising' : 'Falling')
      : 'Unknown';

    // Format the next tide time
    const nextTideTime = nextExtreme
      ? new Date(nextExtreme.date).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: 'numeric'
        })
      : 'Unknown';

    // Get current tide height by finding the closest height data point
    const currentHeight = data.heights?.reduce((closest, point) => {
      const pointTime = new Date(point.date);
      const closestTime = new Date(closest.date);
      return Math.abs(pointTime - currentTime) < Math.abs(closestTime - currentTime)
        ? point
        : closest;
    }, data.heights[0]);

    return {
      currentHeight: currentHeight?.height.toFixed(1) || 'Unknown',
      tideStatus,
      nextTide: `${nextExtreme?.type || 'Unknown'} at ${nextTideTime}`,
      copyright: data.copyright, // Required by WorldTides terms of service
      heights: data.heights?.map(height => {
        const date = new Date(height.date);
        return {
          time: date.toLocaleTimeString('en-US', { 
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          height: parseFloat(height.height.toFixed(1))
        };
      }) || []
    };
  } catch (error) {
    console.error('Error fetching tide data:', error);
    return {
      currentHeight: 'Unknown',
      tideStatus: 'Unknown',
      nextTide: 'Unknown',
      copyright: '© WorldTides',
      heights: []
    };
  }
}; 