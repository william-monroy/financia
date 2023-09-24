"use client";

import { Perfil } from "@/components/charts/perfil";
import { Riesgo } from "@/components/charts/riesgo";
import { Card, CardBody } from "@nextui-org/react";
import { PiUsersThree } from "react-icons/pi";
import { AiOutlineLineChart } from "react-icons/ai";
import { BsBarChart } from "react-icons/bs";

const fetcher = (url: string) => fetch(url).then((res) => res.json()); // Función para hacer la petición fetch

const CardDashboard = ({
  value,
  subtitle,
  icon,
}: {
  value: string;
  subtitle: string;
  icon?: React.ReactNode;
}) => {
  return (
    <Card isHoverable className="cursor-pointer p-4">
      <CardBody className="flex gap-4 flex-row">
        <div className="icon">{icon ? icon : <PiUsersThree size="48" />}</div>
        <div className="card__content">
          <h3 className="text-heading2-bold">{value}</h3>
          <p className="text-heading1">{subtitle}</p>
        </div>
      </CardBody>
    </Card>
  );
};

export default function Home() {
  // const { data, error, mutate } = useSWR(
  //   "/api/getAlumnosWithLastAttendance",
  //   fetcher
  // );

  return (
    <>
      <div className="flex justify-center flex-wrap gap-4 mt-0 md:mt-5 w-full">
        <CardDashboard
          value={"10,234"}
          subtitle="Clientes"
          icon={<PiUsersThree size="48" />}
        />
        <CardDashboard
          value={"-12%"}
          subtitle="Volitibilidad"
          icon={<AiOutlineLineChart size="48" />}
        />
        <CardDashboard
          value={"10%"}
          subtitle="Rendimientos"
          icon={<BsBarChart size="48" />}
        />
      </div>
      <div className="flex justify-center flex-wrap gap-4 mt-0 md:mt-5 w-full">
        <Card isHoverable className="p-4">
          <CardBody className="flex gap-4 flex-row">
            <Perfil />
          </CardBody>
        </Card>
        <Card isHoverable className="p-4">
          <CardBody className="flex gap-4 flex-row">
            <Riesgo />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
