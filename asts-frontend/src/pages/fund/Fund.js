import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

///////////////////////////////////////////////////////////////////////////////////

import ContentContainer from "../../components/ContentContainer/ContentContainer";
import TickerAccordion from "../../components/TickerAccordion/TickerAccordion";

///////////////////////////////////////////////////////////////////////////////////

function Fund() {
  const fund = useParams().fundName;

  return (
    <ContentContainer addClass="p-4">
      <TickerAccordion fund={fund} />
    </ContentContainer>
  );
}

///////////////////////////////////////////////////////////////////////////////////

export default Fund;
