import flask

app = flask.Flask(__name__)

@app.route('/home')
def home():
    return "Hello World"