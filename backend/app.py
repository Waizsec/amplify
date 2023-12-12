from flask import Flask, request, jsonify
from audioclassify import audio_classify
from spotify import get_spotify_recommendations
import os
import pickle
import random
import soundfile as sf
import sounddevice as sd
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/",  methods=["POST"])
def index():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    audio_path = "/input/" + file.filename
    base_path = os.path.join(app.root_path, 'static/audio')
    audio_file_path = base_path+audio_path

    file.save(audio_file_path)
    if os.path.exists(audio_file_path):
        result = audio_classify(audio_file_path)
        return result
    else:
        return jsonify({"error": "Failed to save the file"}), 500


@app.route("/getrandom")
def getrandom():
    pickle_path = os.path.join(
        app.root_path, 'static', 'recommended_tracks.pkl')
    with open(pickle_path, 'rb') as pickle_file:
        loaded_recommended_tracks = pickle.load(pickle_file)
    random_tracks = random.sample(loaded_recommended_tracks, 15)
    return jsonify(random_tracks)


@app.route("/getrecomendation",  methods=["GET"])
def getrecomendation():
    # Get parameters from the query string
    genre = request.args.get('genre', default="null", type=str)
    tempo = request.args.get('tempo', default="null", type=float)
    loudness = request.args.get('loudness', default="null", type=float)
    danceability = request.args.get('danceability', default="null", type=float)
    keyindex = request.args.get('keyindex', default="null", type=int)
    liveness = request.args.get('liveness', default="null", type=float)

    # Call the function with obtained parameters
    recommendations = get_spotify_recommendations(
        seed_genre=genre,
        seed_tempo=tempo,
        seed_loudness=loudness,
        seed_danceability=danceability,
        seed_keyindex=keyindex,
        seed_liveness=liveness
    )

    if recommendations is not None and 'tracks' in recommendations:
        tracks = recommendations['tracks']
        simplified_tracks = [
            {
                'artist': ', '.join(artist['name'] for artist in track['artists']),
                'trackName': track['name'],
                'albumImage': track['album']['images'][0]['url'] if track['album']['images'] else None,
                'link': track['external_urls']['spotify'],
                'preview_url': track['preview_url'] if 'preview_url' in track else None
            }
            for track in tracks
        ]
        return jsonify(simplified_tracks)
    else:
        response_data = {"error": "No recommendations or an error occurred."}
        return jsonify(response_data)


@app.route('/startrecording', methods=['POST'])
def start_recording():
    audio_duration = 15
    sample_rate = 44100
    print("Recording...")
    audio_data = sd.rec(int(audio_duration * sample_rate),
                        samplerate=sample_rate, channels=1, dtype=np.int32)
    sd.wait()
    print("Recording complete")
    audio_data_float = audio_data.flatten().astype(np.float64)
    audio_data_float /= np.max(np.abs(audio_data_float))

    base_path = os.path.join(app.root_path, 'static/audio/input')
    output_path = os.path.join(base_path, "record.wav")
    sf.write(output_path, audio_data_float, sample_rate)

    if os.path.exists(output_path):
        result = audio_classify(output_path)
        return result
    else:
        return jsonify({"error": "Failed to save the file"}), 500


if __name__ == '__main__':
    app.run(debug=True)
