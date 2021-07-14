import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

///////////////////////////////////////////////////////////////////////////////////

import ArkStat from "../../components/stats/ArkStat";
import MarketStat from "../../components/stats/MarketStat";
import ContentContainer from "../../components/ContentContainer/ContentContainer";
import ContentContainerHeader from "../../components/ContentContainer/ContentContainerHeader";

///////////////////////////////////////////////////////////////////////////////////

function Ticker() {
  const ticker =  useParams().ticker;
  const [selectedTab, setSelectedTab] = useState('holding');

  const selectHistory = () => {
    console.log('history');
    setSelectedTab('history');
  }
  const selectHolding = () => {
    console.log('holding');
    setSelectedTab('holding');
  }

  return (
    <ContentContainer>
      <nav style={{background: '#695E97'}}>
        <ContentContainerHeader addClass="nav nav-tabs">
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
      <div className="tab-content">
        <div
          className="tab-pane fade show active"
        >
          {selectedTab === 'holding' ? <ArkStat ticker={ticker} /> : <MarketStat ticker={ticker} />}
        </div>
      </div>
    </ContentContainer>
  );
}

export default Ticker;
