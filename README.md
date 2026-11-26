Here's a clean README. Place it at `~/Desktop/qr-generator/README.md` (repo root, next to `.gitignore`).

```markdown
# LinkForge

A QR code generator for links. Paste a URL, get a downloadable PNG QR code, and browse previously generated codes. Built with Django and server-rendered templates, with a small JavaScript layer for instant generation without a page reload.

Built by Anthony Karanja — [a.alphacode.ke](https://a.alphacode.ke)

## Features

- Generates QR codes from any URL, normalizing bare domains to `https://`
- Renders the QR image server-side using the `qrcode` library with a dark blue fill matching the site theme
- Saves each generated code to the database with its link and timestamp
- Displays the six most recent codes on the homepage
- Downloads the QR image directly as a PNG
- Responsive layout with a blue palette, Font Awesome icons, and no external JS frameworks

## Tech Stack

- Python 3.12
- Django 5
- SQLite
- Pillow and qrcode for image generation
- HTML, CSS, vanilla JavaScript
- Font Awesome 6

## Project Layout

```
qr-generator/
├── db.sqlite3
├── media/
│   └── qrcodes/
├── venv/
├── .gitignore
├── README.md
└── qrproject/
    ├── manage.py
    ├── qrproject/
    │   ├── settings.py
    │   ├── urls.py
    │   ├── wsgi.py
    │   └── asgi.py
    ├── generator/
    │   ├── models.py
    │   ├── views.py
    │   ├── urls.py
    │   ├── admin.py
    │   └── templates/
    │       └── generator/
    │           └── home.html
    └── static/
        ├── css/
        │   └── style.css
        └── js/
            └── main.js
```

## Requirements

- Python 3.10 or newer
- pip

## Setup

Clone the repository and move into it:

```bash
git clone <repository-url> qr-generator
cd qr-generator
```

Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

On Windows use `venv\Scripts\activate` instead of the `source` line.

Install dependencies:

```bash
pip install -r requirements.txt
```

The `requirements.txt` file contains:

```
Django>=5.0,<6.0
qrcode[pil]>=7.4
Pillow>=10.0
```

## Configuration

The project reads its settings from `qrproject/qrproject/settings.py`. Two paths differ from the Django defaults and are worth noting:

- The SQLite database lives one level above the Django project, at `~/Desktop/qr-generator/db.sqlite3`, set via `BASE_DIR.parent / "db.sqlite3"`.
- Uploaded QR images are stored under `MEDIA_ROOT`, which points to `BASE_DIR / "media"` by default.

For local development, `DEBUG = True` and `django.contrib.staticfiles` serves CSS and JS directly, so `collectstatic` is not required.

For production, set `DEBUG = False`, provide a real `SECRET_KEY`, configure `ALLOWED_HOSTS`, and point a web server at `STATIC_ROOT` and `MEDIA_ROOT`.

## Database

Apply migrations to create the schema:

```bash
cd qrproject
python manage.py migrate
```

The only application model is `QRCode`, with fields `link`, `image`, and `created_at`. It is registered in the Django admin at `/admin/`, which lets you review or delete generated codes after creating a superuser:

```bash
python manage.py createsuperuser
```

## Running the Server

From `qrproject/`:

```bash
python manage.py runserver
```

Open `http://127.0.0.1:8000/` in the browser. The homepage shows the generator form and a list of recent codes.

## How It Works

1. The user submits a URL through the form.
2. JavaScript posts the URL to `/generate/` along with a CSRF token read from the `csrftoken` cookie.
3. The `generate_qr` view normalizes the URL, encodes it with the `qrcode` library using `ERROR_CORRECT_M` and a blue fill, saves the resulting PNG to `media/qrcodes/`, and creates a `QRCode` record.
4. The view returns JSON containing the image URL and the normalized link.
5. JavaScript updates the result panel and wires up the download link.

If the request is not a POST, or the URL is empty, the view returns a JSON error with an appropriate HTTP status.

## License

No license has been applied to this project. All rights reserved by Anthony Karanja.
```