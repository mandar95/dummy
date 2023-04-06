import swal from "sweetalert";
import { serializeError, DateFormate, downloadFile } from "../../utils"
import service from './template.service'

export const initialState = {
    loading: false,
    allTrigger: [],
    allEmailTemplate: [],
    templateMappingData: [],
    brokerData: null,
    errors: null,
    success: null,
    _frequency: []
}

export const reducer = (state, { type, payload }) => {

    switch (type) {
        case 'GENERIC_UPDATE': return {
            ...state,
            ...payload
        }
        case 'ERROR': return {
            ...state,
            loading: false,
            errors: serializeError(payload)
        }
        case 'SUCCESS': return {
            ...state,
            ...payload
        }
        case 'LOADING': return {
            ...state,
            loading: payload,
        }
        default: return state;
    }
}


export const getAllTrigger = async (dispatch) => {
    try {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
        const { data, message, errors } = await service.getAllTrigger();
        if (data.data) {
            dispatch({
                type: 'GENERIC_UPDATE', payload: {
                    brokerData: data?.broker_data || {},
                    allTrigger: data.data,
                    loading: false
                }
            });
        } else {
            dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
            swal("Alert", serializeError(message || errors), 'info');
        }
    }
    catch (error) {
        console.error(error)
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    }
}

export const getALLEmailTemplate = async (dispatch, payload) => {
    try {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
        const { data, message, errors } = await service.getALLEmailTemplate(payload);
        if (data.data) {
            dispatch({
                type: 'GENERIC_UPDATE', payload: {
                    // allEmailTemplate: data.data,
                    allEmailTemplate: (data.data && data.data.map(item => ({
                        ...item,
                        created_at: DateFormate(item.created_at, { type: 'withTime' }),
                        updated_at: DateFormate(item.updated_at, { type: 'withTime' })
                    }))) || [],
                    loading: false
                }
            });
        } else {
            dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
            swal("Alert", serializeError(message || errors), 'info');
        }
    }
    catch (error) {
        console.error(error)
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    }
}

export const createEmailTemplate = async (dispatch, payload) => {
    try {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
        const { data, message, errors } = await service.createEmailTemplate(payload);
        if (data.status) {
            dispatch({
                type: 'SUCCESS', payload: {
                    success: serializeError(message || errors),
                    loading: false
                }
            })
        } else {
            dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
            swal("Alert", serializeError(message || errors), 'info')
            // .then(() => {
            //     getALLEmailTemplate(dispatch)
            // });
        }
    }
    catch (error) {
        console.error(error)
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    }
}

export const updateEmailTemplate = async (dispatch, payload, id) => {
    try {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
        const { data, message, errors } = await service.updateEmailTemplate(payload, id);
        if (data.status) {
            dispatch({
                type: 'SUCCESS', payload: {
                    success: serializeError(message || errors),
                    loading: false
                }
            })
        } else {
            dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
            swal("Alert", serializeError(message || errors), 'info')
            // .then(() => {
            //     getALLEmailTemplate(dispatch)
            // });
        }
    }
    catch (error) {
        console.error(error)
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    }
}

export const deleteTemplate = async (dispatch, payload) => {
    try {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
        const { data, message, errors } = await service.deleteTemplate(payload);
        if (data.status) {
            dispatch({
                type: 'SUCCESS', payload: {
                    success: serializeError(message || errors),
                    loading: false
                }
            })
        } else {
            dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
            swal("Alert", serializeError(message || errors), 'info')
            // .then(() => {
            //     getALLEmailTemplate(dispatch)
            // });
        }
    }
    catch (error) {
        console.error(error)
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    }
}



export const getTemplateMapping = async (dispatch, payload) => {
    try {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
        const { data, message, errors } = await service.getTemplateMapping(payload);
        if (data.data) {
            dispatch({
                type: 'GENERIC_UPDATE', payload: {
                    // templateMappingData: data.data,
                    templateMappingData: (data.data && data.data.map(item => ({
                        ...item,
                        created_at: DateFormate(item.created_at, { type: 'withTime' }),
                        updated_at: DateFormate(item.updated_at, { type: 'withTime' })
                    }))) || [],
                    loading: false
                }
            });
        } else {
            dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
            swal("Alert", serializeError(message || errors), 'info');
        }
    }
    catch (error) {
        console.error(error)
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    }
}

export const createTemplateMapping = async (dispatch, payload) => {
    try {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
        const { data, message, errors } = await service.createTemplateMapping(payload);
        if (data.status) {
            dispatch({
                type: 'SUCCESS', payload: {
                    success: serializeError(message || errors),
                    loading: false
                }
            })
        } else {
            dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
            swal("Alert", serializeError(message || errors), 'info');
        }
    }
    catch (error) {
        console.error(error)
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    }
}

export const deleteTemplateMapping = async (dispatch, payload) => {
    try {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
        const { data, message, errors } = await service.deleteTemplateMapping(payload);
        if (data.status) {
            dispatch({
                type: 'SUCCESS', payload: {
                    success: serializeError(message || errors),
                    loading: false
                }
            })
        } else {
            dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
            swal("Alert", serializeError(message || errors), 'info');
        }
    }
    catch (error) {
        console.error(error)
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    }
}

export const updateTemplateMapping = async (dispatch, payload, id) => {
    try {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: true } });
        const { data, message, errors } = await service.updateTemplateMapping(payload, id);
        if (data.status) {
            dispatch({
                type: 'SUCCESS', payload: {
                    success: serializeError(message || errors),
                    loading: false
                }
            })
        } else {
            dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
            swal("Alert", serializeError(message || errors), 'info');
        }
    }
    catch (error) {
        console.error(error)
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    }
}

export const clear = async (dispatch) => {
    try {
        dispatch({ type: 'GENERIC_UPDATE', payload: { success: null, errors: null } });
    }
    catch (error) {
        console.error(error)
        dispatch({ type: 'GENERIC_UPDATE', payload: { loading: false } });
    }
}

export const getTemplateView = async (payload, setState) => {
    try {
        const { data } = await service.getTemplateView(payload);
        setState(state => data);
    } catch (err) {
        console.error("Error", err);
    }
};


export const loadSelectedEvent = async (dispatch) => {
    try {
        dispatch({ type: 'LOADING', payload: true });
        const { data, message, errors } = await service.loadSelectedEvent();
        if (data.data) {
            dispatch({
                type: 'GENERIC_UPDATE', payload: {
                    selectedEvent: data.data.map((elem) => ({
                        ...elem,
                        label: elem.trigger_name,
                        value: elem.id
                    })),
                    loading: false
                }
            })
        } else {
            dispatch({ type: 'LOADING', payload: false });
            swal("Alert", serializeError(message || errors), 'info');
        }
    }
    catch (error) {
        console.error(error)
        dispatch({ type: 'LOADING', payload: false });
    }
}

export const loadTemplate = async (dispatch, payload) => {
    try {
        const { data, message, errors } = await service.loadTemplate(payload);
        if (data.data) {
            dispatch({
                type: 'GENERIC_UPDATE', payload: {
                    templates: data.data.map((elem) => ({
                        label: elem.name,
                        value: elem.id,
                        id: elem.id
                    })),
                }
            })
        } else {
            swal("Alert", serializeError(message || errors), 'info');
        }
    }
    catch (error) {
        console.error(error)
    }
}

export const triggerEmailUplaod = async (dispatch, payload, setValue) => {
    try {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loadingDetail: true } });
        const { data, message, errors } = await service.triggerEmailUplaod(payload);
        if (data.status) {
            dispatch({ type: 'GENERIC_UPDATE', payload: { loadingDetail: false } });
            swal('Success', message, 'success').then(() =>
                setValue([
                    { employer_id: undefined },
                    { policy_type: undefined },
                    { policy_id: undefined },
                    { template_id: undefined },
                    { trigger_id: undefined },
                    { file: undefined }
                ]));

        } else {
            dispatch({ type: 'GENERIC_UPDATE', payload: { loadingDetail: false } });
            swal("Alert", serializeError(message || errors), 'warning');
            setValue('file', undefined)
        }
    }
    catch (error) {
        dispatch({ type: 'GENERIC_UPDATE', payload: { loadingDetail: false } });
        swal("Alert", serializeError(error), 'warning');
        console.error(error)
        setValue('file', undefined)
    }
}

export const loadSampleFormatAction = async (payload) => {
    try {
        const { data, message, errors } = await service.loadSampleFormat(payload);
        data.url ? downloadFile(data.url) :
            swal("Alert", serializeError(message || errors), 'info');
    }
    catch (error) {
        console.error(error)
    }
}

export const loadFrequency = async (dispatch, payload) => {
    try {
        const { data, message, errors } = await service.loadFrequency(payload);
        if (data.data) {
            dispatch({
                type: 'GENERIC_UPDATE', payload: {
                    _frequency: data.data.map((elem) => ({
                        label: elem.frequency_name,
                        name: elem.frequency_name,
                        value: elem.sequence,
                        id: elem.sequence
                    })),
                }
            })
        } else {
            swal("Alert", serializeError(message || errors), 'info');
        }
    }
    catch (error) {
        console.error(error)
    }
}

export const templateImageUpload = async (setImgLoader, setImgURLData, payload) => {
    try {
        setImgLoader(true)
        const { data, message, errors } = await service.templateImageUpload(payload);
        if (data.status) {
            setImgURLData((prev) => [...prev, { url: data?.data?.url, name: data?.data?.file_name, id: prev ? prev?.length + 1 : 1 }])
            setImgLoader(false)
        } else {
            swal("Alert", serializeError(message || errors), 'info');
            setImgLoader(false)
        }
    }
    catch (err) {
        console.error(err)
        setImgLoader(false)
    }
}
