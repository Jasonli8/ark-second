import React, { useState, useContext } from "react";
import { Form, Button, Spinner } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../../../components/ContentContainer/ContentContainer";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import ErrorNotif from "../../../components/Error/ErrorNotif";
import { AuthContext } from "../../../contexts/auth-context";
import { useHttpClient } from "../../../helpers/hooks/http-hook";

///////////////////////////////////////////////////////////////////////////////////

function UserRecovery() {
  const auth = useContext(AuthContext);
  const { isLoading, error, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const [success, setSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();
    console.log("submit handler called");
    const email = event.currentTarget.email.value;
    try {
      await sendRequest(
        "http://localhost:5000/user/recovery/user",
        "POST",
        JSON.stringify({
          email: email,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      setSentEmail(email);
      setSuccess(true);
    } catch (err) {
      console.log(err);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////

  return (
    <ContentContainer addClass="mt-5 p-3 text-light">
      {error ? (
        <ErrorNotif error={error} errorDetails={errorDetails} />
      ) : (
        <>
          {success ? (
            <div className="d-flex justify-content-center p-5">
              <h2>Email with username has been sent to {sentEmail}</h2>
            </div>
          ) : (
            <>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Form onSubmit={submitHandler}>
                    <h1>Enter you email</h1>
                    <Form.Group controlId="email">
                      <Form.Control type="input" placeholder="Email" />
                    </Form.Group>
                    <Button type="submit">Send email</Button>
                    <Button variant="secondary" href="/login" className="ml-3">
                      Cancel
                    </Button>
                  </Form>
                </>
              )}
            </>
          )}
        </>
      )}
    </ContentContainer>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default UserRecovery;
