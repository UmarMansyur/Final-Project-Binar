require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const ejs = require('ejs')

const {
    GOOGLE_REFRESH_TOKEN1,
    GOOGLE_ACCESS_TOKEN1,
    GOOGLE_CLIENT_ID1,
    GOOGLE_CLIENT_SECRET1,
    GOOGLE_REDIRECT_URI1,
    JWT_TOKEN
} = process.env

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID1,
    GOOGLE_CLIENT_SECRET1,
    GOOGLE_REDIRECT_URI1
);

oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN1
});

module.exports = {
    sendEmail: async (to, subject, html) => {
        return new Promise(async (resolve, reject) => {

            try{ 
            const accessToken = await oauth2Client.getAccessToken();
        
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: 'your_mail@gmail.com',
                    clientId: GOOGLE_CLIENT_ID1,
                    clientSecret: GOOGLE_CLIENT_SECRET1,
                    refreshToken: GOOGLE_REFRESH_TOKEN1,
                    accessToken: accessToken
                }
            })
        
            const mailOptions = {
                to,
                subject,
                html
            }
        
            const response = transport.sendMail(mailOptions)
            resolve(response)
        
            }catch (err){
            reject(err)
            }
        })
    },

    getHtml: async (filename, data) => {
        return new Promise((resolve, reject) => {
            const path = __dirname + '/../views/' + filename;
    
            ejs.renderFile(path, data, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}