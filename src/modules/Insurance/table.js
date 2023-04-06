import React, { useState } from "react";
import { DataTable } from "modules/user-management";
import InsModal from './editModal';
import { deleteInsurance } from "./BuyInsurance.slice";
import { _renderImage, _renderAIStatus } from "../../components";

const TableData = (myModule) => [
	{
		Header: "Name",
		accessor: "name",
	},
	{
		Header: "Url",
		accessor: "url",
	},
	{
		Header: "Image",
		accessor: "media",
		Cell: _renderImage,
		disableFilters: true,
		disableSortBy: true,
	},
	{
		Header: "Status",
		disableFilters: true,
		disableSortBy: true,
		accessor: "status",
		Cell: _renderAIStatus
	},
	...((myModule?.canwrite || myModule?.candelete) ? [{
		Header: "Operations",
		accessor: "operations",
	}] : []),
];

const Table = ({ data, myModule }) => {
	// const deleteFlag = "insurance";

	const [editModal, setEditModal] = useState();

	const onEdit = (id, data) => {
		setEditModal(data);
	};

	return (
		<>
			<DataTable
				columns={TableData(myModule)}
				data={data || []}
				noStatus={true}
				pageState={{ pageIndex: 0, pageSize: 5 }}
				pageSizeOptions={[5, 10]}
				rowStyle
				deleteFlag={!!myModule?.candelete && 'custom_delete'}
				removeAction={deleteInsurance}
				EditFlag={!!myModule?.canwrite}
				EditFunc={onEdit}
			/>

			{!!editModal &&
				<InsModal
					show={!!editModal}
					id={editModal.id}
					onHide={() => setEditModal(false)}
				/>
			}
		</>
	);
};

export default Table;
