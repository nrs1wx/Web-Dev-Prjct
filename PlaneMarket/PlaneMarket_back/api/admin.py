from django.contrib import admin

from .models import Plane, Manufacturer, Order, Customer

# Register your models here.
admin.site.register(Plane)
admin.site.register(Manufacturer)
admin.site.register(Order)
admin.site.register(Customer)