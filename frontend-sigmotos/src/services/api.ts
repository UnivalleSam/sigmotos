const WORKSHOP_API = 'http://localhost:8083/api';
const USERS_API = 'http://localhost:8081/api';
const INVENTORY_API = 'http://localhost:8082/api';

// ── TIPOS ──────────────────────────────────────────────────────────────

export interface AppointmentDto {
    id: number;
    clientId: number;
    vehicleId: number;
    appointmentDate: string;
    reason: string;
    status: 'PENDING' | 'ACCEPTED' | 'CANCELLED';
    // Campos enriquecidos (no vienen del backend, los agregamos en el frontend)
    clientName?: string;
    vehicleLabel?: string; // "Yamaha MT-09 — AAA123"
}

export interface VehicleDto {
    id: number;
    plate: string;
    brand: string;
    model: string;
    year: number;
    ownerId: number;
}

export interface UserDto {
    id: number;
    name: string;
    email: string;
}

export interface ProductDto {
    id: number;
    nombre: string;
    descripcion?: string;
    codigo: string;
    marca: string;
    categoria: string;
    precioCompra: number;
    precioVenta: number;
    stockActual: number;
    stockMinimo: number;
    ubicacion?: string;
    activo: boolean;
    alertaStock: boolean;
    fechaCreacion?: string;
    fechaActualizacion?: string;
}

// ── HELPERS INTERNOS ────────────────────────────────────────────────────

const fetchUser = async (id: number): Promise<UserDto | null> => {
    try {
        const res = await fetch(`${USERS_API}/users/${id}`);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
};

const fetchVehicle = async (id: number): Promise<VehicleDto | null> => {
    try {
        const res = await fetch(`${WORKSHOP_API}/vehicles/${id}`);
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
};

// ── CITAS ───────────────────────────────────────────────────────────────

export const getAppointments = async (): Promise<AppointmentDto[]> => {
    try {
        const res = await fetch(`${WORKSHOP_API}/appointments`);
        if (!res.ok) throw new Error('Error al obtener citas');
        const appointments: AppointmentDto[] = await res.json();

        // Enriquecer en paralelo con nombres reales
        const enriched = await Promise.all(
            appointments.map(async (appt) => {
                const [user, vehicle] = await Promise.all([
                    fetchUser(appt.clientId),
                    fetchVehicle(appt.vehicleId),
                ]);
                return {
                    ...appt,
                    clientName: user?.name ?? `Cliente #${appt.clientId}`,
                    vehicleLabel: vehicle
                        ? `${vehicle.brand} ${vehicle.model} — ${vehicle.plate}`
                        : `Vehículo #${appt.vehicleId}`,
                };
            })
        );

        return enriched;
    } catch (error) {
        console.error('Error fetching appointments', error);
        return [];
    }
};

export const createAppointment = async (data: Partial<AppointmentDto>): Promise<AppointmentDto | null> => {
    try {
        const res = await fetch(`${WORKSHOP_API}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Error al crear la cita');
        return await res.json();
    } catch (error) {
        console.error('Error creating appointment', error);
        return null;
    }
};

export const updateAppointmentStatus = async (
    id: number,
    status: 'PENDING' | 'ACCEPTED' | 'CANCELLED'
): Promise<AppointmentDto | null> => {
    try {
        const res = await fetch(`${WORKSHOP_API}/appointments/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error('Error al actualizar estado');
        return await res.json();
    } catch (error) {
        console.error('Error updating appointment status', error);
        return null;
    }
};

// ── VEHÍCULOS ───────────────────────────────────────────────────────────

export const getVehicles = async (): Promise<VehicleDto[]> => {
    try {
        const res = await fetch(`${WORKSHOP_API}/vehicles`);
        if (!res.ok) throw new Error('Error al obtener vehículos');
        return await res.json();
    } catch (error) {
        console.error('Error fetching vehicles', error);
        return [];
    }
};

export const getVehiclesByOwner = async (ownerId: number): Promise<VehicleDto[]> => {
    try {
        const res = await fetch(`${WORKSHOP_API}/vehicles/owner/${ownerId}`);
        if (!res.ok) throw new Error('Error al obtener vehículos del propietario');
        return await res.json();
    } catch (error) {
        console.error('Error fetching vehicles by owner', error);
        return [];
    }
};

export const createVehicle = async (data: Omit<VehicleDto, 'id'>): Promise<VehicleDto | null> => {
    try {
        const res = await fetch(`${WORKSHOP_API}/vehicles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(errorBody?.message || 'Error al registrar vehículo');
        }
        return await res.json();
    } catch (error) {
        console.error('Error creating vehicle', error);
        throw error;
    }
};

// ── REPUESTOS / INVENTARIO ──────────────────────────────────────────────

export const getProducts = async (): Promise<ProductDto[]> => {
    try {
        const res = await fetch(`${INVENTORY_API}/productos`);
        if (!res.ok) throw new Error('Error al obtener repuestos');
        return await res.json();
    } catch (error) {
        console.error('Error fetching products', error);
        return [];
    }
};

export const getProductsAlerts = async (): Promise<ProductDto[]> => {
    try {
        const res = await fetch(`${INVENTORY_API}/productos/alertas`);
        if (!res.ok) throw new Error('Error al obtener alertas de stock');
        return await res.json();
    } catch (error) {
        console.error('Error fetching product alerts', error);
        return [];
    }
};

export const getProductById = async (id: number): Promise<ProductDto | null> => {
    try {
        const res = await fetch(`${INVENTORY_API}/productos/${id}`);
        if (!res.ok) throw new Error('Error al obtener repuesto');
        return await res.json();
    } catch (error) {
        console.error('Error fetching product by id', error);
        return null;
    }
};

export const createProduct = async (
    data: Omit<ProductDto, 'id' | 'activo' | 'alertaStock'>
): Promise<ProductDto> => {
    try {
        const res = await fetch(`${INVENTORY_API}/productos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(errorBody?.message || 'Error al registrar repuesto');
        }
        return await res.json();
    } catch (error) {
        console.error('Error creating product', error);
        throw error;
    }
};

export const updateProduct = async (
    id: number,
    data: Omit<ProductDto, 'id' | 'activo' | 'alertaStock' | 'fechaCreacion' | 'fechaActualizacion'>
): Promise<ProductDto> => {
    try {
        const res = await fetch(`${INVENTORY_API}/productos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const errorBody = await res.json().catch(() => null);
            throw new Error(errorBody?.message || 'Error al actualizar repuesto');
        }
        return await res.json();
    } catch (error) {
        console.error('Error updating product', error);
        throw error;
    }
};

export const deleteProduct = async (id: number): Promise<boolean> => {
    try {
        const res = await fetch(`${INVENTORY_API}/productos/${id}`, {
            method: 'DELETE',
        });
        return res.ok;
    } catch (error) {
        console.error('Error deleting product', error);
        return false;
    }
};

