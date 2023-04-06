import React, { useState } from "react";
import { _renderImage, _renderAIStatus } from "../../../components";
import { ModuleControl } from "../../../config/module-control";
import { DataTable } from "../../user-management";
import { deleteBenefit } from "../wellness.slice";
import EditBenefitConfig from './editModal';

const TableData = (operations) => [
	{
		Header: "Benefit Name",
		accessor: "name",
	},
	{
		Header: "Image",
		accessor: "image",
		Cell: _renderImage,
		disableFilters: true,
		disableSortBy: true,
	},
	{
		Header: "Redirection Button Name",
		accessor: "button_name",
	},
	{
		Header: "Content",
		accessor: "content",
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

	const [editModal, setEditModal] = useState();
	// const deleteFlag = "benefit-config";

	const onEdit = (id, data) => {
		setEditModal(data);
	};

	return (
		<>
			<DataTable
				columns={TableData(myModule?.canwrite || myModule?.candelete) || []}
				data={data.map((elem) => ({
					...elem,
					to_allow_delete_actions: !ModuleControl.Wellness_Partners.some(({ benefit_id }) => benefit_id === elem.id)
				})) || []}
				noStatus={true}
				pageState={{ pageIndex: 0, pageSize: 5 }}
				pageSizeOptions={[5, 10]}
				rowStyle
				deleteFlag={myModule?.candelete ? 'custom_delete' : false}
				removeAction={deleteBenefit}
				EditFlag={!!myModule?.canwrite ? true : false}
				EditFunc={myModule?.canwrite && onEdit}
				selectiveDelete
				// trimData={(data) => data.map((elem) => ({
				// 	...elem,
				// 	to_allow_delete_actions: !ModuleControl.Wellness_Partners.some(({ benefit_id }) => benefit_id === elem.id)
				// }))}
			// editBenefitConfig={myModule?.canwrite ? true : false}
			// AI_status
			/>

			{!!editModal &&
				<EditBenefitConfig
					show={!!editModal}
					id={editModal.id}
					onHide={() => setEditModal(false)}
				/>
			}
		</>
	);
};

export default Table;
