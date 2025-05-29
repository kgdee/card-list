const projectName = "card-list";
const cardsEl = document.querySelector(".cards");

let cards = JSON.parse(localStorage.getItem(`${projectName}_cards`)) || [];

let darkTheme = JSON.parse(localStorage.getItem(`${projectName}_darkTheme`)) || false;

document.addEventListener("DOMContentLoaded", function () {
  displayCards();
  toggleTheme(darkTheme);
});

function stopPropagation(event) {
  event.stopPropagation();
}

function addNewCard() {
  const card = CardModal.getCard();
  if (!card.name) return;

  cards.push(card);
  localStorage.setItem(`${projectName}_cards`, JSON.stringify(cards));

  displayCards();
}

function displayCards() {
  cardsEl.innerHTML = cards
    .map(
      (card) =>
        `
      <div class="item" onclick="CardModal.toggle(${cards.indexOf(card)})">
        <img src="${card.icon}">
        <p class="item-text truncated">${card.name}</p>
      </div>
    `
    )
    .join("");
}

const CardModal = (() => {
  const element = document.querySelector(".card-modal");
  const title = document.querySelector(".card-modal .title");
  const submitBtn = document.querySelector(".card-modal .submit");
  const nameInput = document.querySelector(".card-modal .name-input");
  const descriptionInput = document.querySelector(".card-modal .description-input");
  const iconOptions = document.querySelector(".card-modal .icon-options");
  const iconInput = document.querySelector(".card-modal .icon-input");
  const iconFileInput = iconInput.querySelector("input[type=file]");
  let selectedIcon = null;

  const icons = [
    "images/cards/bamboo.jpg",
    "images/cards/butterflies.jpg",
    "images/cards/cat.jpg",
    "images/cards/flamingo.jpg",
    "images/cards/mushroom.jpg",
    "images/cards/parrot.jpg",
    "images/cards/summer.jpg",
    "images/cards/sunflower.jpg",
    "images/cards/tree.jpg",
    "images/cards/whale.jpg",
  ];

  iconInput.oninput = () => refreshSelection();
  iconFileInput.oninput = (event) => {
    if (event.target.files.length > 0) selectedIcon = URL.createObjectURL(event.target.files[0]);
  };

  function getCard() {
    const card = {
      name: nameInput.value,
      description: descriptionInput.value,
      icon: selectedIcon || "images/icon-default-64x64.png",
    };
    return card;
  }

  function toggle(cardIndex) {
    iconFileInput.value = "";
    selectedIcon = null;
    title.textContent = "Add a new Card";
    submitBtn.textContent = "Add";
    nameInput.value = "";
    descriptionInput.value = "";

    displayIconOptions();

    if (isFinite(cardIndex)) {
      const selectedCard = cards[cardIndex];

      title.textContent = `Update ${selectedCard.name}`;
      submitBtn.textContent = "Update";

      nameInput.value = selectedCard.name;
      descriptionInput.value = selectedCard.description;
    }

    refreshSelection();
    element.classList.toggle("hidden");
  }

  function displayIconOptions() {
    const shuffled = [...icons].sort(() => 0.5 - Math.random());
    const selectedIcons = shuffled.slice(0, 3);

    iconOptions.innerHTML = selectedIcons
      .map(
        (icon) => `
          <button data-icon="${icons.indexOf(icon)}" onclick="CardModal.selectIcon(${icons.indexOf(icon)})">
            <img src="${icon}">
          </button>
        `
      )
      .join("");
  }

  function selectIcon(index) {
    selectedIcon = icons[index];

    refreshSelection();
  }

  function refreshSelection() {
    iconOptions.querySelectorAll(":scope > *").forEach((el) => el.classList.remove("selected"));
    if (!iconFileInput.value) iconInput.querySelector("img").src = ""
    iconInput.querySelector("img").classList.toggle("hidden", !iconFileInput.value)
    iconInput.querySelector("i").classList.toggle("hidden", iconFileInput.value)
    iconInput.classList.remove("selected");

    if (!selectedIcon) return

    if (icons.includes(selectedIcon)) {
      iconOptions.querySelector(`[data-icon="${icons.indexOf(selectedIcon)}"]`).classList.add("selected");
    } else {
      iconInput.querySelector("img").src = selectedIcon;
      iconInput.classList.add("selected");
    }
  }

  return { toggle, getCard, selectIcon };
})();

function toggleTheme(force = undefined) {
  const toggle = document.querySelector(".theme-toggle");
  force === undefined ? (darkTheme = !darkTheme) : (darkTheme = force);
  localStorage.setItem(`${projectName}_darkTheme`, darkTheme);
  document.body.classList.toggle("dark-theme", darkTheme);
  toggle.innerHTML = darkTheme ? `<i class="bi bi-sun"></i>` : `<i class="bi bi-moon"></i>`;
}
