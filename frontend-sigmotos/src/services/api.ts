const WORKSHOP_API = 'http://localhost:8083/api';
const USERS_API = 'http://localhost:8081/api';

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
