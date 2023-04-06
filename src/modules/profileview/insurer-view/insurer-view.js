import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { CardBlue } from "components";
import Edit from "./insurer-edit";
import { useSelector, useDispatch } from "react-redux";
import { Insurer, clr } from "../profileview.slice";
import { Lister } from "./helper";
import _ from "lodash";
import swal from "sweetalert";

const InsurerView = ({ currentUser }) => {
	const dispatch = useDispatch();
	const { insurer, error, success } = useSelector((state) => state.profile);

	const [edit, setEdit] = useState(false);

	useEffect(() => {
		if (currentUser.ic_id) {
			dispatch(Insurer({ ic_id: currentUser.ic_id }));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser.ic_id]);

	//onError
	useEffect(() => {
		if (error) {
			swal(error, "", "warning");
		}

		return () => {
			dispatch(clr());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error]);

	//onSuccess
	useEffect(() => {
		if (success) {
			dispatch(Insurer({ ic_id: currentUser.ic_id }));
		}

		return () => {
			dispatch(clr());
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [success]);

	return (
		<Row className="w-100">
			<Col sm="12" md="12" lg="12" xl="12">
				<CardBlue
					title={
						<div className="d-flex justify-content-between">
							<span>Profile</span>
							{currentUser?.ic_user_type_id === 1 && (
								<div>
									<Button
										size="sm"
										onClick={() => {
											!edit ? setEdit(true) : setEdit(false);
										}}
									>
										<strong>{!edit ? "Edit" : "Cancel"}</strong>
									</Button>
								</div>
							)}
						</div>
					}
				>
					{edit ? (
						<Edit onSet={() => setEdit(false)} />
					) : (
						Lister(!_.isEmpty(insurer) ? insurer[0] : {})
					)}
				</CardBlue>
			</Col>
		</Row>
	);
};

export default InsurerView;
