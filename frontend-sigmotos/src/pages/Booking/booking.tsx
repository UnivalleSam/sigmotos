import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Datos maestros
interface Bike {
  id: number;
  brand: string;
  model: string;
  year: string;
  color: string;
  image: string;
}

interface Service {
  id: string;
  label: string;
  price: number;
  duration: number;
  icon: string;
}

const bikes: Bike[] = [
  { id: 1, brand: 'Kawasaki', model: 'NINJA 400', year: '2022', color: '#32CD32', image: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?w=400' },
  { id: 2, brand: 'Yamaha', model: 'MT-09', year: '2023', color: '#0056FF', image: 'https://images.unsplash.com/photo-1622185135505-2d795003994a?w=400' },
];

const services: Service[] = [
  { id: 'maint', label: 'Mantenimiento General', price: 260000, duration: 240, icon: '🔧' },
  { id: 'diag', label: 'Scanner OBD II', price: 120000, duration: 45, icon: '💻' },
  { id: 'oil', label: 'Cambio Aceite Sintético', price: 90000, duration: 30, icon: '🛢️' },
  { id: 'wash', label: 'Lavado Detallado', price: 40000, duration: 60, icon: '🚿' },
];

export default function Booking() {
  const [step, setStep] = useState(1);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null); // Nuevo estado para la hora
  const [showSuccess, setShowSuccess] = useState(false); // Estado para el Pop-up

  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);

  const toggleService = (service: Service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const formatDuration = (minutos: number) => {
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return h > 0 ? `${h}h ${m > 0 ? m + 'm' : ''}` : `${m} min`;
  };

  const handleConfirm = () => {
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-moto-black text-white font-technical p-4 lg:p-12 relative">
      
      {/* OVERLAY POP-UP DE ÉXITO */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-moto-gray border border-moto-orange/30 p-8 max-w-md w-full relative overflow-hidden"
            >
              {/* Decoración de fondo del modal */}
              <div className="absolute -top-10 -right-10 text-moto-orange/5 text-9xl font-display rotate-12 select-none">SIG</div>
              
              <div className="relative z-10 text-center space-y-6">
                <div className="w-16 h-16 bg-moto-orange rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(255,90,0,0.4)]">
                  <span className="text-black text-3xl font-black">✓</span>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-display font-bold uppercase tracking-tighter">Cita Confirmada</h2>
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Protocolo de recepción activado</p>
                </div>

                <div className="bg-black/40 p-4 border border-white/5 text-left space-y-3 font-mono">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-600">UNIDAD:</span>
                    <span className="text-white uppercase">{selectedBike?.brand} {selectedBike?.model}</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-gray-600">HORARIO:</span>
                    <span className="text-moto-orange">{selectedDate} Mayo, 2026 - {selectedTime}</span>
                  </div>
                  <div className="flex justify-between text-[10px] border-t border-white/5 pt-2">
                    <span className="text-gray-600">TICKET ID:</span>
                    <span className="text-white">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 italic">"Ya se ha creado tu cita. Prepara tu máquina para el máximo rendimiento."</p>

                <button 
                  onClick={() => window.location.reload()} // O redirigir al Home
                  className="w-full bg-white text-black font-black py-4 uppercase tracking-[0.2em] text-[10px] hover:bg-moto-orange transition-colors"
                >
                  Entendido, cerrar sistema
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INDICADOR DE PASOS */}
      <div className="max-w-6xl mx-auto mb-12 flex items-center gap-4">
        <div className={`h-1 flex-1 transition-colors duration-500 ${step >= 1 ? 'bg-moto-orange' : 'bg-gray-800'}`} />
        <span className={`text-[10px] font-bold ${step === 1 ? 'text-moto-orange' : 'text-gray-500'}`}>01 CONFIG</span>
        <div className={`h-1 flex-1 transition-colors duration-500 ${step >= 2 ? 'bg-moto-orange' : 'bg-gray-800'}`} />
        <span className={`text-[10px] font-bold ${step === 2 ? 'text-moto-orange' : 'text-gray-500'}`}>02 SCHEDULE</span>
        <div className="h-1 flex-1 bg-gray-800" />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-10"
          >
            {/* ... (SELECCIÓN DE UNIDAD Y SERVICIOS - SE MANTIENE IGUAL) ... */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-gray-500">Selección de Unidad</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bikes.map(bike => (
                    <button 
                      key={bike.id}
                      onClick={() => setSelectedBike(bike)}
                      className={`relative p-4 border-2 flex items-center gap-4 transition-all ${
                        selectedBike?.id === bike.id ? 'border-moto-orange bg-moto-gray' : 'border-white/5 bg-white/5'
                      }`}
                    >
                      <img src={bike.image} className="w-16 h-16 object-cover grayscale brightness-50" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-moto-orange">{bike.brand}</p>
                        <p className="font-display text-lg tracking-tighter">{bike.model}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-gray-500">Mantenimientos Requeridos</h3>
                <div className="grid gap-3">
                  {services.map(service => {
                    const isSelected = selectedServices.find(s => s.id === service.id);
                    return (
                      <button 
                        key={service.id}
                        onClick={() => toggleService(service)}
                        className={`group flex items-center justify-between p-5 border-2 transition-all ${
                          isSelected ? 'border-moto-orange bg-moto-orange/10' : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-2xl ${isSelected ? 'scale-125' : 'grayscale'}`}>{service.icon}</span>
                          <div className="text-left">
                            <p className="text-sm font-bold uppercase">{service.label}</p>
                            <p className="text-[10px] text-gray-500">TIEMPO ESTIMADO: {formatDuration(service.duration)}</p>
                          </div>
                        </div>
                        <span className={`font-display ${isSelected ? 'text-white' : 'text-gray-600'}`}>${service.price}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-moto-gray p-8 border border-white/5 sticky top-12">
                <h2 className="font-display text-xl mb-8 border-b border-white/10 pb-4">TICKET_STATUS</h2>
                <div className="space-y-4 mb-10 text-xs">
                    <div className="flex justify-between"><span>ITEMS:</span><span>{selectedServices.length}</span></div>
                    <div className="flex justify-between text-moto-orange font-bold"><span>DURACIÓN:</span><span>{formatDuration(totalDuration)}</span></div>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                      <span className="text-gray-500 uppercase">SUBTOTAL:</span>
                      <span className="text-3xl font-display">${totalPrice}</span>
                    </div>
                </div>
                <button 
                  disabled={!selectedBike || selectedServices.length === 0}
                  onClick={() => setStep(2)}
                  className="w-full bg-moto-orange text-black font-black py-4 uppercase tracking-[0.2em] text-xs hover:bg-white transition-colors disabled:opacity-20"
                >
                  Siguiente: Agendar Slot →
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto"
          >
            <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white text-[10px] mb-8 uppercase tracking-widest flex items-center gap-2">
              <span>←</span> Volver a configuración
            </button>
            
            <div className="grid lg:grid-cols-2 gap-12">
              {/* CALENDARIO */}
              <div className="space-y-8">
                <div className="bg-white/5 p-6 border border-white/10">
                  <h3 className="text-lg font-display mb-6 text-moto-orange">Mayo 2026</h3>
                  <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-gray-600 mb-4 font-bold">
                    <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(31)].map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedDate(i+1)}
                        className={`aspect-square flex items-center justify-center text-xs border transition-all ${
                          selectedDate === i+1 ? 'bg-moto-orange border-moto-orange text-black font-bold' : 'border-white/5 hover:border-white/40'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SELECCIÓN DE HORA Y CONFIRMACIÓN */}
              <div className="space-y-6">
                <div className="bg-moto-orange/10 p-4 border-l-4 border-moto-orange">
                  <p className="text-[10px] uppercase font-bold text-moto-orange tracking-widest">Slots Disponibles</p>
                  <p className="text-sm opacity-80">Selecciona el momento de ingreso:</p>
                </div>

                <div className="grid gap-3">
                  {['08:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'].map((time) => (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`group flex items-center justify-between p-4 border transition-all ${
                        selectedTime === time 
                        ? 'bg-moto-orange border-moto-orange text-black' 
                        : 'bg-white/5 border-white/5 hover:border-white/20 text-white'
                      }`}
                    >
                      <span className="font-display text-sm">{time}</span>
                      <span className={`text-[9px] font-bold uppercase ${selectedTime === time ? 'text-black/60' : 'text-moto-orange'}`}>
                        {selectedTime === time ? 'Seleccionado' : 'Disponible'}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-8 space-y-4">
                    <button 
                      disabled={!selectedDate || !selectedTime}
                      onClick={handleConfirm}
                      className="w-full bg-white text-black font-black py-5 uppercase tracking-[0.3em] text-xs hover:bg-moto-orange transition-all disabled:opacity-10 shadow-[0_10px_30px_rgba(255,255,255,0.05)] flex justify-center items-center gap-4"
                    >
                      Confirmar Cita de Servicio
                      <span className="text-xl">⇁</span>
                    </button>
                    <p className="text-[9px] text-gray-600 text-center uppercase tracking-tighter">
                      Al confirmar, bloqueas {formatDuration(totalDuration)} de capacidad técnica del taller.
                    </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}