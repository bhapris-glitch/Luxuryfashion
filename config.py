import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-12345')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///luxe_boutique.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Stripe Config
    STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY')
    STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY')
    
    # SaaS Business Rules
    TRIAL_DURATION_DAYS = int(os.getenv('TRIAL_DAYS', 7))
    SUBSCRIPTION_PRICE_ID = "price_12345" # Replace with actual Stripe Price ID
    DOMAIN = "https://luxe-boutique-saas.onrender.com"
