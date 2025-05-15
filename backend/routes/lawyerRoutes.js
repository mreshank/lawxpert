const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const lawyers = require("../data/lawyers.json")

// Get all lawyers with filters and pagination
router.get('/', async (req, res) => {
  try {
    // Read the lawyers data from the JSON file
    // const lawyersData = JSON.parse(
    //   fs.readFileSync(path.join(__dirname, '../data/lawyers.json'), 'utf8')
    // );
    const lawyersData = lawyers;

    // Extract query parameters
    const {
      page = 1,
      limit = 10,
      search = '',
      location = '',
      rating_min = 0,
      rating_max = 5,
      is_verified = '',
      languages = '',
      practice_areas = '',
      courts = '',
      experience_min = 0,
      experience_max = 100,
      sort_by = 'rating',
      sort_order = 'desc'
    } = req.query;

    // Convert query params to appropriate types
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const ratingMin = parseFloat(rating_min);
    const ratingMax = parseFloat(rating_max);
    const experienceMin = parseInt(experience_min);
    const experienceMax = parseInt(experience_max);
    const verifiedFilter = is_verified === 'true' ? true : is_verified === 'false' ? false : '';
    
    // Convert comma-separated lists to arrays
    const languagesArray = languages ? languages.split(',') : [];
    const practiceAreasArray = practice_areas ? practice_areas.split(',') : [];
    const courtsArray = courts ? courts.split(',') : [];

    // Filter lawyers based on criteria
    let filteredLawyers = lawyersData.filter(lawyer => {
      // Search filter (name, location, description)
      const searchMatches = search === '' || 
        lawyer.name.toLowerCase().includes(search.toLowerCase()) ||
        lawyer.location.toLowerCase().includes(search.toLowerCase()) ||
        (lawyer.about && lawyer.about.some(text => text.toLowerCase().includes(search.toLowerCase())));
      
      // Location filter
      const locationMatches = location === '' || 
        lawyer.location.toLowerCase().includes(location.toLowerCase());
      
      // Rating filter
      const ratingMatches = 
        lawyer.rating >= ratingMin && lawyer.rating <= ratingMax;
      
      // Verification filter
      const verifiedMatches = 
        verifiedFilter === '' || lawyer.is_verified === verifiedFilter;
      
      // Experience filter (extract years from text like "20 years")
      const experienceYears = parseInt(lawyer.experience.split(' ')[0]);
      const experienceMatches = 
        experienceYears >= experienceMin && experienceYears <= experienceMax;
      
      // Languages filter
      const languagesMatch = languagesArray.length === 0 || 
        languagesArray.every(lang => lawyer.languages.includes(lang));
      
      // Practice areas filter
      const practiceAreasMatch = practiceAreasArray.length === 0 || 
        practiceAreasArray.every(area => lawyer.practice_areas.includes(area));
      
      // Courts filter
      const courtsMatch = courtsArray.length === 0 || 
        (lawyer.courts && courtsArray.every(court => lawyer.courts.includes(court)));
      
      return searchMatches && locationMatches && ratingMatches && 
             verifiedMatches && experienceMatches && languagesMatch && 
             practiceAreasMatch && courtsMatch;
    });

    // Sort the filtered results
    filteredLawyers.sort((a, b) => {
      let comparison = 0;
      
      // Handle different sort fields
      switch (sort_by) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'experience':
          comparison = parseInt(a.experience) - parseInt(b.experience);
          break;
        default:
          comparison = a.rating - b.rating;
      }
      
      // Apply sort order
      return sort_order === 'asc' ? comparison : -comparison;
    });
    
    // Calculate pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const totalResults = filteredLawyers.length;
    const totalPages = Math.ceil(totalResults / limitNum);
    
    // Get the paginated subset of lawyers
    const paginatedLawyers = filteredLawyers.slice(startIndex, endIndex);
    
    // Add hourly rate to each lawyer (simulated)
    const lawyersWithHourlyRate = paginatedLawyers.map(lawyer => {
      // Generate a random hourly rate between 100 and 300 based on rating and experience
      const experienceYears = parseInt(lawyer.experience.split(' ')[0]);
      const baseRate = 100;
      const ratingFactor = lawyer.rating * 10;
      const experienceFactor = experienceYears * 2;
      const hourlyRate = Math.round((baseRate + ratingFactor + experienceFactor) / 10) * 10;
      
      return {
        ...lawyer,
        hourlyRate
      };
    });

    // Return the response
    res.json({
      success: true,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalResults,
        hasNextPage: endIndex < totalResults,
        hasPrevPage: startIndex > 0
      },
      data: lawyersWithHourlyRate
    });
    
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch lawyers data',
      error: error.message
    });
  }
});

// Get available filter values (unique locations, languages, practice areas, etc.)
router.get('/filter-options', async (req, res) => {
  try {
    // Read the lawyers data from the JSON file
    const lawyersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../data/lawyers.json'), 'utf8')
    );

    // Extract unique values for each filter type
    const locations = new Set();
    const languages = new Set();
    const practiceAreas = new Set();
    const courts = new Set();
    const experienceRange = { min: 100, max: 0 }; // Initialize with opposite extremes
    const ratingRange = { min: 5, max: 0 };

    lawyersData.forEach(lawyer => {
      // Locations
      if (lawyer.location) locations.add(lawyer.location.split(',')[0].trim());
      
      // Languages
      if (lawyer.languages) {
        lawyer.languages.forEach(language => languages.add(language));
      }
      
      // Practice areas
      if (lawyer.practice_areas) {
        lawyer.practice_areas.forEach(area => practiceAreas.add(area));
      }
      
      // Courts
      if (lawyer.courts) {
        lawyer.courts.forEach(court => courts.add(court));
      }
      
      // Experience range
      const experienceYears = parseInt(lawyer.experience?.split(' ')[0] || 0);
      experienceRange.min = Math.min(experienceRange.min, experienceYears);
      experienceRange.max = Math.max(experienceRange.max, experienceYears);
      
      // Rating range
      ratingRange.min = Math.min(ratingRange.min, lawyer.rating);
      ratingRange.max = Math.max(ratingRange.max, lawyer.rating);
    });

    res.json({
      success: true,
      data: {
        locations: Array.from(locations).sort(),
        languages: Array.from(languages).sort(),
        practiceAreas: Array.from(practiceAreas).sort(),
        courts: Array.from(courts).sort(),
        experienceRange,
        ratingRange
      }
    });
    
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filter options',
      error: error.message
    });
  }
});

module.exports = router; 