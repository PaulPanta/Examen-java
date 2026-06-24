import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useArbitrios } from '../../context/ArbitrioContext';

export default function Lista() {
  const { arbitrios, listar, eliminar } = useArbitrios();
  const navigate = useNavigate();

  useEffect(() => {
    listar();
  }, []);

  return (
    <div>
      <div>
        <h1>Pagos de Arbitrios Municipales</h1>
        <button onClick={() => navigate('/formulario/nuevo')}>Nuevo Pago</button>
      </div>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Contribuyente</th>
            <th>Código Predio</th>
            <th>Tipo Arbitrio</th>
            <th>Monto</th>
            <th>Pagado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {arbitrios.map(arbitrio => (
            <tr key={arbitrio.id}>
              <td>{arbitrio.id}</td>
              <td>{arbitrio.contribuyente}</td>
              <td>{arbitrio.codigoPredio}</td>
              <td>{arbitrio.tipoArbitrio}</td>
              <td>{arbitrio.monto}</td>
              <td>{arbitrio.pagado ? 'Sí' : 'No'}</td>
              <td>
                <button onClick={() => navigate(`/formulario/${arbitrio.id}`)}>Editar</button>
                <button onClick={() => eliminar(arbitrio.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
