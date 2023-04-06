
//data process
export const dataProcess = (item) => {
	let data, type;
	if (item?.sum_insured && item?.premium) {
		const sumIns = item?.sum_insured.split(",");
		const prem = item?.premium.split(",");
		type = "table";
		data = sumIns.map((_, index) => ({
			sumInsured: sumIns[index],
			premium: prem[index],
		}));
	} else if (item?.no_of_days) {
		const noOfDays = item?.no_of_days.split(",");
		if (noOfDays.length === 2) {
			data = { pre: noOfDays[0], post: noOfDays[1] };
			type = "pre_post";
		} else {
			data = {
				deluxe: noOfDays[0],
				shared_ac: noOfDays[1],
				shared_twin: noOfDays[2],
				single_ac: noOfDays[3],
			};
			type = "room_type";
		}
	} else {
		data = Number(item?.is_waived_off) ? true : false;
		type = "waiver";
	}
	return { ...item, data, type };
};

/*------ui elements------*/
// export const UICheckBox = (data, inputRef, setValue, watch) => {
// 	let details;
// 	switch (data?.type) {
// 		case "waiver":
// 			details = data;
// 			break;
// 		case "table":
// 			details = data;
// 			break;
// 		case "room_type":
// 			break;
// 		case "pre_post":
// 			break;
// 		default:
// 			break;
// 	}
// 	return (
		
// 	);
// };
/*--x---ui elements---x--*/


