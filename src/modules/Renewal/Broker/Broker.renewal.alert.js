import React, { useState } from 'react';
import { Alert, Button } from 'react-bootstrap';

export default function RenewalAlert() {
    const [show, setShow] = useState(true);
    const reload = () => {
        setShow(false);
        window.location.reload();
    }
    return (
        <Alert show={show} variant="danger">
            <Alert.Heading>Error!</Alert.Heading>
            <p>
                OOPS!Our server seems to be on a break.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => reload()} variant="outline-danger">
                    Try Again
                </Button>
            </div>
        </Alert>
    );
}
