import React, { useEffect, useState, useContext } from "react";
import { Modal } from "react-bootstrap";
import { SelectComponent } from "components";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useHistory } from 'react-router';
import styled from "styled-components";
import { DrawerContext } from 'context/sidebar.context.api'


const Label = styled.div`
 i {
    color: ${({ theme }) => (theme.PrimaryColors?.color1 || '#0581FC')};
    padding-right: 6px;
 }
 color: ${({ theme }) => (theme.PrimaryColors?.color2 || '#2b1d55')};
 font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12.5px + ${fontSize - 92}%)` : '12.5px'};
 text-transform: capitalize;
 letter-spacing: .07rem;
`

const ModalA = (props) => {
  const history = useHistory();
  const { control, watch } = useForm({});
  const [noClickableModules, setNoClickableModules] = useState([]);
  const { modules } = useSelector(
    (state) => state.login
  );
  const { closeStatus } = useContext(DrawerContext);

  const url = watch("modules")?.url;
  useEffect(() => {
    if (Boolean(url)) {
      !props.biggerThan768 && closeStatus();
      props.onHide();
      history.push(url);

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  useEffect(() => {
    if (modules) {
      let filterParentId = modules.filter(({ parent_menu_id }) => parent_menu_id).map(({ parent_menu_id }) => parent_menu_id);
      filterParentId = [...new Set(filterParentId)]
      setNoClickableModules(filterParentId)
    }
  }, [modules])

  const customFilter = (option, searchText) => {
    if (option.data.name?.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  }


  return (
    <Modal show={props.show} onHide={props.onHide} size="md">
      <Modal.Body>
        <Controller
          as={
            <SelectComponent
              menuIsOpen
              autoFocus
              label="Go To Module"
              placeholder="Select Module"
              options={modules?.filter(({ id }) => !noClickableModules.includes(id))
                .map((data, i) => ({
                  id: data.id,
                  label: <Label key={"searchindex" + i}>
                    <i className={'fa-lg fa fa-' + data.class} />
                    {!!data.parent_menu_id && (modules.find((module) => data.parent_menu_id === module.id)?.name + ' : ')}{data.name}
                  </Label>,
                  value: data.id,
                  name: data.name,
                  url: data?.url
                })) || []}
            />
          }
          customFilter={customFilter}
          name="modules"
          control={control}
          defaultValue={""}
        />
      </Modal.Body>
    </Modal>
  );
};

export default ModalA;
