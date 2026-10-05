// Vercel serverless function: proxies the free Arbeitnow job board API (no key needed),
// filters for data, ML, software and DevOps roles and caches the result for an hour.
const ARB = 'https://www.arbeitnow.com/api/job-board-api';
const REL = /data scien|data engineer|data analy|machine learning|\bml\b|\bai\b|mlops|nlp|python|software|backend|back-end|full.?stack|developer|devops|\bsre\b|cloud|kubernetes|platform engineer/i;
const strip = h => String(h || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
const short = s => (s.length > 190 ? s.slice(0, 187).trimEnd() + '...' : s);

function normalise(pages) {
  const seen = new Set();
  return pages
    .flatMap(p => (p && p.data) || [])
    .filter(j => j && j.slug && !seen.has(j.slug) && seen.add(j.slug))
    .filter(j => REL.test((j.title || '') + ' ' + (j.tags || []).join(' ')))
    .map(j => ({
      id: j.slug, title: j.title, company: j.company_name, loc: j.location, remote: !!j.remote,
      type: (j.job_types || [])[0] || '', tags: j.tags || [], posted: j.created_at, url: j.url,
      sum: short(strip(j.description)),
    }))
    .sort((a, b) => b.posted - a.posted)
    .slice(0, 18);
}

module.exports = async (req, res) => {
  try {
    const pages = await Promise.all([1, 2, 3].map(p =>
      fetch(ARB + '?page=' + p).then(r => (r.ok ? r.json() : { data: [] })).catch(() => ({ data: [] }))));
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json({ jobs: normalise(pages) });
  } catch (e) {
    res.status(502).json({ error: 'upstream unavailable' });
  }
};
module.exports.normalise = normalise;
