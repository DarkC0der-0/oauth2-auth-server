import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={LoginPage} />
                <Route path="/admin" component={AdminDashboard} />
                <Route path="/" component={LoginPage} />
            </Switch>
        </Router>
    );
};

export default App;