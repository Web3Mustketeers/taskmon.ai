import Head from "next/head";

function CustomHead() {
  return (
    <Head>
      {/* <link
        href="/assets/android-chrome-192x192.png"
        rel="apple-touch-icon"
        sizes="192x192"
      /> */}
      <link
        href="/assets/android-chrome-512x512.png"
        rel="apple-touch-icon"
        sizes="512x512"
      />
      <link
        href="/assets/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />

      <link
        href="/assets/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
      <link
        href="/assets/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="/assets/favicon.ico"
        rel="icon"
        sizes="48x48"
        type="image/png"
      />
      <link href="/assets/site.webmanifest" rel="manifest" />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <meta name="theme-color" content="#000000" />
      <meta
        name="description"
        content="Taskmon.ai is a  Task Management System with AI PMO is a project management tool that uses machine learning algorithms to analyze data and make predictions about project outcomes. It helps project managers to prioritize tasks, improve resource allocation, and increase productivity."
      />
      <title>Taskmon.ai</title>
    </Head>
  );
}

export default CustomHead;
