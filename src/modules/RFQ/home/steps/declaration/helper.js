export const onChangeHandler = (e, obj) => {
    let isTrue = (obj.watch(e.target.name));
    let ID = e.target.id
    let filterData = obj.allDeclrationData.filter((item) => item.id === parseInt(ID))
    if (filterData[0].is_mandatory) {
        if (!isTrue) {
            obj.setMandatory((prev) => [...prev, filterData[0]])
        }
        else {
            let removeMandatory = obj.mandatory.filter((item) => item.id !== parseInt(ID))
            obj.setMandatory([...removeMandatory])
        }
    }
}
