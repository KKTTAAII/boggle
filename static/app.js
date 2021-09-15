"use strict";

const submitBtn = $(".submitBtn");
const startBtn = $(".startBtn");
let score = 0;
let timeLeft = 60;
let timer;

async function guessHandler(event) {
  event.preventDefault();

  $("h3").remove();

  const word = $("input").val();
  check_if_word(word);

  const resp = await axios.get("/check-word", { params: { word: word } });
  const result = resp.data.result;
  $("input").val("");

  checkWord(result, word);
}

function check_if_word(word) {
  if (!word) {
    swal("Please make a guess");
  }
}

function checkWord(result, word) {
  if (result === "ok") {
    keepTrackOfScore(word);
    return $(".result").append(
      "<h3>Congrats! You guessed a correct word!</h3>"
    );
  }
  if (result === "not-on-board") {
    return $(".result").append("<h3>Sorry, the word is not on the board</h3>");
  }
  if (result === "not-word") {
    return $(".result").append("<h3>That's not even a word!</h3>");
  }
}

function keepTrackOfScore(word) {
  score += word.length;
  $(".score").text(score);
}

async function timesUp() {
  // how to remove guess click?
  clearInterval(timer);

  const resp = await axios.post("/score", { score: score });
  const userHighestScore = resp.data.highestscore;
  console.log(userHighestScore);
 $('.highestscore').text(userHighestScore)

  $(".start-container").show();
  startBtn.text("RESTART");
}

function startTimer() {
  timer = setInterval(updateTimer, 1000);
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

startBtn.on("click", startGameHandler);
