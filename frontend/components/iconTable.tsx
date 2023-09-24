import { FC } from "react";

import '../public/styles/iconTable.css';

interface IconTableProps {
    icono: any;
}

const IconTable: FC<IconTableProps> = ({ icono }) => (
    <div className="flex flex-col iconoDiv">
        {icono}
    </div>
);

export default IconTable;