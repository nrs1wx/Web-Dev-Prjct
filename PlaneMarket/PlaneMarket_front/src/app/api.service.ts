import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Manufacturer, Plane, Customer, Order, RegisterData} from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Аутентификация
  login(data: { username: string; password: string; }): Observable<{ access: string; refresh: string; }> {
    return this.http.post<{ access: string; refresh: string; }>(`${this.baseUrl}/api/token/`, data);
  }

  refreshToken(refresh: string): Observable<{ access: string; }> {
    return this.http.post<{ access: string; }>(`${this.baseUrl}/api/token/refresh/`, { refresh });
  }

  logout(refresh: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/logout/`, { refresh_token: refresh });
  }

  getCurrentUser(): Observable<{ email: string; username: string; }> {
    return this.http.get<{ email: string; username: string; }>(`${this.baseUrl}/api/current_user/`);
  }

  // Производители
  getManufacturers(): Observable<Manufacturer[]> {
    return this.http.get<Manufacturer[]>(`${this.baseUrl}/api/manufacturers/`);
  }

  getManufacturer(id: number): Observable<Manufacturer> {
    return this.http.get<Manufacturer>(`${this.baseUrl}/api/manufacturers/${id}/`);
  }

  createManufacturer(data: Partial<Manufacturer>): Observable<Manufacturer> {
    return this.http.post<Manufacturer>(`${this.baseUrl}/api/manufacturers/`, data);
  }

  updateManufacturer(id: number, data: Partial<Manufacturer>): Observable<Manufacturer> {
    return this.http.put<Manufacturer>(`${this.baseUrl}/api/manufacturers/${id}/`, data);
  }

  deleteManufacturer(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/manufacturers/${id}/`);
  }

  getPlanesByManufacturer(id: number): Observable<Plane[]> {
    return this.http.get<Plane[]>(`${this.baseUrl}/api/manufacturers/${id}/planes/`);
  }

  // Самолеты
  getPlanes(): Observable<Plane[]> {
    return this.http.get<Plane[]>(`${this.baseUrl}/api/planes/`);
  }

  getPlane(id: number): Observable<Plane> {
    return this.http.get<Plane>(`${this.baseUrl}/api/planes/${id}/`);
  }

  createPlane(data: Partial<Plane>): Observable<Plane> {
    return this.http.post<Plane>(`${this.baseUrl}/api/planes/`, data);
  }

  updatePlane(id: number, data: Partial<Plane>): Observable<Plane> {
    return this.http.put<Plane>(`${this.baseUrl}/api/planes/${id}/`, data);
  }

  deletePlane(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/planes/${id}/`);
  }

  getTopTenPlanes(): Observable<Plane[]> {
    return this.http.get<Plane[]>(`${this.baseUrl}/api/planes/top_ten/`);
  }

  // Заказы
  getOrdersByPlane(planeId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/api/planes/${planeId}/orders/`);
  }

  getCustomerOrders(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/api/customers/${customerId}/orders`);
  }

  createOrderForUser(planeId: number): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/api/orders/create/`, { plane: planeId });
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/api/orders/my/`);
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/register/`, data);
  }
}
