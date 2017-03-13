from flask import Flask, request
import base64
import json
import smtplib
from os.path import basename
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate
from email import encoders
from email.mime.base import MIMEBase


app = Flask(__name__)

EMAIL_ADDRESS = "joshstestingemail3122017@gmail.com"
EMAIL_PASSWORD = "SecurePassword"

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

        sendEmail(request.form['email'], EMAIL_ADDRESS, EMAIL_PASSWORD, "Postcard", "smtp.gmail.com", 587, "postcard.png")

    return json.dumps({'success':True}), 200, {'ContentType':'application.json'}


def sendEmail(send_to, send_from, password, subject, server, port, image):
    msg = MIMEMultipart()
    msg['From'] = send_from
    msg['To'] = send_to
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = subject
    body = "Your friend has sent you a postcard!"
    msg.attach(MIMEText(body, 'plain'))

    filename = "postcard.png"
    attachment = open(filename, "rb")
    attch = MIMEBase('application', "octet-stream")
    attch.set_payload(attachment.read())
    encoders.encode_base64(attch)
    attch.add_header('Content-Disposition', "attachment; filename=%s" % filename)
    msg.attach(attch)

    smtp = smtplib.SMTP(server, port)
    smtp.ehlo()
    smtp.starttls()
    smtp.ehlo()
    smtp.login(send_from, password)
    smtp.sendmail(send_from, send_to, msg.as_string())
    smtp.close()


# For testing and debugging only
if __name__ == '__main__':
    app.run()