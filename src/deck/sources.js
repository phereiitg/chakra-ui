/**
 * Every source, in one place.
 *
 * Links and captions live here rather than inside components, so a broken URL
 * is fixed once. `shot` points at a screenshot under public/sources/ — drop the
 * file in and the card renders it inside a window frame; leave it out and the
 * card falls back to a document sketch. Either way the link works.
 */

/**
 * The papers, grouped.
 *
 * These render as one window with a live link per row rather than five
 * screenshots of near-identical arXiv abstract pages.
 */
export const PAPERS = [
  { id: '2601.22569', href: 'https://arxiv.org/abs/2601.22569',
    title: 'Whispers of Wealth — red-teaming Google\u2019s AP2',
    gave: 'The attack we reproduce. 100% success on ranking manipulation.' },
  { id: '2607.21824', href: 'https://arxiv.org/abs/2607.21824',
    title: 'Protocol-Level Attacks on Agentic Commerce Platforms (AIP-Bench)',
    gave: '33 vulnerabilities; the structural-versus-semantic split we use as a taxonomy axis.' },
  { id: '2604.13125', href: 'https://arxiv.org/abs/2604.13125',
    title: 'Synthetic Tabular Generators Fail to Preserve Behavioral Fraud Patterns',
    gave: 'The proof that row-independent generators cannot produce ring structure.' },
  { id: '2602.06345', href: 'https://arxiv.org/abs/2602.06345',
    title: 'Zero-Trust Runtime Verification for Agentic Payment Protocols',
    gave: 'Names the gap our intent head fills — it cannot stop a valid mandate used for a malicious purpose.' },
  { id: '2602.09222', href: 'https://arxiv.org/abs/2602.09222',
    title: 'MUZZLE — adaptive agentic red-teaming (USENIX Security 2026)',
    gave: 'Prior art for the closed search loop. We cite the pattern rather than claim it.' },
]

export const SOURCES = [
  {
    id: 'f3',
    tint: '#A78BFA',
    title: 'MITRE Fight Fraud Framework v1.1',
    host: 'github.com',
    path: '/center-for-threat-informed-defense/fight-fraud-framework',
    href: 'https://github.com/center-for-threat-informed-defense/fight-fraud-framework',
    meta: 'April 2026 · 8 tactics · 74 techniques · 49 sub-techniques',
    gave: 'The technique IDs. Every vector we hold maps to a real F3 code, and the 28 we added are namespaced so nobody confuses them with the standard.',
    badge: 'the fraud vocabulary',
    shot: '/sources/f3.jpg',
  },
  {
    id: 'owasp',
    tint: '#38BDF8',
    title: 'OWASP Top 10 for Agentic Applications 2026',
    host: 'genai.owasp.org',
    path: '/resource/owasp-top-10-for-agentic-applications-for-2026/',
    href: 'https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/',
    meta: 'December 2025 · ASI01 – ASI10 · reviewed by JPMorgan, ABN AMRO, AWS',
    gave: 'Ten classes of agent attack with real incidents attached, and the mitigation pattern our intent head implements as a detection signal rather than a control.',
    badge: 'agent attack classes',
    shot: '/sources/owasp.jpg',
  },
  {
    id: 'ap2',
    tint: '#34D399',
    title: 'AP2 Security and Privacy Considerations',
    host: 'ap2-protocol.org',
    path: '/ap2/security_and_privacy_considerations/',
    href: 'https://ap2-protocol.org/ap2/security_and_privacy_considerations/',
    meta: 'Google · agent payments protocol documentation',
    gave: 'A threat list written by the engineers who built the protocol, including mandate theft and replay. They concede preventing prompt injection is currently infeasible.',
    badge: 'threats named by its authors',
    shot: '/sources/ap2.jpg',
  },
  {
    id: 'rbi',
    tint: '#FBBF24',
    title: 'Exploring Safeguards in Digital Payments to Curb Frauds',
    host: 'rbi.org.in',
    path: '/Scripts/PublicationsView.aspx?id=23810',
    href: 'https://www.rbi.org.in/Scripts/PublicationsView.aspx?id=23810',
    meta: 'Reserve Bank of India · discussion paper · 10 April 2026',
    gave: 'What India\u2019s regulator says is actually happening, and four proposed controls we attack directly — the one-hour lag, the trusted person, the credit ceiling, the kill switch.',
    badge: 'regulator findings',
    shot: '/sources/rbi.jpg',
  },
  {
    id: 'echoleak',
    tint: '#FB7185',
    title: 'CVE-2025-32711 — EchoLeak',
    host: 'nvd.nist.gov',
    path: '/vuln/detail/CVE-2025-32711',
    href: 'https://nvd.nist.gov/vuln/detail/CVE-2025-32711',
    meta: 'CVSS 9.3 · the first known zero-click attack on an AI agent',
    gave: 'Evidence that agent compromise is not hypothetical. It anchors the N0 grade — this one happened to somebody.',
    badge: 'happened to somebody',
    shot: '/sources/echoleak.jpg',
  },
]

/** The six shown on the walkthrough step; the rest live on the sources page. */
/** The five that get a screenshot. Papers render from PAPERS instead. */
export const HEADLINE = ['f3', 'owasp', 'ap2', 'rbi', 'echoleak']
