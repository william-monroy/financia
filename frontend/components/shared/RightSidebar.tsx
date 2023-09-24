"use client";
import { Card, CardBody } from "@nextui-org/react";
import { Fondos } from "../../data/Fondos";

function RightSidebar() {
  return (
    <section className="custom-scrollbar rightsidebar max-w-[300px]">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Fondos de Inversión de mayor rendimiento
        </h3>
      </div>
      {Fondos.map((fondo, index) => {
        return (
          <Card>
            <CardBody key={index}>
              <p className="text-body-bold text-light-1">{fondo.nombre}</p>
              <p className="text-body-bold text-green-500">{fondo.valor}</p>
            </CardBody>
          </Card>
        );
      })}
      {/* <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
      </div> */}
    </section>
  );
}

export default RightSidebar;
