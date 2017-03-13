from flask import Flask, request
import base64
import json
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formatdate
from email import encoders
from email.mime.base import MIMEBase


app = Flask(__name__)

# This email address and password were created exactly for this project.
# If they are replaced to a non-gmail account, the mail server must also be replaced.
EMAIL_ADDRESS = "joshstestingemail3122017@gmail.com"
EMAIL_PASSWORD = "SecurePassword"

# The default web page to serve
@app.route('/')
def index():
    return app.send_static_file('index.html')


# Handling the email form
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
        # Send the email
        # smtp.gmail.com and 587 are the address and port of Google's gmail server.
        # IF EMAIL_ADDRESS AND EMAIL_PASSWORD ARE CHANGED, THESE MUST BE CHANGED AS WELL.
        sendEmail(request.form['email'], EMAIL_ADDRESS, EMAIL_PASSWORD, "Postcard", "smtp.gmail.com", 587, "postcard.png")

    # Return a success code.
    return json.dumps({'success':True}), 200, {'ContentType':'application.json'}


# Send the email
def sendEmail(send_to, send_from, password, subject, server, port, image):
    msg = MIMEMultipart()
    # The From, To, Date, Subject, and Body of the email assigned here
    msg['From'] = send_from
    msg['To'] = send_to
    msg['Date'] = formatdate(localtime=True)
    msg['Subject'] = subject
    body = "Your friend has sent you a postcard!"
    msg.attach(MIMEText(body, 'plain'))

    # Loading the image file and attaching it to the email
    filename = "postcard.png"
    attachment = open(filename, "rb")
    attch = MIMEBase('application', "octet-stream")
    attch.set_payload(attachment.read())
    encoders.encode_base64(attch)
    attch.add_header('Content-Disposition', "attachment; filename=%s" % filename)
    msg.attach(attch)

    # Send the email
    smtp = smtplib.SMTP(server, port)
    smtp.ehlo()
    smtp.starttls()
    smtp.ehlo()
    smtp.login(send_from, password)
    smtp.sendmail(send_from, send_to, msg.as_string())
    smtp.close()


if __name__ == '__main__':
    app.run()