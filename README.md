# 🖼️ Background Remover

Remove image backgrounds **directly in the browser** using AI — **no backend required**.

This project demonstrates running **Hugging Face Transformers.js models** fully client-side for fast, private image processing.

---

## 🚀 Features

* 🧠 AI-powered background removal
* ⚡ 100% client-side — no API keys or server required
* 📁 Upload PNG/JPG images
* ⏳ Loading indicator during processing
* 🎨 Clean UI with styled buttons and responsive layout
* 📦 Built with **Vite** for fast development

---

## 🖥️ Demo (Local)

1. Clone the repository:

```bash
git clone git@github.com:gallaouim/bg-remover.git
cd bg-remover
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open in your browser:

```
http://localhost:5173
```

---

## 📂 Project Structure

```
bg-remover/
├── index.html       # Main HTML page
├── src/
│   ├── main.js      # App initialization
│   ├── app.js       # Model loading & background removal logic
│   └── style.css    # Styles for UI
└── vite.config.js   # Vite configuration
```

---

## 🛠️ Technologies

* **Vite** — fast development server and bundler
* **Transformers.js** — run Hugging Face models in the browser
* **ONNX Runtime Web** — model inference
* **Vanilla JS / HTML / CSS** — lightweight and simple

---

## 🤖 Model

Uses a segmentation model compatible with:

```js
import { AutoModel, AutoProcessor } from "@huggingface/transformers";
```

* Model runs **entirely in the browser**.
* No backend or external API calls needed.

---

## 📸 How It Works

1. User uploads an image
2. Transformers.js preprocesses the image
3. Model segments foreground from background
4. Background is removed
5. Output image is rendered on the page

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

* `dist/` folder contains the production-ready app

---

## 🧩 Future Improvements

* Drag & drop image support
* Export with custom background colors or images
* GPU acceleration (WebGPU)
* Undo / history for edits

---

## 📝 License

MIT License — free for personal and commercial use.

---

## ❤️ Contributing

Pull requests are welcome! Improve performance, UI, or add new features.
