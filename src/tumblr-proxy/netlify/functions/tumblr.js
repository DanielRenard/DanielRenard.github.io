export async function handler() {
  try {
    const response = await fetch("https://djrenard.tumblr.com/rss");
    const text = await response.text();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/xml",
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to fetch Tumblr RSS",
    };
  }
}