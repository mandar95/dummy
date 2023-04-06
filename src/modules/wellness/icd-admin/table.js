import React, { useState } from "react";
import { DataTable } from "../../user-management";
import { deleteIA } from "../wellness.slice";
import EditIA from './editModal';

const TableData = (operations) => [
	{
		Header: "ICD Name",
		accessor: "icd_name",
	},
	{
		Header: "ICD code",
		accessor: "icd_code",
	},
	...(operations ?
		[{
			Header: "Operations",
			accessor: "operations",
		}] : [])
];

const Table = ({ data, myModule }) => {
	// const deleteFlag = "icd-admin";
	const [editModal, setEditModal] = useState();

	const onEdit = (id, data) => {
		setEditModal(data);
	};


	return (
		<>
			<DataTable
				columns={TableData(myModule?.canwrite || myModule?.candelete) || []}
				data={data || []}
				noStatus={true}
				pageState={{ pageIndex: 0, pageSize: 5 }}
				pageSizeOptions={[5, 10]}
				rowStyle
				deleteFlag={myModule?.candelete ? 'custom_delete' : false}
				removeAction={deleteIA}
				EditFlag={!!myModule?.canwrite ? true : false}
				EditFunc={myModule?.canwrite && onEdit}
				// editIcdAdmin={myModule?.canwrite ? true : false}
				// AI_status
			/>

			{!!editModal &&
				<EditIA
					show={!!editModal}
					id={editModal.id}
					onHide={() => setEditModal(false)}
				/>
			}
		</>
	);
};

export default Table;
