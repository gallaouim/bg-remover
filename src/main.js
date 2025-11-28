import { AutoModel, AutoProcessor, RawImage } from "@huggingface/transformers";

// Constants

// Reference the elements that we will need
const status = document.getElementById("status");
const fileUpload = document.getElementById("upload");
const imageContainer = document.getElementById("container");

// Load model and processor
status.textContent = "Loading model...";

const model = await AutoModel.from_pretrained("briaai/RMBG-1.4", {
  // Do not require config.json to be present in the repository
  config: { model_type: "custom" },
});

const processor = await AutoProcessor.from_pretrained("briaai/RMBG-1.4", {
  // Do not require config.json to be present in the repository
  config: {
    do_normalize: true,
    do_pad: false,
    do_rescale: true,
    do_resize: true,
    image_mean: [0.5, 0.5, 0.5],
    feature_extractor_type: "ImageFeatureExtractor",
    image_std: [1, 1, 1],
    resample: 2,
    rescale_factor: 0.00392156862745098,
    size: { width: 1024, height: 1024 },
  },
});

status.textContent = "Ready";



fileUpload.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();

  // Set up a callback when the file is loaded
  reader.onload = (e2) => predict(e2.target.result);

  reader.readAsDataURL(file);
});

// Predict foreground of the given image
async function predict(url) {
  status.textContent = "Analysing...";

  // Read image
  const image = await RawImage.fromURL(url);

  // Update UI
  imageContainer.innerHTML = "";
  imageContainer.style.backgroundImage = `url(${url})`;

  // Set container width and height depending on the image aspect ratio
  const ar = image.width / image.height;
  const [cw, ch] = ar > 720 / 480 ? [720, 720 / ar] : [480 * ar, 480];
  imageContainer.style.width = `${cw}px`;
  imageContainer.style.height = `${ch}px`;

  // Preprocess image
  const { pixel_values } = await processor(image);

  // Predict alpha matte
  const { output } = await model({ input: pixel_values });

  // Resize mask back to original size
  const mask = await RawImage.fromTensor(output[0].mul(255).to("uint8")).resize(
    image.width,
    image.height,
  );
  image.putAlpha(mask);

  // Create canvas and draw image
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image.toCanvas(), 0, 0);

  // Show processed image
  imageContainer.innerHTML = "";
  imageContainer.append(canvas);
  imageContainer.style.removeProperty("background-image");

  // Update status
  status.textContent = "Done!";

  // --- Buttons under status ---
  let buttonsContainer = document.getElementById("buttons-container");
  if (!buttonsContainer) {
    buttonsContainer = document.createElement("div");
    buttonsContainer.id = "buttons-container";
    buttonsContainer.style.marginTop = "10px";
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "10px";
    status.insertAdjacentElement("afterend", buttonsContainer);
  } else {
    buttonsContainer.innerHTML = ""; // reset if buttons already exist
  }

  // Retry button
  const retryBtn = document.createElement("button");
  retryBtn.textContent = "Retry";
  retryBtn.onclick = () => {
    imageContainer.innerHTML = `
      <label id="upload-button" for="upload">Click to upload image</label>
    `;
    fileUpload.value = "";
    status.textContent = "Ready";
    buttonsContainer.innerHTML = ""; // hide buttons
  };

  // Download button
  const downloadBtn = document.createElement("button");
  downloadBtn.textContent = "Download";
  downloadBtn.onclick = () => {
    const link = document.createElement("a");
    link.download = "processed-image.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  buttonsContainer.append(retryBtn, downloadBtn);
}
