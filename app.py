import os
from flask import Flask, render_template, redirect, url_for, request, flash, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import stripe

from config import Config
from models import db, Boutique, Order

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
login_manager = LoginManager()
login_manager.login_view = 'login'
login_manager.init_app(app)

stripe.api_key = app.config['STRIPE_SECRET_KEY']

@login_manager.user_loader
def load_user(user_id):
    return Boutique.query.get(int(user_id))

# --- MIDDLEWARE: Trial Guard ---
@app.before_request
def check_trial_status():
    if current_user.is_authenticated:
        # Allow access to subscription and logout pages always
        if request.endpoint in ['subscription', 'logout', 'create_checkout_session', 'static']:
            return
            
        if not current_user.is_subscribed and datetime.utcnow() > current_user.trial_ends_at:
            return redirect(url_for('subscription'))

# --- ROUTES ---

@app.route('/')
def splash():
    return render_template('splash.html')

@app.route('/dashboard')
@login_required
def dashboard():
    orders = Order.query.filter_by(boutique_id=current_user.id).order_by(Order.created_at.desc()).all()
    return render_template('dashboard_admin.html', orders=orders)

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        hashed_pw = generate_password_hash(request.form.get('password'))
        new_boutique = Boutique(
            business_name=request.form.get('business_name'),
            email=request.form.get('email'),
            password=hashed_pw
        )
        db.session.add(new_boutique)
        db.session.commit()
        login_user(new_boutique)
        return redirect(url_for('dashboard'))
    return render_template('register.html') # Added for completeness

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user = Boutique.query.filter_by(email=request.form.get('email')).first()
        if user and check_password_hash(user.password, request.form.get('password')):
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Invalid Credentials')
    return render_template('login.html')

@app.route('/measurements/new', methods=['GET', 'POST'])
@login_required
def tailoring_form():
    if request.method == 'POST':
        gender = request.form.get('gender')
        # Gather all form data except CSRF and basic info
        measurements = {k: v for k, v in request.form.items() if k not in ['customer_name', 'gender']}
        
        new_order = Order(
            customer_name=request.form.get('customer_name'),
            gender=gender,
            measurements=measurements,
            boutique_id=current_user.id
        )
        db.session.add(new_order)
        db.session.commit()
        flash('Measurement Saved Successfully')
        return redirect(url_for('dashboard'))
    return render_template('tailoring_form.html')

@app.route('/subscription')
@login_required
def subscription():
    return render_template('subscription.html')

@app.route('/create-checkout-session', methods=['POST'])
@login_required
def create_checkout_session():
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{'price': app.config['SUBSCRIPTION_PRICE_ID'], 'quantity': 1}],
            mode='subscription',
            success_url=app.config['DOMAIN'] + '/dashboard?session_id={CHECKOUT_SESSION_ID}',
            cancel_url=app.config['DOMAIN'] + '/subscription',
            customer_email=current_user.email,
        )
        return redirect(checkout_session.url, code=303)
    except Exception as e:
        return str(e)

@app.route('/exit')
def exit_app():
    return render_template('exit.html')

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('exit_app'))

# Database initialization
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
