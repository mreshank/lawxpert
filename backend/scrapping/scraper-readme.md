# Lawyer Profile Scraper

A set of tools to scrape lawyer profiles from lawrato.com and analyze the extracted data.

## Overview

This scraper uses Node.js, Axios, and Cheerio to extract detailed information about lawyers from their profile pages on lawrato.com. The URLs are read from the `test.js` file in the root directory, and the data is structured to match the format in `sample.json`.

## Files in this Directory

- `scraper.js` - The main scraper script that extracts lawyer information
- `run-scraper.js` - A utility script to run the scraper
- `sample-page-analysis.js` - A tool to analyze a sample page structure
- `analyze-results.js` - A script to analyze the scraped data
- `test-single-scrape.js` - A tool to test the scraper on a single lawyer profile
- `fix-test-js.js` - A utility to ensure the ./test.json file is correctly formatted

## Data Structure

The scraper extracts data to match the structure in the sample.json file, which includes:

```json
{
  "is_verified": true,
  "name": "Lawyer Name",
  "rating": 4.5,
  "rating_count": "100+",
  "contact_number": "9876****43",
  "location": "Location",
  "experience": "10 years",
  "languages": "English, Hindi",
  "practice_areas": "Criminal, Civil, Property",
  "about": ["Paragraph 1", "Paragraph 2"],
  "specialization": "Divorce, Property, Criminal",
  "courts": ["Court 1", "Court 2"],
  "popular_reviews": [
    {
      "name": "Reviewer Name",
      "verified_client": true,
      "review": "Review text",
      "age": "2 months ago"
    }
  ],
  "questions_answered": [
    ["Question Title", "Question Details", "Lawyer's Answer"]
  ],
  "faq": [
    ["FAQ Question", "FAQ Answer"]
  ]
}
```

## How to Use

### Step 0: Prepare Your URL List

Make sure your `test.js` file in the root directory is properly formatted as a valid JSON array. You can run the fix-test-js script to ensure correct formatting:

```bash
node backend/fix-test-js.js
```

### Step 1: Analyze a Sample Page

Before running the full scraper, it's recommended to analyze a sample page to verify the HTML structure:

```bash
node backend/sample-page-analysis.js
```

This will:
- Fetch the first URL from test.js
- Save the raw HTML to `sample_page.html`
- Log information about the page structure
- Help identify the correct CSS selectors for different pieces of information

### Step 2: Test on a Single Profile

Test the scraper on a single lawyer profile to verify it works correctly:

```bash
node backend/test-single-scrape.js
```

Or specify a specific URL:

```bash
node backend/test-single-scrape.js https://lawrato.com/advocate-some-name
```

This will:
- Scrape the specified profile
- Save the extracted data to `test_lawyer_data.json`
- Display a summary of the extracted data

### Step 3: Run the Full Scraper

To scrape all lawyer profiles:

```bash
node backend/run-scraper.js
```

This will:
- Process each URL in the ./test.json file
- Extract lawyer information from each profile page
- Save the data to `lawyers_data.json`
- Add a delay between requests to avoid being blocked
- Save intermediate results for every 5 lawyers scraped

### Step 4: Analyze the Results

After scraping is complete, analyze the results:

```bash
node backend/analyze-results.js
```

This will:
- Provide statistics about the scraped data
- Count successful vs. failed scrapes
- Analyze data completeness for different fields
- Show top specializations and locations
- Export a clean version of the data to `lawyers_clean_data.json`

## Extracted Information

The scraper extracts the following information for each lawyer:

- Verification status
- Name
- Rating and rating count
- Contact number
- Location
- Experience
- Languages
- Practice areas
- About/bio (paragraphs)
- Specialization
- Courts
- Reviews (with reviewer name, verification status, review text, and age)
- Answered questions (question title, details, and answer)
- FAQs

## Troubleshooting

If the scraper fails to extract certain information, consider:

1. Check the HTML structure in `sample_page.html`
2. Modify the CSS selectors in `scraper.js`
3. Run on a smaller batch of URLs first
4. Increase delay time between requests
5. Check for any potential IP blocking issues

## Note

Web scraping should be performed responsibly and ethically. Always respect the website's robots.txt file and terms of service. This scraper includes intentional delays between requests to minimize server load. 