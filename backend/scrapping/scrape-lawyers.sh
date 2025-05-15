#!/bin/bash

# Lawyer Scraper Shell Script
# This script automates the process of scraping lawyer profiles from lawrato.com

# Set colors for better terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}===== Lawyer Profile Scraper - Automation Script =====${NC}"
echo "This script will guide you through the process of scraping lawyer profiles"
echo ""

# Make sure we are in the right directory
cd "$(dirname "$0")"
SCRIPT_DIR="$(pwd)"
echo "Working directory: $SCRIPT_DIR"
echo ""

# Check if lawyers-list-to-extract-data.json exists
if [ ! -f "./lawyers-list-to-extract-data.json" ]; then
  echo -e "${RED}Error: lawyers-list-to-extract-data.json file not found in the current directory.${NC}"
  exit 1
fi

# Step 1: Fix the test.js file format
echo -e "${YELLOW}Step 1: Checking lawyers-list-to-extract-data.json file format...${NC}"
node fix-test-js.js
if [ $? -ne 0 ]; then
  echo -e "${RED}Error fixing lawyers-list-to-extract-data.json file. Please check the file manually.${NC}"
  exit 1
fi
echo ""

# Step 2: Analyze a sample page
echo -e "${YELLOW}Step 2: Analyzing a sample lawyer profile page...${NC}"
echo "This helps verify the HTML structure and CSS selectors."
read -p "Do you want to analyze a sample page? (y/n): " analyze_sample
if [[ $analyze_sample == "y" || $analyze_sample == "Y" ]]; then
  node sample-page-analysis.js
  echo -e "${GREEN}Sample page analysis complete. Results saved to sample_page.html${NC}"
else
  echo "Skipping sample page analysis."
fi
echo ""

# Step 3: Test scraper on a single profile
echo -e "${YELLOW}Step 3: Testing scraper on a single lawyer profile...${NC}"
read -p "Do you want to test the scraper on a single profile? (y/n): " test_single
if [[ $test_single == "y" || $test_single == "Y" ]]; then
  read -p "Enter a specific URL (leave blank for default): " specific_url
  if [ -z "$specific_url" ]; then
    node test-single-scrape.js
  else
    node test-single-scrape.js "$specific_url"
  fi
  echo -e "${GREEN}Single profile test complete. Results saved to test_lawyer_data.json${NC}"
else
  echo "Skipping single profile test."
fi
echo ""

# Step 4: Run the main scraper
echo -e "${YELLOW}Step 4: Running the full scraper for all lawyers...${NC}"
echo "This will scrape data for all lawyers in the lawyers-list-to-extract-data.json file."
echo "WARNING: This may take a long time depending on the number of profiles."
read -p "Do you want to run the full scraper now? (y/n): " run_full
if [[ $run_full == "y" || $run_full == "Y" ]]; then
  echo "Starting the scraper. This may take a while..."
  node scraper.js
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error running the scraper.${NC}"
    exit 1
  fi
  echo -e "${GREEN}Full scraping complete! Results saved to lawyers_data.json${NC}"
else
  echo "Skipping full scraper."
fi
echo ""

# Step 5: Analyze the results
echo -e "${YELLOW}Step 5: Analyzing the scraped data...${NC}"
if [[ $run_full == "y" || $run_full == "Y" ]]; then
  read -p "Do you want to analyze the scraped data? (y/n): " analyze_data
  if [[ $analyze_data == "y" || $analyze_data == "Y" ]]; then
    node analyze-results.js
    echo -e "${GREEN}Analysis complete! Clean data saved to lawyers_clean_data.json${NC}"
  else
    echo "Skipping data analysis."
  fi
else
  echo "Skipping data analysis since full scraper was not run."
fi
echo ""

echo -e "${GREEN}===== Lawyer Profile Scraper - Process Complete =====${NC}"
echo "Here's what you can do next:"
echo "1. Check lawyers_data.json for the raw scraped data"
echo "2. Check lawyers_clean_data.json for the cleaned data"
echo "3. Run 'node analyze-results.js' if you want to analyze the data again"
echo "" 