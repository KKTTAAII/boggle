"use strict";

const submitBtn = $(".submitBtn");
const startBtn = $(".startBtn");
let score = 0;
let timeLeft = 60;
let timer;
startBtn.on("click", startGameHandler);
let words = [];

async function guessHandler(event) {
  event.preventDefault();
  if (timeLeft === 0) {
    return;
  } else {
    const word = $("input").val();
    if (!word) {
      return "User needs to guess a word";
    }
    checkIfWord(word);

    const resp = await axios.get("/check-word", { params: { word: word } });
    const result = resp.data.result;
    $("input").val("");

    checkWord(result, word);
  }
}

function checkIfWord(word) {
  if (!word) {
    swal("Please make a guess");
  }
}

function checkWord(result, word) {
  $(".result").empty();
  if (result === "ok") {
    keepTrackOfScore(word);
    return $(".result").append(
      "<p class='p'>Congrats! You guessed a correct word!</p>"
    );
  }
  if (result === "not-on-board") {
    return $(".result").append(
      "<p class='p'>Sorry, the word is not on the board</p>"
    );
  }
  if (result === "not-word") {
    return $(".result").append("<p class='p'>That's not even a word!</p>");
  }
}

function keepTrackOfScore(word) {
  if (words.includes(word)) {
    return swal("You already guessed this word");
  } else {
    words.push(word);
    score += word.length;
    return $(".score").text(score);
  }
}

async function timesUp() {
  clearInterval(timer);

  swal("Time's up");

  const resp = await axios.post("/score", { score: score });
  const userHighestScore = resp.data.highestscore;
  $(".highestscore").text(userHighestScore);

  $(".start-container").show();
  $(".highestScore").show();
  startBtn.text("RESTART");
  $(".result").empty();
}

function startTimer() {
  timer = setInterval(updateTimer, 1000);
  timeLeft = 60;
  updateTimer();
  $(".score-timing-container").show();
}

function updateTimer() {
  timeLeft = timeLeft - 1;
  if (timeLeft >= 0) {
    $("#timer").text(timeLeft);
  } else {
    timesUp();
  }
}

function startGameHandler(evt) {
  evt.preventDefault();
  submitBtn.on("click", guessHandler);
  $(".board-container").show();
  $(".form-container").show();
  $(".start-container").hide();
  startTimer();
}
