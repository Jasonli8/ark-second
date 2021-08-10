import React, { useState } from "react";
import { useParams } from "react-router-dom";

///////////////////////////////////////////////////////////////////////////////////

import ArkStat from "../../components/stats/ArkStat";
import MarketStat from "../../components/stats/MarketStat";
import ContentContainer from "../../components/ContentContainer/ContentContainer";
import ContentContainerHeader from "../../components/ContentContainer/ContentContainerHeader";
import DataStat from "../../components/stats/DataStat";

///////////////////////////////////////////////////////////////////////////////////

function Ticker() {
  const ticker =  useParams().ticker;
  const [selectedTab, setSelectedTab] = useState('holding');

  const selectHistory = () => {
    setSelectedTab('history');
  }
  const selectHolding = () => {
    setSelectedTab('holding');
  }

  return (
    <ContentContainer>
      <nav>
        <ContentContainerHeader addClass="nav nav-tabs" height="60px">
          <a
            className={`nav-item nav-link ${selectedTab === 'holding' ? 'active' : 'text-light'}`}
            onClick={selectHolding}
          >
            Ark Holdings
          </a>
          <a
            className={`nav-item nav-link ${selectedTab === 'history' ? 'active' : 'text-light'}`}
            onClick={selectHistory}
          >
            Quotes
          </a>
        </ContentContainerHeader>
      </nav>
      <div className="tab-content" style={{minHeight: "700px"}}>
        <div
          className="tab-pane fade show active"
        >
          {selectedTab === 'holding' ? <ArkStat ticker={ticker} /> : <MarketStat ticker={ticker} />}
        </div>
      </div>
      <DataStat ticker={ticker} />
    </ContentContainer>
  );
}

export default Ticker;
