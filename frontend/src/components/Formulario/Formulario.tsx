import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArbitrios } from '../../context/ArbitrioContext';

interface FormState {
  contribuyente: string;
  codigoPredio: string;
  tipoArbitrio: string;
  monto: number;
  pagado: boolean;
}

interface TouchedState {
  contribuyente: boolean;
  codigoPredio: boolean;
  monto: boolean;
}

export default function Formulario() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { obtener, crear, actualizar } = useArbitrios();

  const [form, setForm] = useState<FormState>({
    contribuyente: '',
    codigoPredio: '',
    tipoArbitrio: '',
    monto: 0,
    pagado: false,
  });

  const [touched, setTouched] = useState<TouchedState>({
    contribuyente: false,
    codigoPredio: false,
    monto: false,
  });

  useEffect(() => {
    if (id !== 'nuevo') {
      obtener(Number(id)).then(data => {
        setForm({
          contribuyente: data.contribuyente,
          codigoPredio: data.codigoPredio,
          tipoArbitrio: data.tipoArbitrio,
          monto: data.monto,
          pagado: data.pagado,
        });
      });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'monto') {
      setForm(prev => ({ ...prev, monto: Number(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === 'contribuyente' || name === 'codigoPredio' || name === 'monto') {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const errors = {
    contribuyente: form.contribuyente.trim().length < 2 ? 'Mínimo 2 caracteres' : '',
    codigoPredio: form.codigoPredio.trim().length < 2 ? 'Mínimo 2 caracteres' : '',
    monto: form.monto < 0 ? 'El monto mínimo es 0' : '',
  };

  const isValid = !errors.contribuyente && !errors.codigoPredio && !errors.monto;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ contribuyente: true, codigoPredio: true, monto: true });
    if (!isValid) return;

    if (id === 'nuevo') {
      await crear(form);
    } else {
      await actualizar(Number(id), form);
    }
    navigate('/lista');
  };

  return (
    <div>
      <h1>{id === 'nuevo' ? 'Nuevo Pago' : 'Editar Pago'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Contribuyente</label>
          <br />
          <input
            name="contribuyente"
            value={form.contribuyente}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.contribuyente && errors.contribuyente && (
            <span style={{ color: 'red', display: 'block' }}>{errors.contribuyente}</span>
          )}
        </div>
        <div>
          <label>Código Predio</label>
          <br />
          <input
            name="codigoPredio"
            value={form.codigoPredio}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.codigoPredio && errors.codigoPredio && (
            <span style={{ color: 'red', display: 'block' }}>{errors.codigoPredio}</span>
          )}
        </div>
        <div>
          <label>Tipo Arbitrio</label>
          <br />
          <input
            name="tipoArbitrio"
            value={form.tipoArbitrio}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Monto</label>
          <br />
          <input
            type="number"
            name="monto"
            value={form.monto}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.monto && errors.monto && (
            <span style={{ color: 'red', display: 'block' }}>{errors.monto}</span>
          )}
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="pagado"
              checked={form.pagado}
              onChange={handleChange}
            />
            {' '}Pagado
          </label>
        </div>
        <br />
        <button type="submit">Guardar</button>
        {' '}
        <button type="button" onClick={() => navigate('/lista')}>Cancelar</button>
      </form>
    </div>
  );
}
