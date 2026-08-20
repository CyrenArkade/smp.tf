import App from './App';
import './style.css';

export function Root({ url }: { url: URL }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="smp.tf" />
        <link rel="manifest" href="/favicon/site.webmanifest" />

        <title>smp.theflight</title>
      </head>
      <body style={{ backgroundColor: "#3c315d" }}>
        <App url={url} />
      </body>
    </html>
  )
}

