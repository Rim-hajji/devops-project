from flask import Flask, render_template, request
import requests

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/prayers")
def prayer_times():
    return render_template("prayers.html")
@app.route("/adhkar/sabah")
def adhkar_sabah():
    return render_template("adhkar_sabah.html")
@app.route("/adhkar/masaa")
def adhkar_masaa():
    return render_template("adhkar_masaa.html")
@app.route("/adhkar/salah")
def adhkar_salah():
    return render_template("adhkar_salah.html")
@app.route("/adhkar/noum")
def adhkar_noum():
    return render_template("adhkar_noum.html")
@app.route("/adhkar/istikadh")
def adhkar_istikadh():
    return render_template("adhkar_istikadh.html")
@app.route("/adhkar/masjed")
def adhkar_masjed():
    return render_template("adhkar_masjed.html")
@app.route("/mosques-map.html")
def mosques_map():
    return render_template("mosques-map.html")
@app.route("/tasbih")
def tasbih():
    return render_template("tasbih.html")


@app.route("/adhkar")
def adhkar():
    return render_template("adhkar.html")


@app.route("/get_times")
def get_times():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    response = requests.get(f"https://api.aladhan.com/v1/timings?latitude={lat}&longitude={lon}&method=2")
    data = response.json()
    return data['data']['timings']

if __name__ == "__main__":
    app.run(debug=True)
