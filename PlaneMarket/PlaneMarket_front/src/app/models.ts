export interface Manufacturer {
    id: number;
    name: string;
    country: string;
    description: string;
    headquarters_city: string;
    headquarters_address: string;
}

export interface Plane {
    id: number;
    name: string;
    description: string;
    price: number;
    manufacturer: Manufacturer;
    image_url?: string | null;
}

export interface Customer {
    id: number;
    user: string;
    phone_number: string;
    address: string;
}

export interface Order {
    id: number;
    customer: number;
    plane: Plane;
    order_date: string;
    status: 'pending' | 'shipped' | 'delivered';
}

export interface RegisterData {
  username: string;
  password: string;
  phone_number: string;
  address: string;
}
