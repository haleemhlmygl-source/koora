const API_KEY = 'a2388962a5e2454c87c909d662a32188';
const API_BASE = 'https://api.football-data.org';

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    const url = new URL(request.url);
    const apiUrl = API_BASE + url.pathname + url.search;

    try {
      const apiResponse = await fetch(apiUrl, {
        headers: { 'X-Auth-Token': API_KEY }
      });
      const data = await apiResponse.json();
      return new Response(JSON.stringify(data), {
        status: apiResponse.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=60',
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
};
