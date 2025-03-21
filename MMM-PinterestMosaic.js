Module.register("MMM-PinterestMosaic", {
  defaults: {
    pinterestBoardURL: "", // Pinterest board URL to be passed from config
  },

  /**
   * Apply the default styles.
   */
  getStyles() {
    return ["pinterestmosaic.css"] // Include the CSS for layout and styling
  },

  /**
   * Pseudo-constructor for our module. Initialize stuff here.
   */
  start() {
    this.imageURLs = [] // Initialize the imageURLs array to store the URLs

    // Check if pinterestBoardURL is provided in the config
    if (this.config.pinterestBoardURL) {
      this.loadPinterestImages() // Start loading the images if a URL is provided
    } else {
      console.error("Pinterest board URL not provided in the config.")
    }
  },

  /**
   * Request Pinterest images from the node helper.
   */
  loadPinterestImages() {
    this.sendSocketNotification("FETCH_PINTEREST_IMAGES", { pinterestBoardURL: this.config.pinterestBoardURL })
  },

  /**
   * Handle notifications received by the node helper.
   * So we can communicate between the node helper and the module.
   *
   * @param {string} notification - The notification identifier.
   * @param {any} payload - The payload data returned by the node helper.
   */
  socketNotificationReceived: function (notification, payload) {
    if (notification === "PINTEREST_IMAGES") {
      this.imageURLs = payload // Store the scraped image URLs
      this.updateDom() // Update the DOM once the images are fetched
    }
  },

  /**
   * Render the page we're on.
   */
  getDom() {
    const wrapper = document.createElement("div")

    // Create a grid of images using the URLs fetched
    const mosaicWrapper = document.createElement("div")
    mosaicWrapper.classList.add("pinterest-mosaic")

    this.imageURLs.forEach((url) => {
      const img = document.createElement("img")
      img.src = url
      img.classList.add("mosaic-image")
      mosaicWrapper.appendChild(img)
    })

    wrapper.appendChild(mosaicWrapper) // Append the mosaic grid to the wrapper

    return wrapper // Return the DOM structure
  },

  /**
   * This is the place to receive notifications from other modules or the system.
   * We can use this if we need to listen for any specific Magic Mirror notifications.
   *
   * @param {string} notification The notification ID, it is preferred that it prefixes your module name
   * @param {number} payload the payload type.
   */
  notificationReceived(notification, payload) {
    // Handle any notifications received from other modules if needed
    if (notification === "TEMPLATE_RANDOM_TEXT") {
      this.templateContent = `${this.config.exampleContent} ${payload}`
      this.updateDom()
    }
  }
})
