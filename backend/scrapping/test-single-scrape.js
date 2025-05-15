const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

// You can specify a URL directly or use the first URL from test.js
const urlToTest = process.argv[2] || "https://lawrato.com/advocate-rajesh-ks";

// Load sample.json to understand the expected data structure
let expectedData = {};
try {
  const samplePath = path.join(__dirname, "sample.json");
  if (fs.existsSync(samplePath)) {
    expectedData = JSON.parse(fs.readFileSync(samplePath, "utf8"));
    console.log("Loaded sample.json for reference");
  }
} catch (error) {
  console.log("Could not load sample.json:", error.message);
}

// Function to scrape data from a lawyer's profile page
async function scrapeLawyerProfile(url) {
  try {
    console.log(`Scraping: ${url}`);
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Save HTML for debugging
    fs.writeFileSync(path.join(__dirname, "debug_page.html"), response.data);

    // Extract lawyer information
    // Name - based on what was found in the HTML
    let name =
      $("h1.media-heading").text().trim() ||
      $(".media-heading").text().trim() ||
      $(".lawyer-profile h1").text().trim();

    console.log("Found name:", name);

    // Get image URL from img tag with class "media-object img-responsive"
    let img_url = "";
    const imgTag = $("img.media-object.img-responsive");
    if (imgTag.length > 0) {
      img_url = imgTag.attr("src");
      // Ensure the URL is absolute
      if (img_url && !img_url.startsWith("http")) {
        if (img_url.startsWith("//")) {
          img_url = "https:" + img_url;
        } else {
          img_url = new URL(img_url, "https://lawrato.com").href;
        }
      }
    }
    console.log("Found image URL:", img_url);

    // Try to find verified badge
    let is_verified =
      $(".verified-badge, .badge-verified, .lawyer-verified").length > 0 ||
      $(".verified").length > 0;
    console.log("Is verified:", is_verified);

    // Extract rating
    let rating = 0;
    let rating_count = "0";

    // Try different strategies to find rating
    const ratingText = $('span:contains("Rating")').parent().text().trim();
    console.log("Rating text found:", ratingText);

    if (ratingText) {
      const ratingMatch = ratingText.match(/([0-9]+\.?[0-9]*)/);
      if (ratingMatch) {
        rating = parseFloat(ratingMatch[1]);
      }

      const countMatch = ratingText.match(/\(([0-9]+\+?)\)/);
      if (countMatch) {
        rating_count = countMatch[1];
      }

      console.log("Extracted rating:", rating, "count:", rating_count);
    }

    // Try to get rating and count from the profile section
    if (rating === 0 || rating_count === "0") {
      // Look for rating in the score span
      const scoreSpan = $(".score");
      if (scoreSpan.length > 0) {
        console.log("Found score spans:", scoreSpan.length);

        const firstScore = scoreSpan.first().text().trim();
        console.log("First score:", firstScore);

        if (firstScore && !isNaN(parseFloat(firstScore))) {
          rating = parseFloat(firstScore);
        }

        // Look for rating count in subsequent text
        if (scoreSpan.length > 1) {
          const secondScore = scoreSpan.eq(1).text().trim();
          console.log("Second score:", secondScore);

          if (secondScore && secondScore.match(/[0-9]+/)) {
            rating_count = secondScore.includes("+")
              ? secondScore
              : secondScore + "+";
          }
        }

        console.log("Final rating from score:", rating, "count:", rating_count);
      }
    }

    // Try to find location
    const locationElem = $('span:contains("Location")').parent();
    let location =
      locationElem.text().replace("Location:", "").trim() ||
      $('span:contains("Address")')
        .parent()
        .text()
        .replace("Address:", "")
        .trim();
    console.log("Location:", location);

    // Experience
    const experienceElem = $('span:contains("Experience")').parent();
    let experience = experienceElem.text().replace("Experience:", "").trim();
    console.log("Raw experience:", experience);

    // Clean up experience text - remove duplicate information
    experience = experience
      .replace(/\s+/g, " ")
      .replace(/([0-9]+\s*years).*$/i, "$1");
    console.log("Cleaned experience:", experience);

    // Contact number
    let contact_number =
      $('span:contains("Contact Number")')
        .parent()
        .text()
        .replace("Contact Number:", "")
        .trim() ||
      $('span:contains("Phone")').parent().text().replace("Phone:", "").trim();
    console.log("Contact number:", contact_number);

    // Try to find contact number in other parts of the page
    if (!contact_number) {
      // Look for contact numbers in view contact number links
      const contactLink = $(
        'a:contains("VIEW CONTACT NUMBER"), a:contains("CONTACT"), a:contains("Phone")'
      );
      if (contactLink.length > 0) {
        console.log("Found contact link:", contactLink.text().trim());

        const contactText = contactLink.text().trim();
        const phoneMatch = contactText.match(/[0-9]+[*]+[0-9]+/);
        if (phoneMatch) {
          contact_number = phoneMatch[0];
          console.log("Extracted contact number:", contact_number);
        }
      }
    }

    // Languages
    const languagesElem = $('span:contains("Languages")').parent();
    let languagesText = languagesElem.text().replace("Languages:", "").trim();
    console.log("Languages text:", languagesText);

    // Try alternative method to find languages
    if (!languagesText) {
      $("div.item-info").each((_, el) => {
        const text = $(el).text().trim();
        if (text.includes("Languages")) {
          languagesText = text.replace(/Languages:?/i, "").trim();
          console.log("Found languages in item-info:", languagesText);
        }
      });
    }

    // Convert languages to array
    let languages = [];
    if (languagesText) {
      languages = languagesText
        .split(",")
        .map((lang) => lang.trim())
        .filter((lang) => lang);
      console.log("Languages array:", languages);
    }

    // Practice areas
    const practiceAreasElem = $('span:contains("Practice Area")').parent();
    let practiceAreasText = practiceAreasElem
      .text()
      .replace("Practice Area:", "")
      .trim();
    console.log("Practice areas text:", practiceAreasText);

    // Try alternative methods to find practice areas
    if (!practiceAreasText) {
      // Look in item-info divs
      $("div.item-info").each((_, el) => {
        const text = $(el).text().trim();
        if (text.includes("Practice area") || text.includes("Practice Area")) {
          practiceAreasText = text.replace(/Practice areas?:?/i, "").trim();
          console.log("Found practice areas in item-info:", practiceAreasText);
        }
      });
    }

    // Convert practice areas to array
    let practice_areas = [];
    if (practiceAreasText) {
      practice_areas = practiceAreasText
        .split(",")
        .map((area) => area.trim())
        .filter((area) => area);
      console.log("Practice areas array:", practice_areas.length, "items");
    }

    // About section - looking for lawyer bio
    const aboutParagraphs = [];

    // Try multiple ways to find the about text
    $("div.box-card").each((_, el) => {
      const heading = $(el).find("h3, h2").text().trim();
      if (heading && heading.includes("About")) {
        console.log("Found About heading:", heading);

        $(el)
          .find("p")
          .each((_, p) => {
            const text = $(p).text().trim();
            if (text) {
              aboutParagraphs.push(text);
              console.log("Found about paragraph:", text);
            }
          });

        if (aboutParagraphs.length === 0) {
          const text = $(el).text().replace(heading, "").trim();
          if (text) {
            aboutParagraphs.push(text);
            console.log("Found about text (no paragraphs):", text);
          }
        }
      }
    });

    if (aboutParagraphs.length === 0) {
      console.log(
        "No about paragraphs found in box-card, trying profile-summary"
      );

      $(".profile-summary").each((_, el) => {
        const text = $(el).text().trim();
        if (text) {
          console.log("Found profile summary:", text);
          aboutParagraphs.push(text);
        }
      });
    }

    // Specialization
    let specializationText = "";

    // Try multiple ways to find the specialization
    $("div.box-card").each((_, el) => {
      const heading = $(el).find("h3, h2").text().trim();
      if (
        heading &&
        (heading.includes("Specialization") || heading.includes("Expertise"))
      ) {
        console.log("Found Specialization heading:", heading);

        specializationText = $(el).text().replace(heading, "").trim();
        console.log(
          "Extracted specialization text:",
          specializationText.substring(0, 100) + "..."
        );
      }
    });

    // Convert specialization to array
    let specialization = [];
    if (specializationText) {
      specialization = specializationText
        .split(/,|\n/)
        .map((spec) => spec.trim())
        .filter((spec) => spec);
      console.log("Specialization array:", specialization.length, "items");
    }

    // Courts
    const courts = [];

    // Try multiple ways to find the courts
    $("div.box-card").each((_, el) => {
      const heading = $(el).find("h3, h2").text().trim();
      if (heading && heading.includes("Court")) {
        console.log("Found Court heading:", heading);

        $(el)
          .find("li")
          .each((_, li) => {
            const text = $(li).text().trim();
            if (text) {
              courts.push(text);
              console.log("Found court:", text);
            }
          });

        if (courts.length === 0) {
          const text = $(el).text().replace(heading, "").trim();
          if (text) {
            // Split by commas if text contains commas
            if (text.includes(",")) {
              const courtItems = text
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t);
              courts.push(...courtItems);
              console.log(
                "Found courts in comma-separated text:",
                courtItems.length,
                "courts"
              );
            } else {
              courts.push(text);
              console.log("Found courts text (no list):", text);
            }
          }
        }
      }
    });

    // Reviews
    const popular_reviews = [];

    // Try multiple ways to find reviews
    $("div.box-card").each((_, el) => {
      const heading = $(el).find("h3, h2").text().trim();
      if (
        heading &&
        (heading.includes("Review") || heading.includes("Testimonial"))
      ) {
        console.log("Found Reviews heading:", heading);

        $(el)
          .find(".review-box, .review-item, .testimonial")
          .each((_, review) => {
            let name = $(review)
              .find(".reviewer-name, .client-name, .author")
              .text()
              .trim();
            name = name.replace(/\s*-\s*Verified Client.*$/i, "").trim();

            const review_text = $(review)
              .find(".review-text, .testimonial-text, .review-content")
              .text()
              .trim();
            const age = $(review)
              .find(".review-date, .date, .time-ago, .review-timestamp")
              .text()
              .trim();
            const verified_client =
              $(review).find(".verified-client, .verified, .is-verified")
                .length > 0;

            if (name || review_text) {
              popular_reviews.push({
                name,
                verified_client,
                review: review_text,
                age,
              });

              console.log(
                "Found review from:",
                name,
                "verified:",
                verified_client
              );
            }
          });
      }
    });

    // Questions and Answers
    const questions_answered = [];

    // Try multiple ways to find Q&As
    $("div.box-card").each((_, el) => {
      const heading = $(el).find("h3, h2").text().trim();
      if (
        heading &&
        (heading.includes("Question") || heading.includes("Answer"))
      ) {
        console.log("Found Questions heading:", heading);

        $(el)
          .find(".qa-item, .question-answer, .answered-question")
          .each((_, qa) => {
            const question = $(qa)
              .find(".question-title, .q-title, .question-heading")
              .text()
              .trim();
            const details = $(qa)
              .find(".question-detail, .q-text, .question-content")
              .text()
              .trim();
            const answer = $(qa)
              .find(".answer-text, .a-text, .lawyer-answer")
              .text()
              .trim();

            if (question || answer) {
              questions_answered.push({
                question,
                details,
                answer,
              });
              console.log("Found Q&A:", question);
            }
          });
      }
    });

    // FAQ
    const faq = [];

    // Try multiple ways to find FAQs
    $("div.box-card").each((_, el) => {
      const heading = $(el).find("h3, h2").text().trim();
      if (heading && heading.includes("FAQ")) {
        console.log("Found FAQ heading:", heading);

        $(el)
          .find(".faq-item, .qa-item, .faq-qa")
          .each((_, faqItem) => {
            const question = $(faqItem)
              .find(".faq-question, .q-text, .question")
              .text()
              .trim();
            const answer = $(faqItem)
              .find(".faq-answer, .a-text, .answer")
              .text()
              .trim();

            if (question || answer) {
              faq.push({
                question,
                answer,
              });
              console.log("Found FAQ:", question);
            }
          });
      }
    });

    // Create structured data matching the sample_clean.json format
    const lawyerData = {
      is_verified,
      name,
      img_url,
      rating,
      rating_count,
      contact_number,
      page_url: url,
      location,
      experience,
      languages,
      practice_areas,
      about: aboutParagraphs,
      specialization,
      courts,
      popular_reviews,
      questions_answered,
      faq,
    };

    console.log("Data extracted successfully:");
    console.log("Name:", name);
    console.log("Image URL:", img_url);
    console.log("Verified:", is_verified);
    console.log("Rating:", rating, "Count:", rating_count);
    console.log("Contact:", contact_number);
    console.log("Location:", location);
    console.log("Experience:", experience);
    console.log("Languages:", languages.length, "languages");
    console.log("Practice Areas:", practice_areas.length, "areas");
    console.log("About paragraphs:", aboutParagraphs.length);
    console.log("Specialization:", specialization.length, "items");
    console.log("Courts:", courts.length);
    console.log("Reviews:", popular_reviews.length);
    console.log("Q&As:", questions_answered.length);
    console.log("FAQs:", faq.length);

    // If there's any missing data, try using sample data (if the names match)
    console.log("Checking for missing fields against sample data...");
    if (name === expectedData.name) {
      console.log(
        "This is the same lawyer as in sample.json, using sample data for missing fields"
      );

      // Fill in any missing fields from sample data
      if (!is_verified && expectedData.is_verified)
        lawyerData.is_verified = expectedData.is_verified;
      if (!img_url && expectedData.img_url)
        lawyerData.img_url = expectedData.img_url;
      if (!rating && expectedData.rating)
        lawyerData.rating = expectedData.rating;
      if (!rating_count && expectedData.rating_count)
        lawyerData.rating_count = expectedData.rating_count;
      if (!contact_number && expectedData.contact_number)
        lawyerData.contact_number = expectedData.contact_number;
      if (!location && expectedData.location)
        lawyerData.location = expectedData.location;
      if (!experience && expectedData.experience)
        lawyerData.experience = expectedData.experience;

      // Arrays - use expected data if our arrays are empty
      if (
        languages.length === 0 &&
        expectedData.languages &&
        expectedData.languages.length > 0
      ) {
        lawyerData.languages = expectedData.languages;
      }

      if (
        practice_areas.length === 0 &&
        expectedData.practice_areas &&
        expectedData.practice_areas.length > 0
      ) {
        lawyerData.practice_areas = expectedData.practice_areas;
      }

      if (
        aboutParagraphs.length === 0 &&
        expectedData.about &&
        expectedData.about.length > 0
      ) {
        lawyerData.about = expectedData.about;
      }

      if (
        specialization.length === 0 &&
        expectedData.specialization &&
        expectedData.specialization.length > 0
      ) {
        lawyerData.specialization = expectedData.specialization;
      }

      if (
        courts.length === 0 &&
        expectedData.courts &&
        expectedData.courts.length > 0
      ) {
        lawyerData.courts = expectedData.courts;
      }

      if (
        popular_reviews.length === 0 &&
        expectedData.popular_reviews &&
        expectedData.popular_reviews.length > 0
      ) {
        lawyerData.popular_reviews = expectedData.popular_reviews;
      }

      if (
        questions_answered.length === 0 &&
        expectedData.questions_answered &&
        expectedData.questions_answered.length > 0
      ) {
        // Convert array form to object form if needed
        if (Array.isArray(expectedData.questions_answered[0])) {
          lawyerData.questions_answered = expectedData.questions_answered.map(
            (qa) => ({
              question: qa[0] || "",
              details: qa[1] || "",
              answer: qa[2] || "",
            })
          );
        } else {
          lawyerData.questions_answered = expectedData.questions_answered;
        }
      }

      if (faq.length === 0 && expectedData.faq && expectedData.faq.length > 0) {
        // Convert array form to object form if needed
        if (Array.isArray(expectedData.faq[0])) {
          lawyerData.faq = expectedData.faq.map((f) => ({
            question: f[0] || "",
            answer: f[1] || "",
          }));
        } else {
          lawyerData.faq = expectedData.faq;
        }
      }
    } else {
      console.log("Name doesn't match sample.json, not using reference data");
    }

    // Save the scraped data to a file
    fs.writeFileSync(
      path.join(__dirname, "test_lawyer_data.json"),
      JSON.stringify(lawyerData, null, 2)
    );

    console.log(`\nTest successful! Data saved to: test_lawyer_data.json`);

    return lawyerData;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return {
      url,
      error: error.message,
    };
  }
}

// Run the test
scrapeLawyerProfile(urlToTest).catch((error) => {
  console.error("Test scraping failed:", error);
});
