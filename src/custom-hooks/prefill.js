import { useEffect } from 'react';

export function Prefill(data = [], setValue, inputName = '', labelKey = 'name', idKey = 'id', resetOption) {
  useEffect(() => {
    if (data.length === 1)
      setValue(inputName, { id: data[0][idKey], label: data[0][labelKey], value: data[0][idKey] })

      if(!data.length && resetOption && resetOption.reset){
        setValue(inputName, resetOption.resetValue || '')
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
}
