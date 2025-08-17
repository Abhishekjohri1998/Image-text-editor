import '@/styles/globals.css'

export const metadata = {
  title: 'Image Text Composer',
  description: 'Desktop-only editor to overlay text on PNG images.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
