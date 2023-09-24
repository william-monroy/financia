import { FC } from "react";
import Modal from "react-modal";

import '../public/styles/modal.css';

// Configura el elemento raíz para la accesibilidad del modal
// (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#app-root");

// Define la interfaz para las propiedades del componente
interface ModalProps {
  isOpen: boolean; // Indica si el modal está abierto o cerrado
  onRequestClose: () => void; // Función para cerrar el modal
  icono: any; // Elemento de icono que se mostrará en el modal
  formulario: any; // Elemento de formulario que se mostrará en el modal
}

// Define el componente MyModal
const MyModal: FC<ModalProps> = ({ isOpen, onRequestClose, icono, formulario }) => (
  // Utiliza el componente Modal de react-modal
  <Modal
    isOpen={isOpen} // Estado de apertura del modal
    onRequestClose={onRequestClose} // Función para cerrar el modal
    className="outline-none bg-white rounded p-4 w-1/3 h-auto mx-auto"
    overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 centrar"
  >
    {/* Contenedor para el icono */}
    <div className="mb-4 flex justify-center">
        {icono}
    </div>
    {/* Contenedor para el formulario */}
    <div className="flex items-center justify-center">
        {formulario}
    </div>
    {/* Botón para cerrar el modal */}
    <button
      onClick={onRequestClose}
      className="mt-4 px-4 py-2 text-white bg-red-500 rounded"
    >
      Cerrar
    </button>
  </Modal>
);

export default MyModal;
