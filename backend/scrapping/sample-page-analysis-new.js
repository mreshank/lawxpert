const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Load the sample page HTML
const samplePath = path.join(__dirname, 'sample_page.html');
const html = fs.readFileSync(samplePath, 'utf8');

// Parse the HTML
const $ = cheerio.load(html);

console.log("Analyzing sample page for profile image...");
console.log("---------------------------------------------------------");

// Look for image with class "media-object img-responsive"
const profileImages = $('img.media-object.img-responsive');

if (profileImages.length > 0) {
  console.log(`✅ Found ${profileImages.length} image(s) with class "media-object img-responsive"`);
  
  // Display information about each found image
  profileImages.each((i, el) => {
    const $img = $(el);
    console.log(`\nImage #${i+1}:`);
    console.log(`- src: ${$img.attr('src')}`);
    console.log(`- alt: ${$img.attr('alt') || '(no alt text)'}`);
    console.log(`- class: ${$img.attr('class')}`);
    
    // Get parent information
    const $parent = $img.parent();
    console.log(`- parent tag: ${$parent.prop('tagName').toLowerCase()}`);
    console.log(`- parent class: ${$parent.attr('class') || '(no class)'}`);
    
    // Check if this is likely the profile image
    const isInHeader = $parent.closest('.media-heading, .lawyer-profile, .profile-header').length > 0;
    console.log(`- Is in profile header: ${isInHeader ? 'Yes' : 'No'}`);
    
    // Construct absolute URL if needed
    let imgUrl = $img.attr('src');
    if (imgUrl && !imgUrl.startsWith('http')) {
      if (imgUrl.startsWith('//')) {
        imgUrl = 'https:' + imgUrl;
      } else {
        imgUrl = new URL(imgUrl, 'https://lawrato.com').href;
      }
    }
    console.log(`- Absolute URL: ${imgUrl}`);
  });
} else {
  console.log("❌ No images found with class 'media-object img-responsive'");
  
  // Try to find other potential profile images
  console.log("\nLooking for alternative profile image selectors...");
  
  const potentialSelectors = [
    '.lawyer-profile img',
    '.profile-image img',
    '.lawyer-photo img',
    '.media-object',
    '.profile-pic',
    '.avatar'
  ];
  
  potentialSelectors.forEach(selector => {
    const elements = $(selector);
    console.log(`- Selector "${selector}": ${elements.length > 0 ? `✓ (${elements.length})` : '✗'}`);
    
    if (elements.length > 0 && elements.first().is('img')) {
      console.log(`  Image src: ${elements.first().attr('src')}`);
    }
  });
}

// Save a report with image information
const imageReport = {
  timestamp: new Date().toISOString(),
  url: $('link[rel="canonical"]').attr('href'),
  title: $('title').text().trim(),
  images: {}
};

// Function to analyze images with a specific selector
function analyzeImages(selectorName, selector) {
  const images = $(selector);
  const count = images.length;
  
  imageReport.images[selectorName] = {
    count,
    found: count > 0,
    examples: []
  };
  
  if (count > 0) {
    images.slice(0, 5).each((i, el) => {
      const $img = $(el);
      imageReport.images[selectorName].examples.push({
        src: $img.attr('src'),
        alt: $img.attr('alt'),
        class: $img.attr('class'),
        parentTag: $img.parent().prop('tagName').toLowerCase(),
        parentClass: $img.parent().attr('class')
      });
    });
  }
}

// Analyze different image selectors
analyzeImages('profile_image', 'img.media-object.img-responsive');
analyzeImages('media_images', '.media-object');
analyzeImages('lawyer_profile_images', '.lawyer-profile img');
analyzeImages('profile_images', '.profile-image img, .profile-pic');
analyzeImages('all_images', 'img');

// Write the image analysis report to a file
fs.writeFileSync(
  path.join(__dirname, 'image_analysis_report.json'),
  JSON.stringify(imageReport, null, 2)
);

console.log("---------------------------------------------------------");
console.log("Full image analysis report saved to: image_analysis_report.json"); 