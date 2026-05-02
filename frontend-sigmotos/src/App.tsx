import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SigmotosLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-moto-black text-white flex font-technical overflow-hidden">
      
      {/* Columna Izquierda: Identidad Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-moto-gray items-center justify-center border-r border-moto-orange/20">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 p-12"
        >
          <h1 className="text-7xl font-display font-bold tracking-tighter leading-none">
            SIG<span className="text-moto-orange">MOTOS</span>
          </h1>
          <p className="mt-4 text-gray-400 max-w-xs uppercase tracking-widest text-xs border-l-2 border-moto-orange pl-4">
            Gestión de Inventario Inteligente para Sistemas de Alto Rendimiento.
          </p>
        </motion.div>
        
        {/* Elemento Decorativo: "Chasis" */}
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-moto-orange/5 blur-[120px] rounded-full" />
      </div>

      {/* Columna Derecha: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-bold uppercase tracking-tight">Acceso al Sistema</h2>
            <div className="h-1 w-12 bg-moto-orange" />
          </div>

          <form className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 font-bold">Email de Operador</label>
              <input 
                type="email" 
                className="w-full bg-transparent border-b-2 border-moto-gray focus:border-moto-orange outline-none py-3 transition-colors duration-300"
                placeholder="joseph@sigmotos.dev"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase text-gray-500 font-bold">Contraseña</label>
              <input 
                type="password" 
                className="w-full bg-transparent border-b-2 border-moto-gray focus:border-moto-orange outline-none py-3 transition-colors duration-300"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="accent-moto-orange" />
                <span>Recordar sesión</span>
              </label>
              <a href="#" className="hover:text-moto-orange transition-colors">¿Olvidaste la clave?</a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-moto-orange text-black font-bold py-4 uppercase tracking-tighter hover:bg-white transition-colors flex justify-between px-6 items-center"
            >
              Iniciar Motores
              <span className="text-xl">→</span>
            </motion.button>
          </form>

          <footer className="pt-12 text-[10px] text-gray-600 uppercase flex justify-between">
            <span>Sigmotos v1.0.0</span>
            <span>&copy; 2026</span>
          </footer>
        </motion.div>
      </div>
    </div>
  );
};
export default SigmotosLogin;