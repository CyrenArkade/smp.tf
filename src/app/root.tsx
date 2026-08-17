import App from './App';
import './style.css'

export function Root({ url }: { url: URL }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + RSC</title>
      </head>
      <body style={{ backgroundColor: "#3c315d" }}>
        <App/>
      </body>
    </html>
  )
}

