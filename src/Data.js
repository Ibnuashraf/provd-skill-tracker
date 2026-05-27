export const QUOTES = [
  { q: '"The secret of getting ahead is getting started."', a: '— Mark Twain' },
  { q: '"You don\'t have to be great to start, but you have to start to be great."', a: '— Zig Ziglar' },
  { q: '"Skills are built one logged entry at a time."', a: '— Provd' },
  { q: '"An investment in knowledge pays the best interest."', a: '— Benjamin Franklin' },
  { q: '"Consistency is the hallmark of the unimaginative."', a: '— Oscar Wilde' },
  { q: '"Do something today that your future self will thank you for."', a: '— Sean Patrick Flanery' },
  { q: '"The expert in anything was once a beginner."', a: '— Helen Hayes' },
  { q: '"Learning never exhausts the mind."', a: '— Leonardo da Vinci' },
];

export const LEVEL_NAMES = [
  { n: 1, name: 'Absolute Zero', desc: 'Just getting started', ic: '🌑' },
  { n: 2, name: 'First Light', desc: 'Exploring basics', ic: '🌒' },
  { n: 3, name: 'Early Builder', desc: 'Making first things', ic: '🔨' },
  { n: 4, name: 'Consistent Learner', desc: 'Showing up daily', ic: '🌱' },
  { n: 5, name: 'Solid Intermediate', desc: 'Getting real work done', ic: '⚙️' },
  { n: 6, name: 'Confident Maker', desc: 'Building independently', ic: '🔧' },
  { n: 7, name: 'Deep Practitioner', desc: 'Teaching-ready', ic: '🌊' },
  { n: 8, name: 'Competent Pro', desc: 'Shipping real work', ic: '🚀' },
  { n: 9, name: 'Near Expert', desc: 'Mentoring others', ic: '🎓' },
  { n: 10, name: 'Mastery', desc: 'Deep knowledge', ic: '🏔️' },
];

export const INITIAL_ACHS = [
  { ic: '✨', nm: 'First Spark', rq: 'Log your first entry', un: true },
  { ic: '🔍', nm: 'Curious Mind', rq: 'Log 5 entries', un: true },
  { ic: '🔨', nm: 'The Builder', rq: '10 Built-tagged entries', un: true },
  { ic: '🔥', nm: 'Week Warrior', rq: '7-day streak', un: true },
  { ic: '💥', nm: 'Three Week Run', rq: '21-day streak', un: true },
  { ic: '⚡', nm: 'Unstoppable', rq: '60-day streak', un: false },
  { ic: '🌱', nm: 'Sprouting', rq: 'Reach level 3', un: true },
  { ic: '🌿', nm: 'Growing Deep', rq: 'Reach level 5', un: false },
  { ic: '🌳', nm: 'The Oak', rq: 'Reach level 7', un: false },
  { ic: '🏔️', nm: 'Summit', rq: 'Reach level 10', un: false },
  { ic: '🎓', nm: 'The Teacher', rq: '5 Taught entries', un: false },
  { ic: '💯', nm: 'Century Club', rq: '100 total entries', un: false },
];

export const INITIAL_MS = {};

export const INITIAL_SD = [];

export const INITIAL_ENTRIES = [];

export const AI_REPLIES = [
  "That's a common hurdle. Try breaking it down into smaller parts and solving just one piece today.",
  "Consider building a tiny project around that concept. Output solidifies knowledge faster than reading.",
  "If you're stuck, the best thing is to step away for 10 minutes. The brain processes better in background mode.",
  "That sounds like a great topic to teach someone else. Teaching forces you to understand the gaps in your knowledge.",
  "Don't worry about perfect code or design right now. Just get it to work, then iterate.",
  "Have you tried looking at how popular open-source projects handle this?"
];
