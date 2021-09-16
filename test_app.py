from unittest import TestCase
from flask.globals import request
from app import app
from flask import session
from boggle import Boggle

app.config['TESTING'] = True
app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!
    def test_board(self):
        with app.test_client() as client:
            res = client.get('/')
            html = res.get_data(as_text=True)

            self.assertEqual(res.status_code, 200)
            self.assertIn('board', session)
            self.assertIn('<div class="form-container" hidden>', html)
            self.assertIn('<td class="cell">', html)
            self.assertIn('<span id="timer">0</span>', html)
            self.assertIn('<span class="score">0</span>', html)
            self.assertIn('<span id="timer">0</span>', html)
            self.assertIn('<span class="highestscore">0</span>', html)
            self.assertIsNone(session.get("count"), None)
            self.assertIsNone(session.get("score"), None)
            
    def test_check_word(self):
        with app.test_client() as client:
            with client.session_transaction() as session:
                session['board'] = [["M", "A", "Y", "O", "K"], 
                                 ["C", "E", "U", "Q", "T"], 
                                 ["O", "R", "A", "S", "H"], 
                                 ["L", "Y", "U", "Z", "G"], 
                                 ["Z", "W", "T", "E", "C"]]
        response = client.get('/check-word?word=hello')
        html = response.get_data(as_text=True)
        self.assertEqual(response.json['result'], 'not-on-board')
        self.assertEqual(response.status_code, 200)

    def test_track_score(self):
        with app.test_client() as client:
            import pdb
            pdb.set_trace()
            res = client.post('/score', {"score": 15})
            print(res.json)
            
            
        