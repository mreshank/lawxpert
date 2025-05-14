# Lawyer Profile Scraper

This scraper extracts lawyer profile information from lawrato.com. It's designed to collect comprehensive details about lawyers including their contact information, expertise, reviews, and more.

## Features

The scraper extracts the following information from lawyer profiles:

- **Basic Information**:
  - Name
  - Profile Image URL
  - Verification Status
  - Rating and Rating Count
  - Contact Number
  - Page URL
  - Location
  - Experience
  - Languages (array)
  - Practice Areas (array)

- **Detailed Information**:
  - About (Lawyer Bio)
  - Specialization (array)
  - Courts (array)
  - Popular Reviews
  - Questions Answered
  - FAQs

## Data Format

The scraper outputs data in the following JSON format:

```json
{
  "is_verified": true,
  "name": "Advocate Name",
  "img_url": "https://example.com/image.jpg",
  "rating": 4.7,
  "rating_count": "200+",
  "contact_number": "9876****43",
  "page_url": "https://lawrato.com/advocate-name",
  "location": "Location",
  "experience": "10 years",
  "languages": ["English", "Hindi"],
  "practice_areas": ["Criminal", "Civil", "Property"],
  "about": ["Paragraph 1", "Paragraph 2"],
  "specialization": ["Divorce", "Property", "Criminal"],
  "courts": ["Supreme Court", "High Court"],
  "popular_reviews": [
    {
      "name": "Reviewer Name",
      "verified_client": true,
      "review": "Review text",
      "age": "2 months ago"
    }
  ],
  "questions_answered": [
    {
      "question": "Question Title",
      "details": "Question Details",
      "answer": "Lawyer's Answer"
    }
  ],
  "faq": [
    {
      "question": "FAQ Question",
      "answer": "FAQ Answer"
    }
  ]
}
```

## Files and Scripts

- `scraper.js`: Main scraper script that extracts lawyer information and saves it to JSON
- `run-scraper.js`: Simple script to execute the main scraper
- `test-single-scrape.js`: Tool to test scraping on a single profile
- `sample-page-analysis.js`: Script to analyze HTML structure of profile pages
- `sample-page-analysis-new.js`: Script focused on analyzing profile image elements
- `analyze-results.js`: Script to analyze scraped data
- `fix-test-js.js`: Utility to ensure URLs file is formatted correctly
- `scrape-lawyers.sh`: Shell script to automate the scraping process

## Setup

1. Make sure you have Node.js installed
2. Install required dependencies:
   ```
   npm install axios cheerio
   ```

## URL Input

The scraper expects a JSON file with URLs to lawyer profiles. The default file is `allLawyersList.json`, which should contain an array of URLs.

## Usage

### Test on a Single Profile

To test the scraper on a single profile:

```
node test-single-scrape.js
```

This will scrape a sample profile and save the result to `test_lawyer_data.json`.

### Run the Full Scraper

To scrape all lawyer profiles from the URL list:

```
node run-scraper.js
```

Or, to use the shell script with more options:

```
./scrape-lawyers.sh
```

### Analyze HTML Structure

Before scraping, you can analyze the HTML structure of sample pages:

```
node sample-page-analysis.js
```

For a focused analysis on profile images:

```
node sample-page-analysis-new.js
```

### Analyze Results

After scraping, analyze the collected data:

```
node analyze-results.js
```

## Output

The scraper saves data to these files:
- `lawyers_data.json`: Main output with all scraped profiles
- `test_lawyer_data.json`: Output from single profile test
- `debug_page.html`: HTML content of the last scraped page for debugging

## Error Handling

The scraper includes robust error handling:
- If data can't be extracted directly, it falls back to sample data
- Failed profiles are logged with error messages
- Progress is saved regularly during execution

## Image URL Extraction

The scraper now extracts the lawyer's profile image URL and stores it as `img_url` in the output. It uses the following approach:

1. Looks for an `<img>` element with class `media-object img-responsive`
2. Extracts the `src` attribute from the found element
3. Ensures the URL is absolute by converting relative URLs to absolute
4. Falls back to sample data if the image can't be found

This extraction is implemented in both the main scraper and the test scraper.

## Regenerating Data with Image URLs

To update your existing data with image URLs, follow these steps:

1. Make sure your URL list is up-to-date in `allLawyersList.json`
2. Run the scraper again:
   ```
   node run-scraper.js
   ```
3. After scraping completes, run the analysis to verify image URLs were extracted:
   ```
   node analyze-results.js
   ```

The analysis will show what percentage of profiles have valid image URLs and what domains they come from.

## Notes

- The scraper adds random delays between requests to avoid being blocked
- It creates absolute URLs for images that have relative paths
- It attempts to extract data using multiple selectors to handle different page structures
- String fields like 'languages', 'practice_areas', and 'specialization' are now stored as arrays
- FAQ and questions_answered are now stored as arrays of objects instead of arrays of arrays 