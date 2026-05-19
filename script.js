/* =====================================================
   Eid Salami Spinner
   Funny hidden logic:
   Wheel shows both Diba and Niba.
   But final spin always lands on Salami Diba.
===================================================== */

const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const resultBox = document.getElementById("result");

/* Taka note values */
const takaValues = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];

/*
  One array for all wheel options.
  The options are mixed visually so the prank feels natural.
*/
const allWheelOptions = [];

takaValues.forEach((amount) => {
  allWheelOptions.push({
    amount: amount,
    type: "Diba",
    label: `৳${amount} Salami Diba`
  });

  allWheelOptions.push({
    amount: amount,
    type: "Niba",
    label: `৳${amount} Salami Niba`
  });
});

/*
  Secret Diba index list.
  Spin will randomly select only from these indexes.
*/
const dibaIndexes = allWheelOptions
  .map((option, index) => option.type === "Diba" ? index : null)
  .filter(index => index !== null);

/* Funny final messages */
const resultMessages = [
  "😂 Dhora khaiso! তুমি ৳AMOUNT Salami Diba!",
  "💸 Pocket ready koro! তুমি ৳AMOUNT Salami Diba!",
  "🤣 Nibar shopno sesh! তুমি ৳AMOUNT Salami Diba!",
  "🌙 Eid Mubarak! Ebar তুমি ৳AMOUNT Salami Diba!",
  "😂 আজকের Eid ভাগ্য: তুমি ৳AMOUNT Salami Diba!",
  "🤑 Salami dite hobe boss! তুমি ৳AMOUNT Salami Diba!"
];

const segmentAngle = 360 / allWheelOptions.length;
let currentRotation = 0;
let isSpinning = false;

/* Build wheel colors */
function buildWheelGradient() {
  const colors = [
    "#04783f",
    "#d6a900",
    "#0b9b55",
    "#ffcc33",
    "#075e35",
    "#c29200"
  ];

  const gradientParts = allWheelOptions.map((option, index) => {
    const start = index * segmentAngle;
    const end = start + segmentAngle;

    /*
      Diba and Niba both visible.
      Diba has greener shades, Niba has golden shades.
    */
    const color = option.type === "Diba"
      ? colors[index % 3]
      : colors[(index % 3) + 3];

    return `${color} ${start}deg ${end}deg`;
  });

  wheel.style.background = `conic-gradient(from -90deg, ${gradientParts.join(", ")})`;
}

/* Add labels around the wheel */
function buildWheelLabels() {
  const wheelSize = wheel.offsetWidth;
  const labelRadius = wheelSize * 0.36;

  allWheelOptions.forEach((option, index) => {
    const label = document.createElement("div");
    label.className = "wheel-label";

    label.innerHTML = `
      <strong>৳${option.amount}</strong>
      <span>Salami</span>
      <span>${option.type}</span>
    `;

    const angle = index * segmentAngle + segmentAngle / 2;

    label.style.transform = `
      rotate(${angle}deg)
      translateY(-${labelRadius}px)
      rotate(${-angle}deg)
    `;

    wheel.appendChild(label);
  });
}

/* Pick random item from an array */
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/* Spin function */
function spinWheel() {
  if (isSpinning) return;

  isSpinning = true;
  spinBtn.disabled = true;
  spinBtn.textContent = "SPIN HOCHE... 🌙";
  resultBox.textContent = "চাকা ঘুরতেছে... pocket ready rakho! 💸";

  /*
    Secretly choose only from Diba indexes.
    This ensures final result is always Salami Diba.
  */
  const selectedDibaIndex = getRandomItem(dibaIndexes);
  const selectedOption = allWheelOptions[selectedDibaIndex];

  /*
    Calculate exact rotation.
    Pointer is fixed at the top.
    Wheel segment index starts from top because conic-gradient uses from -90deg.
  */
  const selectedSegmentCenter =
    selectedDibaIndex * segmentAngle + segmentAngle / 2;

  /*
    Add tiny safe random offset inside the selected Diba segment
    so the spin feels natural but never crosses segment boundary.
  */
  const safeOffset =
    (Math.random() - 0.5) * segmentAngle * 0.45;

  const finalSegmentAngle = selectedSegmentCenter + safeOffset;

  /*
    To bring selected segment under top pointer:
    final rotation modulo 360 should be 360 - finalSegmentAngle.
  */
  const desiredRotationMod = (360 - finalSegmentAngle) % 360;
  const currentRotationMod = ((currentRotation % 360) + 360) % 360;

  const neededRotation =
    (desiredRotationMod - currentRotationMod + 360) % 360;

  /*
    Add multiple full rotations for natural spinning animation.
  */
  const fullSpins = 5 + Math.floor(Math.random() * 4);
  const finalRotation =
    currentRotation + fullSpins * 360 + neededRotation;

  currentRotation = finalRotation;

  wheel.style.transform = `rotate(${currentRotation}deg)`;

  /*
    Show final result after animation ends.
  */
  setTimeout(() => {
    const randomMessage = getRandomItem(resultMessages);
    const finalMessage = randomMessage.replace("AMOUNT", selectedOption.amount);

    resultBox.textContent = finalMessage;

    spinBtn.disabled = false;
    spinBtn.textContent = "SPIN KORO ✨";
    isSpinning = false;
  }, 5200);
}

/* Initialize wheel */
buildWheelGradient();

window.addEventListener("load", () => {
  buildWheelLabels();
});

spinBtn.addEventListener("click", spinWheel);

/*
  Rebuild labels on resize for better mobile responsiveness.
*/
window.addEventListener("resize", () => {
  const oldLabels = document.querySelectorAll(".wheel-label");
  oldLabels.forEach(label => label.remove());
  buildWheelLabels();
});