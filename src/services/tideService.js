const NOAA_BASE_URL = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';

export const getTideData = async (stationId) => {
  try {
    const date = new Date();
    const beginDate = date.toISOString().split('T')[0];
    date.setDate(date.getDate() + 1);
    const endDate = date.toISOString().split('T')[0];

    const response = await fetch(
      `${NOAA_BASE_URL}?begin_date=${beginDate}&end_date=${endDate}&station=${stationId}&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&format=json`
    );

    if (!response.ok) {
      throw new Error('Tide data fetch failed');
    }

    const data = await response.json();
    return data.predictions || [];
  } catch (error) {
    console.error('Error fetching tide data:', error);
    throw error;
  }
};

export const getWaveData = async (stationId) => {
  try {
    const date = new Date();
    const beginDate = date.toISOString().split('T')[0];
    date.setDate(date.getDate() + 1);
    const endDate = date.toISOString().split('T')[0];

    const response = await fetch(
      `${NOAA_BASE_URL}?begin_date=${beginDate}&end_date=${endDate}&station=${stationId}&product=wave_height&datum=MLLW&time_zone=lst_ldt&units=english&format=json`
    );

    if (!response.ok) {
      throw new Error('Wave data fetch failed');
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching wave data:', error);
    throw error;
  }
}; 