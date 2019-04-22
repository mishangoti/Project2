const path = require('path');
const dotenv = require('dotenv');

console.log(`Mode : ${process.env.DZ_MODE}`);

if (process.env.DZ_MODE == 'production') {
    dotenv.load({ path: '.env-prod' });
} else {
    //   dotenv.load({ path: '.env-dev' });
    dotenv.config({ path: './.env-dev' });
}

// console.log(process.env);
module.exports = {
    appName: process.env.DZ_APP_NAME,
    logPath: process.env.DZ_LOG_PATH,
    port: process.env.DZ_PORT,
    mode: process.env.DZ_MODE || 'development',
    databaseInfo: {
        userName: process.env.DZ_DB_USERNAME,
        password: process.env.DZ_DB_PASSWORD,
        databaseName: process.env.DZ_DB_NAME,
        host: process.env.DZ_LOG_PATH,
    },
    filePaths: {
        parentDir: __dirname,
        filesDir: path.join(__dirname, 'files'),
    },
    aws: {
        keyId: '',
        key: '',
        region: '',
        s3: {
            userBucket: '',
            staticPagesBucket: '',
            placeholderBucket: '',
        },
    },
    twilio: {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        mobileNo: process.env.TWILIO_MOBILE_NO,
    },
    mailgunInfo: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    },
    geocoderInfo: {
        provider: '',
        httpAdapter: '',
        apiKey: '',
        formatter: null,
    },
    googleDistance: {
        apiKey: ['', ''],
    },
    googleAPIKey: '',
    push_notification: {
        p8FilePath: './public/XXXXXXXXXX.p8',
        key_id: '',
        team_id: '',
        bundle_id: '',
        bundle_id_consumer: '',
        server_key: '',
        title: '',
        arrive_title: '',
        arrive_type: '',
        msg_from: '',
    },
    JWTSecret: process.env.JWTSecret,
    audience: 'nodejs-jwt-auth',
    issuer: 'https://gonto.com',
    paypal: {
        payment_mode: process.env.PAYPAL_MODE,
        paypal_client_id: process.env.PAYPAL_CLIENT_ID,
        paypal_client_secret: process.env.PAYPAL_CLIENT_SECRET
    },
    mail: {
        mail_service: process.env.MAIL_SERVICE,
        mail_port: process.env.MAIL_PORT,
        mail_user: process.env.MAIL_USER,
        mail_pass: process.env.MAIL_PASS
    },
    gmail: {
        gmail_service: process.env.GMAIL_SERVICE,
        gmail_port: process.env.GMAIL_PORT,
        gmail_user: process.env.GMAIL_USER,
        gmail_pass: process.env.GMAIL_PASS
    }
};
