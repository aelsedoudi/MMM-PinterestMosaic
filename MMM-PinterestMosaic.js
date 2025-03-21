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
  socketNotificationReceived(notification, payload) {
    if (notification === "PINTEREST_IMAGES") {
      console.log("Received Pinterest images:", payload) // Log the received images
      this.images = payload // Store the images in the module's state
      this.updateDom()
    }
  },

  /**
   * Render the page we're on.
   */
  getDom() {
    const wrapper = document.createElement("div")
    if (this.images && this.images.length > 0) {
      // Create a container for the image mosaic
      const mosaicContainer = document.createElement("div")
      mosaicContainer.style.display = "grid"
      mosaicContainer.style.gridTemplateColumns = "repeat(auto-fill, minmax(100px, 1fr))"
      mosaicContainer.style.gap = "5px"

      // Loop through the images and create image elements
      this.images.forEach((imageUrl) => {
        const img = document.createElement("img")
        img.src = imageUrl
        img.style.width = "100%" // Make the image fill its container
        img.style.height = "auto"
        mosaicContainer.appendChild(img)
      })

      wrapper.appendChild(mosaicContainer)
    } else {
      wrapper.innerHTML = "<p>No images found.</p>"
    }

    return wrapper
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
