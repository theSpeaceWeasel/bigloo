{{-- <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Verify email</title>
</head>
<body>
    <a href="{{ url(env('FRONTEND_URL') . '/q?verify-token=' . $token) }}">
       click here to validate your email
    </a>
</body>
</html> --}}

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }}</title>
    <style>
        /* Inline CSS styles */
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f8f8;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333333;
        }
        p {
            color: #666666;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Verify Email Address</h1>
        <p>Please click the button below to verify your email address:</p>
        @php
            $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:3000'), '/');
            $verificationUrl = $frontendUrl . '/?verify-token=' . urlencode($token);
        @endphp
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #666666; font-family: monospace; background: #f5f5f5; padding: 10px; border-radius: 4px;">
            {{ $verificationUrl }}
        </p>
        <p><a href="{{ $verificationUrl }}" style="color: #ffffff; background-color: #007bff; padding: 10px 20px; border-radius: 5px; display: inline-block; text-decoration: none; margin-top: 10px;">Verify Email Address</a></p>
        <p>If you did not create an account, no further action is required.</p>
        <p>Thanks,<br>{{ config('app.name') }}</p>
    </div>
</body>
</html>
