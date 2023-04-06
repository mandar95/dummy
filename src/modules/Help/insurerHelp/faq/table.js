import React, { useState } from "react";
import { DataTable } from "modules/user-management";
import FaqInsModal from './editModal';
import { deleteInsFaq } from "../../help.slice";

const TableData = (myModule) => [
	{
		Header: "Sr No.",
		accessor: "srno",
	},
	{
		Header: "Question",
		accessor: "question",
	},
	{
		Header: "Answer",
		accessor: "answer",
	},
	...((myModule?.canwrite || myModule?.candelete) ? [{
		Header: "Operations",
		accessor: "operations",
	}] : []),
];

const Table = ({ data, myModule }) => {

	const [editModal, setEditModal] = useState();
	let Data = data.map((item, index) => {
		return { ...item, srno: (index + 1) }
	})
	// const deleteFlag = "ins-faq";

	const onEdit = (id, data) => {
		setEditModal(data);
	};

	return (
		<>
			<DataTable
				columns={TableData(myModule)}
				data={Data || []}
				noStatus={true}
				pageState={{ pageIndex: 0, pageSize: 5 }}
				pageSizeOptions={[5, 10]}
				rowStyle
				deleteFlag={!!myModule?.candelete && 'custom_delete'}
				removeAction={deleteInsFaq}
				EditFlag={!!myModule?.canwrite}
				EditFunc={onEdit}
			/>

			{!!editModal &&
				<FaqInsModal
					show={!!editModal}
					id={editModal.id}
					onHide={() => setEditModal(false)}
				/>
			}
		</>
	);
};

export default Table;
