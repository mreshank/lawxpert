const fs = require('fs');
const path = require('path');

// Load the scraped data
const dataPath = path.join(__dirname, 'lawyers_data.json');
const lawyersData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Stats collection
const stats = {
  total: lawyersData.length,
  successful: 0,
  failed: 0,
  fields: {
    is_verified: 0,
    name: 0,
    img_url: 0,
    rating: 0,
    rating_count: 0,
    contact_number: 0,
    page_url: 0,
    location: 0,
    experience: 0,
    languages: 0,
    practice_areas: 0,
    about: 0,
    specialization: 0,
    courts: 0,
    popular_reviews: 0,
    questions_answered: 0,
    faq: 0
  },
  locations: {},
  image_domains: {},
  specializations: {},
  avgRating: 0,
  totalRatings: 0
};

// Find and filter any failed scrapes
const failedScrapes = lawyersData.filter(lawyer => lawyer.error);
stats.failed = failedScrapes.length;
stats.successful = stats.total - stats.failed;

console.log(`\nAnalyzing ${stats.total} lawyer profiles...`);
console.log(`Successfully scraped: ${stats.successful}`);
console.log(`Failed: ${stats.failed}\n`);

// Check each lawyer for data completeness
const cleanData = [];
let totalRatingSum = 0;
let validRatings = 0;

lawyersData.forEach(lawyer => {
  // Skip failed scrapes
  if (lawyer.error) return;
  
  // Clean up the data
  const cleanLawyer = { ...lawyer };
  delete cleanLawyer.error;
  
  // Count filled fields
  for (const field in stats.fields) {
    let hasValue = false;
    
    if (field === 'img_url') {
      // Check if img_url exists and is a valid URL
      hasValue = lawyer.img_url && lawyer.img_url.startsWith('http');
      
      // Track image domains for analysis
      if (hasValue) {
        try {
          const domain = new URL(lawyer.img_url).hostname;
          stats.image_domains[domain] = (stats.image_domains[domain] || 0) + 1;
        } catch (e) {
          // Invalid URL
        }
      }
    } else if (field === 'page_url') {
      // Check if page_url exists and is a valid URL
      hasValue = lawyer.page_url && lawyer.page_url.startsWith('http');
    } else if (field === 'about' || field === 'courts' || field === 'languages' || 
              field === 'practice_areas' || field === 'specialization') {
      // Arrays should have at least one item
      hasValue = Array.isArray(lawyer[field]) && lawyer[field].length > 0;
    } else if (field === 'popular_reviews' || field === 'questions_answered' || field === 'faq') {
      // Arrays of objects should have at least one item
      hasValue = Array.isArray(lawyer[field]) && lawyer[field].length > 0;
      
      // Validate that the array items are objects with the required keys
      if (hasValue) {
        const firstItem = lawyer[field][0];
        if (field === 'popular_reviews') {
          hasValue = firstItem && typeof firstItem === 'object' && 
                    ('name' in firstItem || 'review' in firstItem);
        } else if (field === 'questions_answered') {
          hasValue = firstItem && typeof firstItem === 'object' && 
                    ('question' in firstItem || 'answer' in firstItem);
        } else if (field === 'faq') {
          hasValue = firstItem && typeof firstItem === 'object' && 
                    ('question' in firstItem || 'answer' in firstItem);
        }
      }
    } else if (field === 'rating') {
      hasValue = typeof lawyer[field] === 'number' && lawyer[field] > 0;
      
      // Track average rating
      if (hasValue) {
        totalRatingSum += lawyer[field];
        validRatings++;
      }
    } else {
      // All other fields
      hasValue = lawyer[field] !== undefined && lawyer[field] !== null && lawyer[field] !== '';
    }
    
    if (hasValue) {
      stats.fields[field]++;
    }
  }
  
  // Track locations
  if (lawyer.location) {
    const location = lawyer.location.trim();
    stats.locations[location] = (stats.locations[location] || 0) + 1;
  }
  
  // Track specializations
  if (Array.isArray(lawyer.specialization) && lawyer.specialization.length > 0) {
    lawyer.specialization.forEach(spec => {
      if (spec && typeof spec === 'string') {
        stats.specializations[spec] = (stats.specializations[spec] || 0) + 1;
      }
    });
  }
  
  // Add to clean data
  cleanData.push(cleanLawyer);
});

// Calculate average rating
stats.avgRating = validRatings > 0 ? (totalRatingSum / validRatings).toFixed(2) : 0;
stats.totalRatings = validRatings;

// Calculate field completion percentages
const fieldStats = [];
for (const field in stats.fields) {
  const count = stats.fields[field];
  const percentage = ((count / stats.successful) * 100).toFixed(2);
  fieldStats.push({ field, count, percentage });
}

// Sort by percentage
fieldStats.sort((a, b) => b.percentage - a.percentage);

// Get top locations
const sortedLocations = Object.entries(stats.locations)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([location, count]) => ({ location, count }));

// Get top image domains
const sortedImageDomains = Object.entries(stats.image_domains)
  .sort((a, b) => b[1] - a[1])
  .map(([domain, count]) => ({ domain, count, percentage: ((count / stats.fields.img_url) * 100).toFixed(2) }));

// Get top specializations
const sortedSpecializations = Object.entries(stats.specializations)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15)
  .map(([specialization, count]) => ({ specialization, count }));

// Print analysis
console.log("\nField Completion:");
console.log("----------------");
fieldStats.forEach(({ field, count, percentage }) => {
  console.log(`${field.padEnd(20)} ${count.toString().padStart(5)} / ${stats.successful} (${percentage}%)`);
});

console.log("\nProfile Images:");
console.log("----------------");
console.log(`Total profiles with valid image URLs: ${stats.fields.img_url} / ${stats.successful} (${((stats.fields.img_url / stats.successful) * 100).toFixed(2)}%)`);
console.log("\nImage Domains:");
sortedImageDomains.forEach(({ domain, count, percentage }) => {
  console.log(`${domain.padEnd(30)} ${count.toString().padStart(5)} (${percentage}%)`);
});

console.log("\nTop 10 Locations:");
console.log("----------------");
sortedLocations.forEach(({ location, count }) => {
  console.log(`${location.padEnd(30)} ${count.toString().padStart(5)}`);
});

console.log("\nAverage Rating:");
console.log("----------------");
console.log(`Average rating: ${stats.avgRating} (from ${stats.totalRatings} profiles with ratings)`);

console.log("\nFailed URLs:");
console.log("----------------");
if (failedScrapes.length > 0) {
  console.log(`${failedScrapes.length} URLs failed to scrape. First 5 errors:`);
  failedScrapes.slice(0, 5).forEach(fail => {
    console.log(`- ${fail.url || 'Unknown URL'}: ${fail.error}`);
  });
  
  // Save failed URLs to a file
  fs.writeFileSync(
    path.join(__dirname, 'lawyers_data_failed.json'),
    JSON.stringify(failedScrapes, null, 2)
  );
  console.log(`\nAll failed URLs saved to lawyers_data_failed.json`);
} else {
  console.log("No URLs failed to scrape.");
}

// Save clean data to a file
fs.writeFileSync(
  path.join(__dirname, 'lawyers_clean_data.json'),
  JSON.stringify(cleanData, null, 2)
);

console.log(`\nClean data saved to lawyers_clean_data.json (${cleanData.length} profiles)`);
console.log(`\nAnalysis complete.`); 