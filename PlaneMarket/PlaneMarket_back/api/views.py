from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Manufacturer, Plane, Customer, Order
from .serializers import ManufacturerSerializer, PlaneSerializer, OrderSerializer, CustomerSerializer, \
    RegisterSerializer


# Логин — получение JWT токенов
class CustomTokenObtainPairView(TokenObtainPairView):
    # Этот класс можно кастомизировать, если нужно
    pass



# Логаут — аннулирование refresh токена
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # getting refresh token from data request
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()  # adding to blacklist, so token will not work
            return Response({"detail": "Logged out successfully"}, status=200)
        except Exception as e:
            return Response({"error": "Something went wrong"}, status=400)



class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Возвращаем информацию о текущем аутентифицированном пользователе
        user_data = {
            'email': request.user.email,
            'username': request.user.username,
        }
        return Response(user_data)


    
@api_view(['GET', 'POST'])
def manufacturers_list(request):

    if request.method == 'GET':
        manufacturers = Manufacturer.objects.all()
        serializer = ManufacturerSerializer(manufacturers, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = ManufacturerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'PUT', 'DELETE'])
def manufacturer_detail(request, id):
    manufacturer = Manufacturer.objects.get(id=id)

    if request.method == 'GET':
        serializer = ManufacturerSerializer(manufacturer)
        return Response(serializer.data)

    elif request.method == 'PUT':
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = ManufacturerSerializer(manufacturer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        manufacturer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['GET'])
def planes_by_manufacturer(request, id):
    planes = Plane.objects.filter(manufacturer_id=id)
    if not planes:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = PlaneSerializer(planes, many=True)
    return Response(serializer.data)



class PlaneListAPIView(APIView):

    def get(self, request):
        planes = Plane.objects.all()
        serializer = PlaneSerializer(planes, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = PlaneSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PlaneDetailAPIView(APIView):

    def get(self, request, id):
        plane = get_object_or_404(Plane, id=id)
        serializer = PlaneSerializer(plane)
        return Response(serializer.data)

    def put(self, request, id):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        plane = Plane.objects.get(id=id)
        serializer = PlaneSerializer(plane, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        plane = Plane.objects.get(id=id)
        plane.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class TopTenPlaneListAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        planes = Plane.objects.order_by('-price')[:10]
        if not planes:
            return Response({"detail": "No planes found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = PlaneSerializer(planes, many=True)
        return Response(serializer.data)



@api_view(['GET'])
def orders_by_plane(request, id):
    orders = Order.objects.filter(plane_id=id)
    if not orders:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def customer_orders(request, id):
    orders = Order.objects.filter(customer_id=id)
    if not orders:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    customer = getattr(request.user, 'customer', None)
    if not customer:
        return Response({"detail": "No linked customer profile found."}, status=status.HTTP_400_BAD_REQUEST)

    orders = Order.objects.filter(customer=customer)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order_for_authenticated_user(request):
    customer = getattr(request.user, 'customer', None)
    if not customer:
        return Response({"detail": "Authenticated user has no linked customer profile."}, status=status.HTTP_400_BAD_REQUEST)

    plane_id = request.data.get('plane')
    if not plane_id:
        return Response({"detail": "Plane ID is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        plane = Plane.objects.get(id=plane_id)
    except Plane.DoesNotExist:
        return Response({"detail": "Plane not found."}, status=status.HTTP_404_NOT_FOUND)

    order = Order.objects.create(customer=customer, plane=plane, status="pending")
    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)



class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
            except IntegrityError:
                return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)