from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Manufacturer, Plane, Order, Customer
from django.contrib.auth.models import User

# Manufacturer Serializer
class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = ['id', 'name', 'country', 'description', 'headquarters_city', 'headquarters_address']

# Plane Serializer
class PlaneSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    description = serializers.CharField()
    price = serializers.IntegerField()
    manufacturer = ManufacturerSerializer()  # <-- Use ManufacturerSerializer here
    image_url = serializers.URLField(required=False, allow_blank=True, allow_null=True)

    def create(self, validated_data):
        return Plane.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.price = validated_data.get('price', instance.price)
        instance.manufacturer = validated_data.get('manufacturer', instance.manufacturer)
        instance.image_url = validated_data.get('image_url', instance.image_url)
        instance.save()
        return instance


# Order Serializer
class OrderSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())

    # READ: Send full plane object
    plane = PlaneSerializer(read_only=True)

    # WRITE: Accept a plane_id when creating/updating
    plane_id = serializers.PrimaryKeyRelatedField(
        queryset=Plane.objects.all(),
        source='plane',
        write_only=True
    )

    order_date = serializers.DateTimeField(read_only=True)
    status = serializers.CharField()

    def create(self, validated_data):
        return Order.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # You can implement update logic if needed
        pass

# Customer Serializer
class CustomerSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Customer
        fields = ['id', 'user', 'phone_number', 'address']

# Plane Search Serializer (for filtering by keyword)
class PlaneSearchSerializer(serializers.Serializer):
    keyword = serializers.CharField(max_length=100)



class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField()
    address = serializers.CharField()

    class Meta:
        model = Customer
        fields = ['username', 'password', 'phone_number', 'address']

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')

        if User.objects.filter(username=username).exists():
            raise ValidationError({"username": "This username is already taken."})

        user = User.objects.create_user(username=username, password=password)
        customer = Customer.objects.create(user=user, **validated_data)
        return customer