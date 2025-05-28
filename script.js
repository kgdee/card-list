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
  const iconFileInput = document.querySelector("input[type=file]")

  iconInput.oninput = () => displayIconInput();

  function getCard() {
    const card = {
      name: nameInput.value,
      description: descriptionInput.value,
      icon: iconFileInput.files.length > 0 ? URL.createObjectURL(iconFileInput.files[0]) : "images/icon-default-64x64.png",
    };
    return card;
  }

  function toggle(cardIndex) {
    iconInput.querySelector("input[type=file]").value = null;
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

    displayIconInput();
    element.classList.toggle("hidden");
  }

  function displayIconInput() {
    const card = getCard();
    iconInput.querySelector("img").src = card?.icon ? card.icon : "";
    iconInput.querySelector("img").classList.toggle("hidden", !card?.icon);
    iconInput.querySelector("i").classList.toggle("hidden", !!card?.icon);
    iconInput.style.border = card?.icon ? "2px solid" : "2px dashed";
  }

  function displayIconOptions() {
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

    iconOptions.innerHTML = selectedIcons
      .map(
        (icon) => `
      <img src="${icon}">
    `
      )
      .join("");
  }

  return { toggle, getCard };
})();

function toggleTheme(force = undefined) {
  const toggle = document.querySelector(".theme-toggle");
  force === undefined ? (darkTheme = !darkTheme) : (darkTheme = force);
  localStorage.setItem(`${projectName}_darkTheme`, darkTheme);
  document.body.classList.toggle("dark-theme", darkTheme);
  toggle.innerHTML = darkTheme ? `<i class="bi bi-sun"></i>` : `<i class="bi bi-moon"></i>`;
}
