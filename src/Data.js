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

export const INITIAL_MS = {
  python: [
    { tx: 'Installed Python, ran a print statement', lv: 1, done: true },
    { tx: 'Understand variables, loops, if/else', lv: 2, done: true },
    { tx: 'Write and call my own functions', lv: 3, done: true },
    { tx: 'Built a small complete project', lv: 4, done: true },
    { tx: 'Work with files and external libraries', lv: 5, done: false },
    { tx: 'Understand OOP — classes and inheritance', lv: 6, done: false },
    { tx: 'Built a web scraper or data pipeline', lv: 7, done: false },
    { tx: 'Contributed to a real codebase', lv: 8, done: false },
    { tx: 'Writes clean, tested, documented code', lv: 9, done: false },
    { tx: 'Designs systems, deep library knowledge', lv: 10, done: false },
  ],
  design: [
    { tx: 'Know what Figma is, created an account', lv: 1, done: true },
    { tx: 'Create shapes, text, basic frames', lv: 2, done: true },
    { tx: 'Recreated an existing UI from a screenshot', lv: 3, done: true },
    { tx: 'Designed a login screen independently', lv: 4, done: false },
    { tx: 'Uses components and design systems', lv: 5, done: false },
    { tx: 'Designed a full app flow', lv: 6, done: false },
    { tx: 'Ran user research, iterated on feedback', lv: 7, done: false },
    { tx: 'Shipped a real product to real users', lv: 8, done: false },
    { tx: 'Creates and maintains a design system', lv: 9, done: false },
    { tx: 'Defines design direction for a team', lv: 10, done: false },
  ],
  speaking: [
    { tx: 'Aware of the fear, willing to try', lv: 1, done: true },
    { tx: 'Spoke once in class without freezing', lv: 2, done: true },
    { tx: 'Gave a 2-min intro without notes', lv: 3, done: false },
    { tx: 'Completed a 5-min structured talk', lv: 4, done: false },
    { tx: 'Presented to 20+ people confidently', lv: 5, done: false },
    { tx: 'Handled Q&A without panic', lv: 6, done: false },
    { tx: 'Gave a talk at a college event', lv: 7, done: false },
    { tx: 'Trained others in speaking', lv: 8, done: false },
    { tx: 'Speaks regularly at external events', lv: 9, done: false },
    { tx: 'Keynote or TEDx-level delivery', lv: 10, done: false },
  ],
};

export const INITIAL_SD = [
  { id: 'python', nm: 'Python', ic: '🐍', lv: 4, tgt: 7, ents: 34, pts: 136, stk: 21, bc: 'rgba(184,232,48,.14)', bt: '#96C020' },
  { id: 'design', nm: 'UI Design', ic: '🎨', lv: 3, tgt: 6, ents: 18, pts: 62, stk: 14, bc: 'rgba(40,152,216,.12)', bt: '#2898D8' },
  { id: 'speaking', nm: 'Speaking', ic: '🎤', lv: 2, tgt: 5, ents: 9, pts: 24, stk: 7, bc: 'rgba(136,120,232,.12)', bt: '#8878E8' },
];

export const INITIAL_ENTRIES = [
  { sk: 'Python', tp: 'built', nt: 'Built a CLI to-do app using lists and file storage', pts: 4, dt: 'Today' },
  { sk: 'Python', tp: 'solved', nt: 'Solved 3 LeetCode easy problems independently', pts: 3, dt: 'Yesterday' },
  { sk: 'UI Design', tp: 'taught', nt: 'Explained typography rules to my roommate', pts: 5, dt: '2 days ago' },
  { sk: 'Python', tp: 'read', nt: 'Read about decorators in Real Python', pts: 1, dt: '3 days ago' },
  { sk: 'Speaking', tp: 'built', nt: 'Recorded myself speaking and watched it back', pts: 4, dt: '4 days ago' },
];

export const AI_REPLIES = [
  "That's a common hurdle. Try breaking it down into smaller parts and solving just one piece today.",
  "Consider building a tiny project around that concept. Output solidifies knowledge faster than reading.",
  "If you're stuck, the best thing is to step away for 10 minutes. The brain processes better in background mode.",
  "That sounds like a great topic to teach someone else. Teaching forces you to understand the gaps in your knowledge.",
  "Don't worry about perfect code or design right now. Just get it to work, then iterate.",
  "Have you tried looking at how popular open-source projects handle this?"
];
