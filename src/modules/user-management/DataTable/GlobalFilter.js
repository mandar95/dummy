import React from "react";
import { Form } from "react-bootstrap";

const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

export const GlobalFilter = ({
  // preGlobalFilteredRows,
  globalFilterState,
  setGlobalFilterState,
  activateSearchText = ''
}) => {
  const [state, setState] = React.useState('');
  const handleSearch = (e) => {
    setGlobalFilterState(e || '');
  }
  const debounceOnChange = React.useCallback(debounce(handleSearch, 400), []);

  React.useEffect(() => {
    debounceOnChange(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  React.useEffect(() => {
    if (globalFilterState === '') {
      setState('')
    }
  }, [globalFilterState])

  return (
    <div style={{ display: 'inline-table' }}>
      Search:{" "}
      <Form.Control size="sm" type="text"
        value={state}
        onChange={(e) => setState(e.target.value?.trimStart() || '')}
      // placeholder={`${count} records...`}
      />
      {activateSearchText && <>
        <br />
        <small className="ml-5">
          {activateSearchText}
        </small>
      </>}
    </div>
  );
};
