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

        // Look for image elements with Pinterest's typical structure
        $("img[src]").each((i, element) => {
          const imageUrl = $(element).attr("src")

          // We only want to add the larger image URLs (Pinterest stores them in various sizes)
          if (imageUrl && imageUrl.includes("236x")) { // Filter for larger image URLs
            imageUrls.push(imageUrl)
          }
        })

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
