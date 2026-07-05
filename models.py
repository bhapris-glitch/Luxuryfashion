from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime, timedelta

db = SQLAlchemy()

class Boutique(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    business_name = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    
    # Trial & Subscription Logic
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    trial_ends_at = db.Column(db.DateTime, default=lambda: datetime.utcnow() + timedelta(days=7))
    is_subscribed = db.Column(db.Boolean, default=False)
    stripe_customer_id = db.Column(db.String(100), nullable=True)

    # Relationships
    orders = db.relationship('Order', backref='owner', lazy=True)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(20)) # 'Ladies' or 'Gentlemen'
    measurements = db.Column(db.JSON) # Store dynamic fields as JSON
    status = db.Column(db.String(50), default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    boutique_id = db.Column(db.Integer, db.ForeignKey('boutique.id'), nullable=False)
