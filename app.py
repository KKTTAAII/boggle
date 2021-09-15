from flask import Flask, request, render_template, redirect, flash, jsonify
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
    board = boggle_game.make_board()
    session["board"] = board
    return render_template("home.html", board=board)

@app.route("/check-word")
def check_word():
    word = request.args["word"]
    board = session["board"]
    result = boggle_game.check_valid_word(board, word)
    return jsonify({"result": result})

