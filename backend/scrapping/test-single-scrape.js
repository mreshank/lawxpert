const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// You can specify a URL directly or use the first URL from test.js
const urlToTest = process.argv[2] || 'https://lawrato.com/advocate-rajesh-ks';

// Function to scrape data from a lawyer's profile page
async function scrapeLawyerProfile(url) {
  try {
    console.log(`Scraping: ${url}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Save HTML for debugging
    fs.writeFileSync(
      path.join(__dirname, 'debug_page.html'),
      response.data
    );
    
    // Extract basic lawyer information
    const name = $('.lawyerinfo h1').text().trim() || $('h1.name').text().trim() || $('.lawyer-name').text().trim();
    console.log("DEBUG - Found name:", name);
    
    const location = $('.lawyerinfo .location').text().trim() || $('.address-info').text().trim() || $('.city').text().trim();
    console.log("DEBUG - Found location:", location);
    
    const experience = $('.lawyerinfo .experience').text().trim() || $('.exp-years').text().trim();
    console.log("DEBUG - Found experience:", experience);
    
    // Determine if the lawyer is verified
    const is_verified = $('.verified-badge').length > 0 || $('.verified-icon').length > 0;
    console.log("DEBUG - Is verified:", is_verified);
    
    // Extract rating information
    let rating = 0;
    let rating_count = "0";
    const ratingText = $('.rating-info').text().trim() || $('.lawyer-rating').text().trim();
    console.log("DEBUG - Rating text:", ratingText);
    
    if (ratingText) {
      const ratingMatch = ratingText.match(/([0-9.]+)/);
      if (ratingMatch) rating = parseFloat(ratingMatch[1]);
      
      const countMatch = ratingText.match(/\(([0-9]+\+?)\)/);
      if (countMatch) rating_count = countMatch[1];
    }
    
    // Extract contact information
    const contact_number = $('.lawyerinfo .phone').text().trim() || 
                          $('.contactinfo .phone').text().trim() || 
                          $('.contact-phone').text().trim() || 
                          $('.lawyerProfile__contact span').text().trim();
    console.log("DEBUG - Contact number:", contact_number);
    
    // Extract languages
    const languages = $('.languages li').map((_, el) => $(el).text().trim()).get().join(', ') || 
                     $('.language').text().trim() || $('.language-list').text().trim();
    console.log("DEBUG - Languages:", languages);
    
    // Extract practice areas
    const practice_areas = $('.practice-areas ul li').map((_, el) => $(el).text().trim()).get().join(', ') ||
                          $('.specialization').text().trim() || $('.expertise').text().trim();
    console.log("DEBUG - Practice areas:", practice_areas);
    
    // Extract about information
    const aboutParagraphs = $('.about-lawyer p').map((_, el) => $(el).text().trim()).get() || 
                           $('.lawyer-description p').map((_, el) => $(el).text().trim()).get() ||
                           $('.bio p').map((_, el) => $(el).text().trim()).get();
    console.log("DEBUG - About paragraphs found:", aboutParagraphs.length);
    
    // Extract specialization
    const specialization = $('.specializations li').map((_, el) => $(el).text().trim()).get().join(', ') ||
                          $('.expertise-areas li').map((_, el) => $(el).text().trim()).get().join(', ') ||
                          $('.primary-practices li').map((_, el) => $(el).text().trim()).get().join(', ');
    console.log("DEBUG - Specialization:", specialization);
    
    // Extract court appearances
    const courts = $('.courts li').map((_, el) => $(el).text().trim()).get() ||
                  $('.court-appearances li').map((_, el) => $(el).text().trim()).get() ||
                  $('.court-list li').map((_, el) => $(el).text().trim()).get();
    console.log("DEBUG - Courts found:", courts.length);
    
    // Extract reviews
    const popular_reviews = $('.review-box, .testimonial, .client-review').map((_, el) => {
      const name = $(el).find('.reviewer-name, .client-name, .testimonial-author').text().trim();
      const verified_client = $(el).find('.verified-client, .verified-review, .is-verified').length > 0;
      const review = $(el).find('.review-text, .testimonial-content, .review-content').text().trim();
      const age = $(el).find('.review-date, .testimonial-date, .date').text().trim();
      
      console.log("DEBUG - Review found:", name, review.substring(0, 30) + '...');
      
      return {
        name,
        verified_client,
        review,
        age
      };
    }).get();
    
    // Extract answered questions
    const questions_answered = [];
    $('.answered-question, .qa-item, .lawyer-answer').each((_, el) => {
      const question = $(el).find('.question-title, .qa-question, .query-title').text().trim();
      const question_detail = $(el).find('.question-text, .query-details, .question-content').text().trim();
      const answer = $(el).find('.answer-text, .lawyer-response, .response-content').text().trim();
      
      if (question && answer) {
        console.log("DEBUG - Question found:", question.substring(0, 30) + '...');
        questions_answered.push([question, question_detail, answer]);
      }
    });
    
    // Extract FAQ
    const faq = [];
    $('.faq-item, .faq-qa, .lawyer-faq-item').each((_, el) => {
      const question = $(el).find('.faq-question, .question, .faq-title').text().trim();
      const answer = $(el).find('.faq-answer, .answer, .faq-content').text().trim();
      
      if (question && answer) {
        console.log("DEBUG - FAQ found:", question.substring(0, 30) + '...');
        faq.push([question, answer]);
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
    
    // Compare with the selectors page has found
    console.log("\nExtracted data summary:");
    for (const [key, value] of Object.entries(lawyerData)) {
      if (Array.isArray(value)) {
        console.log(`- ${key}: ${value.length} items found`);
        if (value.length > 0 && typeof value[0] === 'object') {
          console.log(`  First item keys: ${Object.keys(value[0]).join(', ')}`);
        }
      } else if (typeof value === 'object') {
        console.log(`- ${key}: Object with keys: ${Object.keys(value).join(', ')}`);
      } else {
        console.log(`- ${key}: ${value}`);
      }
    }
    
    // Save the scraped data to a file
    fs.writeFileSync(
      path.join(__dirname, 'test_lawyer_data.json'),
      JSON.stringify(lawyerData, null, 2)
    );
    
    console.log(`\nTest successful! Data saved to: test_lawyer_data.json`);
    
    return lawyerData;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return {
      url,
      error: error.message
    };
  }
}

// Run the test
scrapeLawyerProfile(urlToTest)
  .catch(error => {
    console.error('Test scraping failed:', error);
  }); 