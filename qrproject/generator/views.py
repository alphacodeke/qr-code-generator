import qrcode
from io import BytesIO
from django.core.files.base import ContentFile
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from .models import QRCode


def home(request):
    recent = QRCode.objects.order_by('-created_at')[:6]
    return render(request, 'generator/home.html', {'recent': recent})


@require_POST
def generate_qr(request):
    link = request.POST.get('link', '').strip()

    if not link:
        return JsonResponse({'error': 'Please provide a link.'}, status=400)

    if not link.startswith(('http://', 'https://')):
        link = 'https://' + link

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=2,
    )
    qr.add_data(link)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#1e3a5f", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format='PNG')

    record = QRCode(link=link)
    filename = f'qr_{QRCode.objects.count() + 1}.png'
    record.image.save(filename, ContentFile(buffer.getvalue()), save=False)
    record.save()

    return JsonResponse({
        'image_url': record.image.url,
        'link': link,
        'id': record.id,
    })
