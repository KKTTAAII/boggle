from flask import Flask, request, render_template, redirect, jsonify
from flask.globals import session
from flask_debugtoolbar import DebugToolbarExtension
from boggle import Boggle

boggle_game = Boggle()
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['SECRET_KEY'] = "helloeve"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

@app.route("/")
def start_board():
    """build a game board"""
    board = boggle_game.make_board()
    session["board"] = board
    return render_template("home.html", board=board)

@app.route("/check-word")
def check_word():
    """receive a word from request and check 
    if the word is on the board"""
    word = request.args["word"]
    board = session["board"]
    result = boggle_game.check_valid_word(board, word)
    return jsonify({"result": result})

@app.route("/score", methods=["POST"])
def show_score():
    """
    receive score data from request and 
    find the highest score
    """
    score = request.json["score"]

    session["count"] = session.get("count", 0) + 1
    session["score"] = session.get("score", [])
    user_score = session["score"]
    user_score.append(score)
    session["score"] = user_score
    highest_score = max(user_score)

    return jsonify({"highestscore": highest_score})