import { Head, Html, Main, NextScript } from 'next/document';

export default function MyDocument() {
  console.log('document is running');
  return (
    <Html>
      <Head lang="ko">
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
