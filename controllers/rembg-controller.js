const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function getRembgPage(req, res) {
  res.render("customer/rembg");
}

// Upload Image
async function getImageUpload(req, res) {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    res.render("transform", {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width || null, // Ensure width is defined
      height: result.height || null, // Ensure height is defined
      transformedUrl: null,
      transformedWidth: null,
      transformedHeight: null,
    });
  } catch (error) {
    res.status(500).send("Upload failed: " + error.message);
  }
}

// routerly Transformations
async function removeBackground(req, res) {
  const { publicId, transformation, width, height } = req.body;

  let transformedUrl = "";
  let transformedWidth = width || null;
  let transformedHeight = height || null;

  switch (transformation) {
    case "resize":
      transformedWidth = 300;
      transformedHeight = 300;
      transformedUrl = cloudinary.url(publicId, {
        width: transformedWidth,
        height: transformedHeight,
        crop: "scale",
      });
      break;
    case "grayscale":
      transformedUrl = cloudinary.url(publicId, { effect: "grayscale" });
      break;
    case "rotate":
      transformedUrl = cloudinary.url(publicId, { angle: 90 });
      break;
    default:
      return res.status(400).send("Invalid transformation selected.");
  }

  res.render("transform", {
    imageUrl: cloudinary.url(publicId),
    publicId,
    width, // Keep original width
    height, // Keep original height
    transformedUrl,
    transformedWidth,
    transformedHeight,
  });
}

// Download Transformed Image
async function getDownload(req, res) {
  const { imageUrl } = req.query;

  try {
    const response = await fetch(imageUrl); // Fetch the image
    const buffer = await response.arrayBuffer(); // Convert response to buffer

    const fileName = "transformed_image.jpg";
    const filePath = path.join(__dirname, fileName);

    // Write the image to a file
    fs.writeFileSync(filePath, Buffer.from(buffer));

    // Send the file as a download
    res.download(filePath, fileName, () => {
      fs.unlinkSync(filePath); // Delete the file after download
    });
  } catch (error) {
    res.status(500).send("Error downloading image: " + error.message);
  }
}

module.exports = {
  getRembgPage: getRembgPage,
  removeBackground: removeBackground,
  getImageUpload: getImageUpload,
  getDownload: getDownload,
};
