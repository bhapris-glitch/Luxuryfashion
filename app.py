from flask import Flask, render_template, redirect, url_for, request, session, flash
from datetime import datetime, timedelta
from models import db, User, Boutique, Order
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'layboka_luxury_secret')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:////var/data/luxe.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Trial Lock Middleware
@app.before_request
def trial_guard():
    # Public endpoints allowed during lock
    allowed_endpoints = ['splash', 'trial_expired', 'static', 'logout', 'login', 'register', 'process_payment']
    
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user and user.role == 'boutique_admin':
            boutique = Boutique.query.filter_by(user_id=user.id).first()
            if boutique:
                days_elapsed = (datetime.utcnow() - boutique.created_at).days
                if days_elapsed > 7 and not boutique.subscription_active:
                    if request.endpoint not in allowed_endpoints:
                        return redirect(url_for('trial_expired'))

@app.route('/')
def splash():
    return render_template('splash.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/trial-expired')
def trial_expired():
    return render_template('trial_expired.html')

@app.route('/exit')
def exit_app():
    # Shows the 3-second Layboka branded exit screen
    return render_template('exit.html')

@app.route('/logout/process')
def logout_process():
    session.clear()
    return redirect(url_for('splash'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)
