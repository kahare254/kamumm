import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ARIntegration from './ar/ARIntegration';
import NFCReader from './components/NFCReader';
import NFTTokenPlaceholder from './components/NFTTokenPlaceholder';
import GPSTag from './components/GPSTag';
import VRIntegration from './components/VRIntegration';
import './styles/tailwind.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <Switch>
          <Route path="/ar" component={ARIntegration} />
          <Route path="/nfc" component={NFCReader} />
          <Route path="/nft" component={NFTTokenPlaceholder} />
          <Route path="/gps" component={GPSTag} />
          <Route path="/vr" component={VRIntegration} />
          <Route path="/" exact>
            <h1 className="text-3xl font-bold">Welcome to the AR Memorial App</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;