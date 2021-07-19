import React, { useContext, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../../components/ContentContainer/ContentContainer";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import ErrorNotif from "../../components/Error/ErrorNotif";
import { AuthContext } from "../../contexts/auth-context";
import { useHttpClient } from "../../helpers/hooks/http-hook";

///////////////////////////////////////////////////////////////////////////////////

let securityQuestions;

function Signup() {
  const auth = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { isLoading, error, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const [questionsLoaded, setQuestionsLoaded] = useState(false);

  useEffect(() => {
    const getQuestions = async () => {
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
      {!error && isLoading ? (
        <LoadingSpinner />
      ) : (
        <ContentContainer addClass="mt-5 p-3 text-light">
          <Form onSubmit={handleSubmit(signupSubmitHandler)}>
            <h1>Signup</h1>
            <Form.Group controlId="userName">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="input"
                placeholder="Username"
                {...register("userName", {
                  required: "Can't be empty.",
                  minLength: {
                    value: 4,
                    message: "Must be at least 4 characters long.",
                  },
                })}
              />
              {errors.userName && (
                <p className="text-danger ml-1">{errors.userName.message}</p>
              )}
            </Form.Group>
            <Form.Group controlId="firstName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="input"
                placeholder="First name"
                {...register("firstName", { required: "Can't be empty." })}
              />
              {errors.firstName && (
                <p className="text-danger ml-1">{errors.firstName.message}</p>
              )}
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="input"
                placeholder="Last name"
                {...register("lastName", { required: "Can't be empty." })}
              />
              {errors.lastName && (
                <p className="text-danger ml-1">{errors.lastName.message}</p>
              )}
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Can't be empty.",
                  pattern: {
                    value: "/^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/",
                    message: "Not a valid email.",
                  },
                })}
              />
              {errors.email && (
                <p className="text-danger ml-1">{errors.email.message}</p>
              )}
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Can't be empty.",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters long.",
                  },
                })}
              />
              {errors.password && (
                <p className="text-danger ml-1">{errors.password.message}</p>
              )}
            </Form.Group>
            <Form.Group controlId="securityQuestion">
              <Form.Label>
                Pick a security question for password recovery
              </Form.Label>
              <Form.Control
                as="select"
                placeholder="Pick one"
                {...register("securityQuestion")}
              >
                {questionsLoaded && securityQuestions}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="answer">
              <Form.Label>Answer to security question</Form.Label>
              <Form.Control
                type="input"
                placeholder="Answer"
                {...register("answer", { required: "Can't be empty" })}
              />
              {errors.answer && (
                <p className="text-danger ml-1">{errors.answer.message}</p>
              )}
            </Form.Group>
            <Button type="submit">Signup</Button>
            <Button variant="secondary" href="/login" className="ml-3">
              Cancel
            </Button>
          </Form>
        </ContentContainer>
      )}
    </>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default Signup;
