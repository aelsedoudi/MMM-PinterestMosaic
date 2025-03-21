Module.register("MMM-PinterestMosaic", {
  defaults: {
    pinterestBoardURL: "", // Default is empty, to be provided by config.js
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
    this.imageURLs = []; // Initialize the imageURLs array to store the URLs

    // Check if pinterestBoardURL is provided in the config
    if (this.config.pinterestBoardURL) {
      this.loadPinterestImages() // Start loading the images if a URL is provided
    } else {
      console.error("Pinterest board URL not provided in the config.")
    }
  },

  /**
   * Fetch Pinterest images.
   * In this example, it's hardcoded; you can replace this with actual API fetching logic.
   */
  loadPinterestImages() {
    // Simulating fetching Pinterest images (replace with real Pinterest API or scraping logic)
    this.imageURLs = [
      "https://via.placeholder.com/200x200?text=Image1",
      "https://via.placeholder.com/200x200?text=Image2",
      "https://via.placeholder.com/200x200?text=Image3",
      "https://via.placeholder.com/200x200?text=Image4",
      // Add more image URLs here
    ];

    console.log("Pinterest images loaded from board:", this.config.pinterestBoardURL)

    this.updateDom() // Update the DOM once the images are fetched
  },

  /**
   * Handle notifications received by the node helper.
   * So we can communicate between the node helper and the module.
   *
   * @param {string} notification - The notification identifier.
   * @param {any} payload - The payload data returned by the node helper.
   */
  socketNotificationReceived: function (notification, payload) {
    if (notification === "EXAMPLE_NOTIFICATION") {
      this.templateContent = `${this.config.exampleContent} ${payload.text}`
      this.updateDom()
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
    });

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
