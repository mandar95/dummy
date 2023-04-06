

export const getTATQueryUserWise = (currentUser, dispatch, getAllTATQuery) => {
    if (currentUser?.broker_id) {
        dispatch(getAllTATQuery(
            { broker_id: currentUser?.broker_id }
        ))
    }
    if (currentUser?.employer_id) {
        dispatch(getAllTATQuery(
            { employer_id: currentUser?.employer_id }
        ))
    }
    if (currentUser?.ic_id) {
        dispatch(getAllTATQuery(
            { ic_id: currentUser?.ic_id }
        ))
    }
}