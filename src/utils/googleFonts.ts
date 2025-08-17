export class GoogleFontsLoader {
  // Replace with your actual Google Fonts API key!
  static GOOGLE_FONTS_API = 'https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyDiZrIs77e_ylzTlhwiGlEjJf3kzEt1ZSQ';

  // Fetches all Google font family names (sorted by popularity)
  static async loadFontFamilies(): Promise<string[]> {
    try {
      const response = await fetch(GoogleFontsLoader.GOOGLE_FONTS_API);
      if (!response.ok) throw new Error('Failed to fetch Google Fonts');
      const data = await response.json();
      return data.items.map((font: any) => font.family);
    } catch (err) {
      console.error('Error loading Google Fonts:', err);
      // Fallback to a static list
      return [
        'Arial',
        'Roboto',
        'Open Sans',
        'Montserrat',
        'Lato',
        'Noto Sans',
        'Poppins',
        'Source Sans Pro',
        'Raleway',
        'Merriweather',
        'Ubuntu',
        'Nunito',
        'PT Sans',
        'Oswald',
        'Work Sans'
      ];
    }
  }

  // Dynamically loads any Google font via <link> tag
  static loadFont(fontFamily: string) {
    if (!fontFamily) return;
    const fontUrlName = encodeURIComponent(fontFamily.replace(/ /g, '+'));
    const linkId = `google-font-link-${fontUrlName}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css?family=${fontUrlName}:400,700&display=swap`;
      document.head.appendChild(link);
    }
  }
}
