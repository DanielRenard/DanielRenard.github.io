export async function handler() {
  try {
    const res = await fetch("https://djrenard.tumblr.com/rss");
    const text = await res.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/xml",
        "Access-Control-Allow-Origin": "*",
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Error fetching Tumblr RSS",
    };
  }
}