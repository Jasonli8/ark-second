import React, { useContext } from "react";
import { Form, Button, Spinner } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../../components/ContentContainer/ContentContainer";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import { AuthContext } from "../../contexts/auth-context";
import { useHttpClient } from "../../helpers/hooks/http-hook";

///////////////////////////////////////////////////////////////////////////////////

function Login() {
  const auth = useContext(AuthContext);
  const { isLoading, error, errorMessage, sendRequest, clearError } =
    useHttpClient();

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("submit handler called");
    console.log(event.currentTarget.userName.value);
    console.log(event.currentTarget.password.value);
    try {
      const responseData = JSON.parse(
        await sendRequest(
          "http://localhost:5000/user/login",
          "POST",
          JSON.stringify({
            user: event.currentTarget.userName.value,
            password: event.currentTarget.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        )
      );

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
        <LoadingSpinner />
      ) : (
        <ContentContainer addClass="mt-5 p-3 text-light">
          <Form onSubmit={authSubmitHandler}>
            <h1>Login</h1>
            {!!error && <p className="text-danger">{errorMessage}</p>}
            <Form.Group controlId="userName">
              <Form.Control type="input" placeholder="Username" />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button type="submit">Login</Button>
            <Button variant="secondary" href="/signup" className="ml-3">
              Create an account
            </Button>
          </Form>
          <br />
          <div>
            <a href="http://localhost:3000/recovery/user">Forgot username?</a>{" "}
            <br />
            <a href="http://localhost:3000/recovery/password">
              Forgot password?
            </a>
          </div>
        </ContentContainer>
      )}
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default Login;
