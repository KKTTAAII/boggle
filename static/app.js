"use strict";

const submitBtn = $(".submitBtn");
const startBtn = $(".startBtn")
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
  console.log(score);
  $(".score").text(score);
}

function timesUp() {
  submitBtn.off("click");
  clearInterval(timer);
  swal("Time's up");
  // $('#playAgainButton').show();
}

function startTimer() {
  timer = setInterval(updateTimer, 1000);
  updateTimer();
  $(".score-timing-container").show();
  // $('#playAgainButton').hide();
}

function updateTimer() {
  timeLeft = timeLeft - 1;
  if (timeLeft >= 0) {
    $("#timer").text(timeLeft);
    console.log(timeLeft);
  } else {
    timesUp();
  }
}

function startGameHandler(evt){
  evt.preventDefault();
  submitBtn.on("click", guessHandler);
  $('.board-container').show();
  $('.form-container').show();
  startTimer();
  startBtn.text("RESTART");
}

startBtn.on('click', startGameHandler)

