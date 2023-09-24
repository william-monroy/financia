import { FC } from "react";
import "../public/styles/table.css"; // Importa tu archivo CSS aquí

// Define la interfaz para las propiedades del componente
type TableProps = {
  encabezados: string[]; // Arreglo de encabezados de la tabla
  datos: any[]; // Arreglo de datos que se mostrarán en la tabla
  renderRow: (item: any, index: number) => JSX.Element; // Función para renderizar cada fila
};

// Define el componente Table
const Table: FC<TableProps> = ({ encabezados, datos, renderRow }) => {
  // Renderiza el componente
  return (
    // Contenedor para manejar el desbordamiento de la tabla
    <table className="min-w-0 divide-y divide-gray-200 text-xs custom-table mt-5">
      <thead className="bg-gray-50">
        <tr>
          {/* Itera sobre el array de encabezados para crear cada columna del encabezado */}
          {encabezados.map((encabezado, index) => (
            <th key={index} scope="col" className="custom-th text-gray-900">
              {encabezado} {/* Texto del encabezado */}
            </th>
          ))}
        </tr>
      </thead>
      {/* Define el cuerpo de la tabla */}

      {!datos && (
        <tbody className="bg-white text-block divide-y divide-gray-200">
          <tr>
            <td colSpan={encabezados.length} className="text-center">
              No hay datos
            </td>
          </tr>
        </tbody>
      )}
      {datos && (
        <tbody className="bg-white text-black divide-y divide-gray-200">
          {/* Itera sobre el array de datos y utiliza la función renderRow para crear cada fila */}
          {datos.map(renderRow)}
        </tbody>
      )}
    </table>
  );
};

export default Table;
