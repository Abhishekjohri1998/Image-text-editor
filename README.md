
Now open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Architecture & Tech Choices

- **Next.js App Router** for routing, page structure, and SSR optimizations.
- **TypeScript** for type safety and predictable, maintainable code.
- **Fabric.js** enables performant, interactive manipulation of text and canvas elements.
- **Zustand** for simple, performant global state and undo/redo logic.
- **Tailwind CSS** for rapid, utility-first, modern styling.
- **Google Fonts API** (front-end) for dynamic font lists and live font loading.

**Key Directories:**
- `/src/app` - Next.js app pages and layouts
- `/src/components` - All editor widgets (toolbar, layer list, property panel...)
- `/src/store` - Zustand global store, undo/redo, all editor state logic
- `/src/styles` - Tailwind + global styles

## ✨ Bonus Features (if implemented)
- [ ] Custom font upload (.ttf/.otf/.woff)
- [ ] Multi-select with group transforms
- [ ] Smart layer spacing hints
- [ ] Editable line height and letter spacing
- [ ] Lock/Unlock layers, duplicate layers
- [ ] Text shadow, warping, or curved text

*(Mark any that you implement!)*

## ⚡ Deployment

The app is hosted at:  
[https://your-vercel-demo-url.vercel.app](https://your-vercel-demo-url.vercel.app)

*(Replace this with your actual deployed URL!)*

## 🧑‍💻 How to Use

1. **Upload**: Click the upload button, select any PNG (or JPEG) image.
2. **Add text layers** using the sidebar input. Click "+" or press enter.
3. **Edit layers**: click a layer to select, drag to move, use blue handles to resize/rotate, type in property sidebar to change style and font.
4. **Reorder/delete layers**: Use the Layers panel left sidebar.
5. **Undo/redo**: Use the header buttons to step back or forward.
6. **Autosave**: Refresh or reopen—the last design reloads.
7. **Export PNG** to download your composite art.

## 💡 Tech Notes & Tradeoffs

- **Fabric.js** was chosen for production-grade canvas interactions and multi-layer support.
- **Zustand** simplifies global state and enables performant undo/redo for complex editor flows.
- **Tailwind** provides fast, responsive UI without excessive CSS bloat.
- **Google Fonts** support is integrated for exhaustive customization of text appearance.
- All image processing and state are browser-side; no backend is needed or required.

## 🧩 Known Limitations

- Mobile/touch interaction is **not supported** (desktop only, per brief).
- Currently only PNG/JPEG uploads (per spec; can add more if needed).
- Export always matches the original image’s resolution (per requirements; no downscaling/upscaling).
- No multi-select, text shadow, or advanced text effects unless implemented as bonus.
- No login/authentication; editor is stateless except for browser localStorage.

## 📄 License

MIT (or your choice)

---

*Built as part of the Adomate Full-Stack Remote Challenge, August 2025.*
