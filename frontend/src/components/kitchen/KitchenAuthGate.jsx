import React, { useState } from 'react';
import { Lock, KeyRound, ArrowRight, ShieldAlert, Utensils } from 'lucide-react';

export default function KitchenAuthGate({ onAuthenticated }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const CORRECT_PIN = '1234';

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      onAuthenticated();
    } else {
      setError('PIN Incorrecto. Intenta nuevamente.');
      setPin('');
    }
  };

  const handleKeyClick = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          onAuthenticated();
        } else {
          setError('PIN Incorrecto. Intenta nuevamente (PIN por defecto: 1234)');
          setPin('');
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-sm p-6 rounded-3xl border border-slate-800 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header Icon */}
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Acceso Restringido Cocina</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">Ingresa el PIN de 4 dígitos para acceder al KDS</p>
        </div>

        {/* PIN Dots Indicator */}
        <div className="flex justify-center items-center gap-3 py-2">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                pin.length > idx
                  ? 'bg-amber-400 border-amber-400 shadow-glow-green scale-110'
                  : 'border-slate-700 bg-slate-950'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyClick(num.toString())}
              className="py-3 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-lg rounded-2xl border border-slate-800/80 active:scale-95 transition-all shadow-2xs"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="py-3 bg-slate-950/60 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-2xl border border-slate-800/80"
          >
            Borrar
          </button>
          <button
            onClick={() => handleKeyClick('0')}
            className="py-3 bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-lg rounded-2xl border border-slate-800/80 active:scale-95 transition-all"
          >
            0
          </button>
          <a
            href="/"
            className="py-3 bg-slate-950/60 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-2xl border border-slate-800/80 flex items-center justify-center"
          >
            Volver
          </a>
        </div>

        <p className="text-[10px] text-slate-500 font-medium pt-2">
          🔑 PIN de prueba predeterminado: <span className="font-bold text-amber-400">1234</span>
        </p>
      </div>
    </div>
  );
}
