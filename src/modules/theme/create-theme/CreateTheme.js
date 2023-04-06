import React, { useEffect, useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import * as yup from 'yup';

import {
  Marker, Typography, Head,
  Input, Card, Button, Error,
} from "components";
import { Row, Col, Form, Button as ReactButton } from 'react-bootstrap';
import { Default } from '../helper';
import { useSelector } from 'react-redux';
import PreviewModal from '../preview-theme/PreviewModal';
import { previewTheme } from '../theme.slice';

export const CreateTheme = ({ dispatch, updateTheme, storeTheme, clearTheme, id }) => {
  const [modal, setModal] = useState(false);

  const { theme } = useSelector(state => state.theme);
  const validationSchema = yup.object().shape({
    name: yup.string().required('Name required').test('alphabets', 'Name must contain only alphabets', (value) => {
      return /^([A-Za-z\s])+$/.test(value?.trim());
    }),
  });
  const { control, errors, handleSubmit, reset, watch } = useForm({
    validationSchema,
    defaultValues: {
      name: theme.name,
      ...(JSON.parse(theme.theme_config || JSON.stringify(Default)))
    }
  });

  const getData =
  {
    "Card": { "color": watch("Card.color") },
    "CardBlue": { "color": watch("CardBlue.color") },
    "CardLine": { "color": watch("CardLine.color") },
    "Tab": { "color": watch("Tab.color") },
    "Button": {
      "default": {
        "background": watch("Button.default.background"), "border_color": watch("Button.default.border_color"), "text_color": watch("Button.default.text_color")
      }, "danger": {
        "background": watch("Button.danger.background"), "border_color": watch("Button.danger.border_color"), "text_color": watch("Button.danger.text_color")
      }, "warning": {
        "background": watch("Button.warning.background"), "border_color": watch("Button.warning.border_color"), "text_color": watch("Button.warning.text_color")
      }, "outline": {
        "background": watch("Button.outline.background"), "border_color": watch("Button.outline.border_color"), "text_color": watch("Button.outline.text_color")
      }, "square_outline": {
        "background": watch("Button.square_outline.background"), "border_color": watch("Button.square_outline.border_color"), "text_color": watch("Button.square_outline.text_color")
      }, "outline_secondary": {
        "background": watch("Button.outline_secondary.background"), "border_color": watch("Button.outline_secondary.border_color"), "text_color": watch("Button.outline_secondary.text_color")
      }, "submit_disabled": {
        "background": watch("Button.submit_disabled.background"), "border_color": watch("Button.submit_disabled.border_color"), "text_color": watch("Button.submit_disabled.text_color")
      }, "outline_solid": {
        "background1": watch("Button.outline_solid.background1"), "background2": watch("Button.outline_solid.background2"), "border_color": watch("Button.outline_solid.border_color"), "text_color": watch("Button.outline_solid.text_color")
      }
    },
    "PrimaryColors": { "color1": watch("PrimaryColors.color1"), "color2": watch("PrimaryColors.color2"), "color3": watch("PrimaryColors.color3"), "color4": watch("PrimaryColors.color4"), "tableColor": watch("PrimaryColors.tableColor") },
    "Chip": { "background": watch("Chip.background"), "color": watch("Chip.color") }
  }


  useEffect(() => {
    return () => { dispatch(clearTheme()) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (theme.name) {
      reset({
        name: theme.name,
        ...(JSON.parse(theme.theme_config || JSON.stringify(Default)))
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);



  const onSubmit = data => {
    const { name, ...rest } = data
    if (id) {
      dispatch(updateTheme({
        name, theme_config: JSON.stringify(rest)
      }, id));
    } else {
      dispatch(storeTheme({
        name, theme_config: JSON.stringify(rest)
      }));
    }
  };

  return (
    <>
      <Card title={
        <div className="d-flex justify-content-between align-items-center">
          <span>{id ? "Update Theme" : "Create Theme"}</span>
          <div>
            <ReactButton size="sm" className="shadow m-1 rounded-lg" variant="primary"
              onClick={() => {
                setModal(true);
                dispatch(previewTheme(getData));
              }}
            >
              <strong><i className="ti-eye"></i> Preview</strong>
            </ReactButton>
          </div>
        </div>
      }>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Name" name="name" placeholder="Enter Name" required />}
                name="name"
                error={errors && errors.name}
                control={control}
              />
              {!!errors.name &&
                <Error>
                  {errors.name.message}
                </Error>}
            </Col>
          </Row>

          <Row className="d-flex flex-wrap">
            <Col md={12} lg={12} xl={12}>
              <Marker />
              <Typography>{'\u00A0'} Cards & Tab Color</Typography>
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Card 1" type="color" placeholder="Enter Color" required />}
                name="Card.color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Card 2" type="color" placeholder="Enter Color" required />}
                name="CardBlue.color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Card 3" type="color" placeholder="Enter Color" required />}
                name="CardLine.color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Tab" type="color" placeholder="Enter Color" required />}
                name="Tab.color"
                control={control}
                defaultValue
              />
            </Col>

            <Col md={12} lg={12} xl={12} className='pb-3'>
              <Marker />
              <Typography>{'\u00A0'}Buttons Color</Typography>
            </Col>
            <Col md={12} lg={12} xl={12}>
              <Head>Submit</Head>
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Background" type="color" placeholder="Enter Color" required />}
                name="Button.default.background"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Border" type="color" placeholder="Enter Color" required />}
                name="Button.default.border_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Text" type="color" placeholder="Enter Color" required />}
                name="Button.default.text_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={12} xl={12}>
              <Head>Error</Head>
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Background" type="color" placeholder="Enter Color" required />}
                name="Button.danger.background"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Border" type="color" placeholder="Enter Color" required />}
                name="Button.danger.border_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Text" type="color" placeholder="Enter Color" required />}
                name="Button.danger.text_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={12} xl={12}>
              <Head>Warning</Head>
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Background" type="color" placeholder="Enter Color" required />}
                name="Button.warning.background"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Border" type="color" placeholder="Enter Color" required />}
                name="Button.warning.border_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Text" type="color" placeholder="Enter Color" required />}
                name="Button.warning.text_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={12} xl={12}>
              <Head>Outline</Head>
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Background" type="color" placeholder="Enter Color" required />}
                name="Button.outline.background"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Border" type="color" placeholder="Enter Color" required />}
                name="Button.outline.border_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Text" type="color" placeholder="Enter Color" required />}
                name="Button.outline.text_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={12} xl={12}>
              <Head>Square-Outline</Head>
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Background" type="color" placeholder="Enter Color" required />}
                name="Button.square_outline.background"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Border" type="color" placeholder="Enter Color" required />}
                name="Button.square_outline.border_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Text" type="color" placeholder="Enter Color" required />}
                name="Button.square_outline.text_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={12} xl={12}>
              <Head>Secondary-Outline</Head>
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Background" type="color" placeholder="Enter Color" required />}
                name="Button.outline_secondary.background"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Border" type="color" placeholder="Enter Color" required />}
                name="Button.outline_secondary.border_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Text" type="color" placeholder="Enter Color" required />}
                name="Button.outline_secondary.text_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={12} xl={12}>
              <Head>Submit-Disabled</Head>
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Background" type="color" placeholder="Enter Color" required />}
                name="Button.submit_disabled.background"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Border" type="color" placeholder="Enter Color" required />}
                name="Button.submit_disabled.border_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Text" type="color" placeholder="Enter Color" required />}
                name="Button.submit_disabled.text_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={12} xl={12}>
              <Head>Outline Solid</Head>
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Background 1" type="color" placeholder="Enter Color" required />}
                name="Button.outline_solid.background1"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Background 2" type="color" placeholder="Enter Color" required />}
                name="Button.outline_solid.background2"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Border" type="color" placeholder="Enter Color" required />}
                name="Button.outline_solid.border_color"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Text" type="color" placeholder="Enter Color" required />}
                name="Button.outline_solid.text_color"
                control={control}
                defaultValue
              />
            </Col>

            <Col md={12} lg={12} xl={12}>
              <Marker />
              <Typography>{'\u00A0'}Primary Colors</Typography>
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Color 1" type="color" placeholder="Enter Color" required />}
                name="PrimaryColors.color1"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Color 2" type="color" placeholder="Enter Color" required />}
                name="PrimaryColors.color2"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Color 3" type="color" placeholder="Enter Color" required />}
                name="PrimaryColors.color3"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Color 4" type="color" placeholder="Enter Color" required />}
                name="PrimaryColors.color4"
                control={control}
                defaultValue
              />
            </Col>

            <Col md={12} lg={12} xl={12}>
              <Marker />
              <Typography>{'\u00A0'}Table & Chips Color</Typography>
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Table" type="color" placeholder="Enter Color" required />}
                name="PrimaryColors.tableColor"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={12} xl={12}>
              <Head>Chip</Head>
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Background" type="color" placeholder="Enter Color" required />}
                name="Chip.background"
                control={control}
                defaultValue
              />
            </Col>
            <Col md={12} lg={4} xl={3} sm={6}>
              <Controller
                as={<Input label="Color" type="color" placeholder="Enter Color" required />}
                name="Chip.color"
                control={control}
                defaultValue
              />
            </Col>
          </Row>
          <Row >
            <Col md={12} className="d-flex justify-content-end mt-4">
              <Button type="submit">
                {id ? 'Update' : 'Submit'}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>

      {
        !!modal && <PreviewModal
          onHide={() => setModal(false)}
          show={modal}
        />
      }

    </>
  )
}
