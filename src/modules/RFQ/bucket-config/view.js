import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { DataTable } from "modules/user-management";
// import { Select } from "components";
import BucketModal from './Modal';
import { deleteBucket } from '../home/home.slice';
import { _renderAIStatus } from "../../../components";

const TableData = (myModule) => [
	// {
	// 	Header: "Sr no",
	// 	accessor: "id",
	// },
	{
		Header: "Bucket Name",
		accessor: "bucket_name",
	},
	{
		Header: "Status",
		disableFilters: true,
		disableSortBy: true,
		accessor: "id", //always true
		Cell: _renderAIStatus
	},
	...((myModule?.canwrite || myModule?.candelete) ? [{
		Header: "Operations",
		accessor: "operations",
	}] : [])
];

export const View = ({ buckets, myModule }) => {
	// const deleteFlag = 'bucket-config'
	const [editModal, setEditModal] = useState();

	const Bucket = typeof buckets === "object" ? buckets : [];

	const onEdit = (id, data) => {
		setEditModal(data);
	};

	return (
		<Row>
			{/* <Col sm="12" md="12" lg="12" xl="12">
				<Select label="Bucket" placeholder="Select Bucket" required={false} />
			</Col> */}
			<Col sm="12" md="12" lg="12" xl="12">
				<DataTable
					columns={TableData(myModule) || []}
					data={Bucket || []}
					noStatus={true}
					pageState={{ pageIndex: 0, pageSize: 5 }}
					pageSizeOptions={[5, 10]}
					rowStyle
					// AI_status
					deleteFlag={!!myModule?.candelete && 'custom_delete'}
					removeAction={deleteBucket}
					EditFlag={!!myModule?.canwrite}
					EditFunc={onEdit}
				// editBucket
				// deleteFlag={deleteFlag}
				/>
			</Col>

			{!!editModal &&
				<BucketModal
					show={!!editModal}
					id={editModal.id}
					onHide={() => setEditModal(false)}
				/>
			}
		</Row>
	);
};
