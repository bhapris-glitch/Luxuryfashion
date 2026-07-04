from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='boutique_admin') # super_admin, boutique_admin

class Boutique(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    name = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    subscription_active = db.Column(db.Boolean, default=False)
    plan_tier = db.Column(db.String(50)) # Beautiful, More Beautiful, Most Beautiful

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    boutique_id = db.Column(db.Integer, db.ForeignKey('boutique.id'))
    client_name = db.Column(db.String(100))
    gender = db.Column(db.String(10)) # Male, Female
    dress_type = db.Column(db.String(100))
    measurements = db.Column(db.JSON)
    status = db.Column(db.String(50), default='Concept Born')
