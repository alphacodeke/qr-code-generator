from django.db import models


class QRCode(models.Model):
    link = models.URLField(max_length=500)
    image = models.ImageField(upload_to='qrcodes/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.link