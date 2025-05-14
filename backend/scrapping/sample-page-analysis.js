const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

// Path to the URLs file
const urlsFilePath = path.join(__dirname, './allLawyersList.json');
const urlsFileContent = fs.readFileSync(urlsFilePath, 'utf8');
const urls = JSON.parse(urlsFileContent.replace(/];$/, ']'));

// Select the first URL for analysis
const sampleUrl = urls[0];

async function analyzeSamplePage() {
  try {
    console.log(`Analyzing sample page: ${sampleUrl}`);
    const response = await axios.get(sampleUrl);
    const $ = cheerio.load(response.data);
    
    // Save the HTML structure to a file for inspection
    fs.writeFileSync(
      path.join(__dirname, 'sample_page.html'),
      response.data
    );
    
    // Extract and log page structure information
    console.log('\n--- PAGE ANALYSIS ---');
    
    // Find main content container
    const mainContainers = [
      '.lawyer-profile',
      '.lawyerinfo',
      '.profile-container',
      '#profile-content'
    ];
    
    let mainContainer = null;
    for (const selector of mainContainers) {
      if ($(selector).length > 0) {
        mainContainer = selector;
        console.log(`Main container found: ${selector} (${$(selector).length} elements)`);
        break;
      }
    }
    
    // Find headings
    const headings = $('h1, h2, h3').map((i, el) => {
      return {
        type: el.name,
        text: $(el).text().trim(),
        path: getElementPath($, el)
      };
    }).get();
    
    console.log('\nHeadings:');
    headings.forEach(h => console.log(`- ${h.type}: "${h.text}" (${h.path})`));
    
    // These are the fields we want to extract based on sample.json
    const fieldsToCheck = {
      'is_verified': ['.verified-badge', '.verified-icon', '.verified-lawyer'],
      'name': ['.lawyerinfo h1', '.profile-name', '.lawyer-name', 'h1.name'],
      'rating': ['.rating-info', '.lawyer-rating', '.rating-value'],
      'rating_count': ['.rating-count', '.reviews-count'],
      'contact_number': ['.phone', '.contact-phone', '.mobile', '.contact-number'],
      'location': ['.location', '.city', '.address-info'],
      'experience': ['.experience', '.exp-years', '.professional-since'],
      'languages': ['.languages', '.language-list', '.spoken-languages'],
      'practice_areas': ['.practice-areas', '.expertise', '.specializations'],
      'about': ['.about-lawyer', '.lawyer-description', '.bio'],
      'specialization': ['.specializations', '.expertise-areas', '.primary-practices'],
      'courts': ['.courts', '.court-appearances', '.court-list'],
      'reviews': ['.reviews', '.testimonials', '.client-reviews'],
      'questions': ['.answered-questions', '.lawyer-answers', '.qa-section'],
      'faq': ['.faq', '.faq-section', '.lawyer-faq']
    };
    
    console.log('\nField Detection:');
    for (const [field, selectors] of Object.entries(fieldsToCheck)) {
      for (const selector of selectors) {
        const element = $(selector);
        if (element.length > 0) {
          console.log(`- ${field}: Found with "${selector}" (${element.length} elements)`);
          const sample = element.text().trim().substring(0, 100);
          console.log(`  Sample: "${sample}${sample.length >= 100 ? '...' : ''}"`);
          
          // For structured elements like reviews or questions, show more detail
          if (['reviews', 'questions', 'faq'].includes(field)) {
            const childrenSample = element.find('> *').slice(0, 2).map((_, el) => {
              return $(el).text().trim().substring(0, 50) + '...';
            }).get();
            
            if (childrenSample.length > 0) {
              console.log(`  Child elements (first 2):`);
              childrenSample.forEach((s, i) => console.log(`    ${i+1}. ${s}`));
            }
          }
          break;
        }
      }
    }
    
    // Check if verification badge exists
    const verificationSelectors = ['.verified-badge', '.lawyer-verified', '.is-verified'];
    let isVerified = false;
    for (const selector of verificationSelectors) {
      if ($(selector).length > 0) {
        isVerified = true;
        console.log(`\nVerification: Found with "${selector}"`);
        break;
      }
    }
    if (!isVerified) {
      console.log('\nVerification: Not found');
    }
    
    // Extract review structure
    const reviewSelectors = ['.review-box', '.testimonial', '.client-review'];
    for (const selector of reviewSelectors) {
      const reviews = $(selector);
      if (reviews.length > 0) {
        console.log(`\nReview Structure: Found ${reviews.length} reviews with "${selector}"`);
        const firstReview = reviews.first();
        
        // Check for review components
        const reviewComponents = {
          'reviewer_name': ['.reviewer-name', '.client-name', '.testimonial-author'],
          'verified_client': ['.verified-client', '.verified-review', '.is-verified'],
          'review_text': ['.review-text', '.testimonial-content', '.review-content'],
          'review_date': ['.review-date', '.testimonial-date', '.date']
        };
        
        console.log('  Review components:');
        for (const [component, componentSelectors] of Object.entries(reviewComponents)) {
          for (const compSelector of componentSelectors) {
            if (firstReview.find(compSelector).length > 0) {
              const text = firstReview.find(compSelector).text().trim();
              console.log(`    - ${component}: Found with "${compSelector}" (${text})`);
              break;
            }
          }
        }
        break;
      }
    }
    
    // Extract answered questions structure
    const questionSelectors = ['.answered-question', '.qa-item', '.lawyer-answer'];
    for (const selector of questionSelectors) {
      const questions = $(selector);
      if (questions.length > 0) {
        console.log(`\nAnswered Questions Structure: Found ${questions.length} questions with "${selector}"`);
        const firstQuestion = questions.first();
        
        // Check for question components
        const questionComponents = {
          'question_title': ['.question-title', '.qa-question', '.query-title'],
          'question_text': ['.question-text', '.query-details', '.question-content'],
          'answer_text': ['.answer-text', '.lawyer-response', '.response-content']
        };
        
        console.log('  Question components:');
        for (const [component, componentSelectors] of Object.entries(questionComponents)) {
          for (const compSelector of componentSelectors) {
            if (firstQuestion.find(compSelector).length > 0) {
              const text = firstQuestion.find(compSelector).text().trim().substring(0, 50);
              console.log(`    - ${component}: Found with "${compSelector}" (${text}...)`);
              break;
            }
          }
        }
        break;
      }
    }
    
    // Extract FAQ structure
    const faqSelectors = ['.faq-item', '.faq-qa', '.lawyer-faq-item'];
    for (const selector of faqSelectors) {
      const faqs = $(selector);
      if (faqs.length > 0) {
        console.log(`\nFAQ Structure: Found ${faqs.length} FAQs with "${selector}"`);
        const firstFaq = faqs.first();
        
        // Check for FAQ components
        const faqComponents = {
          'faq_question': ['.faq-question', '.question', '.faq-title'],
          'faq_answer': ['.faq-answer', '.answer', '.faq-content']
        };
        
        console.log('  FAQ components:');
        for (const [component, componentSelectors] of Object.entries(faqComponents)) {
          for (const compSelector of componentSelectors) {
            if (firstFaq.find(compSelector).length > 0) {
              const text = firstFaq.find(compSelector).text().trim().substring(0, 50);
              console.log(`    - ${component}: Found with "${compSelector}" (${text}...)`);
              break;
            }
          }
        }
        break;
      }
    }
    
    console.log('\nAnalysis complete! HTML saved to sample_page.html');
    
  } catch (error) {
    console.error('Analysis failed:', error.message);
  }
}

// Helper function to get the element's CSS path
function getElementPath($, element) {
  let path = [];
  const el = $(element);
  
  // Add id if exists
  if (el.attr('id')) {
    return `#${el.attr('id')}`;
  }
  
  // Add classes
  if (el.attr('class')) {
    const classes = el.attr('class').split(/\s+/).join('.');
    path.push(`.${classes}`);
  } else {
    path.push(element.name || 'unknown');
  }
  
  return path.join(' ');
}

// Run the analysis
analyzeSamplePage().catch(console.error); 