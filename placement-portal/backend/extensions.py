from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore
from celery import Celery
from flask_caching import Cache

db = SQLAlchemy()
celery = Celery()
security = Security()
cache = Cache()
