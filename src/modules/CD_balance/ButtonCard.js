import React from "react";
import { useSelector } from "react-redux";
import ModalComponent from "./Modal.js";
import { selectCdStatement } from "./CD.Slice.js";
import { BoxContainer, ButtonContent1, ButtonContent } from "./style";
import swal from "sweetalert";

const ButtonCard = (props) => {
	//dispatch,states,selectors
	const cdResponse = useSelector(selectCdStatement);

	const [modalShow, setModalShow] = React.useState(false); //State for Modal visibility Condition

	return (
		<div>
			<BoxContainer>
				{/* <button
					style={{ outline: "none", border: "none", background: "transparent" }}
					onClick={() => setModalShow(true)}
				> */}
				<ButtonContent1 onClick={() => setModalShow(true)}>
					<i className="ti-eye" style={{ cursor: "pointer" }}></i>
					<label style={styles.labelText}>Policy Balance Details</label>
				</ButtonContent1>
				{/* </button> */}
				<ButtonContent
					onClick={() => {
						cdResponse?.data?.data?.download_report
							? window.open(cdResponse?.data?.data?.download_report)
							: swal("Report not available", "", "warning");
					}}
					style={styles.buttonContent}
				>
					<i className="ti-credit-card" style={{ cursor: "pointer" }}></i>
					<label style={styles.labelText}>CD Balance</label>
				</ButtonContent>
			</BoxContainer>
			<ModalComponent
				TotalMembers={props.TotalMembers}
				policyNoId={props.policyNoId}
				style={{ transition: " opacity .25s linear " }}
				show={modalShow}
				onHide={() => setModalShow(false)}
			/>
		</div>
	);
};

const styles = {
	labelText: {
		paddingTop: "10px",
		cursor: "pointer",
	},
};

export default ButtonCard;
