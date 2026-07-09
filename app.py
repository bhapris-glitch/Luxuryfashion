from flask import Flask, render_template, redirect, url_for, request, session
from datetime import datetime, timedelta
from models import db, User, Boutique
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'layboka_ultimate_vault_2024'

# SMART DATABASE ENGINE: Fixes "unable to open database" on Render
# We use the absolute path of the current directory to ensure SQLite can write the file
basedir = os.path.abspath(os.path.dirname(__file__))
db_path = os.path.join(basedir, 'luxe_boutique.db')

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.before_request
def trial_check():
    public = ['splash', 'subscription', 'static', 'logout_screen', 'logout_process', 'login']
    if request.endpoint in public or not request.endpoint: return
    
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        if user and user.role == 'boutique_admin':
            boutique = Boutique.query.filter_by(user_id=user.id).first()
            if boutique:
                expiry = boutique.created_at + timedelta(days=7)
                if datetime.utcnow() > expiry and not boutique.subscription_active:
                    return redirect(url_for('subscription'))

@app.route('/')
def splash(): return render_template('splash.html')

@app.route('/login')
def login():
    # Simple auto-setup for first-time use
    user = User.query.first()
    if user: session['user_id'] = user.id
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard(): return render_template('dashboard.html')

@app.route('/tailoring')
def tailoring(): return render_template('tailoring.html')

@app.route('/subscription')
def subscription(): return render_template('subscription.html')

@app.route('/logout')
def logout_screen(): return render_template('exit.html')

@app.route('/logout/process')
def logout_process():
    session.clear()
    return redirect(url_for('splash'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        if not User.query.first():
            u = User(email='admin@layboka.com', role='boutique_admin')
            db.session.add(u)
            db.session.commit()
            b = Boutique(user_id=u.id, name='Luxe Boutique')
            db.session.add(b)
            db.session.commit()
    app.run(debug=True)
