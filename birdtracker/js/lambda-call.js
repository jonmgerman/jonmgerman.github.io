// ---------------------------
// Fetch data from Lambda API
// ---------------------------

const url = 'https://h5gpxkfp2b.execute-api.us-east-1.amazonaws.com/default/bird-tracker-db-read-write?TableName=bird-species-sightings';

export async function fetchBirdSightings(jwtToken) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    })
    
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = response.json();
      console.log(data);
      return data;
     
  } catch (error) {
      console.error('Error:', error);
      return null;
    }
}

