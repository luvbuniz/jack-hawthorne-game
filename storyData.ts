import { StoryNode, QuizQuestion } from './types';

export const STORY_NODES: Record<string, StoryNode> = {
  'start': {
    id: 'start',
    title: 'London, 1851',
    content: `The year of the Great Exhibition. Smoke pours from the chimneys of factories. Trains rattle across iron bridges. The air smells like coal dust, oil, and industry. Queen Victoria rules over the largest empire the world has ever seen, and the city pulses with invention and ambition.

Jack Hawthorne, age twelve, watches it all from his attic window. Below, children not much older than him spill out of textile mills after a long day's shift. Jack's father, a mapmaker, often tells him how steam engines and machines are changing the world — but not always for the better.

One morning, Jack finds a torn piece of parchment tucked in an old atlas. It's marked with the initials "E.I.C." — the East India Company. Moments later, through the cracked glass of his window, Jack hears voices from the alley below: "Secrets… war plans… Persia."`,
    imagePrompt: "Victorian London street 1851, smoky sky, factories in background, attic window view, oil painting style",
    imagePath: "/images/start.jpg",
    hotspots: [
      { id: 'h1', x: 20, y: 30, label: 'Factories', description: 'Factories roared all day during the Industrial Revolution. Children Jack\'s age often worked 12-hour shifts tending giant looms.' },
      { id: 'h2', x: 80, y: 70, label: 'The Atlas', description: 'Maps were powerful tools. The British Empire relied on accurate maps to control trade routes and territory across the globe.' },
    ],
    choices: [
      { text: "Follow your brother to join the Army", nextNodeId: "army_intro" },
      { text: "Sneak aboard a ship bound for India", nextNodeId: "ship_india" },
      { text: "Deliver a secret letter to the Chinese Embassy", nextNodeId: "china_mission" },
      { text: "Investigate the Great Exhibition", nextNodeId: "exhibition_intro" }
    ]
  },
  'army_intro': {
    id: 'army_intro',
    title: 'The Crimean Front',
    content: `You travel with your older brother to the front lines of the Crimean War. British soldiers are fighting against Russia, and the cold wind stings your face as tents flap across the muddy fields.

In the crowded hospital tent, you meet a calm, determined woman: Florence Nightingale. She shows you how to boil instruments and scrub hands to stop deadly infections — something no other army had thought to do.

A captain bursts in. "We need this message across enemy lines. It could save lives." He hands it to you. You nod. You're ready.`,
    imagePrompt: "Florence Nightingale in a candlelit hospital tent, Crimean War, boiling bandages, soldiers in background, oil painting",
    imagePath: "/images/Florence Nightingale in the Field Hospital.jpg",
    hotspots: [
      { id: 'h3', x: 50, y: 50, label: 'Florence Nightingale', description: 'Known as "The Lady with the Lamp", she revolutionized nursing by insisting on sanitation and hygiene, drastically reducing death rates.' },
      { id: 'h4', x: 80, y: 20, label: 'The Message', description: 'Military dispatches were crucial. Before radio, runners and riders had to physically carry orders through dangerous territory.' }
    ],
    choices: [
      { text: "Try to sneak across the trenches at night", nextNodeId: "sneak_mission" },
      { text: "Climb the hill to signal with flags instead", nextNodeId: "signal_success" }
    ]
  },
  'sneak_mission': {
    id: 'sneak_mission',
    title: 'Sneak Mission',
    content: `The moon is bright. You crawl through mud, past sleeping guards. Suddenly — a shout! You dive into a trench and press your body against the cold earth.

It's a moment of pure chance. Do you find a way out, or does your luck run out?`,
    imagePrompt: "Dark muddy trenches at night, moonlight, soldier hiding, tense atmosphere, oil painting",
    imagePath: "/images/Moonlit Vigil of a Soldier.jpg",
    hotspots: [
      { id: 'h5', x: 30, y: 80, label: 'Trenches', description: 'Trench warfare involved digging long, narrow ditches for protection. It was muddy, cold, and dangerous.' }
    ],
    choices: [
      { text: "Flip a coin: Heads (Find a tunnel)", nextNodeId: "escape_tunnel" },
      { text: "Flip a coin: Tails (Get caught)", nextNodeId: "captured" }
    ]
  },
  'signal_success': {
    id: 'signal_success',
    title: 'Signal Success',
    content: `You climb the ridge and wave your flags in a careful pattern. Down below, a sergeant copies your message. Minutes later, cannon fire shifts — the troops are saved.

Back in London, you're invited to Kensington Palace. Queen Victoria pins a medal to your jacket. "For cleverness in the field," she says with a smile.`,
    imagePrompt: "Queen Victoria pinning a medal on a young boy in a fancy palace room, Kensington Palace, oil painting",
    imagePath: "/images/queenvic.jpg",
    isEnd: true,
    choices: []
  },
  'escape_tunnel': {
    id: 'escape_tunnel',
    title: 'Escape Tunnel',
    content: `You stumble into a tunnel dug beneath the trenches. Holding your compass, you crawl toward distant light. At the far end, British soldiers help you up. "You're just in time," one says. They rush off with your message. You lean back in the grass, heart pounding. You've saved lives tonight.`,
    imagePrompt: "Soldiers emerging from a tunnel, holding a compass, dawn light, relief, oil painting",
    imagePath: "/images/compass.jpg",
    isEnd: true,
    choices: []
  },
  'captured': {
    id: 'captured',
    title: 'Captured!',
    content: `You're dragged into a tent lit by candlelight. A British general scowls. "A child? A spy?" You show him the letter and stammer out your story. His brow softens. "You're braver than many I've known." He hands you a sealed letter. "Take this home — you've earned it."`,
    imagePrompt: "Inside a military tent, general looking at a scared boy, candlelight, oil painting",
    imagePath: "/images/tent.jpg",
    isEnd: true,
    choices: []
  },
  'ship_india': {
    id: 'ship_india',
    title: 'Ship to India',
    content: `You sneak aboard the SS Bombay, hiding near crates of tea and porcelain. A sailor discovers you — but lets you stay if you help mop the deck.

Weeks later, you reach Calcutta. The streets are hot and loud. You hear talk of rebellion, and learn the East India Company rules here — like a private empire.`,
    imagePrompt: "Port of Calcutta 1850s, sailing ships, crates of tea, busy market, exotic architecture, oil painting",
    imagePath: "/images/calcutta.jpg",
    hotspots: [
      { id: 'h6', x: 20, y: 60, label: 'East India Company', description: 'A powerful British trading company that effectively ruled large parts of India with its own private army.' },
      { id: 'h7', x: 70, y: 40, label: 'Tea Trade', description: 'Tea was a major commodity. The Company grew opium in India to trade for tea in China.' }
    ],
    choices: [
      { text: "Join a merchant caravan heading north", nextNodeId: "merchant_caravan" },
      { text: "Follow a mysterious rider into the jungle", nextNodeId: "into_jungle" }
    ]
  },
  'merchant_caravan': {
    id: 'merchant_caravan',
    title: 'Merchant Caravan',
    content: `You join a British merchant selling tea and spices, heading toward a remote region in the Himalayas. He is a local guide who knows many languages. As you cross rocky trails and sleep beneath starlit skies, you begin to understand how trade shapes the empire. One night, he hands you a brass compass. "You're made for this life," he says with a grin.`,
    imagePrompt: "Himalayan mountain trail, merchant caravan with yaks or horses, snowy peaks, starry night, oil painting",
    imagePath: "/images/mountain.jpg",
    isEnd: true,
    choices: []
  },
  'into_jungle': {
    id: 'into_jungle',
    title: 'Into the Jungle',
    content: `You follow the rider deep into the thick jungle. The trees are so tall they block out the sun. At the end of a narrow path, you discover a rebel camp. The people there are quiet, watchful. You don't speak — just listen. You hear plans to rise against the East India Company. (Reflecting the Sepoy Rebellion of 1857). You leave the jungle changed.`,
    imagePrompt: "Dense green jungle, hidden camp, rebels gathering around a fire, tense atmosphere, oil painting",
    imagePath: "/images/Victorian Explorer in Jungle Standoff.jpg",
    isEnd: true,
    choices: []
  },
  'china_mission': {
    id: 'china_mission',
    title: 'Secret Mission to China',
    content: `You walk through narrow streets, clutching a wax-sealed letter marked "urgent." The year is 1857, and tensions are high following the Opium Wars. A stranger watches you from the shadows. You walk faster.`,
    imagePrompt: "Narrow Chinese street 1850s, lanterns, shadows, mysterious figure, night time, oil painting",
    imagePath: "/images/china.jpg",
    hotspots: [
      { id: 'h8', x: 50, y: 50, label: 'Opium Wars', description: 'Wars fought between Britain and China over trade rights and the opium trade, leading to forced treaties.' }
    ],
    choices: [
      { text: "Hide in the alley and wait till dark", nextNodeId: "hidden_alley" },
      { text: "Deliver it immediately despite the danger", nextNodeId: "dangerous_delivery" }
    ]
  },
  'hidden_alley': {
    id: 'hidden_alley',
    title: 'The Hidden Alley',
    content: `You crouch in a dark alley. Hours later, you knock on a carved wooden door. A Chinese scholar opens it. He examines the letter, nods, and hands you a small pendant made of jade. Scholars often served as the quiet bridge between foreign diplomats and local leaders.`,
    imagePrompt: "Chinese scholar in traditional robes, carved wooden door, jade pendant, oil painting",
    imagePath: "/images/scholar.jpg",
    isEnd: true,
    choices: []
  },
  'dangerous_delivery': {
    id: 'dangerous_delivery',
    title: 'Dangerous Delivery',
    content: `You dart through the crowded market, dodging carts of ginger and lanterns. Just as the stranger gets close, you reach the embassy gate. "Well done," says the guard. In an age of fragile alliances, diplomatic letters were often hand-delivered under great risk.`,
    imagePrompt: "Action scene, running through a crowded Chinese market, lanterns blurring, embassy gates in distance, oil painting",
    imagePath: "/images/market.jpg",
    isEnd: true,
    choices: []
  },
  'exhibition_intro': {
    id: 'exhibition_intro',
    title: 'The Great Exhibition',
    content: `You enter the Crystal Palace — a vast glass building filled with marvels. Steam engines hiss. Telegraph wires buzz. Visitors crowd around machines from around the world.

A man drops a folded paper as he passes. You pick it up — it's a coded message.`,
    imagePrompt: "Interior of the Crystal Palace 1851, glass ceiling, steam engines on display, crowds in Victorian dress, oil painting",
    imagePath: "/images/crystal palace.jpg",
    hotspots: [
      { id: 'h9', x: 50, y: 20, label: 'Crystal Palace', description: 'A massive structure made of cast iron and plate glass, built in Hyde Park to house the Great Exhibition.' },
      { id: 'h10', x: 30, y: 70, label: 'Telegraph', description: 'A revolutionary machine that sent messages quickly over long distances using electric signals.' }
    ],
    choices: [
      { text: "Follow the man through the crowd", nextNodeId: "following_man" },
      { text: "Decode the message yourself", nextNodeId: "cracking_code" }
    ]
  },
  'following_man': {
    id: 'following_man',
    title: 'Following the Man',
    content: `You slip through the crowd, tailing the man into a storage room. Inside, papers with maps are scattered across a table. You memorize coordinates just as he bolts. Moments later, you hand the info to a constable. Maps and engineering secrets were powerful tools in the age of empires.`,
    imagePrompt: "Storage room, scattered maps on table, fleeing shadow, suspenseful, oil painting",
    imagePath: "/images/storage room.jpg",
    isEnd: true,
    choices: []
  },
  'cracking_code': {
    id: 'cracking_code',
    title: 'Cracking the Code',
    content: `You find a quiet corner. The message reads: "The lion must sleep before the hammer drops." It's a cipher. You copy it into your journal. Ciphers were used to send secret instructions between spies and generals. You may not know what it means yet, but it could be important someday.`,
    imagePrompt: "Boy sitting on a bench in the Crystal Palace, writing in a notebook, mysterious paper, oil painting",
    imagePath: "/images/Decoding Secrets at the Great Exhibition.jpg",
    isEnd: true,
    choices: []
  }
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What was the East India Company?',
    options: [
      'A shipping company for vacations',
      'A powerful British trading company that controlled parts of India',
      'A group of mapmakers in London',
      'A secret society of spies'
    ],
    correctAnswer: 1,
    explanation: 'The East India Company was a powerful trading body that ruled large parts of India during the 1800s, acting almost like a nation itself.'
  },
  {
    id: 'q2',
    question: 'Who was Florence Nightingale?',
    options: [
      'The Queen of England',
      'A famous spy',
      'A nurse who improved hospital hygiene during the Crimean War',
      'The inventor of the telegraph'
    ],
    correctAnswer: 2,
    explanation: 'Florence Nightingale is famous for her work in the Crimean War, where she introduced sanitary practices like hand washing.'
  },
  {
    id: 'q3',
    question: 'What is a "Cipher"?',
    options: [
      'A type of steam engine',
      'A secret code used to hide messages',
      'A ranking in the army',
      'A map of the stars'
    ],
    correctAnswer: 1,
    explanation: 'A cipher is a secret code used to encrypt messages so only the intended recipient can read them.'
  },
  {
    id: 'q4',
    question: 'Which invention allowed for quick communication over long wires?',
    options: [
      'The Steam Engine',
      'The Spinning Jenny',
      'The Telegraph',
      'The Compass'
    ],
    correctAnswer: 2,
    explanation: 'The Telegraph used electric signals to send messages instantly across long distances.'
  }
];