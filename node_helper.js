const NodeHelper = require("node_helper")
const axios = require("axios")
const cheerio = require("cheerio")

module.exports = NodeHelper.create({
  start() {
    console.log("MMM-PinterestMosaic node_helper started...")
  },

  /**
   * Scrape Pinterest for images
   * @param {string} pinterestBoardURL - The URL of the Pinterest board
   */
  scrapePinterestImages(pinterestBoardURL) {
    axios.get(pinterestBoardURL)
      .then((response) => {
        const $ = cheerio.load(response.data) // Load the HTML content with Cheerio
        const imageUrls = []

        // Loop through all <img> tags to find valid image URLs
        $("img").each((i, element) => {
          // Get the srcset attribute (which contains multiple image sizes)
          const srcset = $(element).attr("srcset")

          if (srcset) {
            // Extract the largest image from the srcset (the highest resolution)
            const srcsetUrls = srcset.split(", ") // Split into multiple sizes
            const largestUrl = srcsetUrls[srcsetUrls.length - 1].split(" ")[0] // Get the last (largest) URL

            // Check if it's a valid image URL and not a profile or small image
            if (largestUrl && largestUrl.includes("originals")) {
              imageUrls.push(largestUrl) // Add the highest res URL to the array
            }
          }
        })

        // Log the list of image URLs scraped
        console.log("Scraped images:", imageUrls)

        // Send the list of image URLs back to the frontend module
        this.sendSocketNotification("PINTEREST_IMAGES", imageUrls)
      })
      .catch((error) => {
        console.error("Error scraping Pinterest:", error)
      })
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "FETCH_PINTEREST_IMAGES") {
      this.scrapePinterestImages(payload.pinterestBoardURL) // Pass the URL from the frontend
    }
  }
})
