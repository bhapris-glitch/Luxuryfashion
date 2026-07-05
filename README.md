# Luxe Boutique SaaS - Powered by Layboka

A premium, global SaaS platform for luxury fashion boutiques to manage customer measurements, orders, and business growth.

## Features
- **7-Day Free Trial**: Automatic trial-to-paid conversion logic.
- **App Lock Security**: Gracefully restricts access upon trial expiry.
- **Measurement Engine**: Dual-tab system for Ladies and Gentlemen.
- **Stripe Integration**: Integrated autopay for recurring subscriptions.
- **Luxury UI**: Royal Purple & Gold theme with GSAP animations.
- **PWA Ready**: Can be installed on mobile devices for ease of use.

## Prerequisites
- Python 3.11+
- Stripe Account (for API keys)
- Git

## Installation & Local Setup

1. **Clone the repository:**
    git clone https://github.com/your-username/luxe-boutique.git
    cd luxe-boutique

2. **Setup Virtual Environment:**
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate

3. **Install Dependencies:**
    pip install -r requirements.txt

4. **Environment Configuration:**
    Create a `.env` file from the example:
    cp .env.example .env
    Update your `STRIPE_SECRET_KEY` and `SECRET_KEY`.

5. **Run the Application:**
    python app.py

6. **Access the app:**
    Open `http://127.0.0.1:5000` in your browser.

## Deployment to Render.com
1. Push your code to a private GitHub repository.
2. Connect the repository to **Render.com**.
3. Render will automatically detect the `render.yaml` file.
4. Add your **Stripe Secret Keys** in the Environment Variables dashboard on Render.
5. Use a **Persistent Disk** for the SQLite database if not using the managed PostgreSQL option.

## Troubleshooting
- **Database Errors**: Delete `luxe_boutique.db` and restart the app to recreate the schema.
- **Stripe Session Errors**: Ensure your `STRIPE_PRICE_ID` in `config.py` matches a price created in your Stripe Dashboard.
- **CSS Not Loading**: Check the browser console to ensure the path to `/static/css/style.css` is correctly resolved.

*Proudly Powered by Layboka.*
