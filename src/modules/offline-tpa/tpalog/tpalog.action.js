import service from './Tpalog.service'

export const loadTpaMethods = async (dispatch, payload) => {
  try {
    const { data } = await service.loadTpaMethods(payload);
    dispatch({
      type: 'GENERIC_UPDATE', payload: {
        log_types: (data.data && data.data.map(item => (
          {
            id: item.name,
            label: item.name,
            name: item.name,
            value: item.name
          }
        ))) || [],
        // loading: false
      }
    });
  }
  catch (error) {
    console.error(error)
  }
}
