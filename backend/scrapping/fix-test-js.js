const fs = require('fs');
const path = require('path');

// Path to the URLs file
const urlsFilePath = path.join(__dirname, './allLawyersList.json');

try {
  console.log('Reading ./allLawyersList.json file...');
  const content = fs.readFileSync(urlsFilePath, 'utf8');
  
  // Check if the file ends with a semicolon after the closing bracket
  if (content.trim().endsWith('];')) {
    console.log('File format is already correct.');
  } else {
    // Remove any trailing semicolon or other characters after the closing bracket
    let fixedContent = content.replace(/\][^]*$/, ']');
    
    // Write the fixed content back to the file
    fs.writeFileSync(urlsFilePath, fixedContent);
    console.log('File format fixed successfully.');
  }
  
  // Test if the file can be parsed as JSON
  try {
    const urls = JSON.parse(content.replace(/];$/, ']'));
    console.log(`Successfully parsed ${urls.length} URLs from test.js`);
    
    // Display the first few URLs
    console.log('\nFirst 3 URLs:');
    urls.slice(0, 3).forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });
  } catch (parseError) {
    console.error('Error parsing the file as JSON. Manual fix may be required:', parseError.message);
  }
} catch (error) {
  console.error('Error reading or processing the file:', error.message);
} 