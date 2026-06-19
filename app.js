const aceModuleTitle = "ACE Cognitive Conditioning";
const equilibriumModuleTitle = "Equilibrium breathing drill";

const defaultModules = [
  {
    id: createId(),
    title: aceModuleTitle,
    category: "Mental Health",
    notes:
      "Awareness, Composure, and Equilibrium drills for clear decisions under pressure.",
    media: "",
    assigned: true,
    core: true,
  },
  {
    id: createId(),
    title: "Tactical conditioning",
    category: "Workout",
    notes: "Loaded carries, bodyweight intervals, and controlled recovery under fatigue.",
    media: "",
    assigned: true,
  },
  {
    id: createId(),
    title: equilibriumModuleTitle,
    category: "Breathing",
    notes: "Equilibrium breathing to steady attention before and after hard efforts.",
    media: "",
    assigned: true,
  },
  {
    id: createId(),
    title: "HR cognitive stress drill",
    category: "Workout",
    notes: "Drive heart rate toward 180 bpm, choose a physical load, then complete a cognitive test under pressure.",
    media: "",
    assigned: true,
  },
  {
    id: createId(),
    title: "Stress response reset",
    category: "Mental Health",
    notes: "Notice threat cues, name the response, and return to the immediate task.",
    media: "",
    assigned: true,
  },
  {
    id: createId(),
    title: "Sleep and recovery basics",
    category: "Health",
    notes: "Practical recovery habits for shift work, heavy training, and high pressure weeks.",
    media: "",
    assigned: false,
  },
];

const professionThemes = {
  military: {
    label: "Military",
    metaColor: "#070908",
    toast: "Military style selected",
  },
  police: {
    label: "Police",
    metaColor: "#070a0f",
    toast: "Police style selected",
  },
  ems: {
    label: "EMS",
    metaColor: "#061011",
    toast: "EMS style selected",
  },
  fire: {
    label: "Fire",
    metaColor: "#100807",
    toast: "Fire rescue style selected",
  },
  general: {
    label: "General",
    metaColor: "#080909",
    toast: "General tactical style selected",
  },
};

const state = {
  role: "trainee",
  category: "All",
  professionTheme: loadProfessionTheme(),
  modules: loadModules(),
  mealProfile: loadMealProfile(),
  mealPlan: [],
  breathingTimer: null,
  phaseIndex: 0,
  phaseCount: 4,
  breathingActive: false,
  breathMethod: "box",
  workoutActive: false,
  cognitiveUnlocked: false,
  cognitiveTest: "sequence",
  protocolStage: "idle",
  protocolTimer: null,
  protocolSeconds: 0,
  activeRun: null,
  runStartedAt: 0,
  lastCueAt: 0,
  baselineStats: loadProtocolStats(),
  stressStats: createProtocolStats(),
  nbackRound: 1,
  nbackLevel: 1,
  nbackHistory: [],
  nbackCurrent: null,
  trackerTargets: [],
  trackerSelected: [],
  trackerRound: 1,
  trackerSpeed: 1,
  trackerPhase: "idle",
  trackerNoiseTimer: null,
  vigilanceRound: 1,
  vigilanceIsGo: true,
  vigilanceThreat: false,
  vigilanceNumber: 0,
  vigilanceExposure: 120,
  vigilanceAwaitingNumber: false,
  vigilanceTimeout: null,
  vigilanceFlashTimeout: null,
  reciteRound: 1,
  reciteAnswer: 0,
  cooldownTargetBpm: 0,
  workoutTestMode: "hundred",
  workoutTestTimer: null,
  workoutTestSeconds: 0,
  workoutTestReps: 0,
  workoutTestTargetReps: 100,
  workoutTestRunning: false,
  sequence: [],
  nextNumber: 1,
  sequenceAttempts: 0,
  colourRound: 1,
  colourAnswer: "",
  mathsRound: 1,
  mathsAnswer: 0,
  activeModuleId: null,
};

const breathMethods = {
  box: {
    title: "Equilibrium breathing",
    phases: [
      { label: "Inhale", count: 4 },
      { label: "Hold", count: 4 },
      { label: "Exhale", count: 4 },
      { label: "Hold", count: 4 },
    ],
    instruction: "Use the 4-4-4-4 box breath to restore Equilibrium, bring oxygen back to the brain, and steady decision-making.",
  },
  rocking: {
    title: "Rocking breathing",
    phases: [
      { label: "Rock forward", count: 4 },
      { label: "Rock back", count: 6 },
    ],
    instruction: "Rock forward as you inhale, then rock back through a longer exhale. Let the movement settle your nervous system.",
  },
  recovery: {
    title: "Tactical recovery",
    phases: [
      { label: "Inhale", count: 3 },
      { label: "Exhale", count: 6 },
    ],
    instruction: "Short controlled inhale, longer steady exhale. Use it after a hard effort to bring control back quickly.",
  },
};
const cognitiveRoundGoal = 3;
const baselineSeconds = 45;
const loadingSeconds = 60;
const postLoadSeconds = 60;
const recoverySeconds = 120;
const colourOptions = [
  { name: "Green", value: "#c6e36b" },
  { name: "Amber", value: "#c8a45d" },
  { name: "Blue", value: "#8fc1af" },
  { name: "Red", value: "#d07158" },
];
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const mealSlots = ["breakfast", "lunch", "dinner", "snack"];
const mealTargets = {
  breakfast: 0.25,
  lunch: 0.3,
  dinner: 0.32,
  snack: 0.13,
};
const budgetPriorityLabels = {
  flexible: "Flexible",
  balanced: "Balanced",
  strict: "Strict cheapest",
};
const premiumIngredients = [
  "turkey",
  "salmon",
  "steak",
  "lamb",
  "beef jerky",
  "protein powder",
  "quinoa",
  "mixed nuts",
];
const ingredientCosts = {
  eggs: 0.9,
  "boiled eggs": 1.2,
  kumara: 1.1,
  spinach: 1.2,
  "olive oil": 0.3,
  "Greek yoghurt": 1.8,
  "rolled oats": 0.45,
  "mixed berries": 2.3,
  "chia seeds": 0.7,
  banana: 0.6,
  "protein powder": 2.4,
  milk: 0.7,
  "turkey slices": 3.1,
  "wholemeal wrap": 0.9,
  tomato: 0.7,
  "wholegrain toast": 0.65,
  "cottage cheese": 1.8,
  apple: 0.8,
  "peanut butter": 0.45,
  "plain yoghurt": 1.2,
  "chicken breast": 2.8,
  rice: 0.55,
  broccoli: 1.1,
  "soy sauce": 0.2,
  tuna: 1.7,
  potatoes: 0.9,
  lettuce: 0.9,
  cucumber: 0.8,
  "Greek yoghurt dressing": 0.7,
  "lean beef mince": 2.5,
  "black beans": 0.85,
  corn: 0.65,
  salsa: 0.8,
  "salmon": 5.2,
  quinoa: 1.9,
  greens: 1,
  "lemon dressing": 0.45,
  "frozen vegetables": 0.9,
  "frozen peas": 0.65,
  carrot: 0.45,
  "red lentils": 0.7,
  chicken: 1.8,
  onion: 0.35,
  stock: 0.3,
  "lean steak": 5.4,
  "mixed vegetables": 0.95,
  "stir fry vegetables": 1.2,
  garlic: 0.2,
  "turkey mince": 3.6,
  "kidney beans": 0.85,
  tomatoes: 0.95,
  "chilli spice": 0.25,
  "white fish": 3.2,
  tortillas: 1,
  "cabbage slaw": 0.85,
  lime: 0.45,
  "lean lamb": 4.8,
  couscous: 0.7,
  "green beans": 1.2,
  "mint yoghurt": 0.7,
  "chicken drumsticks": 1.9,
  seasoning: 0.2,
  "beef mince": 2.2,
  pasta: 0.6,
  pepper: 0.1,
  "milk or water": 0.35,
  "carrot sticks": 0.45,
  "beef jerky": 4.2,
  "mixed nuts": 1.6,
  orange: 0.8,
  hummus: 1.4,
  "wholegrain crackers": 0.9,
  "wholemeal toast": 0.65,
  cinnamon: 0.1,
  salt: 0.05,
};
const ingredientAmounts = {
  eggs: "2 large eggs",
  "boiled eggs": "2 eggs",
  kumara: "180g diced",
  spinach: "1 packed cup",
  "olive oil": "1 tsp",
  "Greek yoghurt": "200g",
  "rolled oats": "50g",
  "mixed berries": "80g",
  "chia seeds": "1 tsp",
  banana: "1 medium",
  "protein powder": "1 scoop",
  milk: "200ml",
  "turkey slices": "100g",
  "wholemeal wrap": "1 large wrap",
  tomato: "1 medium",
  "wholegrain toast": "2 slices",
  "cottage cheese": "150g",
  apple: "1 medium",
  "peanut butter": "1 tbsp",
  "plain yoghurt": "170g",
  "chicken breast": "160g",
  rice: "1 cup cooked",
  broccoli: "1 cup",
  "soy sauce": "1 tbsp",
  tuna: "1 can",
  potatoes: "250g",
  lettuce: "2 cups",
  cucumber: "1/2 cucumber",
  "Greek yoghurt dressing": "2 tbsp",
  "lean beef mince": "150g",
  "black beans": "1/2 can",
  corn: "1/2 cup",
  salsa: "2 tbsp",
  salmon: "150g fillet",
  quinoa: "3/4 cup cooked",
  greens: "2 cups",
  "lemon dressing": "1 tbsp",
  "frozen vegetables": "1.5 cups",
  "frozen peas": "3/4 cup",
  carrot: "1 medium",
  "red lentils": "3/4 cup cooked",
  chicken: "120g cooked",
  onion: "1/2 onion",
  stock: "300ml",
  "lean steak": "170g",
  "mixed vegetables": "1.5 cups",
  "stir fry vegetables": "2 cups",
  garlic: "1 clove",
  "turkey mince": "160g",
  "kidney beans": "1/2 can",
  tomatoes: "1/2 can",
  "chilli spice": "1 tsp",
  "white fish": "160g",
  tortillas: "2 small",
  "cabbage slaw": "1.5 cups",
  lime: "1/2 lime",
  "lean lamb": "160g",
  couscous: "3/4 cup cooked",
  "green beans": "1 cup",
  "mint yoghurt": "2 tbsp",
  "chicken drumsticks": "2 drumsticks",
  seasoning: "1 tsp",
  "beef mince": "150g",
  pasta: "1 cup cooked",
  pepper: "to taste",
  "milk or water": "250ml",
  "carrot sticks": "1 cup",
  "beef jerky": "40g",
  "mixed nuts": "30g",
  orange: "1 medium",
  hummus: "3 tbsp",
  "wholegrain crackers": "6 crackers",
  "wholemeal toast": "2 slices",
  cinnamon: "1 pinch",
  salt: "1 pinch",
};
const mealPools = {
  breakfast: [
    {
      name: "Eggs, kumara hash, spinach",
      calories: 520,
      protein: 34,
      tags: ["lose", "maintain", "build"],
      cost: "standard",
      ingredients: ["eggs", "kumara", "spinach", "olive oil", "salt", "pepper"],
    },
    {
      name: "Greek yoghurt, oats, berries",
      calories: 430,
      protein: 32,
      tags: ["lose", "maintain"],
      cost: "standard",
      ingredients: ["Greek yoghurt", "rolled oats", "mixed berries", "chia seeds"],
    },
    {
      name: "Protein oats with banana",
      calories: 610,
      protein: 38,
      tags: ["maintain", "build"],
      cost: "standard",
      ingredients: ["rolled oats", "banana", "protein powder", "milk", "cinnamon"],
    },
    {
      name: "Turkey omelette wrap",
      calories: 560,
      protein: 42,
      tags: ["lose", "maintain", "build"],
      cost: "standard",
      ingredients: ["eggs", "turkey slices", "wholemeal wrap", "spinach", "tomato"],
    },
    {
      name: "Cottage cheese toast and fruit",
      calories: 450,
      protein: 33,
      tags: ["lose", "maintain"],
      cost: "standard",
      ingredients: ["wholegrain toast", "cottage cheese", "apple", "cinnamon"],
    },
    {
      name: "Porridge, milk, peanut butter",
      calories: 470,
      protein: 24,
      tags: ["lose", "maintain", "build"],
      cost: "budget",
      ingredients: ["rolled oats", "milk", "peanut butter", "banana"],
    },
    {
      name: "Scrambled eggs on toast",
      calories: 430,
      protein: 26,
      tags: ["lose", "maintain"],
      cost: "budget",
      ingredients: ["eggs", "wholemeal toast", "milk", "spinach"],
    },
    {
      name: "Banana oats and yoghurt",
      calories: 540,
      protein: 28,
      tags: ["maintain", "build"],
      cost: "budget",
      ingredients: ["rolled oats", "banana", "plain yoghurt", "milk"],
    },
  ],
  lunch: [
    {
      name: "Chicken rice bowl with greens",
      calories: 720,
      protein: 52,
      tags: ["maintain", "build"],
      cost: "standard",
      ingredients: ["chicken breast", "rice", "broccoli", "spinach", "soy sauce"],
    },
    {
      name: "Tuna potato salad",
      calories: 560,
      protein: 43,
      tags: ["lose", "maintain"],
      cost: "standard",
      ingredients: ["tuna", "potatoes", "lettuce", "cucumber", "Greek yoghurt dressing"],
    },
    {
      name: "Lean beef burrito bowl",
      calories: 760,
      protein: 55,
      tags: ["maintain", "build"],
      cost: "standard",
      ingredients: ["lean beef mince", "rice", "black beans", "corn", "salsa"],
    },
    {
      name: "Turkey salad wrap and apple",
      calories: 510,
      protein: 38,
      tags: ["lose", "maintain"],
      cost: "standard",
      ingredients: ["turkey slices", "wholemeal wrap", "lettuce", "tomato", "apple"],
    },
    {
      name: "Salmon quinoa field bowl",
      calories: 680,
      protein: 45,
      tags: ["lose", "maintain", "build"],
      cost: "standard",
      ingredients: ["salmon", "quinoa", "greens", "cucumber", "lemon dressing"],
    },
    {
      name: "Tuna, rice, frozen veg",
      calories: 610,
      protein: 42,
      tags: ["lose", "maintain", "build"],
      cost: "budget",
      ingredients: ["tuna", "rice", "frozen vegetables", "soy sauce"],
    },
    {
      name: "Egg fried rice with peas",
      calories: 590,
      protein: 28,
      tags: ["maintain", "build"],
      cost: "budget",
      ingredients: ["eggs", "rice", "frozen peas", "carrot", "soy sauce"],
    },
    {
      name: "Lentil and chicken soup",
      calories: 500,
      protein: 34,
      tags: ["lose", "maintain"],
      cost: "budget",
      ingredients: ["red lentils", "chicken", "carrot", "onion", "stock"],
    },
  ],
  dinner: [
    {
      name: "Steak, potatoes, mixed veg",
      calories: 780,
      protein: 58,
      tags: ["maintain", "build"],
      cost: "standard",
      ingredients: ["lean steak", "potatoes", "mixed vegetables", "olive oil"],
    },
    {
      name: "Chicken stir fry with rice",
      calories: 660,
      protein: 50,
      tags: ["lose", "maintain"],
      cost: "standard",
      ingredients: ["chicken breast", "rice", "stir fry vegetables", "garlic", "soy sauce"],
    },
    {
      name: "Turkey chilli and beans",
      calories: 620,
      protein: 48,
      tags: ["lose", "maintain", "build"],
      cost: "standard",
      ingredients: ["turkey mince", "kidney beans", "tomatoes", "onion", "chilli spice"],
    },
    {
      name: "Fish tacos with slaw",
      calories: 590,
      protein: 41,
      tags: ["lose", "maintain"],
      cost: "standard",
      ingredients: ["white fish", "tortillas", "cabbage slaw", "Greek yoghurt", "lime"],
    },
    {
      name: "Lamb, couscous, greens",
      calories: 820,
      protein: 52,
      tags: ["maintain", "build"],
      cost: "standard",
      ingredients: ["lean lamb", "couscous", "green beans", "spinach", "mint yoghurt"],
    },
    {
      name: "Chicken drumsticks, rice, veg",
      calories: 680,
      protein: 46,
      tags: ["lose", "maintain", "build"],
      cost: "budget",
      ingredients: ["chicken drumsticks", "rice", "frozen vegetables", "seasoning"],
    },
    {
      name: "Mince chilli, beans, rice",
      calories: 720,
      protein: 45,
      tags: ["maintain", "build"],
      cost: "budget",
      ingredients: ["beef mince", "kidney beans", "rice", "tomatoes", "chilli spice"],
    },
    {
      name: "Tuna pasta with peas",
      calories: 610,
      protein: 38,
      tags: ["lose", "maintain"],
      cost: "budget",
      ingredients: ["tuna", "pasta", "frozen peas", "plain yoghurt", "pepper"],
    },
  ],
  snack: [
    {
      name: "Protein shake and banana",
      calories: 310,
      protein: 30,
      tags: ["maintain", "build"],
      cost: "standard",
      ingredients: ["protein powder", "banana", "milk or water"],
    },
    {
      name: "Boiled eggs and carrots",
      calories: 220,
      protein: 16,
      tags: ["lose", "maintain"],
      cost: "standard",
      ingredients: ["boiled eggs", "carrot sticks", "salt", "pepper"],
    },
    {
      name: "Beef jerky, nuts, orange",
      calories: 330,
      protein: 28,
      tags: ["maintain", "build"],
      cost: "standard",
      ingredients: ["beef jerky", "mixed nuts", "orange"],
    },
    {
      name: "Cottage cheese and berries",
      calories: 240,
      protein: 26,
      tags: ["lose", "maintain"],
      cost: "standard",
      ingredients: ["cottage cheese", "mixed berries", "cinnamon"],
    },
    {
      name: "Hummus, crackers, cucumber",
      calories: 280,
      protein: 13,
      tags: ["lose", "maintain"],
      cost: "standard",
      ingredients: ["hummus", "wholegrain crackers", "cucumber"],
    },
    {
      name: "Peanut butter toast",
      calories: 260,
      protein: 11,
      tags: ["lose", "maintain"],
      cost: "budget",
      ingredients: ["wholemeal toast", "peanut butter"],
    },
    {
      name: "Boiled eggs and banana",
      calories: 300,
      protein: 17,
      tags: ["maintain", "build"],
      cost: "budget",
      ingredients: ["boiled eggs", "banana"],
    },
    {
      name: "Yoghurt and rolled oats",
      calories: 280,
      protein: 18,
      tags: ["lose", "maintain", "build"],
      cost: "budget",
      ingredients: ["plain yoghurt", "rolled oats", "cinnamon"],
    },
  ],
};

const mealImageFallbacks = {
  breakfast: "https://www.themealdb.com/images/media/meals/naqyel1608588563.jpg",
  lunch: "https://www.themealdb.com/images/media/meals/1549542994.jpg",
  dinner: "https://www.themealdb.com/images/media/meals/qptpvt1487339892.jpg",
  snack: "https://www.themealdb.com/images/media/meals/2dsltq1560461468.jpg",
};

const expandedMealPools = {
  breakfast: [
    {
      name: "Salmon egg performance toast",
      calories: 590,
      protein: 39,
      tags: ["maintain", "build"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/1550440197.jpg",
      source: "Inspired by TheMealDB salmon eggs benedict",
      ingredients: ["salmon", "eggs", "wholegrain toast", "spinach", "Greek yoghurt"],
      amounts: { salmon: "90g cooked or smoked", eggs: "2 eggs", "Greek yoghurt": "2 tbsp" },
      steps: [
        "Toast the bread and wilt the spinach in a pan or microwave.",
        "Cook the eggs to preference, then layer salmon and eggs over the toast.",
        "Spoon over yoghurt, season lightly, and eat while warm.",
      ],
    },
    {
      name: "Breakfast potatoes, eggs, greens",
      calories: 540,
      protein: 28,
      tags: ["maintain", "build"],
      cost: "budget",
      image: "https://www.themealdb.com/images/media/meals/1550441882.jpg",
      source: "Inspired by TheMealDB breakfast potatoes",
      ingredients: ["eggs", "potatoes", "spinach", "olive oil", "seasoning"],
      amounts: { potatoes: "220g diced", eggs: "2 large eggs", spinach: "1 packed cup" },
      steps: [
        "Pan-cook diced potato with oil and seasoning until crisp at the edges.",
        "Add spinach to wilt, then cook eggs beside the potatoes.",
        "Plate together and add salt or pepper to taste.",
      ],
    },
    {
      name: "Overnight oats, yoghurt, berries",
      calories: 480,
      protein: 31,
      tags: ["lose", "maintain", "build"],
      cost: "budget",
      image: "https://www.themealdb.com/images/media/meals/uwq8001777540502.jpg",
      source: "Forge field meal",
      ingredients: ["rolled oats", "Greek yoghurt", "mixed berries", "chia seeds", "milk"],
      amounts: { "rolled oats": "55g", "Greek yoghurt": "180g", milk: "120ml" },
      steps: [
        "Mix oats, yoghurt, milk, chia, and berries in a container.",
        "Refrigerate overnight or for at least four hours.",
        "Stir before eating and add water or milk if it is too thick.",
      ],
    },
    {
      name: "Shakshuka eggs and toast",
      calories: 520,
      protein: 30,
      tags: ["lose", "maintain"],
      cost: "budget",
      image: "https://www.themealdb.com/images/media/meals/eo0yfb1763600916.jpg",
      source: "Inspired by TheMealDB vegetarian shakshuka",
      ingredients: ["eggs", "tomatoes", "onion", "spinach", "wholegrain toast", "chilli spice"],
      amounts: { tomatoes: "1 cup canned", onion: "1/2 onion", eggs: "2 eggs" },
      steps: [
        "Simmer tomatoes, onion, spinach, and spice until thick.",
        "Crack eggs into the sauce, cover, and cook until set.",
        "Serve with toast for a controlled carb base.",
      ],
    },
    {
      name: "Cottage cheese banana bowl",
      calories: 430,
      protein: 34,
      tags: ["lose", "maintain"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/1543774956.jpg",
      source: "Forge field meal",
      ingredients: ["cottage cheese", "banana", "rolled oats", "mixed berries", "cinnamon"],
      amounts: { "cottage cheese": "220g", "rolled oats": "30g", banana: "1 small" },
      steps: [
        "Spoon cottage cheese into a bowl.",
        "Top with sliced banana, berries, oats, and cinnamon.",
        "Eat cold, or pack in a sealed container for shift work.",
      ],
    },
    {
      name: "Turkey breakfast burrito",
      calories: 640,
      protein: 45,
      tags: ["maintain", "build"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/1wj8w31763781990.jpg",
      source: "Inspired by TheMealDB turkey banh mi",
      ingredients: ["turkey slices", "eggs", "wholemeal wrap", "spinach", "tomato", "salsa"],
      amounts: { "turkey slices": "90g", eggs: "2 eggs", "wholemeal wrap": "1 large" },
      steps: [
        "Scramble the eggs and warm the wrap.",
        "Layer turkey, eggs, spinach, tomato, and salsa.",
        "Roll tightly and toast seam-side down if eating immediately.",
      ],
    },
    {
      name: "Protein porridge with apple",
      calories: 560,
      protein: 36,
      tags: ["maintain", "build"],
      cost: "budget",
      image: "https://www.themealdb.com/images/media/meals/uwq8001777540502.jpg",
      source: "Forge field meal",
      ingredients: ["rolled oats", "protein powder", "milk", "apple", "cinnamon"],
      amounts: { "rolled oats": "65g", "protein powder": "1 scoop", apple: "1/2 diced" },
      steps: [
        "Cook oats with milk until creamy.",
        "Remove from heat and stir in protein powder.",
        "Top with diced apple and cinnamon.",
      ],
    },
  ],
  lunch: [
    {
      name: "Salmon avocado salad bowl",
      calories: 650,
      protein: 44,
      tags: ["lose", "maintain", "build"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/1549542994.jpg",
      source: "Inspired by TheMealDB salmon avocado salad",
      ingredients: ["salmon", "greens", "cucumber", "rice", "lemon dressing"],
      amounts: { salmon: "150g", greens: "2 cups", rice: "3/4 cup cooked" },
      steps: [
        "Cook or reheat salmon and rice.",
        "Build a bowl with greens and cucumber.",
        "Add salmon, rice, and lemon dressing just before eating.",
      ],
    },
    {
      name: "Chicken fried rice field bowl",
      calories: 720,
      protein: 48,
      tags: ["maintain", "build"],
      cost: "budget",
      image: "https://www.themealdb.com/images/media/meals/wuyd2h1765655837.jpg",
      source: "Inspired by TheMealDB chicken fried rice",
      ingredients: ["chicken breast", "rice", "eggs", "frozen vegetables", "soy sauce"],
      amounts: { "chicken breast": "140g", rice: "1.25 cups cooked", eggs: "1 egg" },
      steps: [
        "Cook chicken pieces in a hot pan.",
        "Add rice, vegetables, egg, and soy sauce.",
        "Stir until hot and pack into a container.",
      ],
    },
    {
      name: "Beef pho recovery bowl",
      calories: 610,
      protein: 42,
      tags: ["lose", "maintain"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/pbzcrx1763765096.jpg",
      source: "Inspired by TheMealDB beef pho",
      ingredients: ["lean steak", "rice", "stock", "greens", "lime"],
      amounts: { "lean steak": "130g sliced", rice: "3/4 cup cooked", stock: "350ml" },
      steps: [
        "Heat stock until simmering and add greens.",
        "Add cooked rice and thin steak slices until just cooked.",
        "Finish with lime and eat as a warm recovery meal.",
      ],
    },
    {
      name: "Tuna nicoise patrol salad",
      calories: 540,
      protein: 41,
      tags: ["lose", "maintain"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/yypwwq1511304979.jpg",
      source: "Inspired by TheMealDB tuna nicoise",
      ingredients: ["tuna", "boiled eggs", "potatoes", "green beans", "lettuce", "lemon dressing"],
      amounts: { tuna: "1 can", "boiled eggs": "1 egg", potatoes: "180g" },
      steps: [
        "Boil potatoes and green beans until tender.",
        "Add lettuce, tuna, egg, and cooled vegetables to a bowl.",
        "Dress lightly and keep chilled until lunch.",
      ],
    },
    {
      name: "Turkey banh mi style wrap",
      calories: 570,
      protein: 40,
      tags: ["lose", "maintain"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/1wj8w31763781990.jpg",
      source: "Inspired by TheMealDB turkey banh mi",
      ingredients: ["turkey slices", "wholemeal wrap", "cabbage slaw", "cucumber", "Greek yoghurt dressing"],
      amounts: { "turkey slices": "110g", "wholemeal wrap": "1 large", "cabbage slaw": "1 cup" },
      steps: [
        "Warm the wrap so it rolls without tearing.",
        "Layer turkey, slaw, cucumber, and yoghurt dressing.",
        "Roll tightly, slice in half, and pack wrapped in foil.",
      ],
    },
    {
      name: "Vegetarian chilli rice bowl",
      calories: 620,
      protein: 30,
      tags: ["lose", "maintain", "build"],
      cost: "budget",
      image: "https://www.themealdb.com/images/media/meals/wqurxy1511453156.jpg",
      source: "Inspired by TheMealDB vegetarian chilli",
      ingredients: ["kidney beans", "black beans", "rice", "tomatoes", "corn", "chilli spice"],
      amounts: { "kidney beans": "1/2 can", "black beans": "1/2 can", rice: "1 cup cooked" },
      steps: [
        "Simmer beans, tomatoes, corn, and chilli spice until thick.",
        "Spoon over cooked rice.",
        "Cool before packing, or eat hot as a high-fibre lunch.",
      ],
    },
    {
      name: "Noodle bowl chicken salad",
      calories: 640,
      protein: 43,
      tags: ["maintain", "build"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/zry07j1763779321.jpg",
      source: "Inspired by TheMealDB noodle bowl salad",
      ingredients: ["chicken breast", "rice", "cabbage slaw", "cucumber", "soy sauce", "lime"],
      amounts: { "chicken breast": "150g", rice: "1 cup cooked", "cabbage slaw": "1.5 cups" },
      steps: [
        "Cook chicken and slice it thin.",
        "Combine rice, slaw, cucumber, soy sauce, and lime.",
        "Top with chicken and keep chilled if eating later.",
      ],
    },
  ],
  dinner: [
    {
      name: "Tandoori chicken, rice, greens",
      calories: 760,
      protein: 58,
      tags: ["maintain", "build"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/qptpvt1487339892.jpg",
      source: "Inspired by TheMealDB tandoori chicken",
      ingredients: ["chicken breast", "rice", "Greek yoghurt", "greens", "seasoning", "lime"],
      amounts: { "chicken breast": "180g", rice: "1 cup cooked", "Greek yoghurt": "3 tbsp" },
      steps: [
        "Coat chicken with yoghurt, seasoning, and lime.",
        "Bake or pan-cook until cooked through.",
        "Serve with rice and greens for a high-protein dinner.",
      ],
    },
    {
      name: "Honey teriyaki salmon bowl",
      calories: 720,
      protein: 47,
      tags: ["maintain", "build"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg",
      source: "Inspired by TheMealDB honey teriyaki salmon",
      ingredients: ["salmon", "rice", "broccoli", "soy sauce", "honey", "garlic"],
      amounts: { salmon: "160g", rice: "1 cup cooked", broccoli: "1.5 cups" },
      steps: [
        "Bake or pan-sear salmon with soy, honey, and garlic.",
        "Steam broccoli while rice warms.",
        "Serve salmon over rice with broccoli on the side.",
      ],
    },
    {
      name: "Beef lo mein training bowl",
      calories: 780,
      protein: 52,
      tags: ["maintain", "build"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
      source: "Inspired by TheMealDB beef lo mein",
      ingredients: ["lean steak", "pasta", "stir fry vegetables", "soy sauce", "garlic"],
      amounts: { "lean steak": "160g", pasta: "1.25 cups cooked", "stir fry vegetables": "2 cups" },
      steps: [
        "Sear sliced steak quickly and set aside.",
        "Stir fry vegetables, then add pasta and soy sauce.",
        "Return steak to the pan and toss until hot.",
      ],
    },
    {
      name: "Turkey meatloaf, potatoes, beans",
      calories: 690,
      protein: 53,
      tags: ["lose", "maintain", "build"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/ypuxtw1511297463.jpg",
      source: "Inspired by TheMealDB turkey meatloaf",
      ingredients: ["turkey mince", "potatoes", "green beans", "onion", "seasoning"],
      amounts: { "turkey mince": "180g", potatoes: "220g", "green beans": "1.5 cups" },
      steps: [
        "Shape seasoned turkey mince with onion into a small loaf or patties.",
        "Bake or pan-cook until fully cooked.",
        "Serve with potatoes and green beans.",
      ],
    },
    {
      name: "Lamb tagine couscous bowl",
      calories: 820,
      protein: 50,
      tags: ["maintain", "build"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/yuwtuu1511295751.jpg",
      source: "Inspired by TheMealDB lamb tagine",
      ingredients: ["lean lamb", "couscous", "carrot", "tomatoes", "seasoning"],
      amounts: { "lean lamb": "160g", couscous: "1 cup cooked", tomatoes: "1/2 can" },
      steps: [
        "Brown lamb with seasoning.",
        "Simmer with tomatoes and carrot until tender.",
        "Serve over couscous and portion leftovers for lunch.",
      ],
    },
    {
      name: "Fish soup and potato bowl",
      calories: 560,
      protein: 43,
      tags: ["lose", "maintain"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/7n8su21699013057.jpg",
      source: "Inspired by TheMealDB fish soup",
      ingredients: ["white fish", "potatoes", "stock", "carrot", "greens", "lime"],
      amounts: { "white fish": "170g", potatoes: "200g", stock: "400ml" },
      steps: [
        "Simmer potatoes and carrot in stock until tender.",
        "Add fish and greens for the final few minutes.",
        "Finish with lime and serve hot.",
      ],
    },
    {
      name: "Kidney bean curry and rice",
      calories: 640,
      protein: 29,
      tags: ["lose", "maintain", "build"],
      cost: "budget",
      image: "https://www.themealdb.com/images/media/meals/sywrsu1511463066.jpg",
      source: "Inspired by TheMealDB kidney bean curry",
      ingredients: ["kidney beans", "rice", "tomatoes", "onion", "garlic", "chilli spice"],
      amounts: { "kidney beans": "1 can", rice: "1 cup cooked", tomatoes: "1/2 can" },
      steps: [
        "Cook onion and garlic until soft.",
        "Add beans, tomatoes, and spice; simmer until thick.",
        "Serve over rice and save extra portions.",
      ],
    },
  ],
  snack: [
    {
      name: "Tuna egg rice cakes",
      calories: 340,
      protein: 31,
      tags: ["lose", "maintain"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/2dsltq1560461468.jpg",
      source: "Inspired by TheMealDB tuna and egg briks",
      ingredients: ["tuna", "boiled eggs", "wholegrain crackers", "cucumber"],
      amounts: { tuna: "1/2 can", "boiled eggs": "1 egg", "wholegrain crackers": "4 crackers" },
      steps: [
        "Mash tuna and egg together with pepper.",
        "Spoon onto crackers and add cucumber on the side.",
        "Eat soon after assembling so the crackers stay crisp.",
      ],
    },
    {
      name: "Greek yoghurt protein cup",
      calories: 300,
      protein: 34,
      tags: ["lose", "maintain", "build"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/1543774956.jpg",
      source: "Forge field meal",
      ingredients: ["Greek yoghurt", "protein powder", "mixed berries", "chia seeds"],
      amounts: { "Greek yoghurt": "200g", "protein powder": "1/2 scoop", "mixed berries": "70g" },
      steps: [
        "Stir protein powder into yoghurt until smooth.",
        "Top with berries and chia.",
        "Keep chilled and eat after training or between calls.",
      ],
    },
    {
      name: "Hummus patrol box",
      calories: 360,
      protein: 15,
      tags: ["lose", "maintain"],
      cost: "budget",
      image: "https://www.themealdb.com/images/media/meals/93iok31766436070.jpg",
      source: "Forge field meal",
      ingredients: ["hummus", "carrot sticks", "cucumber", "wholegrain crackers"],
      amounts: { hummus: "4 tbsp", "carrot sticks": "1 cup", cucumber: "1/2 cucumber" },
      steps: [
        "Portion hummus into a small container.",
        "Slice vegetables and pack crackers separately.",
        "Dip as needed for a steady-energy snack.",
      ],
    },
    {
      name: "Jerky orange nut pack",
      calories: 390,
      protein: 30,
      tags: ["maintain", "build"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/z1hz7z1765316430.jpg",
      source: "Forge field meal",
      ingredients: ["beef jerky", "mixed nuts", "orange"],
      amounts: { "beef jerky": "45g", "mixed nuts": "25g", orange: "1 medium" },
      steps: [
        "Pack jerky and nuts in a small bag.",
        "Keep the orange whole until eating.",
        "Use this when refrigeration is not available.",
      ],
    },
    {
      name: "Apple peanut butter yoghurt",
      calories: 330,
      protein: 21,
      tags: ["lose", "maintain"],
      cost: "budget",
      image: "https://www.themealdb.com/images/media/meals/uwq8001777540502.jpg",
      source: "Forge field meal",
      ingredients: ["apple", "peanut butter", "plain yoghurt", "cinnamon"],
      amounts: { apple: "1 medium", "peanut butter": "1 tbsp", "plain yoghurt": "170g" },
      steps: [
        "Slice apple into wedges.",
        "Serve with yoghurt and peanut butter.",
        "Dust with cinnamon for sweetness without adding much energy.",
      ],
    },
    {
      name: "Cottage cheese cracker stack",
      calories: 310,
      protein: 27,
      tags: ["lose", "maintain"],
      cost: "standard",
      image: "https://www.themealdb.com/images/media/meals/1549542994.jpg",
      source: "Forge field meal",
      ingredients: ["cottage cheese", "wholegrain crackers", "tomato", "pepper"],
      amounts: { "cottage cheese": "170g", "wholegrain crackers": "6 crackers", tomato: "1 small" },
      steps: [
        "Spoon cottage cheese onto crackers.",
        "Top with tomato and pepper.",
        "Assemble just before eating for better texture.",
      ],
    },
    {
      name: "Boiled egg potato mini box",
      calories: 370,
      protein: 20,
      tags: ["maintain", "build"],
      cost: "budget",
      image: "https://www.themealdb.com/images/media/meals/yypwwq1511304979.jpg",
      source: "Forge field meal",
      ingredients: ["boiled eggs", "potatoes", "Greek yoghurt dressing", "green beans"],
      amounts: { "boiled eggs": "2 eggs", potatoes: "150g", "green beans": "1 cup" },
      steps: [
        "Boil eggs, potatoes, and green beans ahead of time.",
        "Cool, portion, and add yoghurt dressing.",
        "Eat cold as a mini recovery meal.",
      ],
    },
  ],
};

Object.entries(expandedMealPools).forEach(([slot, meals]) => {
  mealPools[slot].push(...meals);
});

const dietLabels = {
  any: "Any balanced",
  "high-protein": "High protein",
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  "gluten-free": "Gluten-free",
  "dairy-free": "Dairy-free",
  "halal-friendly": "Halal-friendly",
};

const generatedImages = {
  oats: "https://www.themealdb.com/images/media/meals/uwq8001777540502.jpg",
  eggs: "https://www.themealdb.com/images/media/meals/eo0yfb1763600916.jpg",
  toast: "https://www.themealdb.com/images/media/meals/1550440197.jpg",
  chicken: "https://www.themealdb.com/images/media/meals/qptpvt1487339892.jpg",
  beef: "https://www.themealdb.com/images/media/meals/1529444830.jpg",
  salmon: "https://www.themealdb.com/images/media/meals/xxyupu1468262513.jpg",
  tuna: "https://www.themealdb.com/images/media/meals/yypwwq1511304979.jpg",
  fish: "https://www.themealdb.com/images/media/meals/7n8su21699013057.jpg",
  turkey: "https://www.themealdb.com/images/media/meals/ypuxtw1511297463.jpg",
  lamb: "https://www.themealdb.com/images/media/meals/yuwtuu1511295751.jpg",
  beans: "https://www.themealdb.com/images/media/meals/sywrsu1511463066.jpg",
  tofu: "https://www.themealdb.com/images/media/meals/wqurxy1511453156.jpg",
  salad: "https://www.themealdb.com/images/media/meals/zry07j1763779321.jpg",
  snack: "https://www.themealdb.com/images/media/meals/93iok31766436070.jpg",
};

const mealComponents = {
  breakfastProteins: [
    { name: "eggs", label: "eggs", calories: 160, protein: 13, cost: "budget", diets: ["vegetarian", "gluten-free", "dairy-free", "halal-friendly"], image: "eggs", amount: "2 eggs" },
    { name: "Greek yoghurt", label: "Greek yoghurt", calories: 190, protein: 21, cost: "standard", diets: ["vegetarian", "gluten-free", "halal-friendly"], image: "oats", amount: "200g" },
    { name: "cottage cheese", label: "cottage cheese", calories: 165, protein: 24, cost: "standard", diets: ["vegetarian", "gluten-free", "halal-friendly"], image: "oats", amount: "170g" },
    { name: "protein powder", label: "protein shake", calories: 130, protein: 25, cost: "standard", diets: ["vegetarian", "gluten-free"], image: "oats", amount: "1 scoop" },
    { name: "turkey slices", label: "turkey", calories: 135, protein: 28, cost: "standard", diets: ["gluten-free", "dairy-free", "halal-friendly"], image: "turkey", amount: "100g" },
    { name: "tofu", label: "tofu scramble", calories: 170, protein: 18, cost: "budget", diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], image: "tofu", amount: "180g" },
    { name: "black beans", label: "black beans", calories: 160, protein: 10, cost: "budget", diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], image: "beans", amount: "3/4 cup" },
  ],
  proteins: [
    { name: "chicken breast", label: "chicken", calories: 260, protein: 50, cost: "standard", diets: ["gluten-free", "dairy-free", "halal-friendly"], image: "chicken", amount: "160g cooked" },
    { name: "turkey mince", label: "turkey", calories: 245, protein: 42, cost: "standard", diets: ["gluten-free", "dairy-free", "halal-friendly"], image: "turkey", amount: "160g cooked" },
    { name: "lean beef mince", label: "lean beef", calories: 290, protein: 43, cost: "standard", diets: ["gluten-free", "dairy-free", "halal-friendly"], image: "beef", amount: "160g cooked" },
    { name: "lean steak", label: "steak", calories: 320, protein: 48, cost: "standard", diets: ["gluten-free", "dairy-free", "halal-friendly"], image: "beef", amount: "170g cooked" },
    { name: "salmon", label: "salmon", calories: 310, protein: 38, cost: "standard", diets: ["gluten-free", "dairy-free", "halal-friendly"], image: "salmon", amount: "150g fillet" },
    { name: "tuna", label: "tuna", calories: 160, protein: 36, cost: "budget", diets: ["gluten-free", "dairy-free", "halal-friendly"], image: "tuna", amount: "1 can" },
    { name: "white fish", label: "white fish", calories: 180, protein: 39, cost: "standard", diets: ["gluten-free", "dairy-free", "halal-friendly"], image: "fish", amount: "170g" },
    { name: "lean lamb", label: "lamb", calories: 330, protein: 43, cost: "standard", diets: ["gluten-free", "dairy-free", "halal-friendly"], image: "lamb", amount: "160g cooked" },
    { name: "eggs", label: "egg", calories: 160, protein: 13, cost: "budget", diets: ["vegetarian", "gluten-free", "dairy-free", "halal-friendly"], image: "eggs", amount: "2 eggs" },
    { name: "tofu", label: "tofu", calories: 210, protein: 22, cost: "budget", diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], image: "tofu", amount: "200g" },
    { name: "kidney beans", label: "kidney bean", calories: 230, protein: 15, cost: "budget", diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], image: "beans", amount: "1 cup" },
    { name: "red lentils", label: "lentil", calories: 230, protein: 18, cost: "budget", diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], image: "beans", amount: "1 cup cooked" },
  ],
  carbs: [
    { name: "rice", label: "rice", calories: 230, protein: 5, diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], amount: "1 cup cooked" },
    { name: "potatoes", label: "potato", calories: 210, protein: 5, diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], amount: "230g" },
    { name: "kumara", label: "kumara", calories: 190, protein: 4, diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], amount: "220g" },
    { name: "quinoa", label: "quinoa", calories: 220, protein: 8, diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], amount: "1 cup cooked" },
    { name: "couscous", label: "couscous", calories: 210, protein: 7, diets: ["vegetarian", "vegan", "dairy-free", "halal-friendly"], amount: "1 cup cooked" },
    { name: "pasta", label: "pasta", calories: 250, protein: 8, diets: ["vegetarian", "vegan", "dairy-free", "halal-friendly"], amount: "1.25 cups cooked" },
    { name: "wholemeal wrap", label: "wrap", calories: 190, protein: 7, diets: ["vegetarian", "vegan", "dairy-free", "halal-friendly"], amount: "1 large wrap" },
    { name: "rolled oats", label: "oats", calories: 210, protein: 7, diets: ["vegetarian", "vegan", "dairy-free", "halal-friendly"], amount: "60g" },
  ],
  vegetables: [
    { name: "broccoli", label: "broccoli", amount: "1.5 cups" },
    { name: "spinach", label: "spinach", amount: "1 packed cup" },
    { name: "green beans", label: "green beans", amount: "1 cup" },
    { name: "cabbage slaw", label: "slaw", amount: "1.5 cups" },
    { name: "stir fry vegetables", label: "stir-fry veg", amount: "2 cups" },
    { name: "mixed vegetables", label: "mixed veg", amount: "1.5 cups" },
    { name: "cucumber", label: "cucumber", amount: "1/2 cucumber" },
    { name: "tomatoes", label: "tomatoes", amount: "1/2 can" },
  ],
  sauces: [
    { name: "soy sauce", label: "soy", calories: 20, diets: ["vegetarian", "vegan", "dairy-free", "halal-friendly"], amount: "1 tbsp" },
    { name: "lemon dressing", label: "lemon", calories: 45, diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], amount: "1 tbsp" },
    { name: "Greek yoghurt dressing", label: "yoghurt", calories: 70, diets: ["vegetarian", "gluten-free", "halal-friendly"], amount: "2 tbsp" },
    { name: "salsa", label: "salsa", calories: 35, diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], amount: "2 tbsp" },
    { name: "chilli spice", label: "chilli", calories: 20, diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], amount: "1 tsp" },
  ],
};

function generateMealLibrary() {
  const generated = { breakfast: [], lunch: [], dinner: [], snack: [] };

  const breakfastStyles = [
    { suffix: "bowl", extraCalories: 80, extraProtein: 4, prep: "bowl" },
    { suffix: "wrap", extraCalories: 170, extraProtein: 6, prep: "wrap", requiredCarb: "wholemeal wrap" },
    { suffix: "hash", extraCalories: 140, extraProtein: 3, prep: "pan" },
    { suffix: "prep pot", extraCalories: 60, extraProtein: 3, prep: "cold" },
  ];

  mealComponents.breakfastProteins.forEach((protein, proteinIndex) => {
    mealComponents.carbs.slice(0, 7).forEach((carb, carbIndex) => {
      mealComponents.vegetables.slice(0, 5).forEach((veg, vegIndex) => {
        const style = breakfastStyles[(proteinIndex + carbIndex + vegIndex) % breakfastStyles.length];
        if (style.requiredCarb && carb.name !== style.requiredCarb) return;
        generated.breakfast.push(buildGeneratedMeal("breakfast", protein, carb, veg, mealComponents.sauces[vegIndex % mealComponents.sauces.length], style));
      });
    });
  });

  const mealStyles = {
    lunch: [
      { suffix: "field bowl", extraCalories: 80, extraProtein: 2, prep: "bowl" },
      { suffix: "patrol wrap", extraCalories: 120, extraProtein: 3, prep: "wrap", requiredCarb: "wholemeal wrap" },
      { suffix: "recovery salad", extraCalories: 40, extraProtein: 2, prep: "cold" },
      { suffix: "hot box", extraCalories: 90, extraProtein: 2, prep: "pan" },
    ],
    dinner: [
      { suffix: "dinner plate", extraCalories: 120, extraProtein: 3, prep: "plate" },
      { suffix: "stir-fry", extraCalories: 95, extraProtein: 2, prep: "pan" },
      { suffix: "recovery bowl", extraCalories: 110, extraProtein: 2, prep: "bowl" },
      { suffix: "batch cook", extraCalories: 130, extraProtein: 3, prep: "batch" },
    ],
  };

  ["lunch", "dinner"].forEach((slot) => {
    const operationalCarbs = mealComponents.carbs.filter((carb) => carb.name !== "rolled oats");
    mealComponents.proteins.forEach((protein, proteinIndex) => {
      operationalCarbs.forEach((carb, carbIndex) => {
        mealComponents.vegetables.forEach((veg, vegIndex) => {
          const style = mealStyles[slot][(proteinIndex + carbIndex + vegIndex) % mealStyles[slot].length];
          if (style.requiredCarb && carb.name !== style.requiredCarb) return;
          generated[slot].push(buildGeneratedMeal(slot, protein, carb, veg, mealComponents.sauces[(proteinIndex + vegIndex) % mealComponents.sauces.length], style));
        });
      });
    });
  });

  const snackBases = [
    { name: "Greek yoghurt", label: "yoghurt", calories: 190, protein: 21, cost: "standard", diets: ["vegetarian", "gluten-free", "halal-friendly"], image: "oats", amount: "200g" },
    { name: "cottage cheese", label: "cottage cheese", calories: 165, protein: 24, cost: "standard", diets: ["vegetarian", "gluten-free", "halal-friendly"], image: "snack", amount: "170g" },
    { name: "boiled eggs", label: "egg", calories: 155, protein: 13, cost: "budget", diets: ["vegetarian", "gluten-free", "dairy-free", "halal-friendly"], image: "eggs", amount: "2 eggs" },
    { name: "hummus", label: "hummus", calories: 180, protein: 7, cost: "budget", diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], image: "snack", amount: "4 tbsp" },
    { name: "tuna", label: "tuna", calories: 110, protein: 25, cost: "budget", diets: ["gluten-free", "dairy-free", "halal-friendly"], image: "tuna", amount: "1/2 can" },
    { name: "protein powder", label: "protein", calories: 130, protein: 25, cost: "standard", diets: ["vegetarian", "gluten-free"], image: "oats", amount: "1 scoop" },
    { name: "tofu", label: "tofu", calories: 140, protein: 15, cost: "budget", diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], image: "tofu", amount: "140g" },
  ];
  const snackAdds = [
    { name: "banana", label: "banana", calories: 105, protein: 1, diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], amount: "1 medium" },
    { name: "apple", label: "apple", calories: 95, protein: 1, diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], amount: "1 medium" },
    { name: "mixed berries", label: "berries", calories: 60, protein: 1, diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], amount: "80g" },
    { name: "wholegrain crackers", label: "crackers", calories: 120, protein: 3, diets: ["vegetarian", "vegan", "dairy-free", "halal-friendly"], amount: "6 crackers" },
    { name: "carrot sticks", label: "carrots", calories: 45, protein: 1, diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], amount: "1 cup" },
    { name: "mixed nuts", label: "nuts", calories: 170, protein: 6, diets: ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"], amount: "30g" },
    { name: "rolled oats", label: "oats", calories: 105, protein: 4, diets: ["vegetarian", "vegan", "dairy-free", "halal-friendly"], amount: "30g" },
  ];
  snackBases.forEach((base, baseIndex) => {
    snackAdds.forEach((add, addIndex) => {
      generated.snack.push(buildGeneratedSnack(base, add, baseIndex + addIndex));
    });
  });

  return generated;
}

function buildGeneratedMeal(slot, protein, carb, veg, sauce, style) {
  const proteinBoost = protein.protein >= 35 || protein.name === "protein powder" ? ["high-protein"] : [];
  const diets = intersectDiets(protein.diets, carb.diets, sauce.diets, ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"]);
  const calories = protein.calories + carb.calories + 70 + (sauce.calories || 0) + style.extraCalories;
  const proteinGrams = protein.protein + carb.protein + style.extraProtein;
  const name = `${capitalize(protein.label)} ${carb.label} ${veg.label} ${style.suffix}`;
  return {
    name,
    calories,
    protein: proteinGrams,
    tags: goalTagsForCalories(calories),
    dietTags: [...new Set([...diets, ...proteinBoost])],
    cost: protein.cost === "budget" && calories < 680 ? "budget" : "standard",
    image: "",
    source: "Forge expanded meal library",
    ingredients: [protein.name, carb.name, veg.name, sauce.name],
    amounts: {
      [protein.name]: protein.amount,
      [carb.name]: carb.amount,
      [veg.name]: veg.amount,
      [sauce.name]: sauce.amount,
    },
    steps: generatedPrepSteps(style.prep, protein.label, carb.label, veg.label, sauce.label),
  };
}

function buildGeneratedSnack(base, add, index) {
  const diets = intersectDiets(base.diets, add.diets, ["vegetarian", "vegan", "gluten-free", "dairy-free", "halal-friendly"]);
  const calories = base.calories + add.calories + (index % 3 === 0 ? 35 : 0);
  const proteinGrams = base.protein + add.protein;
  return {
    name: `${capitalize(base.label)} ${add.label} snack`,
    calories,
    protein: proteinGrams,
    tags: goalTagsForCalories(calories),
    dietTags: [...new Set([...diets, proteinGrams >= 24 ? "high-protein" : ""])].filter(Boolean),
    cost: base.cost === "budget" ? "budget" : "standard",
    image: "",
    source: "Forge expanded snack library",
    ingredients: [base.name, add.name],
    amounts: {
      [base.name]: base.amount,
      [add.name]: add.amount,
    },
    steps: [
      "Portion both ingredients before the shift or training block.",
      "Keep cold items chilled and dry items separate until eating.",
      "Use it as a controlled snack rather than grazing from the packet.",
    ],
  };
}

function intersectDiets(...dietLists) {
  const [first = [], ...rest] = dietLists;
  return first.filter((diet) => rest.every((list) => list.includes(diet)));
}

function goalTagsForCalories(calories) {
  if (calories <= 430) return ["lose", "maintain"];
  if (calories >= 720) return ["maintain", "build"];
  return ["lose", "maintain", "build"];
}

function generatedPrepSteps(prep, protein, carb, veg, sauce) {
  if (prep === "wrap") {
    return [
      `Warm the wrap, then add ${protein}, ${veg}, and ${sauce}.`,
      `Add the ${carb} portion only if it is not already the wrap base.`,
      "Roll tightly and pack in foil for a clean field meal.",
    ];
  }
  if (prep === "cold") {
    return [
      `Cook or prep the ${protein} and ${carb} ahead of time.`,
      `Layer with ${veg}, then add ${sauce} just before eating.`,
      "Keep chilled and use within the day.",
    ];
  }
  if (prep === "batch") {
    return [
      `Batch cook the ${protein} with simple seasoning.`,
      `Cook ${carb} and portion it with ${veg}.`,
      `Add ${sauce}, cool quickly, and store extra portions for the week.`,
    ];
  }
  return [
    `Cook the ${protein} first and keep the portion controlled.`,
    `Add ${carb} and ${veg}, then heat through.`,
    `Finish with ${sauce} and adjust seasoning without adding hidden calories.`,
  ];
}

const generatedMealPools = generateMealLibrary();

Object.entries(generatedMealPools).forEach(([slot, meals]) => {
  mealPools[slot].push(...meals);
});

const traineeScreen = document.querySelector("#traineeScreen");
const trainScreen = document.querySelector("#trainScreen");
const seriesScreen = document.querySelector("#seriesScreen");
const mealPlanScreen = document.querySelector("#mealPlanScreen");
const managerScreen = document.querySelector("#managerScreen");
const settingsScreen = document.querySelector("#settingsScreen");
const screenTitle = document.querySelector("#screenTitle");
const themeColorMeta = document.querySelector("#themeColorMeta");
const traineeRole = document.querySelector("#traineeRole");
const managerRole = document.querySelector("#managerRole");
const roleToggle = document.querySelector("#roleToggle");
const themeButtons = document.querySelectorAll("[data-theme-choice]");
const libraryList = document.querySelector("#libraryList");
const libraryCount = document.querySelector("#libraryCount");
const assignedModules = document.querySelector("#assignedModules");
const assignedCount = document.querySelector("#assignedCount");
const moduleDialog = document.querySelector("#moduleDialog");
const moduleForm = document.querySelector("#moduleForm");
const assignDialog = document.querySelector("#assignDialog");
const assignForm = document.querySelector("#assignForm");
const assignModule = document.querySelector("#assignModule");
const breathingDialog = document.querySelector("#breathingDialog");
const sebDialog = document.querySelector("#sebDialog");
const cognitiveDialog = document.querySelector("#cognitiveDialog");
const workoutDialog = document.querySelector("#workoutDialog");
const moduleDetailDialog = document.querySelector("#moduleDetailDialog");
const progressDialog = document.querySelector("#progressDialog");
const breathControl = document.querySelector("#breathControl");
const breathTitle = document.querySelector("#breathTitle");
const breathInstruction = document.querySelector("#breathInstruction");
const breathPhase = document.querySelector("#breathPhase");
const breathCount = document.querySelector("#breathCount");
const breathOrb = document.querySelector("#breathOrb");
const resetCopy = document.querySelector("#resetCopy");
const sebReflection = document.querySelector("#sebReflection");
const workoutStatus = document.querySelector("#workoutStatus");
const workoutControl = document.querySelector("#workoutControl");
const heartRateInput = document.querySelector("#heartRateInput");
const confirmHeartRate = document.querySelector("#confirmHeartRate");
const cognitiveTaskTitle = document.querySelector("#cognitiveTaskTitle");
const sequenceStatus = document.querySelector("#sequenceStatus");
const sequenceProgress = document.querySelector("#sequenceProgress");
const numberGrid = document.querySelector("#numberGrid");
const resetSequence = document.querySelector("#resetSequence");
const sequenceTask = document.querySelector("#sequenceTask");
const colourTask = document.querySelector("#colourTask");
const mathsTask = document.querySelector("#mathsTask");
const nbackTask = document.querySelector("#nbackTask");
const trackerTask = document.querySelector("#trackerTask");
const vigilanceTask = document.querySelector("#vigilanceTask");
const reciteTask = document.querySelector("#reciteTask");
const colourCard = document.querySelector("#colourCard");
const colourWord = document.querySelector("#colourWord");
const colourChoices = document.querySelector("#colourChoices");
const mathsCard = document.querySelector("#mathsCard");
const mathsQuestion = document.querySelector("#mathsQuestion");
const mathsChoices = document.querySelector("#mathsChoices");
const protocolStage = document.querySelector("#protocolStage");
const protocolTimer = document.querySelector("#protocolTimer");
const baselineMetric = document.querySelector("#baselineMetric");
const tacticalEfficiency = document.querySelector("#tacticalEfficiency");
const startBaselineTest = document.querySelector("#startBaselineTest");
const startLoadTimer = document.querySelector("#startLoadTimer");
const bpmGatekeeper = document.querySelector("#bpmGatekeeper");
const timeLoad = document.querySelector("#timeLoad");
const sensoryLoad = document.querySelector("#sensoryLoad");
const secondaryLoad = document.querySelector("#secondaryLoad");
const nbackGrid = document.querySelector("#nbackGrid");
const visualMatch = document.querySelector("#visualMatch");
const audioMatch = document.querySelector("#audioMatch");
const trackerField = document.querySelector("#trackerField");
const vigilanceCue = document.querySelector("#vigilanceCue");
const peripheralChoices = document.querySelector("#peripheralChoices");
const cooldownGate = document.querySelector("#cooldownGate");
const cooldownTarget = document.querySelector("#cooldownTarget");
const cooldownCopy = document.querySelector("#cooldownCopy");
const completeCooldown = document.querySelector("#completeCooldown");
const reciteCard = document.querySelector("#reciteCard");
const recitePrompt = document.querySelector("#recitePrompt");
const reciteChoices = document.querySelector("#reciteChoices");
const workoutTestDialog = document.querySelector("#workoutTestDialog");
const workoutTestTitle = document.querySelector("#workoutTestTitle");
const workoutTestTimer = document.querySelector("#workoutTestTimer");
const workoutTestReps = document.querySelector("#workoutTestReps");
const workoutTestCopy = document.querySelector("#workoutTestCopy");
const workoutTestStandards = document.querySelector("#workoutTestStandards");
const startWorkoutTest = document.querySelector("#startWorkoutTest");
const addWorkoutRep = document.querySelector("#addWorkoutRep");
const resetWorkoutTest = document.querySelector("#resetWorkoutTest");
const launchCognitiveAfterTest = document.querySelector("#launchCognitiveAfterTest");
const mealPlanForm = document.querySelector("#mealPlanForm");
const mealGoal = document.querySelector("#mealGoal");
const mealDiet = document.querySelector("#mealDiet");
const mealBudget = document.querySelector("#mealBudget");
const weeklyFoodBudget = document.querySelector("#weeklyFoodBudget");
const mealPeople = document.querySelector("#mealPeople");
const mealsCovered = document.querySelector("#mealsCovered");
const budgetPriority = document.querySelector("#budgetPriority");
const avoidPremiumFoods = document.querySelector("#avoidPremiumFoods");
const mealWeight = document.querySelector("#mealWeight");
const mealHeight = document.querySelector("#mealHeight");
const mealAge = document.querySelector("#mealAge");
const mealActivity = document.querySelector("#mealActivity");
const healthSyncStatus = document.querySelector("#healthSyncStatus");
const healthConnectionPanel = document.querySelector("#healthConnectionPanel");
const healthPermissionState = document.querySelector("#healthPermissionState");
const healthLastSynced = document.querySelector("#healthLastSynced");
const activeCalories = document.querySelector("#activeCalories");
const stepCount = document.querySelector("#stepCount");
const restingHeartRate = document.querySelector("#restingHeartRate");
const recoveryFeel = document.querySelector("#recoveryFeel");
const applyHealthData = document.querySelector("#applyHealthData");
const syncHealthData = document.querySelector("#syncHealthData");
const nutritionSummary = document.querySelector("#nutritionSummary");
const weeklyMealPlan = document.querySelector("#weeklyMealPlan");
const refreshWeekPlan = document.querySelector("#refreshWeekPlan");
const moduleDetailTitle = document.querySelector("#moduleDetailTitle");
const moduleDetailCategory = document.querySelector("#moduleDetailCategory");
const moduleDetailNotes = document.querySelector("#moduleDetailNotes");
const moduleDetailMedia = document.querySelector("#moduleDetailMedia");
const moduleDetailAction = document.querySelector("#moduleDetailAction");
const mealDetailDialog = document.querySelector("#mealDetailDialog");
const mealDetailImage = document.querySelector("#mealDetailImage");
const mealDetailTitle = document.querySelector("#mealDetailTitle");
const mealDetailMeta = document.querySelector("#mealDetailMeta");
const mealIngredientList = document.querySelector("#mealIngredientList");
const mealPrepList = document.querySelector("#mealPrepList");
const mealWhyCopy = document.querySelector("#mealWhyCopy");
const toast = document.querySelector("#toast");

const resetCopyByStep = {
  Recognize: "Run your ACE check: scan the environment before the pressure narrows your focus.",
  Ground: "Set Composure: eyes up, shoulders back, strong neutral posture.",
  Breathe: "Reset with Equilibrium breathing before emotion takes over the decision.",
  Act: "Choose the next clear action: speak, move, pause, support, or disengage.",
};

const iconByCategory = {
  Workout: "icon-conditioning",
  Breathing: "icon-breath",
  "Mental Health": "icon-reset",
  Health: "icon-health",
};

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `module-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

document.querySelector("#newModuleButton").addEventListener("click", () => moduleDialog.showModal());
document.querySelector("#assignButton").addEventListener("click", openAssignDialog);
document.querySelector("#breathingButton").addEventListener("click", () => breathingDialog.showModal());
document.querySelector("#sebButton").addEventListener("click", openSebDialog);
document.querySelector("#cognitiveButton").addEventListener("click", openCognitiveDialog);
document.querySelector("#drillCognitiveButton").addEventListener("click", openCognitiveDialog);
document.querySelector("#drillBreathingButton").addEventListener("click", () => breathingDialog.showModal());
document.querySelector("#drillSitButton").addEventListener("click", openSebDialog);
document.querySelector("#startSelectedDrill").addEventListener("click", openCognitiveDialog);
document.querySelector("#burpeeWorkoutButton").addEventListener("click", () => showToast("Burpee selected"));
document.querySelector("#burpeeFitnessTestButton").addEventListener("click", () => openWorkoutTest("hundred"));
document.querySelector("#burpeeCapacityTestButton").addEventListener("click", () => openWorkoutTest("capacity"));
document.querySelector("#burpeeFormTestButton").addEventListener("click", () => openWorkoutTest("control"));
document.querySelector("#stressResetButton").addEventListener("click", openSebDialog);
document.querySelector("#closeBreathing").addEventListener("click", closeBreathing);
document.querySelector("#closeSeb").addEventListener("click", () => sebDialog.close());
document.querySelector("#closeCognitive").addEventListener("click", closeCognitive);
document.querySelector("#closeWorkout").addEventListener("click", closeWorkout);
document.querySelector("#closeWorkoutTest").addEventListener("click", closeWorkoutTest);
document.querySelector("#closeModuleDetail").addEventListener("click", () => moduleDetailDialog.close());
document.querySelector("#closeMealDetail").addEventListener("click", () => mealDetailDialog.close());
document.querySelector("#closeProgress").addEventListener("click", () => progressDialog.close());
document.querySelector("#startWorkout").addEventListener("click", openWorkoutDialog);
document.querySelector("#saveSebReflection").addEventListener("click", saveSebReflection);
breathControl.addEventListener("click", toggleBreathing);
workoutControl.addEventListener("click", toggleWorkout);
confirmHeartRate.addEventListener("click", confirmCognitiveLoad);
resetSequence.addEventListener("click", resetCognitiveDrill);
startBaselineTest.addEventListener("click", startRestedBaseline);
startLoadTimer.addEventListener("click", startPhysicalLoadTimer);
visualMatch.addEventListener("click", () => handleNbackChoice("visual"));
audioMatch.addEventListener("click", () => handleNbackChoice("audio"));
vigilanceCue.addEventListener("click", handleVigilanceTap);
completeCooldown.addEventListener("click", completeCooldownGate);
startWorkoutTest.addEventListener("click", toggleWorkoutTest);
addWorkoutRep.addEventListener("click", addWorkoutTestRep);
resetWorkoutTest.addEventListener("click", resetWorkoutTestState);
launchCognitiveAfterTest.addEventListener("click", () => {
  closeWorkoutTest();
  openCognitiveDialog();
});
moduleDetailAction.addEventListener("click", startActiveModule);
mealPlanForm.addEventListener("submit", buildMealPlanFromForm);
refreshWeekPlan.addEventListener("click", refreshFullMealPlan);
applyHealthData.addEventListener("click", applyDailyHealthData);
syncHealthData.addEventListener("click", syncSelectedHealthSource);
traineeRole.addEventListener("click", () => setRole("trainee"));
managerRole.addEventListener("click", () => setRole("manager"));
roleToggle.addEventListener("click", () => setRole(state.role === "trainee" ? "manager" : "trainee"));

themeButtons.forEach((button) => {
  button.addEventListener("click", () => setProfessionTheme(button.dataset.themeChoice));
});

document.querySelectorAll("[data-health-source]").forEach((button) => {
  button.addEventListener("click", () => setHealthSource(button.dataset.healthSource));
});

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => handleNav(button.dataset.nav));
});

document.querySelectorAll(".challenge-action").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".challenge-card").forEach((card) => card.classList.remove("active"));
    button.closest(".challenge-card").classList.add("active");
    showToast(`${button.dataset.challenge} selected`);
  });
});

document.querySelectorAll(".test-tab").forEach((button) => {
  button.addEventListener("click", () => setCognitiveTest(button.dataset.test));
});

document.querySelectorAll(".breath-tab").forEach((button) => {
  button.addEventListener("click", () => setBreathMethod(button.dataset.breath));
});

document.querySelectorAll(".category").forEach((button) => {
  button.addEventListener("click", () => {
    state.category = button.dataset.category;
    document.querySelectorAll(".category").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderLibrary();
  });
});

document.querySelectorAll(".reset-step").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".reset-step").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    resetCopy.textContent = resetCopyByStep[button.dataset.step];
  });
});

moduleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const module = {
    id: createId(),
    title: document.querySelector("#moduleTitle").value.trim(),
    category: document.querySelector("#moduleCategory").value,
    notes: document.querySelector("#moduleNotes").value.trim(),
    media: document.querySelector("#moduleMedia").value.trim(),
    assigned: false,
  };

  state.modules.unshift(module);
  persistModules();
  moduleForm.reset();
  moduleDialog.close();
  render();
  showToast("Training module saved");
});

assignForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const selected = state.modules.find((module) => module.id === assignModule.value);
  if (selected) {
    selected.assigned = true;
    persistModules();
    render();
    showToast(`${selected.title} assigned to ${document.querySelector("#assignGroup").value}`);
  }
  assignDialog.close();
});

function loadModules() {
  const saved = localStorage.getItem("forgeModules");
  if (!saved) return defaultModules;
  const savedModules = JSON.parse(saved).map(normalizeModule);
  const missingDefaults = defaultModules.filter(
    (defaultModule) => !savedModules.some((module) => module.title === defaultModule.title),
  );
  return [...missingDefaults, ...savedModules];
}

function loadMealProfile() {
  const fallback = {
    goal: "lose",
    diet: "any",
    budget: false,
    weeklyBudget: 90,
    people: 1,
    mealsCovered: 4,
    budgetPriority: "balanced",
    avoidPremiumFoods: true,
    weight: 86,
    height: 178,
    age: 32,
    activity: 1.55,
    activeCalories: 0,
    steps: 0,
    restingHeartRate: 60,
    recoveryFeel: "steady",
    syncSource: "Manual entry",
    permissionState: "Not requested",
    lastSynced: "",
    targetCalories: 2400,
  };
  const saved = localStorage.getItem("forgeMealProfile");
  return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
}

function loadProfessionTheme() {
  const saved = localStorage.getItem("forgeProfessionTheme");
  if (localStorage.getItem("forgeProfileCreated") && professionThemes[saved]) return saved;
  localStorage.setItem("forgeProfessionTheme", "police");
  return "police";
}

function persistProfessionTheme() {
  localStorage.setItem("forgeProfessionTheme", state.professionTheme);
}

function applyProfessionTheme() {
  document.body.dataset.theme = state.professionTheme;
  themeButtons.forEach((button) => {
    const isActive = button.dataset.themeChoice === state.professionTheme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", professionThemes[state.professionTheme].metaColor);
  }
}

function setProfessionTheme(theme) {
  if (!professionThemes[theme]) return;
  state.professionTheme = theme;
  persistProfessionTheme();
  applyProfessionTheme();
  showToast(professionThemes[theme].toast);
}

function createProtocolStats() {
  return {
    correct: 0,
    errors: 0,
    reactionTotal: 0,
    responses: 0,
    completedAt: "",
  };
}

function loadProtocolStats() {
  const saved = localStorage.getItem("forgeBaselineStats");
  return saved ? { ...createProtocolStats(), ...JSON.parse(saved) } : createProtocolStats();
}

function persistProtocolStats() {
  localStorage.setItem("forgeBaselineStats", JSON.stringify(state.baselineStats));
}

function persistMealProfile() {
  localStorage.setItem("forgeMealProfile", JSON.stringify(state.mealProfile));
}

function normalizeModule(module) {
  if (module.title === "HR cognitive stress drill") {
    return {
      ...module,
      notes: "Drive heart rate toward 180 bpm, choose a physical load, then complete a cognitive test under pressure.",
      assigned: true,
    };
  }
  if (module.title === "Box breathing drill" || module.title === equilibriumModuleTitle) {
    return {
      ...module,
      title: equilibriumModuleTitle,
      category: "Breathing",
      notes: "Equilibrium breathing to steady attention before and after hard efforts.",
      assigned: true,
    };
  }
  if (module.title !== "SEB pressure cycle" && module.title !== "Stress Inoculation Training (SIT)" && module.title !== aceModuleTitle) {
    return module;
  }
  return {
    ...module,
    title: aceModuleTitle,
    category: "Mental Health",
    notes: "Awareness, Composure, and Equilibrium drills for clear decisions under pressure.",
    assigned: true,
    core: true,
  };
}

function persistModules() {
  localStorage.setItem("forgeModules", JSON.stringify(state.modules));
}

function setRole(role) {
  state.role = role;
  const isTrainee = role === "trainee";
  traineeScreen.classList.toggle("active", isTrainee);
  trainScreen.classList.remove("active");
  seriesScreen.classList.remove("active");
  mealPlanScreen.classList.remove("active");
  managerScreen.classList.toggle("active", !isTrainee);
  settingsScreen.classList.remove("active");
  traineeRole.classList.toggle("active", isTrainee);
  managerRole.classList.toggle("active", !isTrainee);
  screenTitle.textContent = isTrainee ? "Welcome to FORGE" : "FORGE command";
  roleToggle.setAttribute("aria-label", isTrainee ? "Switch to manager view" : "Switch to trainee view");
}

function render() {
  renderLibrary();
  renderAssigned();
  renderAssignOptions();
  renderMealInputs();
  if (!state.mealPlan.length) state.mealPlan = buildWeekPlan(state.mealProfile);
  renderMealPlan();
}

function renderLibrary() {
  const filtered =
    state.category === "All"
      ? state.modules
      : state.modules.filter((module) => module.category === state.category);

  libraryCount.textContent = `${filtered.length} ${filtered.length === 1 ? "item" : "items"}`;
  libraryList.innerHTML = filtered
    .map(
      (module) => `
        <button class="library-item module-button" type="button" data-module-id="${module.id}">
          <span class="module-icon ${categoryClass(module)}">
            <svg aria-hidden="true"><use href="#${moduleIcon(module)}"></use></svg>
          </span>
          <div>
            <strong>${escapeHtml(module.title)}</strong>
            <p>${escapeHtml(module.notes)}</p>
          </div>
          <span class="tag">${escapeHtml(module.category)}</span>
        </button>
      `,
    )
    .join("");

  libraryList.querySelectorAll("[data-module-id]").forEach((button) => {
    button.addEventListener("click", () => openModuleDetail(button.dataset.moduleId));
  });
}

function renderAssigned() {
  const assigned = state.modules.filter((module) => module.assigned);
  assignedCount.textContent = `${assigned.length} ready`;
  assignedModules.innerHTML = assigned
    .map(
      (module) => `
        <button class="module-card module-button" type="button" data-module-id="${module.id}">
          <span class="module-icon ${categoryClass(module)}">
            <svg aria-hidden="true"><use href="#${moduleIcon(module)}"></use></svg>
          </span>
          <span>
            <strong>${escapeHtml(module.title)}</strong>
            <p>${escapeHtml(module.notes)}</p>
          </span>
        </button>
      `,
    )
    .join("");

  assignedModules.querySelectorAll("[data-module-id]").forEach((button) => {
    button.addEventListener("click", () => openModuleDetail(button.dataset.moduleId));
  });
}

function moduleIcon(module) {
  if (module.title === aceModuleTitle) return "icon-seb";
  if (module.title === "HR cognitive stress drill") return "icon-cognitive";
  return iconByCategory[module.category] || "icon-conditioning";
}

function categoryClass(module) {
  const source =
    module.title === aceModuleTitle
      ? "seb"
      : module.title === "HR cognitive stress drill"
        ? "cognitive"
        : module.category;
  return `icon-${source.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function renderAssignOptions() {
  assignModule.innerHTML = state.modules
    .map((module) => `<option value="${module.id}">${escapeHtml(module.title)}</option>`)
    .join("");
}

function openAssignDialog() {
  renderAssignOptions();
  assignDialog.showModal();
}

function openSebDialog() {
  sebReflection.value = localStorage.getItem("forgeSebReflection") || "";
  sebDialog.showModal();
}

function openWorkoutDialog() {
  workoutDialog.showModal();
}

function openCognitiveDialog() {
  resetCognitiveDrill();
  renderProtocolMetrics();
  cognitiveDialog.showModal();
}

function openModuleDetail(moduleId) {
  const module = state.modules.find((item) => item.id === moduleId);
  if (!module) return;

  state.activeModuleId = module.id;
  moduleDetailTitle.textContent = module.title;
  moduleDetailCategory.textContent = module.category;
  moduleDetailNotes.textContent = module.notes;
  moduleDetailMedia.hidden = !module.media;
  moduleDetailMedia.href = module.media || "#";
  moduleDetailAction.textContent = module.assigned ? "Start module" : "Assign module";
  moduleDetailDialog.showModal();
}

function startActiveModule() {
  const module = state.modules.find((item) => item.id === state.activeModuleId);
  if (!module) return;

  if (!module.assigned) {
    module.assigned = true;
    persistModules();
    render();
    moduleDetailAction.textContent = "Start module";
    showToast(`${module.title} assigned`);
    return;
  }

  moduleDetailDialog.close();
  launchModule(module);
}

function launchModule(module) {
  if (module.title === aceModuleTitle || module.title === "Stress response reset") {
    openSebDialog();
    return;
  }

  if (module.title === equilibriumModuleTitle || module.title === "Box breathing drill") {
    breathingDialog.showModal();
    return;
  }

  if (module.title === "HR cognitive stress drill") {
    openCognitiveDialog();
    return;
  }

  if (module.category === "Workout") {
    openWorkoutDialog();
    return;
  }

  showToast(`${module.title} opened`);
}

function handleNav(destination) {
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.nav === destination));

  if (destination === "today") {
    setRole("trainee");
    traineeScreen.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (destination === "progress") {
    progressDialog.showModal();
    return;
  }

  if (destination === "meals") {
    state.role = "trainee";
    traineeScreen.classList.remove("active");
    trainScreen.classList.remove("active");
    seriesScreen.classList.remove("active");
    managerScreen.classList.remove("active");
    settingsScreen.classList.remove("active");
    mealPlanScreen.classList.add("active");
    traineeRole.classList.add("active");
    managerRole.classList.remove("active");
    screenTitle.textContent = "FORGE meals";
    mealPlanScreen.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (destination === "series") {
    state.role = "trainee";
    traineeScreen.classList.remove("active");
    trainScreen.classList.remove("active");
    mealPlanScreen.classList.remove("active");
    managerScreen.classList.remove("active");
    settingsScreen.classList.remove("active");
    seriesScreen.classList.add("active");
    traineeRole.classList.add("active");
    managerRole.classList.remove("active");
    screenTitle.textContent = "FORGE series";
    seriesScreen.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (destination === "settings") {
    state.role = "trainee";
    traineeScreen.classList.remove("active");
    trainScreen.classList.remove("active");
    mealPlanScreen.classList.remove("active");
    seriesScreen.classList.remove("active");
    managerScreen.classList.remove("active");
    settingsScreen.classList.add("active");
    traineeRole.classList.add("active");
    managerRole.classList.remove("active");
    screenTitle.textContent = "FORGE settings";
    settingsScreen.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (destination === "train") {
    state.role = "trainee";
    traineeScreen.classList.remove("active");
    seriesScreen.classList.remove("active");
    mealPlanScreen.classList.remove("active");
    managerScreen.classList.remove("active");
    settingsScreen.classList.remove("active");
    trainScreen.classList.add("active");
    traineeRole.classList.add("active");
    managerRole.classList.remove("active");
    screenTitle.textContent = "FORGE drills";
    trainScreen.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function openHealthConnectionPanel() {
  handleNav("settings");
  requestAnimationFrame(() => {
    healthConnectionPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  showToast("Health connection area opened");
}

function renderMealInputs() {
  mealGoal.value = state.mealProfile.goal;
  mealDiet.value = state.mealProfile.diet || "any";
  mealBudget.checked = Boolean(state.mealProfile.budget);
  weeklyFoodBudget.value = state.mealProfile.weeklyBudget || 90;
  mealPeople.value = state.mealProfile.people || 1;
  mealsCovered.value = String(state.mealProfile.mealsCovered || 4);
  budgetPriority.value = state.mealProfile.budgetPriority || "balanced";
  avoidPremiumFoods.checked = state.mealProfile.avoidPremiumFoods !== false;
  mealWeight.value = state.mealProfile.weight;
  mealHeight.value = state.mealProfile.height;
  mealAge.value = state.mealProfile.age;
  mealActivity.value = String(state.mealProfile.activity);
  activeCalories.value = state.mealProfile.activeCalories || 0;
  stepCount.value = state.mealProfile.steps || 0;
  restingHeartRate.value = state.mealProfile.restingHeartRate || 60;
  recoveryFeel.value = state.mealProfile.recoveryFeel || "steady";
  healthSyncStatus.textContent = state.mealProfile.syncSource || "Manual entry";
  healthPermissionState.textContent = state.mealProfile.permissionState || "Not requested";
  healthLastSynced.textContent = state.mealProfile.lastSynced
    ? `Last sync ${formatSyncTime(state.mealProfile.lastSynced)}`
    : "No health data synced yet";
  document.querySelectorAll("[data-health-source]").forEach((button) => {
    button.classList.toggle("active", button.dataset.healthSource === state.mealProfile.syncSource);
  });
}

function buildMealPlanFromForm(event) {
  event.preventDefault();
  state.mealProfile = readMealProfileFromInputs();
  state.mealPlan = buildWeekPlan(state.mealProfile);
  persistMealProfile();
  renderMealPlan();
  showToast("Weekly meal plan built");
}

function readMealProfileFromInputs() {
  const profile = {
    goal: mealGoal.value,
    diet: mealDiet.value,
    budget: mealBudget.checked,
    weeklyBudget: Number(weeklyFoodBudget.value) || 0,
    people: Math.max(1, Number(mealPeople.value) || 1),
    mealsCovered: Math.max(1, Number(mealsCovered.value) || 4),
    budgetPriority: budgetPriority.value,
    avoidPremiumFoods: avoidPremiumFoods.checked,
    weight: Number(mealWeight.value),
    height: Number(mealHeight.value),
    age: Number(mealAge.value),
    activity: Number(mealActivity.value),
    activeCalories: Number(activeCalories.value) || 0,
    steps: Number(stepCount.value) || 0,
    restingHeartRate: Number(restingHeartRate.value) || 60,
    recoveryFeel: recoveryFeel.value,
    syncSource: state.mealProfile.syncSource || "Manual entry",
    permissionState: state.mealProfile.permissionState || "Not requested",
    lastSynced: state.mealProfile.lastSynced || "",
  };
  profile.baseCalories = calculateBaseCalories(profile);
  profile.activityAdjustment = calculateActivityAdjustment(profile);
  profile.targetCalories = calculateCalories(profile);
  return profile;
}

function calculateBaseCalories(profile) {
  const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  const goalShift = profile.goal === "lose" ? -420 : profile.goal === "build" ? 320 : 0;
  return Math.max(1600, Math.round((bmr * profile.activity + goalShift) / 25) * 25);
}

function calculateActivityAdjustment(profile) {
  const addBackRate = profile.goal === "lose" ? 0.5 : profile.goal === "build" ? 0.9 : 0.75;
  const recoveryMultiplier = profile.recoveryFeel === "flat" ? 0.8 : profile.recoveryFeel === "sharp" ? 1.05 : 1;
  return Math.round(((profile.activeCalories || 0) * addBackRate * recoveryMultiplier) / 25) * 25;
}

function calculateCalories(profile) {
  const baseCalories = profile.baseCalories || calculateBaseCalories(profile);
  const activityAdjustment = profile.activityAdjustment ?? calculateActivityAdjustment(profile);
  return Math.max(1600, baseCalories + activityAdjustment);
}

function setHealthSource(source) {
  state.mealProfile.syncSource = source;
  state.mealProfile.permissionState = source === "Manual entry" ? "Manual entry" : "Ready to request";
  healthSyncStatus.textContent = source;
  healthPermissionState.textContent = state.mealProfile.permissionState;
  document.querySelectorAll("[data-health-source]").forEach((button) => {
    button.classList.toggle("active", button.dataset.healthSource === source);
  });
  persistMealProfile();
  showToast(`${source} selected`);
}

async function syncSelectedHealthSource() {
  const source = state.mealProfile.syncSource || "Manual entry";
  if (source === "Manual entry") {
    showToast("Choose Apple, Android, or Garmin first");
    return;
  }

  const connector = getNativeHealthConnector(source);
  if (!connector) {
    state.mealProfile.permissionState = "Native app required";
    persistMealProfile();
    renderMealInputs();
    showToast("Install as native app to request health permissions");
    return;
  }

  syncHealthData.disabled = true;
  syncHealthData.textContent = "Syncing...";
  state.mealProfile.permissionState = "Requesting permission";
  renderMealInputs();

  try {
    await connector.requestPermissions();
    state.mealProfile.permissionState = "Permission granted";
    renderMealInputs();

    const healthData = await connector.readDailyActivity();
    applySyncedHealthData(source, healthData);
    showToast(`${source} synced`);
  } catch (error) {
    state.mealProfile.permissionState = getHealthSyncError(error);
    persistMealProfile();
    renderMealInputs();
    showToast(state.mealProfile.permissionState);
  } finally {
    syncHealthData.disabled = false;
    syncHealthData.textContent = "Sync now";
  }
}

function getNativeHealthConnector(source) {
  const bridge = window.ForgeHealth || window.Capacitor?.Plugins?.ForgeHealth;
  if (bridge) return normalizeHealthBridge(bridge, source);

  const capacitorPlugins = window.Capacitor?.Plugins || {};
  if (source === "Apple Health" && capacitorPlugins.HealthKit) return normalizeHealthBridge(capacitorPlugins.HealthKit, source);
  if (source === "Health Connect" && capacitorPlugins.HealthConnect) return normalizeHealthBridge(capacitorPlugins.HealthConnect, source);
  if (source === "Garmin" && (window.ForgeGarmin || capacitorPlugins.GarminHealth)) {
    return normalizeHealthBridge(window.ForgeGarmin || capacitorPlugins.GarminHealth, source);
  }

  return null;
}

function normalizeHealthBridge(bridge, source) {
  return {
    requestPermissions: () => {
      if (typeof bridge.requestPermissions === "function") return bridge.requestPermissions({ source, metrics: healthMetricKeys() });
      if (typeof bridge.requestAuthorization === "function") return bridge.requestAuthorization({ source, metrics: healthMetricKeys() });
      if (typeof bridge.authorize === "function") return bridge.authorize({ source, metrics: healthMetricKeys() });
      return Promise.resolve();
    },
    readDailyActivity: async () => {
      const request = { source, date: new Date().toISOString(), metrics: healthMetricKeys() };
      if (typeof bridge.readDailyActivity === "function") return bridge.readDailyActivity(request);
      if (typeof bridge.getDailyActivity === "function") return bridge.getDailyActivity(request);
      if (typeof bridge.query === "function") return bridge.query(request);
      throw new Error("Daily activity read is not available");
    },
  };
}

function healthMetricKeys() {
  return ["activeCalories", "steps", "restingHeartRate"];
}

function applySyncedHealthData(source, healthData = {}) {
  const syncedAt = new Date().toISOString();
  const activeBurn = Number(healthData.activeCalories ?? healthData.activeEnergyBurned ?? healthData.caloriesBurned ?? 0);
  const syncedSteps = Number(healthData.steps ?? healthData.stepCount ?? 0);
  const syncedRestingHr = Number(healthData.restingHeartRate ?? healthData.restingHr ?? 60);

  activeCalories.value = Math.max(0, Math.round(activeBurn));
  stepCount.value = Math.max(0, Math.round(syncedSteps));
  restingHeartRate.value = Math.max(35, Math.round(syncedRestingHr || 60));

  state.mealProfile = {
    ...readMealProfileFromInputs(),
    syncSource: source,
    permissionState: "Synced",
    lastSynced: syncedAt,
  };
  state.mealPlan = buildWeekPlan(state.mealProfile);
  persistMealProfile();
  renderMealInputs();
  renderMealPlan();
}

function getHealthSyncError(error) {
  const message = String(error?.message || error || "");
  if (/denied|not authorized|permission/i.test(message)) return "Permission denied";
  if (/cancel/i.test(message)) return "Permission cancelled";
  if (/unavailable|not installed|not available/i.test(message)) return "Health source unavailable";
  return "Sync failed";
}

function formatSyncTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function applyDailyHealthData() {
  state.mealProfile = readMealProfileFromInputs();
  state.mealProfile.permissionState =
    state.mealProfile.syncSource === "Manual entry" ? "Manual entry applied" : state.mealProfile.permissionState;
  state.mealPlan = buildWeekPlan(state.mealProfile);
  persistMealProfile();
  renderMealInputs();
  renderMealPlan();
  showToast("Activity burn applied to meals");
}

function buildWeekPlan(profile) {
  const targetCalories = profile.targetCalories || calculateCalories(profile);
  return dayNames.map((day, dayIndex) => {
    const meals = {};
    mealSlots.forEach((slot, slotIndex) => {
      meals[slot] = pickMeal(slot, profile, targetCalories * mealTargets[slot], dayIndex + slotIndex);
    });
    return { day, meals };
  });
}

function pickMeal(slot, profile, targetCalories, offset = 0) {
  const options = getMealOptions(slot, profile, targetCalories);
  return options[offset % options.length];
}

function getMealOptions(slot, profile, targetCalories) {
  const goalMatches = mealPools[slot].filter((meal) => meal.tags.includes(profile.goal));
  const dietMatches = goalMatches.filter((meal) => matchesDietPreference(meal, profile.diet));
  const pool = dietMatches.length ? dietMatches : goalMatches.length ? goalMatches : mealPools[slot].filter((meal) => matchesDietPreference(meal, profile.diet));
  const fallbackPool = pool.length ? pool : goalMatches.length ? goalMatches : mealPools[slot];
  const strictBudget = profile.budget || profile.budgetPriority === "strict";
  const budgetAllowance = getMealCostAllowance(profile);
  const allowanceBuffer = profile.budgetPriority === "flexible" ? 1.45 : profile.budgetPriority === "strict" ? 1.05 : 1.2;
  const preferred = fallbackPool.filter((meal) => {
    if (strictBudget && meal.cost !== "budget") return false;
    if (profile.avoidPremiumFoods && hasPremiumIngredient(meal)) return false;
    if (budgetAllowance && estimateMealCost(meal) > budgetAllowance * allowanceBuffer) return false;
    return true;
  });
  const fallback = fallbackPool.filter((meal) => {
    if (profile.avoidPremiumFoods && hasPremiumIngredient(meal)) return false;
    return !budgetAllowance || estimateMealCost(meal) <= budgetAllowance * 1.8;
  });
  const options = preferred.length ? preferred : fallback.length ? fallback : fallbackPool;
  return [...options].sort((a, b) => mealScore(a, targetCalories, profile) - mealScore(b, targetCalories, profile));
}

function matchesDietPreference(meal, diet = "any") {
  if (!diet || diet === "any") return true;
  if (diet === "high-protein") return meal.protein >= highProteinThreshold(meal);
  return dietTagsForMeal(meal).includes(diet);
}

function highProteinThreshold(meal) {
  if (meal.calories <= 380) return 22;
  if (meal.calories <= 600) return 32;
  return 40;
}

function dietTagsForMeal(meal) {
  if (Array.isArray(meal.dietTags) && meal.dietTags.length) return meal.dietTags;
  const ingredients = meal.ingredients.join(" ").toLowerCase();
  const tags = ["halal-friendly"];
  const meatOrFish = /(chicken|turkey|beef|steak|lamb|salmon|tuna|fish|jerky)/.test(ingredients);
  const eggOrDairy = /(egg|yoghurt|cottage cheese|milk|cheese|protein powder)/.test(ingredients);
  const gluten = /(toast|wrap|tortilla|pasta|couscous|cracker|oats)/.test(ingredients);
  const dairy = /(yoghurt|cottage cheese|milk|cheese)/.test(ingredients);
  if (!meatOrFish) tags.push("vegetarian");
  if (!meatOrFish && !eggOrDairy) tags.push("vegan");
  if (!gluten) tags.push("gluten-free");
  if (!dairy) tags.push("dairy-free");
  if (meal.protein >= highProteinThreshold(meal)) tags.push("high-protein");
  return tags;
}

function mealScore(meal, targetCalories, profile) {
  const calorieScore = Math.abs(meal.calories - targetCalories);
  const costScore = estimateMealCost(meal) * (profile.budgetPriority === "flexible" ? 22 : profile.budgetPriority === "strict" ? 70 : 42);
  const premiumPenalty = profile.avoidPremiumFoods && hasPremiumIngredient(meal) ? 500 : 0;
  const standardPenalty = profile.budget && meal.cost !== "budget" ? 350 : 0;
  return calorieScore + costScore + premiumPenalty + standardPenalty;
}

function getMealCostAllowance(profile) {
  const weeklyBudget = Number(profile.weeklyBudget) || 0;
  if (!weeklyBudget) return 0;
  const people = Math.max(1, Number(profile.people) || 1);
  const meals = Math.max(1, Number(profile.mealsCovered) || 4);
  return weeklyBudget / people / 7 / meals;
}

function hasPremiumIngredient(meal) {
  const ingredients = meal.ingredients.join(" ").toLowerCase();
  return premiumIngredients.some((ingredient) => ingredients.includes(ingredient));
}

function estimateMealCost(meal) {
  const ingredientTotal = meal.ingredients.reduce((total, ingredient) => total + (ingredientCosts[ingredient] ?? 0.75), 0);
  const baseline = meal.cost === "budget" ? 2.4 : 4.8;
  return roundCurrency(Math.max(baseline, ingredientTotal));
}

function estimateWeekCost(mealPlan, people = 1) {
  const perPerson = mealPlan.reduce(
    (weekTotal, dayPlan) => weekTotal + mealSlots.reduce((dayTotal, slot) => dayTotal + estimateMealCost(dayPlan.meals[slot]), 0),
    0,
  );
  return roundCurrency(perPerson * Math.max(1, Number(people) || 1));
}

function totalMealLibraryCount() {
  return mealSlots.reduce((total, slot) => total + mealPools[slot].length, 0);
}

function roundCurrency(value) {
  return Math.round(value * 2) / 2;
}

function refreshFullMealPlan() {
  state.mealPlan = buildWeekPlan({
    ...state.mealProfile,
    targetCalories: calculateCalories(state.mealProfile) + randomInt(-75, 75),
  });
  renderMealPlan();
  showToast("New weekly meal plan loaded");
}

function refreshMeal(dayIndex, slot) {
  const current = state.mealPlan[dayIndex].meals[slot];
  const targetCalories = state.mealProfile.targetCalories * mealTargets[slot];
  const options = getMealOptions(slot, state.mealProfile, targetCalories).filter((meal) => meal.name !== current.name);
  const fallback = mealPools[slot].filter(
    (meal) =>
      meal.tags.includes(state.mealProfile.goal) &&
      matchesDietPreference(meal, state.mealProfile.diet) &&
      (!state.mealProfile.avoidPremiumFoods || !hasPremiumIngredient(meal)) &&
      meal.name !== current.name,
  );
  const pool = options.length ? options : fallback.length ? fallback : mealPools[slot].filter((meal) => meal.name !== current.name);
  state.mealPlan[dayIndex].meals[slot] = pickClosestRandom(pool, targetCalories);
  renderMealPlan();
  showToast(`${capitalize(slot)} refreshed`);
}

function pickClosestRandom(pool, targetCalories) {
  const ranked = [...pool].sort((a, b) => Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories));
  return ranked[randomInt(0, Math.min(7, ranked.length - 1))];
}

function renderMealPlan() {
  const profile = state.mealProfile;
  const targetCalories = profile.targetCalories || calculateCalories(profile);
  profile.targetCalories = targetCalories;
  profile.baseCalories = profile.baseCalories || calculateBaseCalories(profile);
  profile.activityAdjustment = profile.activityAdjustment ?? calculateActivityAdjustment(profile);
  const goalLabel =
    profile.goal === "lose" ? "Burn / lose weight" : profile.goal === "build" ? "Build strength" : "Maintain and perform";
  const budgetLabel = profile.budget ? "Tight budget" : "Standard";
  const estimatedWeekCost = estimateWeekCost(state.mealPlan, profile.people);
  const weeklyBudget = Number(profile.weeklyBudget) || 0;
  const budgetGap = roundCurrency(weeklyBudget - estimatedWeekCost);
  const budgetStatus = !weeklyBudget
    ? "Budget not set"
    : budgetGap >= 0
      ? `Inside by $${budgetGap}`
      : `Over by $${Math.abs(budgetGap)}`;
  nutritionSummary.innerHTML = `
    <article>
      <span>Goal</span>
      <strong>${escapeHtml(goalLabel)}</strong>
    </article>
    <article>
      <span>Diet mode</span>
      <strong>${escapeHtml(dietLabels[profile.diet] || dietLabels.any)}</strong>
    </article>
    <article>
      <span>Daily target</span>
      <strong>${targetCalories}<small> kcal</small></strong>
    </article>
    <article>
      <span>Activity burn</span>
      <strong>${profile.activeCalories || 0}<small> kcal</small></strong>
    </article>
    <article>
      <span>Meal adjustment</span>
      <strong>+${profile.activityAdjustment || 0}<small> kcal</small></strong>
    </article>
    <article>
      <span>Protein guide</span>
      <strong>${Math.round(profile.weight * 1.8)}<small> g</small></strong>
    </article>
    <article>
      <span>Meal budget</span>
      <strong>${escapeHtml(budgetLabel)}</strong>
    </article>
    <article>
      <span>Week estimate</span>
      <strong>$${estimatedWeekCost}<small> est</small></strong>
    </article>
    <article class="${budgetGap < 0 ? "over-budget" : "inside-budget"}">
      <span>Affordability</span>
      <strong>${escapeHtml(budgetStatus)}</strong>
    </article>
    <article>
      <span>Budget priority</span>
      <strong>${escapeHtml(budgetPriorityLabels[profile.budgetPriority] || "Balanced")}</strong>
    </article>
    <article>
      <span>People covered</span>
      <strong>${profile.people || 1}<small> ppl</small></strong>
    </article>
    <article>
      <span>Meal library</span>
      <strong>${totalMealLibraryCount()}<small> options</small></strong>
    </article>
  `;

  weeklyMealPlan.innerHTML = state.mealPlan
    .map((dayPlan, dayIndex) => {
      const dayCalories = mealSlots.reduce((total, slot) => total + dayPlan.meals[slot].calories, 0);
      return `
        <article class="day-plan">
          <div class="day-head">
            <h3>${dayPlan.day}</h3>
            <span>${dayCalories} kcal</span>
          </div>
          <div class="meal-list">
            ${mealSlots.map((slot) => renderMealCard(dayPlan.meals[slot], slot, dayIndex)).join("")}
          </div>
        </article>
      `;
    })
    .join("");

  weeklyMealPlan.querySelectorAll("[data-refresh-meal]").forEach((button) => {
    button.addEventListener("click", () => refreshMeal(Number(button.dataset.day), button.dataset.slot));
  });

  weeklyMealPlan.querySelectorAll("[data-open-meal]").forEach((button) => {
    button.addEventListener("click", () => openMealDetail(Number(button.dataset.day), button.dataset.slot));
  });
}

function renderMealCard(meal, slot, dayIndex) {
  return `
    <div class="meal-card">
      <button class="meal-main" data-open-meal type="button" data-day="${dayIndex}" data-slot="${slot}">
        <img class="meal-thumb" src="${escapeHtml(mealImage(meal, slot))}" alt="" loading="lazy" />
        <span>${escapeHtml(capitalize(slot))}</span>
        <strong>${escapeHtml(meal.name)}</strong>
        <small>${meal.calories} kcal · ${meal.protein}g protein · $${estimateMealCost(meal)} est · ${
          meal.cost === "budget" ? "budget" : "standard"
        }</small>
        <p class="meal-ingredients">${renderIngredients(meal.ingredients)}</p>
      </button>
      <button class="icon-button plain refresh-meal" data-refresh-meal type="button" data-day="${dayIndex}" data-slot="${slot}" aria-label="Refresh ${slot}">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12a7 7 0 0 1 11.8-5.1" />
          <path d="M17 3v4h-4" />
          <path d="M19 12a7 7 0 0 1-11.8 5.1" />
          <path d="M7 21v-4h4" />
        </svg>
      </button>
    </div>
  `;
}

function openMealDetail(dayIndex, slot) {
  const dayPlan = state.mealPlan[dayIndex];
  const meal = dayPlan?.meals?.[slot];
  if (!meal) return;

  mealDetailTitle.textContent = meal.name;
  mealDetailImage.src = mealImage(meal, slot);
  mealDetailImage.alt = "";
  mealDetailMeta.innerHTML = `
    <article><span>Day</span><strong>${escapeHtml(dayPlan.day)} ${escapeHtml(capitalize(slot))}</strong></article>
    <article><span>Energy est</span><strong>${meal.calories}<small> kcal</small></strong></article>
    <article><span>Protein est</span><strong>${meal.protein}<small> g</small></strong></article>
    <article><span>Est cost</span><strong>$${estimateMealCost(meal)}<small> pp</small></strong></article>
    <article><span>Source</span><strong>${escapeHtml(meal.source || "Forge estimate")}</strong></article>
    <article><span>Diet tags</span><strong>${escapeHtml(formatDietTags(meal))}</strong></article>
  `;
  mealIngredientList.innerHTML = meal.ingredients
    .map(
      (ingredient) => `
        <li>
          <span>${escapeHtml(ingredient)}</span>
          <strong>${escapeHtml(getIngredientAmount(ingredient, meal))}</strong>
        </li>
      `,
    )
    .join("");
  mealPrepList.innerHTML = buildPrepSteps(meal, slot).map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  mealWhyCopy.textContent = buildMealWhy(meal, slot, state.mealProfile);
  mealDetailDialog.showModal();
}

function getIngredientAmount(ingredient, meal) {
  if (meal.amounts?.[ingredient]) return meal.amounts[ingredient];
  if (ingredientAmounts[ingredient]) return ingredientAmounts[ingredient];
  if (/spice|seasoning|salt|pepper|cinnamon/i.test(ingredient)) return "to taste";
  if (meal.calories >= 700) return "1 large serve";
  if (meal.calories <= 320) return "1 snack serve";
  return "1 standard serve";
}

function mealImage(meal, slot) {
  return meal.image || generatedMealTile(meal, slot);
}

function generatedMealTile(meal, slot) {
  const accent = mealAccent(meal, slot);
  const title = escapeSvgText(meal.name);
  const ingredients = escapeSvgText(meal.ingredients.slice(0, 4).join(" · "));
  const diet = escapeSvgText(formatDietTags(meal).split(" · ").slice(0, 2).join(" · "));
  const calories = escapeSvgText(`${meal.calories} kcal · ${meal.protein}g protein`);
  const circles = meal.ingredients.slice(0, 5).map((ingredient, index) => {
    const color = ingredientColor(ingredient);
    const x = 72 + index * 52;
    const y = index % 2 ? 82 : 62;
    return `<circle cx="${x}" cy="${y}" r="22" fill="${color}" opacity="0.95"/><circle cx="${x - 6}" cy="${y - 6}" r="7" fill="#ffffff" opacity="0.16"/>`;
  }).join("");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#101313"/>
          <stop offset="0.62" stop-color="${accent}"/>
          <stop offset="1" stop-color="#090b0b"/>
        </linearGradient>
      </defs>
      <rect width="640" height="360" rx="28" fill="url(#bg)"/>
      <circle cx="154" cy="88" r="74" fill="none" stroke="#d0b982" stroke-width="3" opacity="0.28"/>
      <circle cx="154" cy="88" r="54" fill="#111313" opacity="0.72"/>
      ${circles}
      <text x="36" y="196" fill="#f4efe3" font-family="Arial, sans-serif" font-size="34" font-weight="800">${title}</text>
      <text x="36" y="238" fill="#d0b982" font-family="Arial, sans-serif" font-size="22" font-weight="700">${calories}</text>
      <text x="36" y="278" fill="#c9c1af" font-family="Arial, sans-serif" font-size="19" font-weight="700">${ingredients}</text>
      <text x="36" y="318" fill="#8fc1af" font-family="Arial, sans-serif" font-size="18" font-weight="800">${diet}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function mealAccent(meal, slot) {
  const ingredients = meal.ingredients.join(" ").toLowerCase();
  if (/salmon|tuna|fish/.test(ingredients)) return "#124f56";
  if (/beef|steak|lamb/.test(ingredients)) return "#51241f";
  if (/chicken|turkey|egg/.test(ingredients)) return "#50441f";
  if (/tofu|bean|lentil|hummus/.test(ingredients)) return "#244b34";
  if (slot === "snack") return "#334049";
  return "#2c3f34";
}

function ingredientColor(ingredient) {
  const value = ingredient.toLowerCase();
  if (/salmon|tuna|fish/.test(value)) return "#60c2c9";
  if (/beef|steak|lamb/.test(value)) return "#c26755";
  if (/chicken|turkey|egg/.test(value)) return "#e0c15f";
  if (/tofu|bean|lentil|hummus/.test(value)) return "#75b86e";
  if (/rice|potato|kumara|pasta|oats|quinoa|couscous|wrap/.test(value)) return "#d0b982";
  if (/spinach|broccoli|beans|greens|slaw|cucumber|vegetables/.test(value)) return "#64a878";
  if (/berry|apple|banana|orange/.test(value)) return "#c98554";
  return "#8fc1af";
}

function escapeSvgText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .slice(0, 72);
}

function formatDietTags(meal) {
  const tags = dietTagsForMeal(meal);
  if (!tags.length) return "Balanced";
  return tags
    .filter((tag) => tag !== "")
    .slice(0, 4)
    .map((tag) => dietLabels[tag] || capitalize(tag.replace(/-/g, " ")))
    .join(" · ");
}

function buildPrepSteps(meal, slot) {
  if (Array.isArray(meal.steps) && meal.steps.length) return meal.steps;
  const ingredients = meal.ingredients.join(" ").toLowerCase();
  if (slot === "snack") {
    return [
      "Portion the ingredients before training or work so it is ready when energy drops.",
      "Keep it simple: assemble cold, or warm the toast/eggs if the meal needs it.",
      "Eat it with water and reassess hunger after 10 minutes.",
    ];
  }
  if (/rice|pasta|potatoes|quinoa|couscous|oats|lentils/.test(ingredients)) {
    return [
      "Cook the main carbohydrate first and portion it into the bowl or container.",
      "Cook or add the protein, then add vegetables for volume and micronutrients.",
      "Season lightly, mix through the sauce or yoghurt, and pack the meal if needed.",
    ];
  }
  if (/wrap|tortillas|toast|crackers/.test(ingredients)) {
    return [
      "Lay out the wrap, toast, tortillas, or crackers as the base.",
      "Add the protein first, then layer vegetables or fruit for texture and fibre.",
      "Season, fold or plate it, and keep sauces controlled so calories stay predictable.",
    ];
  }
  return [
    "Prepare the protein first and keep the portion close to the listed amount.",
    "Add vegetables or fruit to increase fullness without blowing out calories.",
    "Season simply and keep the meal easy to repeat during a training week.",
  ];
}

function buildMealWhy(meal, slot, profile) {
  const goalCopy =
    profile.goal === "lose"
      ? "It supports fat loss by keeping protein high and calories controlled."
      : profile.goal === "build"
        ? "It supports strength work by giving you enough energy and a solid protein hit."
        : "It supports performance by balancing steady energy with recovery protein.";
  const budgetCopy =
    meal.cost === "budget"
      ? "It also leans on cheaper staples, so it is easier to repeat across the week."
      : "It uses a higher-cost protein, so keep it in the plan when the weekly budget allows it.";
  const timingCopy =
    slot === "breakfast"
      ? "As a breakfast option, it sets up the day without starting with a sugar spike."
      : slot === "lunch"
        ? "As a lunch option, it should hold energy steady through the middle of the day."
        : slot === "dinner"
          ? "As a dinner option, it helps recovery after training while still matching the plan."
          : "As a snack, it closes gaps between meals without turning into an unplanned blowout.";
  return `${goalCopy} ${budgetCopy} ${timingCopy}`;
}

function renderIngredients(ingredients = []) {
  return ingredients.map((ingredient) => escapeHtml(ingredient)).join(" · ");
}

function saveSebReflection() {
  localStorage.setItem("forgeSebReflection", sebReflection.value.trim());
  showToast("ACE reflection saved");
}

function toggleWorkout() {
  state.workoutActive = !state.workoutActive;
  workoutStatus.textContent = state.workoutActive ? "Effort active" : "Paused";
  workoutControl.textContent = state.workoutActive ? "Pause effort" : "Resume effort";
  showToast(state.workoutActive ? "Workout running" : "Workout paused");
}

function confirmCognitiveLoad() {
  const heartRate = Number(heartRateInput.value);

  if (bpmGatekeeper.checked && (!heartRate || heartRate < 160)) {
    lockCognitiveTask("Raise heart rate back into the training zone, then confirm again.");
    showToast("Get closer to the 180 bpm target first");
    return;
  }

  startPostLoadTest();
}

function resetCognitiveDrill() {
  stopProtocolTimer();
  stopTrackerNoise();
  clearVigilanceTimeout();
  state.protocolStage = "idle";
  state.activeRun = null;
  state.protocolSeconds = 0;
  state.stressStats = createProtocolStats();
  state.sequenceAttempts = 0;
  state.colourRound = 1;
  state.mathsRound = 1;
  state.nbackRound = 1;
  state.nbackLevel = 1;
  state.nbackHistory = [];
  state.trackerTargets = [];
  state.trackerSelected = [];
  state.trackerPhase = "idle";
  state.vigilanceRound = 1;
  state.vigilanceAwaitingNumber = false;
  state.reciteRound = 1;
  hideCooldownGate();
  lockCognitiveTask("Locked until heart rate is in the training zone.");
  renderProtocolMetrics();
}

function lockCognitiveTask(message) {
  stopTrackerNoise();
  clearVigilanceTimeout();
  state.cognitiveUnlocked = false;
  state.sequence = [];
  state.nextNumber = 1;
  numberGrid.classList.add("locked");
  numberGrid.innerHTML = "";
  colourCard.classList.add("locked");
  colourChoices.innerHTML = "";
  mathsCard.classList.add("locked");
  mathsChoices.innerHTML = "";
  nbackGrid.classList.add("locked");
  nbackGrid.innerHTML = "";
  trackerField.classList.add("locked");
  trackerField.innerHTML = "";
  vigilanceCue.className = "vigilance-cue locked";
  vigilanceCue.innerHTML = `<span class="vigilance-symbol">WAIT</span>`;
  if (peripheralChoices) peripheralChoices.innerHTML = "";
  reciteCard.classList.add("locked");
  reciteChoices.innerHTML = "";
  sequenceStatus.textContent = message;
  updateCognitiveProgress();
}

function startRestedBaseline() {
  stopProtocolTimer();
  state.protocolStage = "baseline";
  state.activeRun = "baseline";
  state.baselineStats = createProtocolStats();
  state.protocolSeconds = baselineSeconds;
  state.cognitiveUnlocked = true;
  state.runStartedAt = performance.now();
  prepareActiveCognitiveTest();
  runProtocolCountdown("Rested baseline", baselineSeconds, finishRestedBaseline);
  showToast("Rested baseline started");
}

function finishRestedBaseline() {
  state.protocolStage = "idle";
  state.activeRun = null;
  state.cognitiveUnlocked = false;
  state.baselineStats.completedAt = new Date().toISOString();
  persistProtocolStats();
  lockCognitiveTask("Baseline saved. Start the burpee timer when ready.");
  renderProtocolMetrics();
  showToast("Baseline saved");
}

function startPhysicalLoadTimer() {
  stopProtocolTimer();
  state.protocolStage = "loading";
  state.activeRun = null;
  state.protocolSeconds = loadingSeconds;
  lockCognitiveTask("Burpee timer running. Move straight to the test when it ends.");
  runProtocolCountdown("Physical load", loadingSeconds, startPostLoadTest);
  showToast("1 minute burpee timer started");
}

function startPostLoadTest() {
  const heartRate = Number(heartRateInput.value);
  if (bpmGatekeeper.checked && (!heartRate || heartRate < 160)) {
    showToast("BPM gate active: reach 160+ first");
    return;
  }

  stopProtocolTimer();
  if (navigator.vibrate) navigator.vibrate([160, 70, 160, 70, 240]);
  document.body.classList.toggle("sensory-load", sensoryLoad.checked);
  state.protocolStage = "post-load";
  state.activeRun = "stress";
  state.stressStats = createProtocolStats();
  state.protocolSeconds = postLoadSeconds;
  state.cognitiveUnlocked = true;
  state.runStartedAt = performance.now();
  prepareActiveCognitiveTest();
  runProtocolCountdown("Post-load test", postLoadSeconds, finishPostLoadTest);
  showToast("Post-load test live");
}

function finishPostLoadTest() {
  state.protocolStage = "recovery";
  state.activeRun = null;
  state.cognitiveUnlocked = false;
  state.stressStats.completedAt = new Date().toISOString();
  document.body.classList.remove("sensory-load");
  lockCognitiveTask("Post-load complete. Cooldown gate active: use Equilibrium breathing and lower heart rate.");
  showCooldownGate();
  runProtocolCountdown("Recovery tracking", recoverySeconds, finishRecoveryTracking);
  renderProtocolMetrics();
  showToast("Cooldown gate active");
}

function finishRecoveryTracking() {
  state.protocolStage = "complete";
  state.protocolSeconds = 0;
  if (cooldownCopy) cooldownCopy.textContent = "Recovery window complete. Log the session and note how quickly control returned.";
  if (completeCooldown) completeCooldown.textContent = "Session complete";
  renderProtocolMetrics();
  showToast("Recovery window complete");
}

function showCooldownGate() {
  const baseline = Number(restingHeartRate.value) || Number(state.mealProfile.restingHeartRate) || 60;
  state.cooldownTargetBpm = baseline + 15;
  cooldownGate?.classList.add("active");
  if (cooldownTarget) cooldownTarget.textContent = `${state.cooldownTargetBpm} bpm`;
  if (cooldownCopy) {
    cooldownCopy.textContent = `Breathing active. Drive heart rate below ${state.cooldownTargetBpm} bpm to unlock and complete the session.`;
  }
  if (completeCooldown) completeCooldown.textContent = "Check recovery HR";
}

function hideCooldownGate() {
  cooldownGate?.classList.remove("active");
}

function completeCooldownGate() {
  const heartRate = Number(heartRateInput.value);
  if (!state.cooldownTargetBpm) showCooldownGate();

  if (heartRate && heartRate <= state.cooldownTargetBpm) {
    stopProtocolTimer();
    state.protocolStage = "complete";
    state.protocolSeconds = 0;
    if (cooldownCopy) cooldownCopy.textContent = "Cooldown achieved. Session complete.";
    if (completeCooldown) completeCooldown.textContent = "Session complete";
    renderProtocolMetrics();
    showToast("Cooldown achieved");
    return;
  }

  if (cooldownCopy) {
    cooldownCopy.textContent = `Keep Equilibrium breathing. Current entry is ${heartRate || "--"} bpm; target is below ${state.cooldownTargetBpm} bpm.`;
  }
  showToast("Keep breathing down");
}

function runProtocolCountdown(stageLabel, seconds, onComplete) {
  state.protocolSeconds = seconds;
  protocolStage.textContent = stageLabel;
  renderProtocolMetrics();
  state.protocolTimer = window.setInterval(() => {
    state.protocolSeconds -= 1;
    renderProtocolMetrics();
    if (state.protocolSeconds <= 0) {
      stopProtocolTimer();
      onComplete();
    }
  }, 1000);
}

function stopProtocolTimer() {
  if (!state.protocolTimer) return;
  window.clearInterval(state.protocolTimer);
  state.protocolTimer = null;
}

function registerCognitiveResult(correct) {
  const now = performance.now();
  const reactionTime = state.lastCueAt ? Math.max(120, Math.round(now - state.lastCueAt)) : Math.round(now - state.runStartedAt);
  const bucket = state.activeRun === "baseline" ? state.baselineStats : state.activeRun === "stress" ? state.stressStats : null;
  if (!bucket) return;
  bucket.responses += 1;
  bucket.reactionTotal += reactionTime;
  if (correct) bucket.correct += 1;
  else bucket.errors += 1;
  renderProtocolMetrics();
}

function renderProtocolMetrics() {
  protocolTimer.textContent = formatCountdown(state.protocolSeconds || 0);
  if (!state.protocolTimer && state.protocolStage === "idle") protocolStage.textContent = "Ready";
  const baseline = summarizeProtocolStats(state.baselineStats);
  const stress = summarizeProtocolStats(state.stressStats);
  baselineMetric.textContent = baseline.responses ? `${baseline.accuracy}% · ${baseline.avgReaction}ms` : "--";
  tacticalEfficiency.textContent = stress.responses && baseline.responses ? `${calculateTacticalEfficiency(baseline, stress)}` : "--";
  if (state.protocolStage === "complete") protocolStage.textContent = "Complete";
}

function summarizeProtocolStats(stats) {
  const total = stats.correct + stats.errors;
  return {
    responses: stats.responses,
    accuracy: total ? Math.round((stats.correct / total) * 100) : 0,
    avgReaction: stats.responses ? Math.round(stats.reactionTotal / stats.responses) : 0,
  };
}

function calculateTacticalEfficiency(baseline, stress) {
  const baselineAccuracy = Math.max(1, baseline.accuracy);
  const stressAccuracy = Math.max(0, stress.accuracy);
  const baselineReaction = Math.max(200, baseline.avgReaction || 700);
  const stressReaction = Math.max(200, stress.avgReaction || 900);
  const accuracyRatio = stressAccuracy / baselineAccuracy;
  const speedRatio = baselineReaction / stressReaction;
  return Math.round((accuracyRatio * 0.65 + speedRatio * 0.35) * 100);
}

function formatCountdown(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
}

function setCognitiveTest(test) {
  state.cognitiveTest = test;
  document.querySelectorAll(".test-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.test === test);
  });
  sequenceTask.classList.toggle("active", test === "sequence");
  colourTask.classList.toggle("active", test === "colour");
  mathsTask.classList.toggle("active", test === "maths");
  nbackTask.classList.toggle("active", test === "nback");
  trackerTask.classList.toggle("active", test === "tracker");
  vigilanceTask.classList.toggle("active", test === "vigilance");
  reciteTask.classList.toggle("active", test === "recite");
  cognitiveTaskTitle.textContent = getCognitiveTitle(test);

  if (state.cognitiveUnlocked) {
    prepareActiveCognitiveTest();
    return;
  }

  lockCognitiveTask("Locked until heart rate is in the training zone.");
}

function prepareActiveCognitiveTest() {
  stopTrackerNoise();
  clearVigilanceTimeout();

  if (state.cognitiveTest === "sequence") {
    state.sequenceAttempts += 1;
    state.sequence = shuffleNumbers(9);
    state.nextNumber = 1;
    numberGrid.classList.remove("locked");
    sequenceStatus.textContent = `Attempt ${state.sequenceAttempts}: select each number in order.`;
    renderNumberGrid();
    updateCognitiveProgress();
    return;
  }

  if (state.cognitiveTest === "colour") {
    state.colourRound = 1;
    renderColourTask();
    return;
  }

  if (state.cognitiveTest === "maths") {
    state.mathsRound = 1;
    renderMathsTask();
    return;
  }

  if (state.cognitiveTest === "nback") {
    state.nbackRound = 1;
    state.nbackHistory = [];
    renderNbackTask();
    return;
  }

  if (state.cognitiveTest === "tracker") {
    state.trackerRound = 1;
    renderTrackerTask();
    return;
  }

  if (state.cognitiveTest === "vigilance") {
    state.vigilanceRound = 1;
    renderVigilanceTask();
    return;
  }

  state.reciteRound = 1;
  renderReciteTask();
}

function getCognitiveTitle(test) {
  if (test === "sequence") return "Number sequence";
  if (test === "colour") return "Colour conflict";
  if (test === "maths") return "Quick maths";
  if (test === "nback") return "Dual N-Back";
  if (test === "tracker") return "Grid Pop tracking";
  if (test === "vigilance") return "Threat Flash";
  return "Backward recitation";
}

function renderNumberGrid() {
  state.lastCueAt = performance.now();
  numberGrid.innerHTML = state.sequence
    .map((number) => `<button class="number-tile" type="button" data-number="${number}">${number}</button>`)
    .join("");

  numberGrid.querySelectorAll(".number-tile").forEach((button) => {
    button.addEventListener("click", () => handleNumberSelection(button));
  });
}

function handleNumberSelection(button) {
  if (!state.cognitiveUnlocked) return;

  const selectedNumber = Number(button.dataset.number);
  if (selectedNumber !== state.nextNumber) {
    registerCognitiveResult(false);
    failCognitiveAttempt("Missed sequence. Error recorded, next cue loading.", "Sequence miss");
    return;
  }

  registerCognitiveResult(true);
  button.classList.add("selected");
  button.disabled = true;
  state.nextNumber += 1;
  updateCognitiveProgress();

  if (state.nextNumber > 9) {
    completeCognitiveTest("Pass: attention held under physical load.");
  }
}

function renderColourTask() {
  const word = randomItem(colourOptions);
  const ink = randomItem(colourOptions.filter((colour) => colour.name !== word.name));
  state.lastCueAt = performance.now();
  state.colourAnswer = ink.name;
  colourWord.textContent = word.name.toUpperCase();
  colourWord.style.color = ink.value;
  colourCard.classList.remove("locked");
  sequenceStatus.textContent = `Round ${state.colourRound}/${cognitiveRoundGoal}: tap the ink colour, not the word.`;
  colourChoices.innerHTML = shuffleArray(colourOptions)
    .map((colour) => `<button class="choice-button" type="button" data-colour="${colour.name}">${colour.name}</button>`)
    .join("");
  colourChoices.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => handleColourChoice(button.dataset.colour));
  });
  updateCognitiveProgress();
}

function handleColourChoice(colour) {
  if (!state.cognitiveUnlocked) return;

  if (colour !== state.colourAnswer) {
    registerCognitiveResult(false);
    failCognitiveAttempt("Colour conflict miss. Error recorded, next cue loading.", "Colour miss");
    return;
  }

  registerCognitiveResult(true);
  if (state.colourRound >= cognitiveRoundGoal) {
    completeCognitiveTest("Pass: interference control held under load.");
    return;
  }

  state.colourRound += 1;
  renderColourTask();
}

function renderMathsTask() {
  const first = randomInt(8, 28);
  const second = randomInt(4, 18);
  const useSubtract = Math.random() > 0.5;
  state.lastCueAt = performance.now();
  state.mathsAnswer = useSubtract ? first - second : first + second;
  mathsQuestion.textContent = `${first} ${useSubtract ? "-" : "+"} ${second}`;
  mathsCard.classList.remove("locked");
  sequenceStatus.textContent = `Round ${state.mathsRound}/${cognitiveRoundGoal}: solve before breathing settles.`;
  mathsChoices.innerHTML = buildMathChoices(state.mathsAnswer)
    .map((answer) => `<button class="choice-button" type="button" data-answer="${answer}">${answer}</button>`)
    .join("");
  mathsChoices.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => handleMathsChoice(Number(button.dataset.answer)));
  });
  updateCognitiveProgress();
}

function handleMathsChoice(answer) {
  if (!state.cognitiveUnlocked) return;

  if (answer !== state.mathsAnswer) {
    registerCognitiveResult(false);
    failCognitiveAttempt("Maths miss. Error recorded, next cue loading.", "Maths miss");
    return;
  }

  registerCognitiveResult(true);
  if (state.mathsRound >= cognitiveRoundGoal) {
    completeCognitiveTest("Pass: decision speed held under load.");
    return;
  }

  state.mathsRound += 1;
  renderMathsTask();
}

function completeCognitiveTest(message) {
  if (state.activeRun) {
    sequenceStatus.textContent = message;
    sequenceProgress.textContent = "Next";
    window.setTimeout(() => {
      if (state.cognitiveUnlocked && state.activeRun) prepareActiveCognitiveTest();
    }, timeLoad.checked ? 260 : 520);
    return;
  }

  state.cognitiveUnlocked = false;
  sequenceStatus.textContent = message;
  sequenceProgress.textContent = "Complete";
  numberGrid.classList.add("locked");
  colourCard.classList.add("locked");
  mathsCard.classList.add("locked");
  nbackGrid.classList.add("locked");
  trackerField.classList.add("locked");
  vigilanceCue.classList.add("locked");
  reciteCard.classList.add("locked");
  showToast("Cognitive drill passed");
}

function failCognitiveAttempt(message, toastMessage) {
  if (state.activeRun) {
    sequenceStatus.textContent = message;
    showToast(toastMessage);
    window.setTimeout(() => {
      if (state.cognitiveUnlocked && state.activeRun) prepareActiveCognitiveTest();
    }, timeLoad.checked ? 260 : 520);
    return;
  }

  lockCognitiveTask(message);
  showToast(toastMessage);
}

function updateCognitiveProgress() {
  if (state.cognitiveTest === "sequence") {
    sequenceProgress.textContent = `Next: ${state.nextNumber}`;
    return;
  }

  if (state.cognitiveTest === "colour") {
    sequenceProgress.textContent = `Round ${state.colourRound}`;
    return;
  }

  if (state.cognitiveTest === "maths") {
    sequenceProgress.textContent = `Round ${state.mathsRound}`;
    return;
  }

  if (state.cognitiveTest === "nback") {
    sequenceProgress.textContent = `${state.nbackLevel}-back`;
    return;
  }

  if (state.cognitiveTest === "tracker") {
    sequenceProgress.textContent = `Speed ${state.trackerSpeed}`;
    return;
  }

  if (state.cognitiveTest === "vigilance") {
    sequenceProgress.textContent = `Cue ${state.vigilanceRound}`;
    return;
  }

  sequenceProgress.textContent = `Round ${state.reciteRound}`;
}

function renderNbackTask() {
  const position = randomInt(0, 8);
  const letter = randomItem(["A", "K", "M", "R", "T", "X"]);
  const previous = state.nbackHistory[state.nbackHistory.length - state.nbackLevel];
  const forcedMatch = state.nbackHistory.length >= state.nbackLevel && Math.random() > 0.55;
  state.nbackCurrent = forcedMatch && previous ? { position: previous.position, letter: previous.letter } : { position, letter };
  state.nbackHistory.push(state.nbackCurrent);
  state.lastCueAt = performance.now();
  nbackGrid.classList.remove("locked");
  nbackGrid.innerHTML = Array.from({ length: 9 }, (_, index) => {
    const active = index === state.nbackCurrent.position;
    return `<div class="nback-cell ${active ? "active" : ""}">${active ? state.nbackCurrent.letter : ""}</div>`;
  }).join("");
  sequenceStatus.textContent = `Round ${state.nbackRound}/${cognitiveRoundGoal}: ${state.nbackLevel}-back. Match the grid position or audio letter.`;
  updateCognitiveProgress();
}

function handleNbackChoice(type) {
  if (!state.cognitiveUnlocked || !state.nbackCurrent) return;
  const previous = state.nbackHistory[state.nbackHistory.length - state.nbackLevel - 1];
  const visualCorrect = previous && previous.position === state.nbackCurrent.position;
  const audioCorrect = previous && previous.letter === state.nbackCurrent.letter;
  const correct = type === "visual" ? visualCorrect : audioCorrect;
  registerCognitiveResult(Boolean(correct));
  if (!correct) {
    failCognitiveAttempt("N-Back miss. Error recorded, next cue loading.", "N-Back miss");
    return;
  }
  if (state.nbackRound >= cognitiveRoundGoal) {
    state.nbackLevel = Math.min(3, state.nbackLevel + 1);
    completeCognitiveTest("Pass: working memory held under load.");
    return;
  }
  state.nbackRound += 1;
  renderNbackTask();
}

function renderTrackerTask() {
  stopTrackerNoise();
  const targetCount = secondaryLoad.checked ? 4 : 3;
  state.trackerPhase = "indexing";
  state.trackerSelected = [];
  state.trackerTargets = shuffleArray(Array.from({ length: 16 }, (_, index) => index)).slice(0, targetCount);
  trackerField.classList.remove("locked");
  trackerField.innerHTML = Array.from({ length: 16 }, (_, index) => {
    const target = state.trackerTargets.includes(index);
    return `<button class="grid-pop-cell ${target ? "target-flash" : ""}" data-cell="${index}" type="button"></button>`;
  }).join("");
  trackerField.querySelectorAll(".grid-pop-cell").forEach((button) => {
    button.addEventListener("click", () => handleTrackerChoice(Number(button.dataset.cell), button));
  });
  sequenceStatus.textContent = `Indexing phase: memorize the ${targetCount} red squares. Visual noise starts next.`;
  updateCognitiveProgress();
  window.setTimeout(startTrackerNoisePhase, timeLoad.checked ? 700 : 1000);
}

function startTrackerNoisePhase() {
  if (!state.cognitiveUnlocked || state.cognitiveTest !== "tracker" || state.trackerPhase !== "indexing") return;
  state.trackerPhase = "noise";
  let secondsLeft = 5;
  const letters = ["A", "K", "M", "R", "T", "X", "7", "9"];
  trackerField.querySelectorAll(".grid-pop-cell").forEach((cell) => {
    cell.classList.remove("target-flash", "selected", "noise");
    cell.textContent = "";
  });
  sequenceStatus.textContent = `Movement phase: hold target locations while noise flashes. ${secondsLeft}s`;
  const tickMs = Math.max(160, 520 - state.trackerSpeed * 45);
  state.trackerNoiseTimer = window.setInterval(() => {
    trackerField.querySelectorAll(".grid-pop-cell").forEach((cell) => {
      cell.classList.remove("noise");
      cell.textContent = "";
    });
    const active = randomItem([...trackerField.querySelectorAll(".grid-pop-cell")]);
    active.classList.add("noise");
    active.textContent = randomItem(letters);
  }, tickMs);

  window.setTimeout(() => {
    if (!state.cognitiveUnlocked || state.cognitiveTest !== "tracker") return;
    stopTrackerNoise();
    state.trackerPhase = "identify";
    state.lastCueAt = performance.now();
    trackerField.querySelectorAll(".grid-pop-cell").forEach((cell) => {
      cell.classList.remove("noise");
      cell.textContent = "";
    });
    sequenceStatus.textContent = `Identification phase: tap the original ${state.trackerTargets.length} red squares.`;
  }, secondsLeft * 1000);
}

function stopTrackerNoise() {
  if (!state.trackerNoiseTimer) return;
  window.clearInterval(state.trackerNoiseTimer);
  state.trackerNoiseTimer = null;
}

function handleTrackerChoice(cell, button) {
  if (!state.cognitiveUnlocked || state.trackerPhase !== "identify") return;
  if (state.trackerSelected.includes(cell)) {
    state.trackerSelected = state.trackerSelected.filter((item) => item !== cell);
    button.classList.remove("selected");
    return;
  }

  state.trackerSelected.push(cell);
  button.classList.add("selected");
  if (state.trackerSelected.length < state.trackerTargets.length) return;

  const correct = state.trackerTargets.every((target) => state.trackerSelected.includes(target));
  registerCognitiveResult(correct);
  if (!correct) {
    state.trackerSpeed = Math.max(1, state.trackerSpeed - 1);
    failCognitiveAttempt("Grid Pop miss. Speed drops and the next round reloads.", "Tracking miss");
    return;
  }

  state.trackerSpeed = Math.min(8, state.trackerSpeed + 1);
  completeCognitiveTest("Pass: spatial tracking held under load. Next round speeds up.");
}

function renderVigilanceTask() {
  clearVigilanceTimeout();
  peripheralChoices.innerHTML = "";
  state.lastCueAt = performance.now();
  state.vigilanceThreat = Math.random() > 0.45;
  state.vigilanceIsGo = state.vigilanceThreat;
  state.vigilanceNumber = randomInt(1, 9);
  state.vigilanceExposure = timeLoad.checked ? 450 : 750;
  state.vigilanceAwaitingNumber = false;
  renderVigilanceCue(state.vigilanceThreat ? "threat" : "friendly");
  sequenceStatus.textContent = `Cue ${state.vigilanceRound}/${cognitiveRoundGoal}: threat means tap, friendly means wait. Remember the corner number.`;
  state.vigilanceFlashTimeout = window.setTimeout(() => {
    if (!state.cognitiveUnlocked || state.cognitiveTest !== "vigilance" || state.vigilanceAwaitingNumber) return;
    renderVigilanceCue("blank");
  }, state.vigilanceExposure);

  state.vigilanceTimeout = window.setTimeout(() => {
    if (!state.cognitiveUnlocked || state.cognitiveTest !== "vigilance" || state.vigilanceAwaitingNumber) return;
    if (state.vigilanceThreat) {
      registerCognitiveResult(false);
      failCognitiveAttempt("Threat missed. Reaction lag recorded, next flash loading.", "Threat missed");
      return;
    }
    registerCognitiveResult(true);
    advanceVigilance();
  }, timeLoad.checked ? 1150 : 1750);
  updateCognitiveProgress();
}

function renderVigilanceCue(mode) {
  const numberCorner = randomItem(["top-left", "top-right", "bottom-left", "bottom-right"]);
  vigilanceCue.className = `vigilance-cue ${mode}`;
  if (mode === "blank") {
    vigilanceCue.innerHTML = `<span class="vigilance-symbol">FLASH?</span>`;
    return;
  }
  const label = mode === "threat" ? "THREAT" : mode === "friendly" ? "FRIENDLY" : "WAIT";
  vigilanceCue.innerHTML = `
    <span class="vigilance-shape" aria-hidden="true"></span>
    <span class="vigilance-symbol">${label}</span>
    <span class="peripheral-number ${numberCorner}">${state.vigilanceNumber}</span>
  `;
}

function clearVigilanceTimeout() {
  if (state.vigilanceTimeout) {
    window.clearTimeout(state.vigilanceTimeout);
    state.vigilanceTimeout = null;
  }
  if (state.vigilanceFlashTimeout) {
    window.clearTimeout(state.vigilanceFlashTimeout);
    state.vigilanceFlashTimeout = null;
  }
}

function handleVigilanceTap() {
  if (!state.cognitiveUnlocked || state.cognitiveTest !== "vigilance") return;
  if (!state.vigilanceThreat) {
    clearVigilanceTimeout();
    registerCognitiveResult(false);
    failCognitiveAttempt("Friendly cue tapped. Impulse control miss recorded.", "Friendly tapped");
    return;
  }
  clearVigilanceTimeout();
  state.vigilanceAwaitingNumber = true;
  renderVigilanceCue("blank");
  peripheralChoices.innerHTML = Array.from({ length: 9 }, (_, index) => {
    const number = index + 1;
    return `<button class="choice-button" type="button" data-number="${number}">${number}</button>`;
  }).join("");
  peripheralChoices.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => handlePeripheralChoice(Number(button.dataset.number)));
  });
  sequenceStatus.textContent = "Threat engaged. Select the number you saw in peripheral vision.";
}

function handlePeripheralChoice(number) {
  if (!state.cognitiveUnlocked || !state.vigilanceAwaitingNumber) return;
  const correct = number === state.vigilanceNumber;
  registerCognitiveResult(correct);
  peripheralChoices.innerHTML = "";
  state.vigilanceAwaitingNumber = false;
  if (!correct) {
    failCognitiveAttempt("Peripheral number missed. Tunnel vision recorded.", "Peripheral miss");
    return;
  }
  advanceVigilance();
}

function advanceVigilance() {
  if (state.vigilanceRound >= cognitiveRoundGoal) {
    completeCognitiveTest("Pass: threat decision and peripheral vision held under load.");
    return;
  }
  state.vigilanceRound += 1;
  renderVigilanceTask();
}

function renderReciteTask() {
  const start = randomInt(84, 130);
  state.reciteAnswer = start - 7;
  state.lastCueAt = performance.now();
  recitePrompt.textContent = `${start} - 7`;
  reciteCard.classList.remove("locked");
  reciteChoices.innerHTML = buildMathChoices(state.reciteAnswer)
    .map((answer) => `<button class="choice-button" type="button" data-answer="${answer}">${answer}</button>`)
    .join("");
  reciteChoices.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => handleReciteChoice(Number(button.dataset.answer)));
  });
  sequenceStatus.textContent = `Round ${state.reciteRound}/${cognitiveRoundGoal}: subtract 7 under pressure.`;
  updateCognitiveProgress();
}

function handleReciteChoice(answer) {
  if (!state.cognitiveUnlocked) return;
  if (answer !== state.reciteAnswer) {
    registerCognitiveResult(false);
    failCognitiveAttempt("Backward recitation miss. Error recorded, next cue loading.", "Recitation miss");
    return;
  }
  registerCognitiveResult(true);
  if (state.reciteRound >= cognitiveRoundGoal) {
    completeCognitiveTest("Pass: cognitive switching held under load.");
    return;
  }
  state.reciteRound += 1;
  renderReciteTask();
}

function shuffleNumbers(max) {
  return shuffleArray(Array.from({ length: max }, (_, index) => index + 1));
}

function buildMathChoices(correctAnswer) {
  const choices = new Set([correctAnswer]);
  while (choices.size < 4) {
    choices.add(correctAnswer + randomInt(-8, 8));
  }
  return shuffleArray([...choices]);
}

function shuffleArray(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setBreathMethod(method) {
  state.breathMethod = method;
  stopBreathing();
  document.querySelectorAll(".breath-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.breath === method);
  });
  renderBreathMethod();
}

function currentBreathMethod() {
  return breathMethods[state.breathMethod] || breathMethods.box;
}

function renderBreathMethod() {
  const method = currentBreathMethod();
  breathTitle.textContent = method.title;
  breathInstruction.textContent = method.instruction;
  breathPhase.textContent = method.phases[0].label;
  breathCount.textContent = method.phases[0].count;
  breathOrb.classList.toggle("rocking", state.breathMethod === "rocking");
}

function toggleBreathing() {
  if (state.breathingActive) {
    stopBreathing();
    return;
  }

  state.breathingActive = true;
  state.phaseIndex = 0;
  state.phaseCount = currentBreathMethod().phases[0].count;
  breathControl.textContent = "Pause drill";
  updateBreathing();
  state.breathingTimer = window.setInterval(updateBreathing, 1000);
}

function updateBreathing() {
  const method = currentBreathMethod();
  const phase = method.phases[state.phaseIndex];
  breathPhase.textContent = phase.label;
  breathCount.textContent = state.phaseCount;
  breathOrb.classList.toggle("expand", phase.label === "Inhale" || phase.label === "Rock forward");
  breathOrb.classList.toggle("contract", phase.label === "Exhale" || phase.label === "Rock back");

  state.phaseCount -= 1;
  if (state.phaseCount === 0) {
    state.phaseIndex = (state.phaseIndex + 1) % method.phases.length;
    state.phaseCount = method.phases[state.phaseIndex].count;
  }
}

function stopBreathing() {
  window.clearInterval(state.breathingTimer);
  state.breathingTimer = null;
  state.breathingActive = false;
  breathControl.textContent = "Begin drill";
  breathOrb.classList.remove("expand", "contract");
  renderBreathMethod();
}

function closeBreathing() {
  stopBreathing();
  breathingDialog.close();
}

function closeWorkout() {
  state.workoutActive = false;
  workoutStatus.textContent = "Ready";
  workoutControl.textContent = "Begin effort";
  workoutDialog.close();
}

function closeCognitive() {
  stopProtocolTimer();
  stopTrackerNoise();
  clearVigilanceTimeout();
  hideCooldownGate();
  document.body.classList.remove("sensory-load");
  cognitiveDialog.close();
}

const workoutTests = {
  hundred: {
    title: "100 Burpees For Time",
    targetReps: 100,
    copy:
      "Start the clock, complete 100 clean burpees, and tap Rep after each one. Stop when you reach 100 and save the time as your benchmark.",
    standards: [
      "Chest reaches the floor or controlled bottom position.",
      "Feet return under the body before standing tall.",
      "Jump or full hip extension finishes each rep.",
    ],
  },
  capacity: {
    title: "3-minute burpee capacity",
    targetReps: 0,
    copy:
      "Start the three-minute clock and count every clean rep. This gives a shorter field benchmark when you do not want the full 100-rep test.",
    standards: [
      "Keep each rep clean before chasing speed.",
      "Stop counting reps that lose the bottom position or full stand.",
      "Record total reps and compare against future attempts.",
    ],
  },
  control: {
    title: "40/20 burpee control",
    targetReps: 0,
    copy:
      "Run three rounds: 40 seconds of burpees, 20 seconds of recovery. Count clean reps and watch how form holds under fatigue.",
    standards: [
      "Round one establishes pace.",
      "Round two tests breathing and posture under load.",
      "Round three tests composure and repeatable mechanics.",
    ],
  },
};

function openWorkoutTest(mode) {
  state.workoutTestMode = mode;
  resetWorkoutTestState();
  renderWorkoutTest();
  workoutTestDialog.showModal();
}

function renderWorkoutTest() {
  const test = workoutTests[state.workoutTestMode] || workoutTests.hundred;
  workoutTestTitle.textContent = test.title;
  workoutTestCopy.textContent = test.copy;
  workoutTestStandards.innerHTML = test.standards.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  workoutTestTimer.textContent = formatClock(state.workoutTestSeconds);
  workoutTestReps.textContent = test.targetReps ? `${state.workoutTestReps}/${test.targetReps}` : `${state.workoutTestReps}`;
  startWorkoutTest.textContent = state.workoutTestRunning ? "Pause test" : "Start test";
}

function toggleWorkoutTest() {
  if (state.workoutTestRunning) {
    stopWorkoutTestTimer();
    renderWorkoutTest();
    showToast("Workout test paused");
    return;
  }

  state.workoutTestRunning = true;
  startWorkoutTest.textContent = "Pause test";
  state.workoutTestTimer = window.setInterval(() => {
    state.workoutTestSeconds += 1;
    if (state.workoutTestMode === "capacity" && state.workoutTestSeconds >= 180) {
      finishWorkoutTest("3-minute test complete");
      return;
    }
    if (state.workoutTestMode === "control" && state.workoutTestSeconds >= 180) {
      finishWorkoutTest("40/20 control test complete");
      return;
    }
    renderWorkoutTest();
  }, 1000);
  showToast("Workout test started");
}

function addWorkoutTestRep() {
  if (!state.workoutTestRunning) toggleWorkoutTest();
  state.workoutTestReps += 1;
  if (state.workoutTestTargetReps && state.workoutTestReps >= state.workoutTestTargetReps) {
    finishWorkoutTest(`Benchmark complete: ${formatClock(state.workoutTestSeconds)}`);
    return;
  }
  renderWorkoutTest();
}

function finishWorkoutTest(message) {
  stopWorkoutTestTimer();
  renderWorkoutTest();
  showToast(message);
}

function resetWorkoutTestState() {
  stopWorkoutTestTimer();
  const test = workoutTests[state.workoutTestMode] || workoutTests.hundred;
  state.workoutTestSeconds = 0;
  state.workoutTestReps = 0;
  state.workoutTestTargetReps = test.targetReps;
  renderWorkoutTest();
}

function stopWorkoutTestTimer() {
  window.clearInterval(state.workoutTestTimer);
  state.workoutTestTimer = null;
  state.workoutTestRunning = false;
}

function closeWorkoutTest() {
  stopWorkoutTestTimer();
  workoutTestDialog.close();
}

function formatClock(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[char];
  });
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

applyProfessionTheme();
render();
renderBreathMethod();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // The app still works without offline support.
    });
  });
}
