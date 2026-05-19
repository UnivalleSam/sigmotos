import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Datos maestros
interface Bike {
  brand: string;
  model: string;
  year: string;
}

interface Service {
  id: string;
  label: string;
  price: number;
  duration: number;
  icon: string;
}

const MOTORCYCLE_BRANDS = [
  'Yamaha',
  'Honda',
  'Kawasaki',
  'Suzuki',
  'KTM',
  'BMW'
];

const MOTORCYCLE_TYPES = [
  'Naked',
  'Deportiva',
  'Adventure',
  'Offroad',
  'Scooter'
];

const MOTORCYCLE_MODELS: Record<string, Record<string, string[]>> = {
  Yamaha: {
    Naked: ['MT-03', 'MT-07', 'MT-09', 'MT-10'],
    Deportiva: ['YZF-R15', 'YZF-R3', 'YZF-R7', 'YZF-R1'],
    Adventure: ['Ténéré 700', 'Super Ténéré 1200', 'Tracer 900 GT'],
    Offroad: ['YZ250F', 'WR450F', 'XTZ 150', 'XTZ 250 Lander'],
    Scooter: ['NMAX 155', 'XMAX 300', 'BWS FI', 'Crypton']
  },
  Honda: {
    Naked: ['CB 300F Twister', 'CB 500F', 'CB 650R', 'CB 1000R Black Edition'],
    Deportiva: ['CBR 250R', 'CBR 500R', 'CBR 650R', 'CBR 1000RR-R Fireblade'],
    Adventure: ['CB 500X', 'NC 750X', 'Transalp XL750', 'Africa Twin CRF1100L'],
    Offroad: ['XR 150L', 'XR 190L', 'XR 300L Tornado', 'CRF 250RX', 'CRF 450X'],
    Scooter: ['PCX 160', 'Elite 125', 'Dio110', 'X-ADV 750']
  },
  Kawasaki: {
    Naked: ['Z400', 'Z650', 'Z900', 'Z H2'],
    Deportiva: ['Ninja 400', 'Ninja 650', 'Ninja ZX-6R', 'Ninja ZX-10R', 'Ninja H2R'],
    Adventure: ['Versys-X 300', 'Versys 650', 'Versys 1000 SE'],
    Offroad: ['KLX 150', 'KLX 300R', 'KX 250', 'KX 450X'],
    Scooter: ['J300', 'J125']
  },
  Suzuki: {
    Naked: ['Gixxer 150', 'Gixxer 250', 'GSX-S750', 'GSX-S1000', 'GSX-8S'],
    Deportiva: ['GSX-R150', 'GSX-R600', 'GSX-R1000R', 'Hayabusa GSX1300R'],
    Adventure: ['V-Strom 250 SX', 'V-Strom 650 XT', 'V-Strom 800DE', 'V-Strom 1050 XT'],
    Offroad: ['DR 150', 'DR 650 SE', 'DR-Z400SM', 'RM-Z250', 'RM-Z450'],
    Scooter: ['Burgman Street 125', 'Access 125', 'Address 125']
  },
  KTM: {
    Naked: ['Duke 200', 'Duke 250', 'Duke 390', 'Duke 790', 'Duke 990', 'Super Duke 1390 R'],
    Deportiva: ['RC 200', 'RC 390'],
    Adventure: ['Adventure 250', 'Adventure 390', 'Adventure 790', 'Adventure 890 R', 'Super Adventure 1290 S'],
    Offroad: ['150 XC-W', '250 EXC-F', '300 EXC TBI', '350 EXC-F', '450 EXC-F'],
    Scooter: []
  },
  BMW: {
    Naked: ['G 310 R', 'F 900 R', 'S 1000 R'],
    Deportiva: ['S 1000 RR', 'M 1000 RR'],
    Adventure: ['G 310 GS', 'F 850 GS', 'F 900 GS', 'R 1250 GS Adventure', 'R 1300 GS'],
    Offroad: ['G 450 X'],
    Scooter: ['C 400 X', 'C 400 GT', 'CE 04']
  }
};

const services: Service[] = [
  { id: 'maint', label: 'Mantenimiento General', price: 260000, duration: 240, icon: '🔧' },
  { id: 'diag', label: 'Scanner OBD II', price: 120000, duration: 45, icon: '💻' },
  { id: 'oil', label: 'Cambio Aceite Sintético', price: 90000, duration: 30, icon: '🛢️' },
  { id: 'wash', label: 'Lavado Detallado', price: 40000, duration: 60, icon: '🚿' },
];

export default function Booking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [bikeYear, setBikeYear] = useState<string>('2026');

  const selectedBike: Bike | null = selectedBrand && selectedModel ? {
    brand: selectedBrand,
    model: selectedModel,
    year: bikeYear
  } : null;

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
    <div className="min-h-screen bg-moto-black text-white font-technical p-6 lg:p-12 relative overflow-x-hidden">
      
      {/* HEADER HUD */}
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/home")}>
          <div className="font-['Barlow_Condensed'] text-xl md:text-2xl font-extrabold tracking-widest text-[#e8e8e8]">
            <span className="text-[#ff5a00]">SIG</span>MOTOS
          </div>
          <span className="bg-white/5 border border-white/10 text-[9px] px-2 py-0.5 font-mono text-gray-400 uppercase tracking-widest rounded hidden sm:inline-block">
            Workshop Booking v1.0
          </span>
        </div>
        <button 
          onClick={() => navigate("/home")}
          className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black bg-[#ff5a00] hover:bg-[#ff7a2a] px-5 py-2.5 transition-all shadow-[0_5px_15px_rgba(255,90,0,0.15)] cursor-pointer"
          style={{ clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)" }}
        >
          Volver a Inicio
        </button>
      </header>

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
                  onClick={() => navigate("/home")} // O redirigir al Home
                  className="w-full bg-white text-black font-black py-4 uppercase tracking-[0.2em] text-[10px] hover:bg-moto-orange hover:text-white transition-colors cursor-pointer"
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
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10"
          >
            <div className="lg:col-span-2 space-y-12">
              <section className="bg-moto-gray/40 border border-white/5 p-6 md:p-8 space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-['Barlow_Condensed'] text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-moto-orange" />
                    Selección de Unidad
                  </h3>
                  <span className="bg-moto-orange/10 border border-moto-orange/30 text-moto-orange text-[8px] font-mono px-2 py-0.5 uppercase tracking-widest rounded">
                    Filtro Dinámico
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Paso 1: Seleccionar Marca */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      1. Selecciona la Marca
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {MOTORCYCLE_BRANDS.map(brand => (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => {
                            setSelectedBrand(brand);
                            setSelectedModel(''); // reset model when brand changes
                          }}
                          className={`py-3 px-2 text-center text-xs font-bold uppercase border transition-all cursor-pointer ${
                            selectedBrand === brand
                              ? 'border-moto-orange bg-moto-orange/15 text-moto-orange font-extrabold shadow-[inset_0_0_10px_rgba(255,90,0,0.1)]'
                              : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Paso 2: Seleccionar Tipo */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                      2. Selecciona el Tipo de Moto
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {MOTORCYCLE_TYPES.map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setSelectedType(type);
                            setSelectedModel(''); // reset model when type changes
                          }}
                          className={`py-3 px-2 text-center text-xs font-bold uppercase border transition-all cursor-pointer ${
                            selectedType === type
                              ? 'border-moto-orange bg-moto-orange/15 text-moto-orange font-extrabold shadow-[inset_0_0_10px_rgba(255,90,0,0.1)]'
                              : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Paso 3: Seleccionar Modelo (Dinámico) */}
                  {selectedBrand && selectedType && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-4 border-t border-white/5"
                    >
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                        3. Selecciona el Modelo
                      </label>

                      {(() => {
                        const availableModels = MOTORCYCLE_MODELS[selectedBrand]?.[selectedType] || [];
                        if (availableModels.length > 0) {
                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {availableModels.map(model => (
                                <button
                                  key={model}
                                  type="button"
                                  onClick={() => setSelectedModel(model)}
                                  className={`p-4 text-left border transition-all cursor-pointer ${
                                    selectedModel === model
                                      ? 'border-moto-orange bg-moto-orange/15 text-white font-bold shadow-[0_0_15px_rgba(255,90,0,0.1)]'
                                      : 'border-white/10 bg-white/5 text-gray-300 hover:border-white/20'
                                  }`}
                                >
                                  <p className="text-[10px] text-moto-orange uppercase font-bold tracking-widest">{selectedBrand} • {selectedType}</p>
                                  <p className="text-sm font-bold uppercase mt-1">{model}</p>
                                </button>
                              ))}
                            </div>
                          );
                        } else {
                          return (
                            <div className="space-y-3">
                              <p className="text-[11px] text-gray-500 italic">
                                No se encontraron modelos predeterminados para {selectedBrand} ({selectedType}). Ingresa el modelo manualmente:
                              </p>
                              <div className="relative max-w-md">
                                <input
                                  type="text"
                                  placeholder="Ej: Custom 250 / Modelo Personalizado"
                                  value={selectedModel}
                                  onChange={(e) => setSelectedModel(e.target.value)}
                                  className="w-full bg-[#080808] border border-white/10 hover:border-white/20 focus:border-moto-orange/50 focus:outline-none px-4 py-3 text-xs uppercase tracking-widest text-[#e8e8e8] placeholder-gray-700 transition-all rounded-none"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 font-mono text-xs animate-pulse">
                                  █
                                </span>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </motion.div>
                  )}

                  {/* Visualización de Selección Actual */}
                  {selectedBrand && selectedModel && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-moto-orange/10 border border-moto-orange/30 p-4 flex items-center justify-between mt-4"
                    >
                      <div>
                        <p className="text-[9px] font-mono text-moto-orange uppercase tracking-widest">MOTOCICLETA CONFIGURADA</p>
                        <h4 className="font-['Barlow_Condensed'] text-lg font-bold text-white uppercase mt-0.5">
                          {selectedBrand} {selectedModel}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest mt-0.5">
                          TIPO: {selectedType || 'N/A'} • AÑO: {bikeYear}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end gap-1">
                          <label className="text-[8px] text-gray-500 uppercase tracking-widest font-mono">Año:</label>
                          <select
                            value={bikeYear}
                            onChange={(e) => setBikeYear(e.target.value)}
                            className="bg-[#080808] border border-white/10 focus:border-moto-orange/50 focus:outline-none px-2 py-1 text-[10px] font-mono text-white transition-all rounded-none cursor-pointer"
                          >
                            {['2027', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'].map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
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
                        className={`group flex items-center justify-between p-6 md:p-7 border-2 transition-all hover:scale-[1.005] cursor-pointer ${
                          isSelected ? 'border-moto-orange bg-moto-orange/10 shadow-[0_0_20px_rgba(255,90,0,0.08)]' : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`text-2xl ${isSelected ? 'scale-125' : 'grayscale'}`}>{service.icon}</span>
                          <div className="text-left">
                            <p className="text-sm font-bold uppercase text-white">{service.label}</p>
                            <p className="text-[10px] text-gray-500">TIEMPO ESTIMADO: {formatDuration(service.duration)}</p>
                          </div>
                        </div>
                        <span className={`font-display text-base ${isSelected ? 'text-white font-bold' : 'text-gray-600'}`}>
                          ${service.price.toLocaleString("es-CO")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-moto-gray p-10 border border-white/5 sticky top-12 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <h2 className="font-display text-2xl mb-8 border-b border-white/10 pb-4 tracking-tighter text-white">TICKET_STATUS</h2>
                <div className="space-y-6 mb-12 text-sm">
                    <div className="flex justify-between"><span>ITEMS:</span><span className="font-bold text-white">{selectedServices.length}</span></div>
                    <div className="flex justify-between text-moto-orange font-bold"><span>DURACIÓN:</span><span>{formatDuration(totalDuration)}</span></div>
                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                      <span className="text-gray-500 text-xs uppercase font-bold">SUBTOTAL:</span>
                      <span className="text-4xl font-display text-white">${totalPrice.toLocaleString("es-CO")}</span>
                    </div>
                </div>
                <button 
                  disabled={!selectedBike || selectedServices.length === 0}
                  onClick={() => setStep(2)}
                  className="w-full bg-moto-orange text-black font-black py-5 uppercase tracking-[0.25em] text-xs hover:bg-white transition-all disabled:opacity-20 hover:scale-[1.02] cursor-pointer"
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
            <button onClick={() => setStep(1)} className="text-gray-400 hover:text-[#ff5a00] text-xs mb-8 uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer">
              <span>←</span> Volver a configuración
            </button>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* CALENDARIO */}
              <div className="space-y-8">
                <div className="bg-white/5 p-6 md:p-8 border border-white/10">
                  <h3 className="text-xl font-display mb-6 text-moto-orange">Mayo 2026</h3>
                  <div className="grid grid-cols-7 gap-2 text-center text-[10px] text-gray-600 mb-4 font-bold">
                    <span>L</span><span>M</span><span>M</span><span>J</span><span>V</span><span>S</span><span>D</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(31)].map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedDate(i+1)}
                        className={`aspect-square flex items-center justify-center text-xs md:text-sm border transition-all hover:scale-105 cursor-pointer ${
                          selectedDate === i+1 ? 'bg-moto-orange border-moto-orange text-black font-bold shadow-[0_0_15px_rgba(255,90,0,0.3)]' : 'border-white/5 hover:border-white/40'
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
                <div className="bg-moto-orange/10 p-5 border-l-4 border-moto-orange">
                  <p className="text-[10px] uppercase font-bold text-moto-orange tracking-widest">Slots Disponibles</p>
                  <p className="text-sm opacity-80 mt-1">Selecciona el momento de ingreso:</p>
                </div>

                <div className="grid gap-3">
                  {['08:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'].map((time) => (
                    <button 
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`group flex items-center justify-between p-5 md:p-6 border transition-all hover:scale-[1.01] cursor-pointer ${
                        selectedTime === time 
                        ? 'bg-moto-orange border-moto-orange text-black shadow-[0_0_15px_rgba(255,90,0,0.2)]' 
                        : 'bg-white/5 border-white/5 hover:border-white/20 text-white'
                      }`}
                    >
                      <span className="font-display text-sm md:text-base">{time}</span>
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
                      className="w-full bg-white text-black font-black py-6 uppercase tracking-[0.3em] text-xs md:text-sm hover:bg-moto-orange hover:text-white transition-all disabled:opacity-10 shadow-[0_10px_30px_rgba(255,255,255,0.05)] flex justify-center items-center gap-4 hover:scale-[1.02] cursor-pointer"
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