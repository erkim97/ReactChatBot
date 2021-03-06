import React from 'react';

const AboutChatbot = () => {
    return (
        <div>
            <h2>Tecnologies Used!</h2>
            <ul style={{ padding: 10, fontSize: 20 }}>
                <li>-React.js for frontend</li>
                <li>-JSX with Materialize.css UI</li>
                <li>-Node.js for the backend for the app</li>
                <li>-concurrently npm package to run both frontend and backend servers during startup of app</li>
                <li>-Dialogflow API which communicates with backend</li>
                <li>-Proxy middleware to solve problem of backend url being hardcoded to every request to the backend
         , this URL needs to change, when the URL of the backend app changes like at deployment </li>
                <li>-Javascript functions for components of the pages</li>
                <li>-react-router-dom npm package to reload just a component, not the whole page</li>
                <li>-Axios npm package for HTTP requests, for two methods - one text queries and event queries</li>
                <li>-Deployment to Heroku with Heroku CLI commands</li>
                <li>-Create unique user sessions with usage of cookies package</li>
                <li>-Event based recommendations input query for users, sending and storing to mongoDB account using mongoose</li>
            </ul>
        </div>
    )
};

export default AboutChatbot;