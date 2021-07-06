import React, { useContext, useState, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../../components/ContentContainer/ContentContainer";
import { AuthContext } from "../../contexts/auth-context";
import { useHttpClient } from "../../helpers/hooks/http-hook";

///////////////////////////////////////////////////////////////////////////////////

let securityQuestions;

function Login() {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [questionsLoaded, setQuestionsLoaded] = useState(false);

  useEffect(() => {
    const getQuestions = async () => {
      console.log("getting questions");
      let data; 
      try {
        data = await sendRequest("http://localhost:5000/user/questions");
        securityQuestions = await data.map((questionObj) => (
            <option>{questionObj.question}</option>
          ));
      } catch (err) {
        console.log(err);
        return;
      }

      setQuestionsLoaded(true);
    };
    getQuestions();
  }, [sendRequest]);

  const signupSubmitHandler = async (event) => {
    event.preventDefault();
    console.log("submit handler called");
    console.log(event.currentTarget.userName.value);
    console.log(event.currentTarget.firstName.value);
    console.log(event.currentTarget.lastName.value);
    console.log(event.currentTarget.email.value);
    console.log(event.currentTarget.password.value);
    console.log(event.currentTarget.securityQuestion.value);
    console.log(event.currentTarget.answer.value);
    try {
      const responseData = await sendRequest(
        "http://localhost:5000/user/signup",
        "POST",
        JSON.stringify({
          user: event.currentTarget.userName.value,
          firstName: event.currentTarget.firstName.value,
          lastName: event.currentTarget.lastName.value,
          email: event.currentTarget.email.value,
          password: event.currentTarget.password.value,
          question: event.currentTarget.securityQuestion.value,
          answer: event.currentTarget.answer.value,
        }),
        {
          "Content-Type": "application/json",
        }
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
        <Spinner animation="grow" />
      ) : (
        <ContentContainer addClass="mt-5">
          <Form onSubmit={signupSubmitHandler}>
            <h1>Login</h1>
            <Form.Group controlId="userName">
              <Form.Label>Username</Form.Label>
              <Form.Control type="input" placeholder="Username" />
            </Form.Group>
            <Form.Group controlId="firstName">
              <Form.Label>First name</Form.Label>
              <Form.Control type="input" placeholder="First name" />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control type="input" placeholder="Last name" />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group controlId="securityQuestion">
              <Form.Label>
                Pick a security question for password recovery
              </Form.Label>
              <Form.Control as="select" placeholder="Pick one">
                {questionsLoaded && securityQuestions}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="answer">
              <Form.Label>Answer to security question</Form.Label>
              <Form.Control type="input" placeholder="Answer" />
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
