import React, { useContext } from "react";
import { Form, Button, Spinner } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../../components/ContentContainer/ContentContainer";
import { AuthContext } from "../../contexts/auth-context";
import { useHttpClient } from "../../helpers/hooks/http-hook";

///////////////////////////////////////////////////////////////////////////////////

function Login() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("submit handler called");
    console.log(event.currentTarget.userName.value);
    console.log(event.currentTarget.password.value);
    try {
      const responseData = JSON.parse(await sendRequest(
        "http://localhost:5000/user/login",
        "POST",
        JSON.stringify({
          user: event.currentTarget.userName.value,
          password: event.currentTarget.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      ));

      auth.login(
        responseData.user,
        responseData.firstName,
        responseData.lastName,
        responseData.token
      );
    } catch (err) {
      console.log(err);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      {isLoading ? (
        <Spinner animation="grow" />
      ) : (
        <ContentContainer addClass="mt-5 p-3">
          <Form onSubmit={authSubmitHandler}>
            <h1>Login</h1>
            <Form.Group controlId="userName">
              <Form.Control type="input" placeholder="Username" />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button type="submit">Login</Button>
          </Form>
        </ContentContainer>
      )}
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default Login;
