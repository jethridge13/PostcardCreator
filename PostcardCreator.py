from flask import Flask, request
import base64
import json

app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/email', methods=['POST'])
def email():
    if request.method == 'POST':
        # Decode the base64 string to get the image
        image = request.form['imgBase64']
        image = image.replace('data:image/png;base64,', '')
        image = base64.b64decode(image)
        file = open("postcard.png", 'wb')
        file.write(image)
        file.close()

    return json.dumps({'success':True}), 200, {'ContentType':'application.json'}


# For testing and debugging only
if __name__ == '__main__':
    app.run()