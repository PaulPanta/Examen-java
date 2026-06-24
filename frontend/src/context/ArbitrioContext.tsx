import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { Arbitrio } from '../types/Arbitrio';

const API_URL = 'http://localhost:3000/api/arbitrios';

interface ArbitrioContextType {
  arbitrios: Arbitrio[];
  listar: () => Promise<void>;
  obtener: (id: number) => Promise<Arbitrio>;
  crear: (arbitrio: Omit<Arbitrio, 'id'>) => Promise<void>;
  actualizar: (id: number, arbitrio: Omit<Arbitrio, 'id'>) => Promise<void>;
  eliminar: (id: number) => Promise<void>;
}

const ArbitrioContext = createContext<ArbitrioContextType | undefined>(undefined);

export function ArbitrioProvider({ children }: { children: ReactNode }) {
  const [arbitrios, setArbitrios] = useState<Arbitrio[]>([]);

  const listar = async () => {
    const response = await axios.get<Arbitrio[]>(API_URL);
    setArbitrios(response.data);
  };

  const obtener = async (id: number): Promise<Arbitrio> => {
    const response = await axios.get<Arbitrio>(`${API_URL}/${id}`);
    return response.data;
  };

  const crear = async (arbitrio: Omit<Arbitrio, 'id'>) => {
    await axios.post(API_URL, arbitrio);
    await listar();
  };

  const actualizar = async (id: number, arbitrio: Omit<Arbitrio, 'id'>) => {
    await axios.put(`${API_URL}/${id}`, arbitrio);
    await listar();
  };

  const eliminar = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
    await listar();
  };

  return (
    <ArbitrioContext.Provider value={{ arbitrios, listar, obtener, crear, actualizar, eliminar }}>
      {children}
    </ArbitrioContext.Provider>
  );
}

export function useArbitrios(): ArbitrioContextType {
  const context = useContext(ArbitrioContext);
  if (!context) throw new Error('useArbitrios debe usarse dentro de ArbitrioProvider');
  return context;
}
