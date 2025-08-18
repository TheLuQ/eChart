from flask import Flask
from flask import send_file
import os.path
from flask_cors import CORS, cross_origin
import flask.json
import json

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)

with open('db.json') as fl:
    conf = json.loads(fl.read())

@cross_origin()
@app.route("/<id>")
def get_file(id):
     try:
          return send_file(f'mockpdfs/{id}')
     except Exception as e:
          return str(e)

@cross_origin()
@app.route("/api/<section>")
def get_file2(section):
    response = app.response_class(
        response=json.dumps(conf[section]),
        status=200,
        mimetype='application/json'
    )
    return response

if __name__ == "__main__":
    app.run(debug=True)