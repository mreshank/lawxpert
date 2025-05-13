const fs = require('fs');
const path = require('path');

// Path to the scraped data
const dataPath = path.join(__dirname, 'lawyers_data.json');

// Function to analyze the scraped data
function analyzeData() {
  // Check if the data file exists
  if (!fs.existsSync(dataPath)) {
    console.error('Data file not found! Run the scraper first.');
    process.exit(1);
  }
  
  // Read the data
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  console.log(`\n=== LAWYER DATA ANALYSIS ===`);
  console.log(`Total lawyers scraped: ${data.length}`);
  
  // Count success vs failures
  const successful = data.filter(lawyer => !lawyer.error);
  const failed = data.filter(lawyer => lawyer.error);
  
  console.log(`Successfully scraped: ${successful.length} (${Math.round(successful.length / data.length * 100)}%)`);
  console.log(`Failed to scrape: ${failed.length} (${Math.round(failed.length / data.length * 100)}%)`);
  
  if (failed.length > 0) {
    console.log(`\nCommon error reasons:`);
    const errorReasons = {};
    failed.forEach(lawyer => {
      const reason = lawyer.error;
      errorReasons[reason] = (errorReasons[reason] || 0) + 1;
    });
    
    Object.entries(errorReasons)
      .sort((a, b) => b[1] - a[1])
      .forEach(([reason, count]) => {
        console.log(`- ${reason}: ${count} occurrences`);
      });
      
    // Save failed data to a separate file
    fs.writeFileSync(
      path.join(__dirname, 'lawyers_data_failed.json'),
      JSON.stringify(failed, null, 2)
    );
    console.log(`Failed entries saved to: lawyers_data_failed.json`);
  }
  
  // Only analyze successful entries
  if (successful.length === 0) {
    console.log('No successful data to analyze!');
    return;
  }
  
  // Analyze data completeness
  console.log(`\nData Completeness Analysis:`);
  const fields = [
    'name', 'location', 'experience', 'specialization', 
    'contact_number', 
    'languages', 'practice_areas',
    'about', 'courts', 'popular_reviews', 'questions_answered', 'faq'
  ];
  
  fields.forEach(field => {
    const parts = field.split('.');
    let count = 0;
    
    successful.forEach(lawyer => {
      let value = lawyer;
      for (const part of parts) {
        value = value?.[part];
      }
      
      if (value && typeof value === 'string' && value.trim() !== '') {
        count++;
      } else if (Array.isArray(value) && value.length > 0) {
        count++;
      }
    });
    
    const percentage = Math.round(count / successful.length * 100);
    console.log(`- ${field}: ${count}/${successful.length} (${percentage}%)`);
  });
  
  // Analyze specializations
  console.log(`\nTop Specializations:`);
  const specializations = {};
  successful.forEach(lawyer => {
    if (lawyer.specialization) {
      const specs = lawyer.specialization.split(',').map(s => s.trim());
      specs.forEach(spec => {
        if (spec) {
          specializations[spec] = (specializations[spec] || 0) + 1;
        }
      });
    }
  });
  
  Object.entries(specializations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([spec, count]) => {
      console.log(`- ${spec}: ${count} lawyers`);
    });
  
  // Analyze locations
  console.log(`\nTop Locations:`);
  const locations = {};
  successful.forEach(lawyer => {
    if (lawyer.location) {
      // Extract city from location
      const location = lawyer.location.split(',')[0].trim();
      locations[location] = (locations[location] || 0) + 1;
    }
  });
  
  Object.entries(locations)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([location, count]) => {
      console.log(`- ${location}: ${count} lawyers`);
    });
  
  // Export clean data (only successful entries) to a separate file
  const cleanData = successful.map(lawyer => {
    // Remove empty fields
    Object.keys(lawyer).forEach(key => {
      if (lawyer[key] === null || lawyer[key] === undefined || 
          (typeof lawyer[key] === 'string' && lawyer[key].trim() === '') ||
          (Array.isArray(lawyer[key]) && lawyer[key].length === 0)) {
        delete lawyer[key];
      }
    });
    return lawyer;
  });
  
  fs.writeFileSync(
    path.join(__dirname, 'lawyers_clean_data.json'),
    JSON.stringify(cleanData, null, 2)
  );
  
  console.log(`\nClean data exported to: lawyers_clean_data.json`);
}

// Run the analysis
analyzeData(); 