# Image Text Composer

A web application to layer fully customizable text on top of any PNG or JPEG image, supporting edit, styling, layer ordering, export to PNG, and full Google Fonts integration—all in your browser. Built as part of the Adomate Full-Stack Engineer Remote Challenge.

---

## 🚀 Features

- **Image Upload:** Use any PNG or JPEG—canvas auto-matches aspect ratio and size.
- **Add/Edit Text Layers:** Multiple layers, each with independent style and positioning.
- **Text Styling:** Choose from all Google Fonts, set font size, weight, color, alignment, opacity, and edit multi-line content.
- **Transform Layers:** Drag to move, use handles to resize/rotate, snap-to-center guides, and layer/reorder text as needed.
- **Layer Management:** Sidebar allows you to select, rename, reorder, or delete layers.
- **Undo/Redo:** Unlimited step-by-step undo/redo history with visible indicators.
- **Autosave & Restore:** Work automatically saves to your browser and reloads on refresh.
- **Export as PNG:** Download final composition at original photo resolution with all overlays.
- **Mobile/Tablet/Desktop:** Fully responsive and works on all devices, including touch.

---

## 🛠️ Architecture & Tech Choices

- **Next.js App Router:** Page structure, fast SSR, code-splitting.
- **TypeScript:** Safety and maintainability.
- **Fabric.js:** Robust, interactive canvas with text/image layers and object transforms.
- **Zustand:** Simple, fast, reliable global state management and time travel (undo/redo).
- **Tailwind CSS:** Utility classes for rapid, consistent, responsive design.
- **Google Fonts API:** Live font picker, font loading for reliable displays.

### Directory Structure

- `/src/app` — Next.js top-level layouts/pages
- `/src/components` — All UI building blocks (toolbar, layer list, font panel)
- `/src/store` — Zustand logic and undo/redo handling
- `/src/styles` — Tailwind CSS and custom CSS

---

## ⚡ Deployment

**Live Demo:**  
[https://image-text-editor-beta.vercel.app](https://image-text-editor-beta.vercel.app)

**Source Code:**  
[https://github.com/Abhishekjohri1998/Image-text-editor](https://github.com/Abhishekjohri1998/Image-text-editor)

---

## 🧑‍💻 How to Use

1. **Upload:** Click "Choose File", select any PNG (or JPEG) image.
2. **Add Text:** Use the left panel to add new text layers.
3. **Edit & Move:** Drag, resize, rotate, change font/style, and type multi-line text using the right panel.
4. **Manage Layers:** Use the layer panel to reorder or delete text elements.
5. **Undo/Redo:** Robust undo/redo with navigation in the top toolbar.
6. **Autosave:** Refresh and return—your latest canvas reloads automatically.
7. **Export:** Download your composition as PNG (at original image resolution).

---

## 💡 Tech Notes & Tradeoffs

- **Fabric.js**: Chosen for deep layer transforms, precise canvas controls, and mature library support.
- **Zustand**: Chosen for simplicity/clarity over Redux—makes undo/redo flows easier to read and extend.
- **Tailwind CSS**: Utility-first styling for rapid iteration and easy mobile/desktop switches.
- **Browser Only**: All logic runs client-side for privacy, speed, and security—no backend required.
- **Full Google Fonts Integration**: Every Google font is available and loads instantly on selection.

---

## ✨ Bonus Features (if implemented)

- [ ] Custom font upload (.ttf/.otf/.woff)
- [ ] Multi-select and group transforms
- [ ] Smart spacing hints
- [ ] Line-height and letter-spacing editing
- [ ] Lock/Unlock or duplicate layers
- [ ] Text shadow, curving, or advanced effects

(*This version implements only the core features—feel free to tick boxes if you add more!*)

---

## 🧩 Known Limitations

- No bonus features or advanced text effects (see above) in this version.
- Image export resolution always matches original upload size—no downscaling.
- Minimal accessibility testing; some controls may be more mouse/touch friendly.
- Works on mobile, but best UX is on desktop/tablet for precision.
- No login—editor is stateless except for local autosave.

---

## 📦 Getting Started Locally

Clone & install dependencies:

