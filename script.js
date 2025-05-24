const projectName = "card-list"
const addItemEl = document.querySelector(".add-item");
const cardsEl = document.querySelector(".cards");

let cards = JSON.parse(localStorage.getItem(`${projectName}_cards`)) || [];

document.addEventListener("DOMContentLoaded", function() {
  displayCards()
})

function addNewCard() {
  const nameInput = addItemEl.querySelector(".name-input");
  const iconInput = addItemEl.querySelector(`.icon-input input[type="file"]`);

  const itemName = nameInput.value.trim();
  const icon = iconInput.files[0] ? URL.createObjectURL(iconInput.files[0]) : "images/icon-default-64x64.png";

  if (!itemName) return;

  const newCard = {
    name: itemName,
    icon: icon,
  };

  cards.push(newCard);
  localStorage.setItem(`${projectName}_cards`, JSON.stringify(cards))

  displayCards()

  nameInput.value = "";
  iconInput.value = "";
}

function displayCards() {
  cardsEl.innerHTML = cards.map(
    (card) =>
      `
      <div class="item">
        <img src="${card.icon}">
        <p class="item-text truncated">${card.name}</p>
      </div>
    `
  )
}
