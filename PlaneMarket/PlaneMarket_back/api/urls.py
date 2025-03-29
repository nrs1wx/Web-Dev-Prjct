from rest_framework_simplejwt.views import TokenRefreshView
from django.urls import path
from .views import (
    manufacturers_list,
    manufacturer_detail,
    planes_by_manufacturer,
    PlaneListAPIView,
    PlaneDetailAPIView,
    TopTenPlaneListAPIView,
    orders_by_plane,
    customer_orders,
    create_order_for_authenticated_user,
    CustomTokenObtainPairView,  # Добавляем сюда логин
    LogoutView,  # Добавляем сюда логаут
    CurrentUserView, my_orders, RegisterView  # Добавляем для получения информации о текущем пользователе
)

urlpatterns = [
    path('manufacturers/', manufacturers_list),
    path('manufacturers/<int:id>/', manufacturer_detail),
    path('manufacturers/<int:id>/planes/', planes_by_manufacturer),

    path('planes/', PlaneListAPIView.as_view()),
    path('planes/<int:id>/', PlaneDetailAPIView.as_view()),
    path('planes/top_ten/', TopTenPlaneListAPIView.as_view()),
    path('planes/<int:id>/orders/', orders_by_plane),

    path('customers/<int:id>/orders', customer_orders),
    path('orders/create/', create_order_for_authenticated_user),
    path('orders/my/', my_orders),

    # Логин: получение пары токенов JWT
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Обновление токенов JWT
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Логаут: аннулирование refresh токена
    path('logout/', LogoutView.as_view(), name='logout'),

    path('register/', RegisterView.as_view(), name='register'),
    
    # Информация о текущем пользователе
    path('current_user/', CurrentUserView.as_view(), name='current_user'),
]

