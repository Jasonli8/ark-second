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
  const { isLoading, error, errorDetails, errorCode, errorMessage, sendRequest, clearError } =
    useHttpClient();
  const [user, setUser] = useState();
  const [question, setQuestion] = useState();

  const userSubmitHandler = async (event) => {
    console.log("submit handler called");
    const user = event.currentTarget.username.value;
    try {
      let response = await sendRequest(
        `http://localhost:5000/user/recovery/password?user=${user}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
        }
      );
      console.log(response);
      clearError();
      setUser(user);
      setQuestion(response.question);
    } catch (err) {
      console.log(err);
    }
  };

  const answerSubmitHandler = async (event) => {
    console.log("submit handler called");
    const answer = event.currentTarget.answer.value;
    try {
      let responseData = await sendRequest(
        "http://localhost:5000/user/recovery/passwordConfirm",
        "POST",
        JSON.stringify({
          user: user,
          answer: answer,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      const response = JSON.parse(responseData);
      console.log(response);
      auth.login(
        response.user,
        response.firstName,
        response.lastName,
        response.token
      );

      window.location.href = `http://localhost:3000/update-password`;
    } catch (err) {
      console.log(err);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////

  return (
    <ContentContainer addClass="mt-5 p-3 text-light">
      <>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Form onSubmit={userSubmitHandler}>
              <h1>Enter you username</h1>
              {!!error && !question && <p className="text-danger">{errorMessage}</p>}
              <Form.Group controlId="username">
                <Form.Control
                  type="input"
                  placeholder="Username"
                  value={user}
                  disabled={!!user}
                />
              </Form.Group>
              <Button type="submit" disabled={!!question}>
                Confirm
              </Button>
              {!question && (
                <Button variant="secondary" href="/login" className="ml-3">
                  Cancel
                </Button>
              )}
            </Form>
            <br />
            {!!question && (
              <Form onSubmit={answerSubmitHandler}>
                <h1>
                  {question}
                  <br />
                  <small>Enter your answer</small>
                </h1>
                {!!error && question && <p className="text-danger">{errorMessage}</p>}
                <Form.Group controlId="answer">
                  <Form.Control type="input" placeholder="Answer" />
                </Form.Group>
                <Button type="submit">Confirm</Button>
                <Button variant="secondary" href="/login" className="ml-3">
                  Cancel
                </Button>
              </Form>
            )}
          </>
        )}
      </>
    </ContentContainer>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default UserRecovery;
