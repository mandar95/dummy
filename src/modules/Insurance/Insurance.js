import React, { useState } from "react";
import { Tab, TabWrapper } from "components";
import CreateIns from "./create-insurance";
import BuyIns from "./BuyInsurance";
import { useParams } from "react-router";

const Insurance = ({ myModule }) => {

	const { userType } = useParams();
	const [trigger, setTrigger] = useState(userType === "customer" ? "Buy" : "create");

	// useEffect(() => {
	// 	if (userType)
	// 		userType === "customer" ? setTrigger("Buy") : setTrigger("create");
	// }, [userType]);

	return (
		<>
			{(userType !== "customer") && (
				<TabWrapper width={"max-content"}>
					<Tab isActive={trigger === "create"} onClick={() => setTrigger("create")}>
						Insurance List
					</Tab>
					<Tab isActive={trigger === "Buy"} onClick={() => setTrigger("Buy")}>
						Buy Insurance
					</Tab>
				</TabWrapper>
			)}
			{trigger === "create" && userType !== "customer" && <CreateIns myModule={myModule} userType={userType} />}
			{trigger === "Buy" && <BuyIns userType={userType} />}
		</>
	);
};

export default Insurance;
