// Handle image upload
const imageUploadInput = document.getElementById("dropzone-file");
const inputImagePreview = document.getElementById("inputImagePreview");
const outputImagePreview = document.getElementById("outputImagePreview");
const outputImageSection = document.getElementById("outputImageSection");
const buttonsSection = document.getElementById("buttonsSection");
const downloadBtn = document.getElementById("downloadBtn");
const undoBtn = document.getElementById("undoBtn");

// Handle file selection
imageUploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      inputImagePreview.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Handle background removal
async function removeBackground(imgSource) {
  try {
    const formData = new FormData();
    formData.append("image", imgSource);

    // Assuming you have a backend endpoint for removing background
    const response = await fetch("/remove-background", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error removing background");
    }

    const resultDataURL = await response.text(); // Assuming the server returns the data URL
    outputImagePreview.src = resultDataURL;

    // Show the result and buttons
    outputImageSection.style.display = "block";
    buttonsSection.style.display = "flex";
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Handle image removal (undo)
undoBtn.addEventListener("click", () => {
  outputImagePreview.src = "";
  outputImageSection.style.display = "none";
  buttonsSection.style.display = "none";
});

// Handle download
downloadBtn.addEventListener("click", () => {
  const dataURL = outputImagePreview.src;
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "output.png";
  link.click();
});

// Optional: Trigger background removal after image upload
imageUploadInput.addEventListener("change", () => {
  if (imageUploadInput.files[0]) {
    removeBackground(imageUploadInput.files[0]);
  }
});
