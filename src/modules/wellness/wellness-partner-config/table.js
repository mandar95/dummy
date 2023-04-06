import React, { useState } from "react";
import { _renderImage, _renderAIStatus } from "../../../components";
import { ModuleControl } from "../../../config/module-control";
import { DataTable } from "../../user-management";
import { deletePartner } from "../wellness.slice";
import EditWellnessPartner from './editModal';

const TableData = (operations) => [
	{
		Header: "Wellness Partner",
		accessor: "wellness_partner",
	},
	{
		Header: "Logo",
		accessor: "logo",
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
	...(operations ?
		[{
			Header: "Operations",
			accessor: "operations",
		}] : [])
];

const Table = ({ data, myModule }) => {

	// const deleteFlag = "wellness-partner";
	const [editModal, setEditModal] = useState();

	const onEdit = (id, data) => {
		setEditModal(data);
	};

	return (
		<>
			<DataTable
				columns={TableData(myModule?.canwrite || myModule?.candelete) || []}
				data={data.map((elem) => ({
					...elem,
					to_allow_delete_actions: !ModuleControl.Wellness_Partners.some(({ wellness_partner_id }) => wellness_partner_id === elem.id)
				})) || []}
				noStatus={true}
				pageState={{ pageIndex: 0, pageSize: 5 }}
				pageSizeOptions={[5, 10]}
				rowStyle
				deleteFlag={myModule?.candelete ? 'custom_delete' : false}
				removeAction={deletePartner}
				EditFlag={!!myModule?.canwrite ? true : false}
				EditFunc={myModule?.canwrite && onEdit}
				selectiveDelete
			// editWellnessPartner={myModule?.canwrite ? true : false}
			// AI_status
			/>

			{!!editModal &&
				<EditWellnessPartner
					show={editModal}
					onHide={() => setEditModal(false)}
				/>
			}
		</>
	);
};

export default Table;
