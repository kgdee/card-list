const projectName = "card-list";
const cardsEl = document.querySelector(".cards");
const cardModal = document.querySelector(".card-modal");

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
  const nameInput = cardModal.querySelector(".name-input");
  const iconInput = cardModal.querySelector(`.icon-input input[type="file"]`);
  const descriptionInput = cardModal.querySelector(".description-input");

  const itemName = nameInput.value;
  const icon = iconInput.files[0] ? URL.createObjectURL(iconInput.files[0]) : "images/icon-default-64x64.png";
  const description = descriptionInput.value;

  if (!itemName) return;

  const newCard = {
    name: itemName,
    icon: icon,
    description: description,
  };

  cards.push(newCard);
  localStorage.setItem(`${projectName}_cards`, JSON.stringify(cards));

  displayCards();

  nameInput.value = "";
  iconInput.value = "";
}

function displayCards() {
  cardsEl.innerHTML = cards.map(
    (card) =>
      `
      <div class="item" onclick="toggleCardModal(${cards.indexOf(card)})">
        <img src="${card.icon}">
        <p class="item-text truncated">${card.name}</p>
      </div>
    `
  );
}

function handleIconInput(file, element) {
  const preview = element.querySelector("img");

  if (file instanceof Blob) {
    preview.src = URL.createObjectURL(file);
  } else if (file) {
    preview.src = file;
  } else {
    preview.src = "images/icon-default-64x64.png";
  }

  preview.classList.toggle("hidden", !file)
  element.querySelector("i").classList.toggle("hidden", file)
  element.style.border = file ? "2px solid" : "2px dashed"
}

function toggleCardModal(cardIndex) {
  const modalTitle = cardModal.querySelector(".title");
  const modalSubmit = cardModal.querySelector(".submit");
  const nameInput = cardModal.querySelector(".name-input");
  const descriptionInput = cardModal.querySelector(".description-input");
  const iconInput = cardModal.querySelector(".icon-input");

  iconInput.querySelector("input[type=file]").value = null
  modalTitle.textContent = "Add a new Card";
  modalSubmit.textContent = "Add";
  nameInput.value = "";
  descriptionInput.value = "";

  displayIconOptions()
  handleIconInput(null, iconInput);

  cardModal.classList.toggle("hidden");

  if (isNaN(cardIndex)) return;

  const card = cards[cardIndex];

  modalTitle.textContent = `Update ${card.name}`;
  modalSubmit.textContent = "Update";

  handleIconInput(card.icon, iconInput);
  nameInput.value = card.name;
  descriptionInput.value = card.description;
}

function displayIconOptions() {
  const iconOptionsEl = cardModal.querySelector(".icon-options");

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
  const shuffled = [...icons].sort(() => 0.5 - Math.random());
  selectedIcons = shuffled.slice(0, 3);

  iconOptionsEl.innerHTML = selectedIcons
    .map(
      (icon) => `
      <img src="${icon}">
    `
    )
    .join("");
}

function toggleTheme(force = undefined) {
  const toggle = document.querySelector(".theme-toggle");
  force === undefined ? (darkTheme = !darkTheme) : (darkTheme = force);
  localStorage.setItem(`${projectName}_darkTheme`, darkTheme);
  document.body.classList.toggle("dark-theme", darkTheme);
  toggle.innerHTML = darkTheme ? `<i class="bi bi-sun"></i>` : `<i class="bi bi-moon"></i>`;
}
