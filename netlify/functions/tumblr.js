export const config = {
  schedule: "0 * * * *"
};

export async function handler(event, context) {
  try {
    const res = await fetch("https://djrenard.tumblr.com/rss");
    const text = await res.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/xml",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600"
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