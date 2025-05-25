const projectName = "card-list";
const cardsEl = document.querySelector(".cards");
const cardModal = document.querySelector(".card-modal");

let cards = JSON.parse(localStorage.getItem(`${projectName}_cards`)) || [];

document.addEventListener("DOMContentLoaded", function () {
  displayCards();
});

function stopPropagation(event) {
  event.stopPropagation();
}

function addNewCard() {
  const nameInput = cardModal.querySelector(".name-input");
  const iconInput = cardModal.querySelector(`.icon-input input[type="file"]`);
  const descriptionInput = cardModal.querySelector(".description-input")

  const itemName = nameInput.value
  const icon = iconInput.files[0] ? URL.createObjectURL(iconInput.files[0]) : "images/icon-default-64x64.png";
  const description = descriptionInput.value

  if (!itemName) return;

  const newCard = {
    name: itemName,
    icon: icon,
    description: description
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
  const preview = element.querySelector("img")

  if (file instanceof Blob) {
    preview.src = URL.createObjectURL(file)
  } else if (file) {
    preview.src = file
  } else {
    preview.src = "images/icon-default-64x64.png"
  }
}

function toggleCardModal(cardIndex) {
  const nameInput = cardModal.querySelector(".name-input")
  const descriptionInput = cardModal.querySelector(".description-input")
  const iconInput = cardModal.querySelector(".icon-input")

  nameInput.value = ""
  descriptionInput.value = ""
  handleIconInput(null, iconInput)

  cardModal.classList.toggle("hidden")

  if (isNaN(cardIndex)) return

  const card = cards[cardIndex]
  handleIconInput(card.icon, iconInput)
  nameInput.value = card.name
  descriptionInput.value = card.description
}