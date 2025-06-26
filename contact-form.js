function doPost(e) {
    // Retrieve the secret key you stored in Project Settings > Script Properties
    var SECRET_KEY = PropertiesService.getScriptProperties().getProperty('RECAPTCHA_SECRET_KEY');
    // Set a score threshold (0.0 to 1.0). Typical scores for real users are > 0.5
    var RECAPTCHA_SCORE_THRESHOLD = 0.5;

    try {
        // --- reCAPTCHA Verification ---
        var token = e.parameter['g-recaptcha-response'];
        if (!token) {
            throw new Error("Missing reCAPTCHA token. Please refresh the page and try again.");
        }

        // Make a server-to-server call to Google's verification endpoint
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
        var response = UrlFetchApp.fetch(verificationUrl, {
            method: "post",
            payload: {
                secret: SECRET_KEY,
                response: token
            }
        });

        var recaptchaResult = JSON.parse(response.getContentText());

        // Check if the verification was successful and if the score is above our threshold
        if (!recaptchaResult.success || recaptchaResult.score < RECAPTCHA_SCORE_THRESHOLD) {
            throw new Error("reCAPTCHA verification failed. It seems you might be a bot. Score: " + (recaptchaResult.score || "N/A"));
        }
        // --- End reCAPTCHA Verification ---

        // --- Process Form Data (only if reCAPTCHA passes) ---
        var subject = sanitizeInput(e.parameter.subject || "No Subject");
        var name = sanitizeInput(e.parameter.name || "No name provided");
        var email = sanitizeInput(e.parameter.email || "No email provided");
        var message = sanitizeInput(e.parameter.message || "No message provided");

        MailApp.sendEmail({
            to: 'nadav@fulo.life',
            subject: 'New Contact Form Submission from ' + name + ' regarding ' + subject,
            htmlBody: message + '<br><br>' +
                'Reply to: <a href="mailto:' + email + '" style="color: #4A90E2; text-decoration: none;">' + email + '</a><br><br>' +
                '(reCAPTCHA score: ' + recaptchaResult.score + ')' // Include score for monitoring
        });

        // Return a success response
        return ContentService
            .createTextOutput(JSON.stringify({ "result": "success" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // Return a specific error response for the frontend to display
        return ContentService
            .createTextOutput(JSON.stringify({ "result": "error", "error": error.message }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// A simple doGet to guide users who visit the URL directly in a browser
function doGet(e) {
    return ContentService
        .createTextOutput("This web endpoint is for POST requests from a form.")
        .setMimeType(ContentService.MimeType.TEXT);
}

// Function to sanitize input by escaping special characters
function sanitizeInput(input) {
    if (typeof input === 'string') {
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
    return input;
}