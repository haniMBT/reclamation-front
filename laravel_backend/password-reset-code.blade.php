<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code de réinitialisation - EPAL</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #0d9488 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #374151;
            margin-bottom: 20px;
        }
        .message {
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .code-container {
            background-color: #f3f4f6;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .code {
            font-size: 32px;
            font-weight: bold;
            color: #10b981;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .code-label {
            font-size: 14px;
            color: #6b7280;
            margin-top: 10px;
        }
        .warning {
            background-color: #fef3cd;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .warning-text {
            color: #92400e;
            font-size: 14px;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer-text {
            color: #6b7280;
            font-size: 12px;
            line-height: 1.5;
        }
        .support-link {
            color: #10b981;
            text-decoration: none;
        }
        .support-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">EPAL</div>
            <div class="subtitle">Entreprise Portuaire d'Alger</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">
                Bonjour {{ $userName }},
            </div>

            <div class="message">
                Vous avez demandé la réinitialisation de votre mot de passe pour votre compte EPAL.
                Utilisez le code de vérification ci-dessous pour procéder à la réinitialisation :
            </div>

            <div class="code-container">
                <div class="code">{{ $code }}</div>
                <div class="code-label">Code de vérification</div>
            </div>

            <div class="warning">
                <div class="warning-text">
                    <strong>Important :</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>Ce code est valide pendant <strong>15 minutes</strong> seulement.</li>
                        <li>Ne partagez jamais ce code avec qui que ce soit.</li>
                        <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</li>
                    </ul>
                </div>
            </div>

            <div class="message">
                Si vous rencontrez des difficultés, contactez notre support technique à l'adresse 
                <a href="mailto:support@epal.dz" class="support-link">support@epal.dz</a> 
                ou consultez notre <a href="http://ged.epal.dz/" class="support-link">portail d'aide</a>.
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-text">
                Cet email a été envoyé automatiquement par la plateforme EPAL.<br>
                Entreprise Portuaire d'Alger - Port d'Alger, Algérie<br>
                <br>
                © {{ date('Y') }} EPAL. Tous droits réservés.
            </div>
        </div>
    </div>
</body>
</html>