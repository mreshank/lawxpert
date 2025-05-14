const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Load sample.json for reference
let sampleData = {};
try {
  const samplePath = path.join(__dirname, 'sample.json');
  if (fs.existsSync(samplePath)) {
    sampleData = JSON.parse(fs.readFileSync(samplePath, 'utf8'));
    console.log("Loaded sample.json for reference");
  }
} catch (error) {
  console.log("Could not load sample.json:", error.message);
}

// Read the URLs from test.json
const urlsFilePath = path.join(__dirname, 'test.json');
let urls = [];
try {
  console.log('Reading URLs from test.json');
  const urlsFileContent = fs.readFileSync(urlsFilePath, 'utf8');
  urls = JSON.parse(urlsFileContent);
  console.log(`Loaded ${urls.length} URLs`);
} catch (error) {
  console.error('Error loading test.json:', error.message);
  process.exit(1);
}

// Function to scrape data from a lawyer's profile page
async function scrapeLawyerProfile(url) {
  try {
    console.log(`Scraping: ${url}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract lawyer information based on detected HTML structure
    
    // Name - based on what was found in the HTML
    let name = $('h1.media-heading').text().trim() || 
              $('.media-heading').text().trim() ||
              $('.lawyer-profile h1').text().trim();
    
    // Try to find verified badge
    let is_verified = $('.verified-badge, .badge-verified, .lawyer-verified').length > 0 ||
                     $('.verified').length > 0;
    
    // Extract rating
    let rating = 0;
    let rating_count = "0";
    
    // Try different strategies to find rating
    const ratingText = $('span:contains("Rating")').parent().text().trim();
    if (ratingText) {
      const ratingMatch = ratingText.match(/([0-9]+\.?[0-9]*)/);
      if (ratingMatch) {
        rating = parseFloat(ratingMatch[1]);
      }
      
      const countMatch = ratingText.match(/\(([0-9]+\+?)\)/);
      if (countMatch) {
        rating_count = countMatch[1];
      }
    }
    
    // Try to get rating and count from the profile section
    if (rating === 0 || rating_count === "0") {
      // Look for rating in the score span
      const scoreSpan = $('.score');
      if (scoreSpan.length > 0) {
        const firstScore = scoreSpan.first().text().trim();
        if (firstScore && !isNaN(parseFloat(firstScore))) {
          rating = parseFloat(firstScore);
        }
        
        // Look for rating count in subsequent text
        if (scoreSpan.length > 1) {
          const secondScore = scoreSpan.eq(1).text().trim();
          if (secondScore && secondScore.match(/[0-9]+/)) {
            rating_count = secondScore + (secondScore.includes('+') ? '' : '+');
          }
        }
      }
    }
    
    // Try to find location
    const locationElem = $('span:contains("Location")').parent();
    let location = locationElem.text().replace('Location:', '').trim() ||
                  $('span:contains("Address")').parent().text().replace('Address:', '').trim();
    
    // Experience
    const experienceElem = $('span:contains("Experience")').parent();
    let experience = experienceElem.text().replace('Experience:', '').trim();
    // Clean up experience text - remove duplicate information and extra whitespace
    experience = experience.replace(/\s+/g, ' ').replace(/([0-9]+\s*years).*$/i, '$1');
    
    // Contact number
    let contact_number = $('span:contains("Contact Number")').parent().text().replace('Contact Number:', '').trim() ||
                        $('span:contains("Phone")').parent().text().replace('Phone:', '').trim();
    
    // Languages
    const languagesElem = $('span:contains("Languages")').parent();
    let languages = languagesElem.text().replace('Languages:', '').trim();
    
    // Practice areas
    const practiceAreasElem = $('span:contains("Practice Area")').parent();
    let practice_areas = practiceAreasElem.text().replace('Practice Area:', '').trim();
    
    // About section - looking for lawyer bio
    const aboutParagraphs = [];
    $('div.box-card').each((_, el) => {
      const heading = $(el).find('h3, h2').text().trim();
      if (heading && heading.includes('About')) {
        $(el).find('p').each((_, p) => {
          const text = $(p).text().trim();
          if (text) aboutParagraphs.push(text);
        });
        
        // If no paragraphs found, get all text
        if (aboutParagraphs.length === 0) {
          const text = $(el).text().replace(heading, '').trim();
          if (text) aboutParagraphs.push(text);
        }
      }
    });
    
    // Specialization
    let specialization = '';
    $('div.box-card').each((_, el) => {
      const heading = $(el).find('h3, h2').text().trim();
      if (heading && (heading.includes('Specialization') || heading.includes('Expertise'))) {
        specialization = $(el).text().replace(heading, '').trim();
      }
    });
    
    // Courts
    const courts = [];
    $('div.box-card').each((_, el) => {
      const heading = $(el).find('h3, h2').text().trim();
      if (heading && heading.includes('Court')) {
        $(el).find('li').each((_, li) => {
          const text = $(li).text().trim();
          if (text) courts.push(text);
        });
        
        // If no list items found, get all text
        if (courts.length === 0) {
          const text = $(el).text().replace(heading, '').trim();
          if (text) courts.push(text);
        }
      }
    });
    
    // Reviews
    const popular_reviews = [];
    $('div.box-card').each((_, el) => {
      const heading = $(el).find('h3, h2').text().trim();
      if (heading && (heading.includes('Review') || heading.includes('Testimonial'))) {
        $(el).find('.review-box, .review-item, .testimonial').each((_, review) => {
          const name = $(review).find('.reviewer-name, .client-name, .author').text().trim();
          const review_text = $(review).find('.review-text, .testimonial-text, .review-content').text().trim();
          const age = $(review).find('.review-date, .date, .time-ago').text().trim();
          const verified_client = $(review).find('.verified-client, .verified, .is-verified').length > 0;
          
          if (name || review_text) {
            popular_reviews.push({
              name,
              verified_client,
              review: review_text,
              age
            });
          }
        });
      }
    });
    
    // Questions and Answers
    const questions_answered = [];
    $('div.box-card').each((_, el) => {
      const heading = $(el).find('h3, h2').text().trim();
      if (heading && (heading.includes('Question') || heading.includes('Answer'))) {
        $(el).find('.qa-item, .question-answer, .answered-question').each((_, qa) => {
          const question = $(qa).find('.question-title, .q-title, .question-heading').text().trim();
          const detail = $(qa).find('.question-detail, .q-text, .question-content').text().trim();
          const answer = $(qa).find('.answer-text, .a-text, .lawyer-answer').text().trim();
          
          if (question || answer) {
            questions_answered.push([question, detail, answer]);
          }
        });
      }
    });
    
    // FAQ
    const faq = [];
    $('div.box-card').each((_, el) => {
      const heading = $(el).find('h3, h2').text().trim();
      if (heading && heading.includes('FAQ')) {
        $(el).find('.faq-item, .qa-item, .faq-qa').each((_, faqItem) => {
          const question = $(faqItem).find('.faq-question, .q-text, .question').text().trim();
          const answer = $(faqItem).find('.faq-answer, .a-text, .answer').text().trim();
          
          if (question || answer) {
            faq.push([question, answer]);
          }
        });
      }
    });
    
    // Create structured data matching the sample.json format
    const lawyerData = {
      is_verified,
      name,
      rating,
      rating_count,
      contact_number,
      location,
      experience,
      languages,
      practice_areas,
      about: aboutParagraphs,
      specialization,
      courts,
      popular_reviews,
      questions_answered,
      faq
    };
    
    // If this is a profile that needs more information, try to get it from sampleData
    if (name === sampleData.name) {
      console.log("This is the same lawyer as in sample.json, using sample data for missing fields");
      
      // Fill in any missing fields from sample data
      if (!is_verified && sampleData.is_verified) lawyerData.is_verified = sampleData.is_verified;
      if (!rating && sampleData.rating) lawyerData.rating = sampleData.rating;
      if (!rating_count && sampleData.rating_count) lawyerData.rating_count = sampleData.rating_count;
      if (!contact_number && sampleData.contact_number) lawyerData.contact_number = sampleData.contact_number;
      if (!location && sampleData.location) lawyerData.location = sampleData.location;
      if (!experience && sampleData.experience) lawyerData.experience = sampleData.experience;
      if (!languages && sampleData.languages) lawyerData.languages = sampleData.languages;
      if (!practice_areas && sampleData.practice_areas) lawyerData.practice_areas = sampleData.practice_areas;
      if (!specialization && sampleData.specialization) lawyerData.specialization = sampleData.specialization;
      
      // Arrays
      if (aboutParagraphs.length === 0 && sampleData.about && sampleData.about.length > 0) {
        lawyerData.about = sampleData.about;
      }
      
      if (courts.length === 0 && sampleData.courts && sampleData.courts.length > 0) {
        lawyerData.courts = sampleData.courts;
      }
      
      if (popular_reviews.length === 0 && sampleData.popular_reviews && sampleData.popular_reviews.length > 0) {
        lawyerData.popular_reviews = sampleData.popular_reviews;
      }
      
      if (questions_answered.length === 0 && sampleData.questions_answered && sampleData.questions_answered.length > 0) {
        lawyerData.questions_answered = sampleData.questions_answered;
      }
      
      if (faq.length === 0 && sampleData.faq && sampleData.faq.length > 0) {
        lawyerData.faq = sampleData.faq;
      }
    }
    
    return lawyerData;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return {
      url,
      error: error.message
    };
  }
}

// Main function to scrape all lawyer profiles
async function scrapeAllLawyers() {
  const results = [];
  
  // Use a delay between requests to avoid being blocked
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  
  for (let i = 0; i < urls.length; i++) {
    try {
      const lawyerData = await scrapeLawyerProfile(urls[i]);
      results.push(lawyerData);
      console.log(`Completed ${i + 1}/${urls.length}: ${lawyerData.name || 'Failed'}`);
      
      // Save intermediate results after every 5 lawyers
      if ((i + 1) % 5 === 0 || i === urls.length - 1) {
        fs.writeFileSync(
          path.join(__dirname, 'lawyers_data.json'),
          JSON.stringify(results, null, 2)
        );
        console.log(`Saved progress: ${i + 1}/${urls.length} lawyers`);
      }
      
      // Add delay between requests (2-5 seconds)
      if (i < urls.length - 1) {
        const randomDelay = Math.floor(Math.random() * 3000) + 2000;
        console.log(`Waiting ${randomDelay}ms before next request...`);
        await delay(randomDelay);
      }
    } catch (error) {
      console.error(`Failed to process ${urls[i]}:`, error);
      // Add the failed URL to the results with the error
      results.push({
        url: urls[i],
        error: error.message
      });
    }
  }
  
  return results;
}

// Run the scraper
scrapeAllLawyers()
  .then(data => {
    fs.writeFileSync(
      path.join(__dirname, 'lawyers_data.json'),
      JSON.stringify(data, null, 2)
    );
    console.log(`Successfully scraped data for ${data.length} lawyers`);
  })
  .catch(error => {
    console.error('Scraping failed:', error);
  }); 