const sitModuleTitle = "Stress Inoculation Training (SIT)";

const defaultModules = [
  {
    id: createId(),
    title: sitModuleTitle,
    category: "Mental Health",
    notes:
      "Stress indicators, Eyes Up awareness, and breathing/body language control for pressure moments.",
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
    title: "Box breathing drill",
    category: "Breathing",
    notes: "Four-count pressure breathing to steady attention before and after hard efforts.",
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
    title: "Box breathing",
    phases: [
      { label: "Inhale", count: 4 },
      { label: "Hold", count: 4 },
      { label: "Exhale", count: 4 },
      { label: "Hold", count: 4 },
    ],
    instruction: "Follow the count. Keep your jaw loose, shoulders low, and attention on the next breath.",
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

const traineeScreen = document.querySelector("#traineeScreen");
const trainScreen = document.querySelector("#trainScreen");
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
const mealPlanForm = document.querySelector("#mealPlanForm");
const mealGoal = document.querySelector("#mealGoal");
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
const mealDetailTitle = document.querySelector("#mealDetailTitle");
const mealDetailMeta = document.querySelector("#mealDetailMeta");
const mealIngredientList = document.querySelector("#mealIngredientList");
const mealPrepList = document.querySelector("#mealPrepList");
const mealWhyCopy = document.querySelector("#mealWhyCopy");
const toast = document.querySelector("#toast");

const resetCopyByStep = {
  Recognize: "Name the stress indicator before it becomes your whole focus.",
  Ground: "Press feet down, relax the jaw, and reconnect with the present scene.",
  Breathe: "Use a controlled breath to slow the body before choosing action.",
  Act: "Pick the next professional action: speak, move, pause, support, or disengage.",
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
document.querySelector("#stressResetButton").addEventListener("click", openSebDialog);
document.querySelector("#closeBreathing").addEventListener("click", closeBreathing);
document.querySelector("#closeSeb").addEventListener("click", () => sebDialog.close());
document.querySelector("#closeCognitive").addEventListener("click", closeCognitive);
document.querySelector("#closeWorkout").addEventListener("click", closeWorkout);
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
  if (module.title !== "SEB pressure cycle" && module.title !== sitModuleTitle) return module;
  return {
    ...module,
    title: sitModuleTitle,
    category: "Mental Health",
    notes:
      "Stress indicators, Eyes Up awareness, and breathing/body language control for pressure moments.",
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
  if (module.title === sitModuleTitle) return "icon-seb";
  if (module.title === "HR cognitive stress drill") return "icon-cognitive";
  return iconByCategory[module.category] || "icon-conditioning";
}

function categoryClass(module) {
  const source =
    module.title === sitModuleTitle
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
  if (module.title === sitModuleTitle || module.title === "Stress response reset") {
    openSebDialog();
    return;
  }

  if (module.title === "Box breathing drill") {
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
    managerScreen.classList.remove("active");
    settingsScreen.classList.remove("active");
    mealPlanScreen.classList.add("active");
    traineeRole.classList.add("active");
    managerRole.classList.remove("active");
    screenTitle.textContent = "FORGE meals";
    mealPlanScreen.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (destination === "settings") {
    state.role = "trainee";
    traineeScreen.classList.remove("active");
    trainScreen.classList.remove("active");
    mealPlanScreen.classList.remove("active");
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
  const pool = goalMatches.length ? goalMatches : mealPools[slot];
  const strictBudget = profile.budget || profile.budgetPriority === "strict";
  const budgetAllowance = getMealCostAllowance(profile);
  const allowanceBuffer = profile.budgetPriority === "flexible" ? 1.45 : profile.budgetPriority === "strict" ? 1.05 : 1.2;
  const preferred = pool.filter((meal) => {
    if (strictBudget && meal.cost !== "budget") return false;
    if (profile.avoidPremiumFoods && hasPremiumIngredient(meal)) return false;
    if (budgetAllowance && estimateMealCost(meal) > budgetAllowance * allowanceBuffer) return false;
    return true;
  });
  const fallback = pool.filter((meal) => {
    if (profile.avoidPremiumFoods && hasPremiumIngredient(meal)) return false;
    return !budgetAllowance || estimateMealCost(meal) <= budgetAllowance * 1.8;
  });
  const options = preferred.length ? preferred : fallback.length ? fallback : pool;
  return [...options].sort((a, b) => mealScore(a, targetCalories, profile) - mealScore(b, targetCalories, profile));
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
  return ranked[randomInt(0, Math.min(2, ranked.length - 1))];
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
  mealDetailMeta.innerHTML = `
    <article><span>Day</span><strong>${escapeHtml(dayPlan.day)} ${escapeHtml(capitalize(slot))}</strong></article>
    <article><span>Energy</span><strong>${meal.calories}<small> kcal</small></strong></article>
    <article><span>Protein</span><strong>${meal.protein}<small> g</small></strong></article>
    <article><span>Est cost</span><strong>$${estimateMealCost(meal)}<small> pp</small></strong></article>
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
  if (ingredientAmounts[ingredient]) return ingredientAmounts[ingredient];
  if (/spice|seasoning|salt|pepper|cinnamon/i.test(ingredient)) return "to taste";
  if (meal.calories >= 700) return "1 large serve";
  if (meal.calories <= 320) return "1 snack serve";
  return "1 standard serve";
}

function buildPrepSteps(meal, slot) {
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
  showToast("SEB reflection saved");
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
  lockCognitiveTask("Post-load complete. Cooldown gate active: use box breathing and lower heart rate.");
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
    cooldownCopy.textContent = `Keep box breathing. Current entry is ${heartRate || "--"} bpm; target is below ${state.cooldownTargetBpm} bpm.`;
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
