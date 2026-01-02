/**
 * Aggregates DynamoDB format bird sightings into summary statistics
 * @param {Array} dynamoDbData - Array of sighting objects in DynamoDB format
 * @returns {Array} Aggregated activity data with species, sightings count, and unique days
 */
export function aggregateBirdActivity(data) {
  // Create a map to track species data
  const speciesMap = new Map();
  try {
    data.forEach(sighting => {
      // Extract values from DynamoDB format (removes the {S: "value"} wrapper)
      const species = sighting.bird_species_common_name;
      const dateTime = sighting.sighting_date_time;

      // Extract just the date (YYYY-MM-DD) from the datetime
      const date = dateTime ? dateTime.split('T')[0] : null;

      if (!speciesMap.has(species)) {
        // Initialize new species entry
        speciesMap.set(species, {
          species: species,
          sightings: 0,
          dates: new Set() // Use Set to track unique dates
        });
      }


      // Get the species data
      const speciesData = speciesMap.get(species);

      // Increment sighting count
      speciesData.sightings++;

      // Add date to the set (duplicates automatically ignored)
      if (date) {
        speciesData.dates.add(date);
      }
    });
  } catch (error) {
    console.error('Error aggregating bird sightings:', error);
  }

  // Convert map to array and format output
  const activity = Array.from(speciesMap.values()).map(data => ({
    species: data.species,
    sightings: data.sightings,
    days: data.dates.size
  }));

  // Sort by number of sightings (descending)
  activity.sort((a, b) => b.sightings - a.sightings);

  return activity;
}





export function aggregateRareBirdActivity(data) {
  // Create a map to track species data
  const speciesMap = new Map();
  try {
    data.forEach(sighting => {
      // Extract values from DynamoDB format (removes the {S: "value"} wrapper)
      const species = sighting.bird_species_common_name;
      const dateTime = sighting.sighting_date_time;

      // Extract just the date (YYYY-MM-DD) from the datetime
      const date = dateTime ? dateTime.split('T')[0] : null;

      if (!speciesMap.has(species)) {
        // Initialize new species entry
        speciesMap.set(species, {
          species: species,
          sightings: 0,
          dates: new Set() // Use Set to track unique dates
        });
      }


      // Get the species data
      const speciesData = speciesMap.get(species);

      // Increment sighting count
      speciesData.sightings++;

      // Add date to the set (duplicates automatically ignored)
      if (date) {
        speciesData.dates.add(date);
      }
    });
  } catch (error) {
    console.error('Error aggregating bird sightings:', error);
  }

  // Convert map to array and format output
  const rareActivity = Array.from(speciesMap.values()).map(data => ({
    species: data.species,
    sightings: data.sightings,
    days: data.dates.size
  })).filter(item => item.sightings <= 5);

  // Sort by number of sightings (descending)
  rareActivity.sort((a, b) => b.sightings - a.sightings);

  return rareActivity;
}


export function birdVisitsOverTime(data) {
  if (!Array.isArray(data)) {
    console.error('[buildVisitsOverTime] Expected array input:', data);
    return { labels: [], visits: [], species: [] };
  }

  const dateMap = new Map();

  data.forEach(sighting => {
    const dateTime = sighting.sighting_date_time;
    const speciesName = sighting.bird_species_common_name;

    if (!dateTime || !speciesName) return;

    const date = dateTime.split('T')[0];

    if (!dateMap.has(date)) {
      dateMap.set(date, {
        visits: 0,
        speciesSet: new Set()
      });
    }

    const entry = dateMap.get(date);
    entry.visits++;
    entry.speciesSet.add(speciesName);
  });

  // Sort dates ascending
  const sortedDates = Array.from(dateMap.keys()).sort();

  return {
    labels: sortedDates,
    visits: sortedDates.map(date => dateMap.get(date).visits),
    species: sortedDates.map(date => dateMap.get(date).speciesSet.size)
  };
}

/**
 * Convert sightings into hourly buckets for a full 24-hour day.
 * @param {Array} data - Array of sighting objects
 * @param {string} inputTZ - "UTC", "EST", or "CST"
 * @param {string} outputTZ - "UTC", "EST", or "CST"
 * @returns {Object} { labels: [...], visits: [...], species: [...] }
 */
export function BirdVisitsOverHourlyTimeOfDay(data, inputTZ = "UTC", outputTZ = "EST") {
  if (!Array.isArray(data)) return { labels: [], visits: [], species: [] };

  // 24 hourly buckets
  const buckets = Array.from({ length: 24 }, (_, i) => ({
    label: `${i}:00`,
    hour: i
  }));

  // Initialize bucket data
  const bucketData = buckets.map(() => ({ visits: 0, speciesSet: new Set() }));

  const tzOffsets = { UTC: 0, EST: -5, CST: -6 };

  const inputOffset = tzOffsets[inputTZ];
  const outputOffset = tzOffsets[outputTZ];

  if (inputOffset === undefined || outputOffset === undefined) {
    console.error('[buildHourlyTimeOfDay] Unsupported timezone');
    return {
      labels: buckets.map(b => b.label),
      visits: [],
      species: []
    };
  }

  data.forEach(sighting => {
    const dtStr = sighting.sighting_date_time;
    const species = sighting.bird_species_common_name;
    if (!dtStr || !species) return;

    const date = new Date(dtStr + "Z"); // Treat as UTC
    let hourUTC = date.getUTCHours();

    // Convert input timezone to UTC, then to output timezone
    hourUTC -= inputOffset;
    let hourOut = (hourUTC + outputOffset + 24) % 24; // normalize 0-23

    const bucketIndex = Math.floor(hourOut); // 0–23
    bucketData[bucketIndex].visits++;
    bucketData[bucketIndex].speciesSet.add(species);
  });

  return {
    labels: buckets.map(b => b.label),
    visits: bucketData.map(b => b.visits),
    species: bucketData.map(b => b.speciesSet.size)
  };
}

// Example usage:
const sampleData = [
  {
    "bird_species_id": "31534",
    "bird_species_taxonomical_name": "Passer domesticus",
    "sighting_date_time": "2025-11-25T15:08:34.354",
    "bird_species_common_name": "House Sparrow",
    "sighting_location_id": "2",
    "sighting_id": "15",
    "sighting_location_name": "Bob's Feeder"
  },
  {
    "bird_species_id": "33779",
    "bird_species_taxonomical_name": "Agelaius phoeniceus",
    "sighting_date_time": "2025-11-23T20:25:34.354",
    "bird_species_common_name": "Red-winged Blackbird",
    "sighting_location_id": "2",
    "sighting_id": "14",
    "sighting_location_name": "Bob's Feeder"
  }
];