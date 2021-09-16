from unittest import TestCase
from flask.globals import request
from flask.wrappers import Response
from app import app
from flask import session
from boggle import Boggle

app.config["TESTING"] = True
app.config["DEBUG_TB_HOSTS"] = ["dont-show-debug-toolbar"]


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def test_board(self):
        with app.test_client() as client:
            """Test that the html elements are on the page"""
            res = client.get("/")
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn("board", session)
            self.assertIn('<div class="form-container" hidden>', html)
            self.assertIn('<td class="cell">', html)
            self.assertIn('<span id="timer">0</span>', html)
            self.assertIn('<span class="score">0</span>', html)
            self.assertIn('<span id="timer">0</span>', html)
            self.assertIn('<span class="highestscore">0</span>', html)
            self.assertIsNone(session.get("count"), None)
            self.assertIsNone(session.get("score"), None)
            
    def test_check_word(self):
        """Test that the python function works when the request is sent"""
        with app.test_client() as client:
            with client.session_transaction() as session:
                session['board'] = [["M", "A", "Y", "O", "K"], 
                                 ["C", "E", "U", "Q", "T"], 
                                 ["O", "R", "A", "S", "H"], 
                                 ["L", "Y", "U", "Z", "G"], 
                                 ["Z", "W", "T", "E", "C"]]
        res = client.get("/check-word?word=hello")
        html = res.get_data(as_text=True)
        self.assertEqual(res.json["result"], "not-on-board")
        self.assertEqual(res.status_code, 200)

    def test_track_score(self):
        """Test sessions and the response json is correct"""
        with app.test_client() as client:
            with client.session_transaction() as score_session:
                score_session["score"] = [5,8,8,16,21]
            with client.session_transaction() as count_session:
                count_session["count"] = 5
            res = client.post("/score", json={"score": 15})
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json["highestscore"], 21)
            self.assertEqual(session["count"], 6)
            self.assertEqual(session["score"], [5,8,8,16,21,15])
            
            
            
        