from .base import *

DEBUG = False
ALLOWED_HOSTS = ['yourdomain.com']

# Security Headers
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
X_FRAME_OPTIONS = 'DENY'

# Ensure SECRET_KEY is provided securely
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')