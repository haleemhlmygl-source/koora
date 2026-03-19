default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    const path = req.query.path || "";
    const url = "https://v3.football.api-sports.io/" + path;
    try {
        const r = await fetch(url, {
            headers: { "x-apisports-key": "9e21494c49c75f64c6b7149ca8671fd4" }
        });
        const data = await r.json();
        res.status(200).json(data);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}
