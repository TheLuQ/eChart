#!/usr/bin/env python3

from flask import Flask, request, send_file, jsonify
import os.path
from flask_cors import CORS, cross_origin
import flask.json
import json
import os
import sys

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app)
db_config = os.getenv("DB_FILE", sys.argv[1])

with open(db_config) as fl:
    conf = json.loads(fl.read())

@cross_origin()
@app.route("/files/<id>")
def get_file(id):
     try:
          return send_file(f'mockpdfs/{id}.pdf')
     except Exception as e:
          return str(e)

@cross_origin()
@app.route("/api/sheets", methods=["GET"])
@app.route("/api/sheets/<id>", methods=["GET"])
def get_sheet(id=None):
    group_keys = request.args.getlist("group_key")

    if group_keys:
        selected = set(group_keys)
        result = [
            item for item in conf["sheets"]
            if item.get("group_key") in selected or item.get("title") in selected
        ]
        if not result:
            return "Not found", 404
        return jsonify(result)

    if id is not None:
        result = [
            item for item in conf["sheets"]
            if item.get("group_key") == id or item.get("title") == id
        ]
        if not result:
            return "Not found", 404
        return jsonify(result)

    return jsonify(conf["sheets"])

@cross_origin()
@app.route("/api/events/<id>")
def get_event(id):
    result = next((item for item in conf["events"] if item["id"] == id), None)
    if result is None:
        return "Not found", 404

    response = app.response_class(
        response=json.dumps(result),
        status=200,
        mimetype='application/json'
    )
    return response

@cross_origin()
@app.route("/api2/flattensheets/<titles>")
def get_sheets_flat(titles):
    ids_list = titles.split(',')
    result = []
    for sheet in conf["sheets"]:
        if sheet["title"] in ids_list:
            for instrument in sheet.get("instruments", []):
                result.append({
                "id": instrument.get("id"),
                "name": instrument.get("file_name"),
                "title": sheet.get("title"),
                "instrument": instrument.get("instrument_name_en"),
                "name_pol": instrument.get("instrument_name_pol"),
                "key": instrument.get("key"),
                "part": instrument.get("voice"),
            })

    response = app.response_class(
        response=json.dumps(result),
        status=200,
        mimetype='application/json'
    )
    return response

@cross_origin()
@app.route("/api/<section>")
def get_file2(section):
    response = app.response_class(
        response=json.dumps(conf[section]),
        status=200,
        mimetype='application/json'
    )
    return response

@cross_origin()
@app.route("/api2/titles")
def get_sheets():
    result = [item.get("title") for item in conf["sheets2"]]

    response = app.response_class(
        response=json.dumps(result),
        status=200,
        mimetype='application/json'
    )
    return response

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', use_reloader=False)