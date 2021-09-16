"use strict";

class Boggle {
  constructor(timeLeft) {
    this.score = 0;
    this.timeLeft = timeLeft;
    this.timer;
    $(".submitBtn").on("click", this.guessHandler.bind(this));
    this.words = [];
    this.startTimer();
    $(".board-container").show();
    $(".form-container").show();
    $(".start-container").hide();
  }

  async guessHandler(event) {
    event.preventDefault();
    if (this.timeLeft === 0) {
      return;
    } else {
      const word = $("input").val();
      if (!word) {
        this.checkIfWord(word);
        return console.log("User needs to guess a word");
      }
      const resp = await axios.get("/check-word", { params: { word: word } });
      const result = resp.data.result;

      $("input").val("");

      this.checkWord(result, word);
    }
  }

  checkIfWord(word) {
    if (!word) {
      swal("Please make a guess");
    }
  }

  checkWord(result, word) {
    this.emptyResultInDiv();
    if (result === "ok") {
      this.keepTrackOfScore(word);
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

  keepTrackOfScore(word) {
    if (this.words.includes(word)) {
      return swal("You already guessed this word");
    } else {
      this.words.push(word);
      this.score += word.length;
      return $(".score").text(this.score);
    }
  }

  startTimer() {
    this.timer = setInterval(this.updateTimer.bind(this), 1000);
    this.timeLeft = this.timeLeft;
    this.updateTimer();
    $(".score-timing-container").show();
  }

  updateTimer() {
    this.timeLeft = this.timeLeft - 1;
    if (this.timeLeft >= 0) {
      $("#timer").text(this.timeLeft);
    } else {
      this.timesUp();
    }
  }

  async timesUp() {
    clearInterval(this.timer);

    swal("Time's up");

    const resp = await axios.post("/score", { score: this.score });
    const userHighestScore = resp.data.highestscore;
    $(".highestscore").text(userHighestScore);

    $(".start-container").show();
    $(".highestScore").show();

    $(".startBtn").text("RESTART");
    this.emptyResultInDiv();
    this.reset();
  }

  reset() {
    this.score = 0;
    this.words = [];
    $(".score").text(this.score);
  }

  emptyResultInDiv() {
    return $(".result").empty();
  }
}

const startBtn = $(".startBtn");

startBtn.on("click", function (event) {
  event.preventDefault();

  const boggle = new Boggle(60);
});
