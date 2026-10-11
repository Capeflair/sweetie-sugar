// script.js makes the page DO things, like a remote control.

// ---------- The menu ----------
// Each sweet has a name, a price (in pounds), a picture and a tune.
// Want a new sweet? Copy one line, change the words, and save!
const sweets = [
  { name: "Fizzer Dubbles",      price: 2.50, picture: "images/fizzer-dubbles.svg",      tune: "twinkle" },
  { name: "Fruit Splits",        price: 3.00, picture: "images/fruit-splits.svg",        tune: "joy" },
  { name: "Chocolate Liquorice", price: 1.00, picture: "images/chocolate-liquorice.svg", tune: "jacques" },
  { name: "Chocolate Digestive", price: 0.50, picture: "images/chocolate-digestive.svg", tune: "lamb" },
  { name: "Chocolate Pretzel",   price: 0.30, picture: "images/chocolate-pretzel.svg",   tune: "bridge" },
  { name: "Jelly Babies",        price: 1.00, picture: "images/jelly-babies.svg",        tune: "farm" },
  { name: "Chocolate",           price: 0.50, picture: "images/chocolate.svg",           tune: "birthday" },
];

// The basket starts empty. It remembers how many of each sweet you picked.
let basket = {};

// Turns a number like 2.5 into "£2.50"
function money(amount) {
  return "£" + amount.toFixed(2);
}

// ---------- Likes ----------
// The likes are remembered by THIS computer's web browser only.
// Nobody else in the world can see them, and nothing gets sent anywhere.
let likes = {};
try {
  likes = JSON.parse(localStorage.getItem("sweetie-likes")) || {};
} catch (oops) {
  likes = {}; // if the browser can't remember, just start from zero
}

function saveLikes() {
  try {
    localStorage.setItem("sweetie-likes", JSON.stringify(likes));
  } catch (oops) {
    // the browser can't remember right now, that's OK
  }
}

// Shows the number of likes, and turns the heart pink once it has any
function showLikes(button, number) {
  const count = likes[number] || 0;
  button.innerHTML = (count > 0 ? "💖" : "🤍") + ' <span class="like-count">' + count + "</span>";
}

// ---------- The piggy bank ----------
// Adds up ALL the pretend money ever paid in the shop.
// Like the likes, only THIS computer remembers it.
let bankMoney = 0;
try {
  bankMoney = Number(localStorage.getItem("sweetie-bank")) || 0;
} catch (oops) {
  bankMoney = 0;
}

function showBank() {
  document.getElementById("bank-total").textContent = money(bankMoney);
}

function addToBank(amount) {
  bankMoney += amount;
  try {
    localStorage.setItem("sweetie-bank", bankMoney);
  } catch (oops) {
    // the browser can't remember right now, that's OK
  }
  showBank();
}

// Makes coins fall into the piggy bank, then it does a happy jump
function dropCoins() {
  const bank = document.getElementById("bank");
  const spot = bank.getBoundingClientRect();

  for (let i = 0; i < 5; i++) {
    const coin = document.createElement("div");
    coin.className = "coin";
    coin.textContent = "🪙";
    coin.style.left = (spot.left + spot.width / 2 - 16) + "px";
    coin.style.top = (spot.top - 120) + "px";
    document.body.appendChild(coin);

    coin.animate([
      { transform: "translateY(0) rotate(0deg)", opacity: 1 },
      { transform: "translateY(130px) rotate(360deg)", opacity: 0 },
    ], { duration: 600, delay: i * 150, easing: "ease-in", fill: "backwards" })
      .onfinish = function () { coin.remove(); };
  }

  setTimeout(function () {
    bank.classList.remove("bounce");
    void bank.offsetWidth; // a little trick so the bounce can play again
    bank.classList.add("bounce");
  }, 1200);
}

// ---------- Show the sweets on the page ----------
const menu = document.getElementById("menu");

sweets.forEach(function (sweet, number) {
  const card = document.createElement("div");
  card.className = "sweet";
  card.innerHTML =
    '<img src="' + sweet.picture + '" alt="' + sweet.name + '">' +
    "<h3>" + sweet.name + "</h3>" +
    '<p class="price">' + money(sweet.price) + "</p>" +
    '<button class="add-button">Add to basket ➕</button>' +
    '<button class="like-button">🤍 <span class="like-count">0</span></button>';

  // When you click "Add to basket", put one in the basket
  card.querySelector(".add-button").addEventListener("click", function () {
    basket[number] = (basket[number] || 0) + 1;
    playTune(sweet.tune);
    flyToBasket(card.querySelector("img"));
  });

  // The heart button: each tap adds one more like
  const likeButton = card.querySelector(".like-button");
  showLikes(likeButton, number);
  likeButton.addEventListener("click", function () {
    likes[number] = (likes[number] || 0) + 1;
    saveLikes();
    showLikes(likeButton, number);
    likeButton.classList.remove("pop");
    void likeButton.offsetWidth; // a little trick so the pop can play again
    likeButton.classList.add("pop");
  });

  menu.appendChild(card);
});

// ---------- Tunes ----------
// Each sweet plays its own little tune when you add it to the basket.
// A tune is a list of notes. Each note has a letter and how long it lasts:
//   1 = a short note, 2 = a long note (twice as long).
// You can write your own tune! Use the letters C D E F G A B,
// "high" notes like "high C" are extra squeaky, "rest" is a little silence.
const tunes = {
  twinkle:  [["C",1],["C",1],["G",1],["G",1],["A",1],["A",1],["G",2]],             // Twinkle Twinkle Little Star
  joy:      [["E",1],["E",1],["F",1],["G",1],["G",1],["F",1],["E",1],["D",1],["C",2]], // Ode to Joy
  jacques:  [["C",1],["D",1],["E",1],["C",1],["C",1],["D",1],["E",1],["C",2]],       // Frère Jacques
  lamb:     [["E",1],["D",1],["C",1],["D",1],["E",1],["E",1],["E",2]],             // Mary Had a Little Lamb
  bridge:   [["G",1],["A",1],["G",1],["F",1],["E",1],["F",1],["G",2]],             // London Bridge
  farm:     [["G",1],["G",1],["G",1],["D",1],["E",1],["E",1],["D",2]],             // Old MacDonald
  birthday: [["G",1],["G",1],["A",2],["G",2],["high C",2],["B",2]],                // Happy Birthday

  // The AMAZING song for when someone pays! 🎉
  party: [["C",1],["E",1],["G",1],["high C",2],["G",1],["high C",4],["rest",1],
          ["A",1],["high C",1],["high E",2],
          ["high D",1],["high C",1],["high D",1],["high E",1],["high G",4]],
  // The deep "bom bom" notes that play underneath the party song
  partyBass: [["C",3],["C",2],["C",5],["rest",1],["F",4],["G",4],["C",4]],
};

// How high each letter sounds (bigger number = higher note)
const pitches = {
  "C": 262, "D": 294, "E": 330, "F": 349, "G": 392, "A": 440, "B": 494,
  "high C": 523, "high D": 587, "high E": 659, "high G": 784,
};

let speaker = null;   // the computer's speaker
let playing = null;   // the tune that is playing right now

// Plays a tune. If you give it a bass tune too, both play together!
function playTune(name, bassName) {
  if (!speaker) {
    speaker = new (window.AudioContext || window.webkitAudioContext)();
  }

  // If a tune is already playing, stop it so they don't get muddled up
  if (playing) {
    playing.disconnect();
  }
  playing = speaker.createGain();
  playing.connect(speaker.destination);

  // The tune: soft and up high, like a music box
  playNotes(tunes[name], 2, "triangle");

  // The bass: deep and low, like a big drum
  if (bassName) {
    playNotes(tunes[bassName], 0.5, "sine");
  }
}

// Plays a list of notes, one after another
//   howHigh: 2 = higher, 0.5 = lower
//   kind:    "triangle" is like a music box, "sine" is soft and smooth
function playNotes(notes, howHigh, kind) {
  const beat = 0.2; // how many seconds a short note lasts
  let time = speaker.currentTime;

  notes.forEach(function (step) {
    const howLong = step[1] * beat;

    if (step[0] !== "rest") {
      const sound = speaker.createOscillator();
      const volume = speaker.createGain();
      sound.type = kind;
      sound.frequency.value = pitches[step[0]] * howHigh;
      volume.gain.setValueAtTime(0.3, time);
      volume.gain.exponentialRampToValueAtTime(0.001, time + howLong);
      sound.connect(volume);
      volume.connect(playing);
      sound.start(time);
      sound.stop(time + howLong);
    }

    time += howLong;
  });
}

// ---------- The flying sweet animation ----------
// Makes a copy of the sweet's picture fly up into the basket button,
// then the basket does a little jump!
function flyToBasket(picture) {
  const basketButton = document.getElementById("cart-button");
  const start = picture.getBoundingClientRect();
  const end = basketButton.getBoundingClientRect();

  // Make a copy of the picture that floats on top of the page
  const flyer = picture.cloneNode();
  flyer.className = "flyer";
  flyer.style.left = start.left + "px";
  flyer.style.top = start.top + "px";
  flyer.style.width = start.width + "px";
  flyer.style.height = start.height + "px";
  document.body.appendChild(flyer);

  // How far it needs to travel to reach the basket
  const moveX = end.left + end.width / 2 - (start.left + start.width / 2);
  const moveY = end.top + end.height / 2 - (start.top + start.height / 2);

  // Fly! It spins and shrinks as it goes.
  const flight = flyer.animate([
    { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1 },
    { transform: "translate(" + moveX * 0.5 + "px, " + (moveY * 0.5 - 80) + "px) scale(0.7) rotate(180deg)", opacity: 1 },
    { transform: "translate(" + moveX + "px, " + moveY + "px) scale(0.15) rotate(360deg)", opacity: 0.6 },
  ], { duration: 800, easing: "ease-in-out" });

  // When it lands: remove the copy, update the basket, and bounce!
  flight.onfinish = function () {
    flyer.remove();
    updateBasket();
    basketButton.classList.remove("bounce");
    void basketButton.offsetWidth; // a little trick so the bounce can play again
    basketButton.classList.add("bounce");
  };
}

// ---------- The basket ----------
function updateBasket() {
  const list = document.getElementById("cart-items");
  list.innerHTML = "";
  let total = 0;
  let count = 0;

  for (const number in basket) {
    const sweet = sweets[number];
    const howMany = basket[number];
    total += sweet.price * howMany;
    count += howMany;

    const item = document.createElement("li");
    item.innerHTML =
      "<span>" + howMany + " × " + sweet.name + "</span>" +
      "<span>" + money(sweet.price * howMany) +
      ' <button class="remove-button">➖</button></span>';

    // The ➖ button takes one away
    item.querySelector("button").addEventListener("click", function () {
      basket[number] -= 1;
      if (basket[number] === 0) {
        delete basket[number];
      }
      updateBasket();
    });

    list.appendChild(item);
  }

  if (count === 0) {
    list.innerHTML = "<li>Your basket is empty. Pick some sweets! 🍬</li>";
  }

  document.getElementById("cart-total").textContent = money(total);
  document.getElementById("cart-count").textContent = count;
}

// ---------- Buttons to open and close things ----------
const cart = document.getElementById("cart");
const thanks = document.getElementById("thanks");

document.getElementById("cart-button").addEventListener("click", function () {
  cart.classList.remove("hidden");
});

document.getElementById("close-cart").addEventListener("click", function () {
  cart.classList.add("hidden");
});

// Pretend to pay: empty the basket and say thank you!
document.getElementById("pay-button").addEventListener("click", function () {
  if (Object.keys(basket).length === 0) {
    alert("Your basket is empty! Add some sweets first. 🍭");
    return;
  }
  // Add up the money and put it in the piggy bank
  let total = 0;
  for (const number in basket) {
    total += sweets[number].price * basket[number];
  }
  addToBank(total);
  dropCoins();

  basket = {};
  updateBasket();
  cart.classList.add("hidden");
  thanks.classList.remove("hidden");
  playTune("party", "partyBass"); // 🎉 the amazing paying song!
});

document.getElementById("close-thanks").addEventListener("click", function () {
  thanks.classList.add("hidden");
});

// When the page first loads, show the empty basket and the money in the bank
updateBasket();
showBank();
