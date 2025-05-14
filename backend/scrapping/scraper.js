const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Read the URLs from test.js
const urlsFilePath = path.join(__dirname, './test.json');
const urlsFileContent = fs.readFileSync(urlsFilePath, 'utf8');
const urls = JSON.parse(urlsFileContent.replace(/];$/, ']'));

// Function to scrape data from a lawyer's profile page
async function scrapeLawyerProfile(url) {
  try {
    console.log(`Scraping: ${url}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract basic lawyer information
    const name = $('.lawyerinfo h1').text().trim();
    const location = $('.lawyerinfo .location').text().trim();
    const experience = $('.lawyerinfo .experience').text().trim();
    
    // Determine if the lawyer is verified
    const is_verified = $('.verified-badge').length > 0;
    
    // Extract rating information
    let rating = 0;
    let rating_count = "0";
    const ratingText = $('.rating-info').text().trim();
    if (ratingText) {
      const ratingMatch = ratingText.match(/([0-9.]+)/);
      if (ratingMatch) rating = parseFloat(ratingMatch[1]);
      
      const countMatch = ratingText.match(/\(([0-9]+\+?)\)/);
      if (countMatch) rating_count = countMatch[1];
    }
    
    // Extract contact information
    const contact_number = $('.lawyerinfo .phone').text().trim() || 
                          $('.contactinfo .phone').text().trim() || 
                          $('.lawyerProfile__contact span').text().trim();
    
    // Extract languages
    const languages = $('.languages li').map((_, el) => $(el).text().trim()).get().join(', ') || 
                     $('.language').text().trim();
    
    // Extract practice areas
    const practice_areas = $('.practice-areas ul li').map((_, el) => $(el).text().trim()).get().join(', ') ||
                          $('.specialization').text().trim();
    
    // Extract about information
    const aboutParagraphs = $('.about-lawyer p').map((_, el) => $(el).text().trim()).get() || 
                           $('.lawyer-description p').map((_, el) => $(el).text().trim()).get();
    
    // Extract specialization
    const specialization = $('.specializations li').map((_, el) => $(el).text().trim()).get().join(', ') ||
                          $('.expertise li').map((_, el) => $(el).text().trim()).get().join(', ');
    
    // Extract court appearances
    const courts = $('.courts li').map((_, el) => $(el).text().trim()).get() ||
                  $('.court-appearances li').map((_, el) => $(el).text().trim()).get();
    
    // Extract reviews
    const popular_reviews = $('.review-box').map((_, el) => {
      const name = $(el).find('.reviewer-name').text().trim();
      const verified_client = $(el).find('.verified-client').length > 0;
      const review = $(el).find('.review-text').text().trim();
      const age = $(el).find('.review-date').text().trim();
      
      return {
        name,
        verified_client,
        review,
        age
      };
    }).get();
    
    // Extract answered questions
    const questions_answered = [];
    $('.answered-question').each((_, el) => {
      const question = $(el).find('.question-title').text().trim();
      const question_detail = $(el).find('.question-text').text().trim();
      const answer = $(el).find('.answer-text').text().trim();
      
      questions_answered.push([question, question_detail, answer]);
    });
    
    // Extract FAQ
    const faq = [];
    $('.faq-item').each((_, el) => {
      const question = $(el).find('.faq-question').text().trim();
      const answer = $(el).find('.faq-answer').text().trim();
      
      faq.push([question, answer]);
    });
    
    // Return structured data matching the sample.json format
    return {
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