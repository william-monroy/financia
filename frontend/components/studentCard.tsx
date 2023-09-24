import { FC, useEffect } from "react";
import "../public/styles/studentCard.css";
import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

// Define la interfaz para las propiedades del componente
interface Student {
  id: number;
  nombre_completo: string;
  matricula: string;
  desc_genero: number;
  clave_programa?: string;
  desc_ejercicio_academico: string;
  desc_sesion_alumno?: string;
  lastAttendance: string;
  attendedToday: boolean;
  onAttendanceToggle: (id: number, attendedToday: boolean) => void;
}

// Define el componente StudentCard
const StudentCard: FC<Student> = ({
  id,
  nombre_completo,
  matricula,
  clave_programa,
  desc_ejercicio_academico,
  lastAttendance,
  attendedToday,
  onAttendanceToggle,
}) => {
  // Utiliza useEffect para manejar cambios en la última asistencia
  useEffect(() => {
    console.log("La última asistencia ha cambiado a:", lastAttendance);
  }, [lastAttendance]);

  // Renderiza el componente
  return (
    <>
      <Card className="w-full p-0 md:p-5">
        <CardHeader className="justify-between flex-wrap gap-2">
          <div className="flex gap-5">
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-body-semibold md:text-heading2-semibold font-semibold leading-none text-default-600">
                {nombre_completo}
              </h4>
              <div className="flex gap-2">
                <h5 className="text-small-semibold md:text-small tracking-tight text-default-400">
                  {matricula}
                </h5>
                <h5 className="text-small-semibold md:text-small tracking-tight text-default-300">
                  {" "}
                  |{" "}
                </h5>
                <h5 className="text-small-semibold md:text-small tracking-tight text-default-400">
                  {clave_programa}
                </h5>
                <h5 className="text-small-semibold md:text-small tracking-tight text-default-300">
                  {" "}
                  |{" "}
                </h5>
                <h5 className="text-small-semibold md:text-small tracking-tight text-default-400">
                  {desc_ejercicio_academico}
                </h5>
              </div>
            </div>
          </div>
          <Button
            color={!attendedToday ? "danger" : "success"}
            radius="full"
            size="md"
            variant={!attendedToday ? "bordered" : "solid"}
            onPress={() => onAttendanceToggle(id, attendedToday)}
          >
            {attendedToday ? "Desmarcar asistencia" : "Marcar asistencia"}
          </Button>
        </CardHeader>
        <Divider />

        <CardBody className="px-3 text-medium text-default-400 p-4">
          <div className="flex gap-2">
            <p className="text-default-foreground">Asistencia de Hoy: </p>
            <p>
              {attendedToday
                ? `${new Date(lastAttendance).toLocaleDateString("es-MX", {
                    weekday: "long",
                    // year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} a las ${new Date(lastAttendance).toLocaleString("es-MX", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}`
                : "No hay asistencia"}
            </p>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default StudentCard;
