from flask import Flask, request
app = Flask(__name__)

@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/email', methods=['POST'])
def email():
    if request.method == 'POST':
        print(request.form['email'])
        print(request.form['imgBase64'])


# For testing and debugging only
if __name__ == '__main__':
    app.run()