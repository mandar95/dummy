import { createSlice } from "@reduxjs/toolkit";
import service from "./serviceApi";
import { actionStructre, downloadFile, serializeError } from "../../utils";
import swal from "sweetalert";

export const wellness = createSlice({
	name: "welness",
	initialState: {
		error: null,
		success: null,
		loading: null,
		benefits: [],
		editbenefit: {},
		benefitUpdate: null,
		partners: [],
		editpartner: {},
		partnerUpdate: null,
		BWPMs: [],
		editbwpm: {},
		bwpmUpdate: null,
		export_bwpm: null,
		EMs: [],
		edit_em: {},
		emUpdate: null,
		export_em: null,
		WFs: [],
		edit_wf: {},
		wfUpdate: null,
		export_wf: null,
		CMSs: [],
		edit_cms: {},
		cmsUpdate: null,
		brokers: [],
		employers: [],
		ICDData: [],
		BrokerICDData: [],
		editICDData: {},
		icdUpdate: null,
		EMPBenefit: [],
		exportICDResponse: null,
		ICDContent: null,
		StaticContent: [],
		edit_staticContent: {},
		staticContentUpdate: null,
		IAs: [],
		edit_ia: {},
		iaUpdate: null,
		isLoadMoreLoading: false,
		isLoadMore: false,
		memberSyncData: null,
		memberSyncDataCNH: null,
		lastPage: 1,
		firstPage: 1,
		visitURL: "",
	},

	//reducers
	reducers: {
		loadMoreLoading: (state) => {
			state.isLoadMoreLoading = true;
		},
		loadMoreQutoes: (state, { payload }) => {
			state.isLoadMore = payload;
			state.isLoadMoreLoading = false;
		},
		loading: (state, { payload = true }) => {
			state.loading = payload;
			state.error = null;
			state.success = null;
		},
		success: (state, { payload }) => {
			state.loading = null;
			state.error = null;
			state.success = payload;
		},
		error: (state, { payload }) => {
			state.loading = false;
			state.error = serializeError(payload);
			state.success = null;
		},
		clear: (state, { payload }) => {
			state.error = null;
			state.success = null;
			switch (payload) {
				case "wellness-partner":
					state.partnerUpdate = null;
					break;
				case "benefit-config":
					state.benefitUpdate = null;
					break;
				case "benefit-wellness-partner-mapping":
					state.bwpmUpdate = null;
					break;
				case "benefit-wellness-partner-mapping-export":
					state.export_bwpm = null;
					break;
				case "benefit-employer-mapping":
					state.emUpdate = null;
					break;
				case "benefit-employer-mapping-export":
					state.export_em = null;
					break;
				case "wellness-flex-config":
					state.wfUpdate = null;
					break;
				case "wellness-flex-config-export":
					state.export_wf = null;
					break;
				case "wellness-benefit-cms":
					state.cmsUpdate = null;
					break;
				case "icd-code-master":
					state.icdUpdate = null;
					break;
				case "icd-admin":
					state.iaUpdate = null;
					break;
				case "export-response":
					state.exportICDResponse = null;
					break;
				case "wellness-benefit-static-content":
					state.staticContentUpdate = null;
					break;
				case "visit":
					state.visitURL = '';
					break;
				default:
					break;
			}
		},
		broker: (state, { payload }) => {
			state.brokers = payload;
		},
		employer: (state, { payload }) => {
			state.employers = payload.isNew ? payload.data : [...state.employers, ...payload.data];
			state.loading = false;
		},
		getBenefits: (state, { payload }) => {
			//let _benefits = payload.filter((item) => item.status === 1)
			state.benefits = payload;
		},
		editBenefits: (state, { payload }) => {
			state.editbenefit = payload;
		},
		UpdateBenefit: (state, { payload }) => {
			state.benefitUpdate = payload;
		},
		getPartners: (state, { payload }) => {
			//let _partners = payload.filter((item) => item.status === 1)
			state.partners = payload;
		},
		editPartners: (state, { payload }) => {
			state.editpartner = payload;
		},
		PartnerUpdate: (state, { payload }) => {
			state.partnerUpdate = payload;
		},
		getBWPMs: (state, { payload }) => {
			state.BWPMs = payload;
		},
		editBWPMs: (state, { payload }) => {
			state.editbwpm = payload;
		},
		BWPMUpdate: (state, { payload }) => {
			state.bwpmUpdate = payload;
		},
		BWPMExport: (state, { payload }) => {
			state.export_bwpm = payload?.url;
		},
		getEMs: (state, { payload }) => {
			state.EMs = payload;
		},
		editEMs: (state, { payload }) => {
			state.edit_em = payload;
		},
		EMUpdate: (state, { payload }) => {
			state.emUpdate = payload;
		},
		EMExport: (state, { payload }) => {
			state.export_em = payload?.url;
		},
		getICD: (state, { payload }) => {
			state.ICDData = payload;
		},
		getBrokerICD: (state, { payload }) => {
			state.BrokerICDData = payload;
		},
		editICD_Data: (state, { payload }) => {
			state.editICDData = payload;
		},
		ICDUpdate: (state, { payload }) => {
			state.icdUpdate = payload;
		},
		getWFs: (state, { payload }) => {
			state.WFs = payload;
		},
		editWFs: (state, { payload }) => {
			state.edit_wf = payload;
		},
		WFUpdate: (state, { payload }) => {
			state.wfUpdate = payload;
		},
		WFExport: (state, { payload }) => {
			state.export_wf = payload?.url;
		},
		getCMSs: (state, { payload }) => {
			state.CMSs = payload;
		},
		editCMSs: (state, { payload }) => {
			state.edit_cms = payload;
		},
		CMSUpdate: (state, { payload }) => {
			state.cmsUpdate = payload;
		},
		getEMPBenefit: (state, { payload = [] }) => {
			// abhi changes
			// state.EMPBenefit = [...payload.filter(({ id }) => id === 43), ...payload.filter(({ id }) => id !== 43)];
			state.EMPBenefit = payload;
			state.loading = null;
		},
		getExportICD: (state, { payload }) => {
			state.exportICDResponse = payload;
		},
		getICD_Content: (state, { payload }) => {
			state.ICDContent = payload;
		},
		getStaticContents: (state, { payload }) => {
			state.StaticContent = payload;
		},
		editStaticContents: (state, { payload }) => {
			state.edit_staticContent = payload;
		},
		staticContentUpdate: (state, { payload }) => {
			state.staticContentUpdate = payload;
		},
		getIAs: (state, { payload }) => {
			state.IAs = payload;
		},
		editIAs: (state, { payload }) => {
			state.edit_ia = payload;
		},
		IAUpdate: (state, { payload }) => {
			state.iaUpdate = payload;
		},
		memberSyncData: (state, { payload }) => {
			state.memberSyncData = payload;
		},
		memberSyncDataCNH: (state, { payload }) => {
			state.memberSyncDataCNH = payload;
		},
		setPageData: (state, { payload }) => {
			state.firstPage = payload.firstPage;
			state.lastPage = payload.lastPage;
		},
		setVisitURL: (state, { payload }) => {
			state.visitURL = payload;
		},
	},
});

export const {
	loadMoreLoading,
	loadMoreQutoes,
	loading,
	error,
	success,
	clear,
	getBenefits,
	editBenefits,
	UpdateBenefit,
	getPartners,
	editPartners,
	PartnerUpdate,
	getBWPMs,
	editBWPMs,
	BWPMUpdate,
	BWPMExport,
	getEMs,
	editEMs,
	EMUpdate,
	EMExport,
	getWFs,
	editWFs,
	WFUpdate,
	WFExport,
	getCMSs,
	editCMSs,
	CMSUpdate,
	broker,
	employer,
	getICD,
	getBrokerICD,
	editICD_Data,
	ICDUpdate,
	getEMPBenefit,
	getExportICD,
	getICD_Content,
	getStaticContents,
	editStaticContents,
	staticContentUpdate,
	getIAs,
	editIAs,
	IAUpdate,
	memberSyncData,
	memberSyncDataCNH,
	setPageData,
	setVisitURL
} = wellness.actions;

//action Creators

//get brokers (only for admin)

export const getBrokers = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, broker, error, service.broker, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

//get employers

export const getEmployers = (payload, pageNo) => {
	return async (dispatch) => {
		try {
			const { data, message, errors } = await service.employers(payload, pageNo);
			if (data.data) {
				dispatch(employer({ data: data.data || [], isNew: !pageNo || pageNo === 1 }));
				dispatch(setPageData({
					firstPage: data.current_page + 1,
					lastPage: data.last_page,
				}))
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

/*------benefit-config------*/

export const createBenefit = (payload) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.createBenefit, payload);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getAllBenefit = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getBenefits, error, service.getAllBenefit, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const editBenefit = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, editBenefits, error, service.editBenefit, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const updateBenefit = (id, payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await service.updateBenefit(
				id,
				payload
			);
			if (data.data || success) {
				dispatch(UpdateBenefit(message || data.data));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const deleteBenefit = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.deleteBenefit, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

/*--x-----benefit-config-----x--*/

/*------wellness-partner-config------*/

export const createPartner = (payload) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.createPartner, payload);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getAllPartner = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getPartners, error, service.getAllPartner, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const editPartner = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, editPartners, error, service.editPartner, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const updatePartner = (id, payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await service.updatePartner(
				id,
				payload
			);
			if (data.data || success) {
				dispatch(PartnerUpdate(message || data.data));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const deletePartner = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.deletePartner, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

/*--x-----wellness-partner-config-----x--*/

/*------benefit-wellness-partner-mapping------*/

export const createBWPM = (payload) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.createBWPM, payload);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getAllBWPM = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getBWPMs, error, service.getAllBWPM, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const editBWPM = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, editBWPMs, error, service.editBWPM, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const updateBWPM = (id, payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await service.updateBWPM(
				id,
				payload
			);
			if (data.data || success) {
				dispatch(BWPMUpdate(message || data.data));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const deleteBWPM = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.deleteBWPM, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const ExportBWPM = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, BWPMExport, error, service.exportBWPM, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

/*--x-----benefit-wellness-partner-mapping-----x--*/

/*------benefit-employer-mapping------*/

export const createEM = (payload) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.createEM, payload);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getAllEM = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getEMs, error, service.getAllEM, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const editEM = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, editEMs, error, service.editEM, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const updateEM = (id, payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await service.updateEM(
				id,
				payload
			);
			if (data.data || success) {
				dispatch(EMUpdate(message || data.data));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const deleteEM = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.deleteEM, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const ExportEM = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, EMExport, error, service.exportEM, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

/*--x-----benefit-employer-mapping-----x--*/

/*------wellness-flex-config------*/

export const createWF = (payload) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.createWF, payload);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getAllWF = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getWFs, error, service.getAllWF, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const editWF = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, editWFs, error, service.editWF, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const updateWF = (id, payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await service.updateWF(
				id,
				payload
			);
			if (data.data || success) {
				dispatch(WFUpdate(message || data.data));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const deleteWF = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.deleteWF, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const ExportWF = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, WFExport, error, service.exportWF, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

/*--x-----wellness-flex-config-----x--*/

/*------wellness-benefit-cms------*/

export const createCMS = (payload) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.createCMS, payload);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getAllCMS = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getCMSs, error, service.getAllCMS, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const editCMS = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, editCMSs, error, service.editCMS, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const updateCMS = (id, payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await service.updateCMS(
				id,
				payload
			);
			if (data.data || success) {
				dispatch(CMSUpdate(message || data.data));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const deleteCMS = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.deleteCMS, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

/*--x-----wellness-benefit-cms-----x--*/

/*--x------wellness-static-content----x--*/
export const createStaticContent = (payload) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.createStaticContent, payload);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getAllStaticContent = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getStaticContents, error, service.getAllStaticContent, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const editStaticContent = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, editStaticContents, error, service.editStaticContent, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const updateStaticContent = (id, payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await service.updateStaticContent(
				id,
				payload
			);
			if (data.data || success) {
				dispatch(staticContentUpdate(message || data.data));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const deleteStaticContent = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.deleteStaticContent, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};
/*--x------wellness-static-content----x--*/

/*------ICD Code Master------*/
export const getAllICD = () => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getICD, error, service.getAllICD);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getAllBrokerICD = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getBrokerICD, error, service.getAllBrokerICD, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const createICD = (payload) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.createICD, payload);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const deleteICD = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.deleteICD, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const editICD = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, editICD_Data, error, service.editICD, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const updateICD = (id, payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await service.updateICD(
				id,
				payload
			);
			if (data.data || success) {
				dispatch(ICDUpdate(message || data.data));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const exportICD = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getExportICD, error, service.exportICD, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

/*--x---ICD Code Master---x--*/

/*------ICD Admin------*/

export const createIA = (payload) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.createIA, payload);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getAllIA = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, getIAs, error, service.getAllIA, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const editIA = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, editIAs, error, service.editIA, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const updateIA = (id, payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await service.updateIA(
				id,
				payload
			);
			if (data.data || success) {
				dispatch(IAUpdate(message || data.data));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const deleteIA = (data) => {
	return async (dispatch) => {
		try {
			actionStructre(dispatch, success, error, service.deleteIA, data);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

/*--x-----ICD Admin-----x--*/

/*------My Wellness------*/

export const getAllEmployeeBenefit = (data) => {
	return async (dispatch) => {
		try {
			dispatch(loading());
			actionStructre(
				dispatch,
				getEMPBenefit,
				error,
				service.getAllEmployeeBenefit,
				data
			);
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const getICDContent = (data) => {
	return async (dispatch) => {
		try {
			const contentData = await service.getICDContent(data);
			if (contentData.data.status) {
				dispatch(getICD_Content(contentData.data));
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const loadMore = (payload) => {
	return async (dispatch) => {
		dispatch(loadMoreLoading());
		setTimeout(() => {
			dispatch(loadMoreQutoes(payload))
		}, 500)
	}
}

export const memberSync = (payload) => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await service.memberSync(
				payload
			);
			if (data.data || success) {
				dispatch(memberSyncData(data.data));
			} else {
				dispatch(error(message || errors));
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(error("Something went wrong"));
			console.error("Error", err);
		}
	};
};

export const memberSyncCNH = () => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			const { data, message, errors } = await service.memberSyncCNH();
			if (data?.url) {
				// dispatch(memberSyncDataCNH(data));
				dispatch(loading(false));
				downloadFile(data?.url, null, true)
			} else {
				dispatch(loading(false));
				swal('Alert', serializeError(message || errors), 'info')
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(loading(false));
			swal('Downtime', 'An internal server error has occurred.', 'info')
			console.error("Error", err);
		}
	}
};

export const pristynCareApiCall = (url, name) => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			const { data, message, errors } = await service.pristynCareApi();
			if (data?.status) {
				dispatch(loading(false));
				swal({
					title: `Thank You ${name}`,
					text: 'Your request has been submitted successffully. Pristyn Care medical coordinator will call you shortly.',
					icon: 'success',
					buttons: {
						catch: {
							text: "Explore",
							value: "continue",
						}
					},
					closeOnClickOutside: false,
					dangerMode: true,
				}).then(async (caseValue) => {
					switch (caseValue) {
						case "continue":
							downloadFile(url, false, true)
							break;
						default:
					}
				})
			} else {
				dispatch(loading(false));
				swal('Alert', serializeError(message || errors), 'info')
				console.error("Error", message || errors);
			}
		} catch (err) {
			dispatch(loading(false));
			swal('Downtime', 'An internal server error has occurred.', 'info')
			console.error("Error", err);
		}
	}
};

export const getVisit = () => {
	return async (dispatch) => {
		try {
			const { data, message, errors, success } = await service.getVisit(
			);
			if (data.status || success) {
				dispatch(setVisitURL(data?.data?.url))
			} else {
				swal('Alert', serializeError(message || errors), 'info')
				dispatch(loading(false));
				console.error("Error", message || errors);
			}
		} catch (err) {
			swal('Downtime', 'An internal server error has occurred.', 'info')
			dispatch(loading(false))
			console.error("Error", err);
		}
	};
};

export const getMediBuddy = () => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			const { data, message, errors } = await service.getMediBuddy(
			);
			if (data.status) {
				dispatch(loading(false));
				mediBuddyAction(data.data.payload, data.medibuddy_url)

			} else {
				swal('Alert', serializeError(message || errors), 'info')
				dispatch(loading(false));
				console.error("Error", message || errors);
			}
		} catch (err) {
			swal('Downtime', 'An internal server error has occurred.', 'info')
			dispatch(loading(false))
			console.error("Error", err);
		}
	};
};

export const getLybrate = () => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			const { data, message, errors } = await service.getLybrate();
			if (data.status && data.data?.url) {
				dispatch(loading(false));
				downloadFile(data.data.url, null, true)

			} else {
				swal('Alert', serializeError(message || errors), 'info')
				dispatch(loading(false));
				console.error("Error", message || errors);
			}
		} catch (err) {
			swal('Downtime', 'An internal server error has occurred.', 'info')
			dispatch(loading(false))
			console.error("Error", err);
		}
	};
};

export const getMeraDoc = () => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			const { data, message, errors } = await service.getMeraDoc();
			if (data.status && data.url) {
				dispatch(loading(false));
				downloadFile(data.url, null, true)

			} else {
				swal('Alert', serializeError(message || errors), 'info')
				dispatch(loading(false));
				console.error("Error", message || errors);
			}
		} catch (err) {
			swal('Downtime', 'An internal server error has occurred.', 'info')
			dispatch(loading(false))
			console.error("Error", err);
		}
	};
};

export const get1MG = () => {
	return async (dispatch) => {
		try {
			dispatch(loading())
			const { data, message, errors } = await service.get1MG();
			if (data.status && data.redirect_url) {
				dispatch(loading(false));
				downloadFile(data.redirect_url, null, true)

			} else {
				swal('Alert', serializeError(message || errors), 'info')
				dispatch(loading(false));
				console.error("Error", message || errors);
			}
		} catch (err) {
			swal('Downtime', 'An internal server error has occurred.', 'info')
			dispatch(loading(false))
			console.error("Error", err);
		}
	};
};
//reducer export
export default wellness.reducer;


const jwt = require('jsonwebtoken');
const mediBuddyAction = (payload, url) => {
	try {
		let secret = new Buffer.from("XCAP05H6LoKvbRRa/QkqLNMI7cOHguaRyHzyg7n5qEkGjQmtBhz4SzYh4Fqwjyi3KJHlSXKPwVu2+bXr6CtpgQ==", 'base64');
		// , { expiresIn: '1h' }
		let jsonToken = jwt.sign(payload, secret, { header: { 'typ': undefined } });
		downloadFile(url + '=' + jsonToken, null, true)
	}
	catch (error) {
		return '';
	}
}

