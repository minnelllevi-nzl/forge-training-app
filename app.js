const defaultModules = [
  {
    id: createId(),
    title: "SEB pressure cycle",
    category: "Mental Health",
    notes:
      "Stress indicators, Eyes Up awareness, and Breathing/body language control for pressure moments.",
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
    notes: "Drive heart rate toward 180 bpm, then complete a number sequence while under load.",
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

const state = {
  role: "trainee",
  category: "All",
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
const mealPlanScreen = document.querySelector("#mealPlanScreen");
const managerScreen = document.querySelector("#managerScreen");
const screenTitle = document.querySelector("#screenTitle");
const traineeRole = document.querySelector("#traineeRole");
const managerRole = document.querySelector("#managerRole");
const roleToggle = document.querySelector("#roleToggle");
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
const colourCard = document.querySelector("#colourCard");
const colourWord = document.querySelector("#colourWord");
const colourChoices = document.querySelector("#colourChoices");
const mathsCard = document.querySelector("#mathsCard");
const mathsQuestion = document.querySelector("#mathsQuestion");
const mathsChoices = document.querySelector("#mathsChoices");
const mealPlanForm = document.querySelector("#mealPlanForm");
const mealGoal = document.querySelector("#mealGoal");
const mealBudget = document.querySelector("#mealBudget");
const mealWeight = document.querySelector("#mealWeight");
const mealHeight = document.querySelector("#mealHeight");
const mealAge = document.querySelector("#mealAge");
const mealActivity = document.querySelector("#mealActivity");
const nutritionSummary = document.querySelector("#nutritionSummary");
const weeklyMealPlan = document.querySelector("#weeklyMealPlan");
const refreshWeekPlan = document.querySelector("#refreshWeekPlan");
const moduleDetailTitle = document.querySelector("#moduleDetailTitle");
const moduleDetailCategory = document.querySelector("#moduleDetailCategory");
const moduleDetailNotes = document.querySelector("#moduleDetailNotes");
const moduleDetailMedia = document.querySelector("#moduleDetailMedia");
const moduleDetailAction = document.querySelector("#moduleDetailAction");
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
document.querySelector("#stressResetButton").addEventListener("click", openSebDialog);
document.querySelector("#closeBreathing").addEventListener("click", closeBreathing);
document.querySelector("#closeSeb").addEventListener("click", () => sebDialog.close());
document.querySelector("#closeCognitive").addEventListener("click", () => cognitiveDialog.close());
document.querySelector("#closeWorkout").addEventListener("click", closeWorkout);
document.querySelector("#closeModuleDetail").addEventListener("click", () => moduleDetailDialog.close());
document.querySelector("#closeProgress").addEventListener("click", () => progressDialog.close());
document.querySelector("#startWorkout").addEventListener("click", openWorkoutDialog);
document.querySelector("#saveSebReflection").addEventListener("click", saveSebReflection);
breathControl.addEventListener("click", toggleBreathing);
workoutControl.addEventListener("click", toggleWorkout);
confirmHeartRate.addEventListener("click", confirmCognitiveLoad);
resetSequence.addEventListener("click", resetCognitiveDrill);
moduleDetailAction.addEventListener("click", startActiveModule);
mealPlanForm.addEventListener("submit", buildMealPlanFromForm);
refreshWeekPlan.addEventListener("click", refreshFullMealPlan);
traineeRole.addEventListener("click", () => setRole("trainee"));
managerRole.addEventListener("click", () => setRole("manager"));
roleToggle.addEventListener("click", () => setRole(state.role === "trainee" ? "manager" : "trainee"));

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
    weight: 86,
    height: 178,
    age: 32,
    activity: 1.55,
    targetCalories: 2400,
  };
  const saved = localStorage.getItem("forgeMealProfile");
  return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
}

function persistMealProfile() {
  localStorage.setItem("forgeMealProfile", JSON.stringify(state.mealProfile));
}

function normalizeModule(module) {
  if (module.title !== "SEB pressure cycle") return module;
  return {
    ...module,
    category: "Mental Health",
    notes:
      "Stress indicators, Eyes Up awareness, and Breathing/body language control for pressure moments.",
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
  mealPlanScreen.classList.remove("active");
  managerScreen.classList.toggle("active", !isTrainee);
  traineeRole.classList.toggle("active", isTrainee);
  managerRole.classList.toggle("active", !isTrainee);
  screenTitle.textContent = isTrainee ? "Today" : "Command";
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
  if (module.title === "SEB pressure cycle") return "icon-seb";
  if (module.title === "HR cognitive stress drill") return "icon-cognitive";
  return iconByCategory[module.category] || "icon-conditioning";
}

function categoryClass(module) {
  const source =
    module.title === "SEB pressure cycle"
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
  if (module.title === "SEB pressure cycle" || module.title === "Stress response reset") {
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
    managerScreen.classList.remove("active");
    mealPlanScreen.classList.add("active");
    traineeRole.classList.add("active");
    managerRole.classList.remove("active");
    screenTitle.textContent = "Meals";
    mealPlanScreen.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  if (destination === "train") {
    setRole("trainee");
    assignedModules.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderMealInputs() {
  mealGoal.value = state.mealProfile.goal;
  mealBudget.checked = Boolean(state.mealProfile.budget);
  mealWeight.value = state.mealProfile.weight;
  mealHeight.value = state.mealProfile.height;
  mealAge.value = state.mealProfile.age;
  mealActivity.value = String(state.mealProfile.activity);
}

function buildMealPlanFromForm(event) {
  event.preventDefault();
  state.mealProfile = {
    goal: mealGoal.value,
    budget: mealBudget.checked,
    weight: Number(mealWeight.value),
    height: Number(mealHeight.value),
    age: Number(mealAge.value),
    activity: Number(mealActivity.value),
  };
  state.mealProfile.targetCalories = calculateCalories(state.mealProfile);
  state.mealPlan = buildWeekPlan(state.mealProfile);
  persistMealProfile();
  renderMealPlan();
  showToast("Weekly meal plan built");
}

function calculateCalories(profile) {
  const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  const goalShift = profile.goal === "lose" ? -420 : profile.goal === "build" ? 320 : 0;
  return Math.max(1600, Math.round((bmr * profile.activity + goalShift) / 25) * 25);
}

function buildWeekPlan(profile) {
  const targetCalories = profile.targetCalories || calculateCalories(profile);
  return dayNames.map((day, dayIndex) => {
    const meals = {};
    mealSlots.forEach((slot, slotIndex) => {
      meals[slot] = pickMeal(slot, profile.goal, profile.budget, targetCalories * mealTargets[slot], dayIndex + slotIndex);
    });
    return { day, meals };
  });
}

function pickMeal(slot, goal, budget, targetCalories, offset = 0) {
  const ranked = mealPools[slot]
    .filter((meal) => meal.tags.includes(goal) && (!budget || meal.cost === "budget"))
    .sort((a, b) => Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories));
  const goalMatches = mealPools[slot].filter((meal) => meal.tags.includes(goal));
  const options = ranked.length ? ranked : goalMatches.length ? goalMatches : mealPools[slot];
  return options[offset % options.length];
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
  const options = mealPools[slot].filter(
    (meal) =>
      meal.tags.includes(state.mealProfile.goal) &&
      (!state.mealProfile.budget || meal.cost === "budget") &&
      meal.name !== current.name,
  );
  const fallback = mealPools[slot].filter((meal) => meal.tags.includes(state.mealProfile.goal) && meal.name !== current.name);
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
  const goalLabel =
    profile.goal === "lose" ? "Burn / lose weight" : profile.goal === "build" ? "Build strength" : "Maintain and perform";
  const budgetLabel = profile.budget ? "Tight budget" : "Standard";
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
      <span>Protein guide</span>
      <strong>${Math.round(profile.weight * 1.8)}<small> g</small></strong>
    </article>
    <article>
      <span>Meal budget</span>
      <strong>${escapeHtml(budgetLabel)}</strong>
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
}

function renderMealCard(meal, slot, dayIndex) {
  return `
    <div class="meal-card">
      <div>
        <span>${escapeHtml(capitalize(slot))}</span>
        <strong>${escapeHtml(meal.name)}</strong>
        <small>${meal.calories} kcal · ${meal.protein}g protein · ${meal.cost === "budget" ? "budget" : "standard"}</small>
        <p class="meal-ingredients">${renderIngredients(meal.ingredients)}</p>
      </div>
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

  if (!heartRate || heartRate < 170) {
    lockCognitiveTask("Raise heart rate back into the training zone, then confirm again.");
    showToast("Get closer to the 180 bpm target first");
    return;
  }

  state.cognitiveUnlocked = true;
  prepareActiveCognitiveTest();
  showToast("Cognitive task unlocked");
}

function resetCognitiveDrill() {
  state.sequenceAttempts = 0;
  state.colourRound = 1;
  state.mathsRound = 1;
  lockCognitiveTask("Locked until heart rate is in the training zone.");
}

function lockCognitiveTask(message) {
  state.cognitiveUnlocked = false;
  state.sequence = [];
  state.nextNumber = 1;
  numberGrid.classList.add("locked");
  numberGrid.innerHTML = "";
  colourCard.classList.add("locked");
  colourChoices.innerHTML = "";
  mathsCard.classList.add("locked");
  mathsChoices.innerHTML = "";
  sequenceStatus.textContent = message;
  updateCognitiveProgress();
}

function setCognitiveTest(test) {
  state.cognitiveTest = test;
  document.querySelectorAll(".test-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.test === test);
  });
  sequenceTask.classList.toggle("active", test === "sequence");
  colourTask.classList.toggle("active", test === "colour");
  mathsTask.classList.toggle("active", test === "maths");
  cognitiveTaskTitle.textContent =
    test === "sequence" ? "Number sequence" : test === "colour" ? "Colour conflict" : "Quick maths";

  if (state.cognitiveUnlocked) {
    prepareActiveCognitiveTest();
    return;
  }

  lockCognitiveTask("Locked until heart rate is in the training zone.");
}

function prepareActiveCognitiveTest() {
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

  state.mathsRound = 1;
  renderMathsTask();
}

function renderNumberGrid() {
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
    lockCognitiveTask("Missed sequence. Rebuild heart rate, then try again.");
    showToast("Sequence failed: raise HR and retry");
    return;
  }

  button.classList.add("selected");
  button.disabled = true;
  state.nextNumber += 1;
  updateCognitiveProgress();

  if (state.nextNumber > 9) {
    state.cognitiveUnlocked = false;
    numberGrid.classList.add("locked");
    sequenceStatus.textContent = "Pass: attention held under physical load.";
    sequenceProgress.textContent = "Complete";
    showToast("Cognitive drill passed");
  }
}

function renderColourTask() {
  const word = randomItem(colourOptions);
  const ink = randomItem(colourOptions.filter((colour) => colour.name !== word.name));
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
    lockCognitiveTask("Colour conflict failed. Rebuild heart rate, then try again.");
    showToast("Colour test failed: raise HR and retry");
    return;
  }

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
    lockCognitiveTask("Maths decision failed. Rebuild heart rate, then try again.");
    showToast("Maths test failed: raise HR and retry");
    return;
  }

  if (state.mathsRound >= cognitiveRoundGoal) {
    completeCognitiveTest("Pass: decision speed held under load.");
    return;
  }

  state.mathsRound += 1;
  renderMathsTask();
}

function completeCognitiveTest(message) {
  state.cognitiveUnlocked = false;
  sequenceStatus.textContent = message;
  sequenceProgress.textContent = "Complete";
  numberGrid.classList.add("locked");
  colourCard.classList.add("locked");
  mathsCard.classList.add("locked");
  showToast("Cognitive drill passed");
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

  sequenceProgress.textContent = `Round ${state.mathsRound}`;
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

render();
renderBreathMethod();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {
      // The app still works without offline support.
    });
  });
}
