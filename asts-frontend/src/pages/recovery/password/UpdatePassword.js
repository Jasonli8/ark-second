import React, { useContext, useState, useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../../../components/ContentContainer/ContentContainer";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import ErrorNotif from "../../../components/Error/ErrorNotif";
import { AuthContext } from "../../../contexts/auth-context";
import { useHttpClient } from "../../../helpers/hooks/http-hook";

///////////////////////////////////////////////////////////////////////////////////

function UpdatePassword() {
  const auth = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const password = useRef({});
  password.current = watch("password", "");
  const { isLoading, error, errorDetails, sendRequest, clearError } =
    useHttpClient();
  const [success, setSuccess] = useState(false);

  const passwordUpdateSubmitHandler = async (event) => {
    console.log(errors);
    try {
      console.log(event);
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_ROOT}/user/recovery/updatePassword`,
        "POST",
        JSON.stringify({
          password: event.password,
          confirmPassword: event.confirmPassword,
        }),
        {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "application/json",
        }
      );
      setSuccess(true);
    } catch (err) {
      console.log(err);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////

  return (
    <ContentContainer addClass="mt-5 p-3 text-light">
      {!error ? (
        isLoading ? (
          <LoadingSpinner />
        ) : success ? (
          <h1>Password has been updated!</h1>
        ) : (
          <>
            <Form onSubmit={handleSubmit(passwordUpdateSubmitHandler)}>
              <h1>Update your password</h1>
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
              <Form.Group controlId="confirmPassword">
                <Form.Label>Re-enter Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Re-enter Password"
                  {...register("confirmPassword", {
                    required: "Can't be empty.",
                    validate: (value) =>
                      value === password.current ||
                      "The passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-danger ml-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </Form.Group>
              <Button type="submit">Update Password</Button>
            </Form>
          </>
        )
      ) : (
        <ErrorNotif error={error} errorDetails={errorDetails} />
      )}
    </ContentContainer>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default UpdatePassword;
