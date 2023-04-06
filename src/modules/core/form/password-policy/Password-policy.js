import React from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

const EditModal = (props) => {
  return (
    <Modal
      {...props}
      style={{ borderRadius: "30px" }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header>
        <Modal.Title className="mx-auto" id="contained-modal-title-vcenter">
          Password Policy
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="col-md-9 col-sm-12 text-center mx-auto">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "400px",
            overflow: "auto",
            padding: "20px",
            textAlign:'left'
          }}
        >
          <h6 style={{textAlign:'center'}}>
            <u>Password Management:</u>
          </h6>
          <ul>
            <li>
              <p>
                All information systems shall require authentication through
                passwords, pass-phrases, one-time passwords and similar password
                mechanisms as a minimum
              </p>
            </li>
            <li>
              <p>
                The system’s security mechanism shall allow for each system user
                to be given a specific level of access to the application’s data
                on authentication basis. Application provides a mechanism that
                authenticates users based, at a minimum, on a unique identifier
                for each user and associated password.
              </p>
            </li>
            <li>
              <p>
                The users shall change their password after first successful
                log-on and ensure the quality of the password is maintained.
              </p>
            </li>
            <li>
              <p>
                Users shall follow the following guidelines for creating
                a quality password:-
              </p>
              <ol>
                <li>
                  <p>All passwords shall be minimum 8 characters in length.</p>
                </li>
                <li>
                  <p>
                    All passwords shall contain both minimum 1 upper case, 1
                    lower case (e.g., a-z, A-Z) and 1 special character (%, $ &
                    etc.) and 1 numeric character where possible.
                  </p>
                </li>
                <li>
                  <p>
                    Users to keep personal secret authentication information
                    confidential and not to be share with anyone.
                  </p>
                </li>
              </ol>
            </li>
            <li>
              <p>Passwords shall never be written down or stored on-line.</p>
            </li>
            <li>
              <p style={{ color: "red" }}>
                The account shall be locked out after five (5) failed password
                attempts per minute. Locked out accounts shall be enabled
                automatically after 15 minutes. There shall be a provision for
                system administrators to enable the locked-out account manually
                during lockout duration, wherever feasible.
              </p>
            </li>
            <li>
              <p style={{ color: "red" }}>
                Last 8 Password history for application to be maintained and
                users shall not be allowed to reuse last 3 passwords.
              </p>
            </li>
            <li>
              <p>
                The same password shall not be used for multiple access needs
                unless enforced using technology such as single sign-on.
              </p>
            </li>
            <li>
              <p>Passwords for users shall be changed in minimum 45 days.</p>
            </li>
            <li>
              <p>
                Three days prior to password expiry the user shall be alerted by
                a system warning message to change the password on every login
              </p>
            </li>
            <li>
              <p>
                The display and printing of passwords must be masked using
                asterisks, or otherwise obscured such that unauthorized parties
                will not be able to observe or subsequently recover them.
              </p>
            </li>
            <li>
              <p>Passwords must not be logged or captured in audit trails</p>
            </li>
            <li>
              <p>
                "Remember Password" feature of applications shall not be used
                (e.g., web browsers, websites). Any exceptions to be approved by
                InfoSec Compliance Manager
              </p>
            </li>
            <li>
              <p>
                IT team shall carry out proper identity verification check of
                the user before changing or reset of password
              </p>
            </li>
            <li>
              <p>
                First time password or reset password shall be delivered to
                employee for (domain id) to reporting manager/IT Team and for
                application to registered on Email Id)
              </p>
            </li>
            <li>
              <p>
                When changing a password, the user shall be prompted to re-enter
                the new password for verification.
              </p>
            </li>
          </ul>
        </div>
        <Modal.Footer>
          <Button variant="primary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};

export default EditModal;
// PropTypes
EditModal.propTypes = {
  props: PropTypes.object,
};

// DefaultTypes
EditModal.defaultProps = {
  props: { onHide: () => {} },
};
