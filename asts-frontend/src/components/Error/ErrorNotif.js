import React, { useState } from "react";

function ErrorNotif(props) {
  const { error, errorDetails } = props;

  return (
      <div>
          <h1 className="d-flex justify-content-center pt-5 pb-2 px-5 text-light">
          Something went wrong!
          </h1>
          <p className="d-flex justify-content-start pt-2 px-5 text-light">{error}</p>
          <p className="d-flex justify-content-start pt-1 pb-5 px-5 text-muted">{errorDetails}</p>
      </div>
  );
}

export default ErrorNotif;
