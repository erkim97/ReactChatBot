import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import About from './pages/About';
import Ask from './ask/Ask';
import Header from './Header';
import Chatbot from './chatbot/Chatbot';

const App = () => {
    return (
        <div>
            <BrowserRouter>
                <div className="container">
                    <Header />
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/ask" component={Ask} />
                    <Chatbot />
                </div>

            </BrowserRouter>

        </div>

    )
}

export default App;