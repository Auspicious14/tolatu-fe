import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content="Effortless Text to Speech" />
      <meta name="author" content="Abdulganiyu Uthman - Auspicious" />
      <meta name="keywords" content="text to speech, TTS, AI voice, speech synthesis, audio generation, image to speech" />
      <meta name="robots" content="index, follow" />
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
