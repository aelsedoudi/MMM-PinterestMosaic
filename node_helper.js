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

        $("img[src]").each((i, element) => {
          const imageUrl = $(element).attr("src")

          // Log each image URL
          console.log(`Found image URL: ${imageUrl}`)

          if (imageUrl && imageUrl.includes("236x")) { // Filter for larger image URLs
            imageUrls.push(imageUrl)
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
