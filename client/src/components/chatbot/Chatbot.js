import React, { Component } from 'react';
import axios from "axios/index";
import { withRouter } from 'react-router-dom';

import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import Message from './Message';
import Card from './Card';
import QuickReplies from './QuickReplies';

const cookies = new Cookies();

class Chatbot extends Component {
    messagesEnd;
    talkInput;

    constructor(props) {
        super(props);
        // Need a binding to make 'this' work in the callback
        this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
        this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);

        this.state = {
            messages: [],
            personWelcomeSent: false
        };
        if (cookies.get('userID') === undefined) {
            cookies.set('userID', uuid(), { path: '/' });
        }
    }

    async df_text_query(text) {
        let says = {
            speaks: 'user',
            msg: {
                text: {
                    text: text
                }
            }
        }
        this.setState({ messages: [...this.state.messages, says] });
        try {
            const res = await axios.post('/api/df_text_query', { text, userID: cookies.get('userID') });

            for (let msg of res.data.fulfillmentMessages) {
                says = {
                    speaks: 'bot',
                    msg: msg
                }
                this.setState({ messages: [...this.state.messages, says] });
            }
        } catch (e) {
            says = {
                speaks: 'bot',
                msg: {
                    text: {
                        text: "I'm having trouble with the connection, please try again later."
                    }
                }
            }

        }
    };

    async df_event_query(event) {
        try {
            const res = await axios.post('/api/df_event_query', { event, userID: cookies.get('userID') });

            for (let msg of res.data.fulfillmentMessages) {
                let says = {
                    speaks: 'bot',
                    msg: msg
                }

                this.setState({ messages: [...this.state.messages, says] });
            }
        } catch (e) {
            let says = {
                speaks: 'bot',
                msg: {
                    text: {
                        text: "I'm having troubles. I need to terminate. Will be back later"
                    }
                }
            }

        }

    };

    //What to ask the chatbot? page, gives shop default state message
    componentDidMount() {
        this.df_event_query('Welcome');

        if (window.location.pathname === '/ask' && !this.state.shopWelcomeSent) {
            this.df_event_query('WELCOME_PERSON');
            this.setState({ personWelcomeSent: true });
        }

        this.props.history.listen(() => {
            if (this.props.history.location.pathname === '/ask' && !this.state.shopWelcomeSent) {
                this.df_event_query('WELCOME_PERSON');
                this.setState({ personWelcomeSent: true });
            }
        });
    }

    componentDidUpdate() {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        this.talkInput.focus();
    }

    //SHOW_RECOMMENDATIONS event trigger recommend_yes follow up intent
    _handleQuickReplyPayload(event, payload, text) {
        event.preventDefault();
        event.stopPropagation();
        switch (payload) {
            case 'recommend_yes':
                this.df_event_query('SHOW_RECOMMENDATIONS');
                break;
            default:
                this.df_text_query(text);
                break;
        }
    }

    //Listings of restaurants on a card, dialogflow diagnostic info
    renderCards(cards) {
        return cards.map((card, i) => <Card key={i} payload={card.structValue} />);
    }

    renderOneMessage(message, i) {

        if (message.msg && message.msg.text && message.msg.text.text) {
            return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />;
        } else if (message.msg && message.msg.payload && message.msg.payload.fields.cards) {
            return <div key={i}>
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div style={{ overflow: 'hidden' }}>
                        <div className="col s2">
                            <a href="/" className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
                        </div>
                        <div style={{ overflow: 'auto', overflowY: 'scroll' }}>
                            <div style={{ height: 500, width: message.msg.payload.fields.cards.listValue.values.length * 270 }}>
                                {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        } else if (message.msg &&
            message.msg.payload &&
            message.msg.payload.fields &&
            message.msg.payload.fields.quick_replies
        ) {
            return <QuickReplies
                text={message.msg.payload.fields.text ? message.msg.payload.fields.text : null}
                key={i}
                replyClick={this._handleQuickReplyPayload}
                speaks={message.speaks}
                payload={message.msg.payload.fields.quick_replies.listValue.values} />;
        }
    }

    renderMessages(returnedMessages) {
        if (returnedMessages) {
            return returnedMessages.map((message, i) => {
                return this.renderOneMessage(message, i);
            }
            )
        } else {
            return null;
        }
    }

    //Handle enter input key press text value
    _handleInputKeyPress(e) {
        if (e.key === 'Enter') {
            this.df_text_query(e.target.value);
            e.target.value = '';
        }
    }

    //Navbar and Chatbot position, size, color, css
    render() {
        return (
            <div style={{ minHeight: 500, maxHeight: 500, width: 400, position: 'absolute', bottom: 0, right: 0, border: '1px solid lightgray' }}>
                <nav>
                    <div className="nav-wrapper">
                        <a href="/" className="brand-logo">ChatBot</a>
                    </div>
                </nav>

                <div id="chatbot" style={{ minHeight: 388, maxHeight: 388, width: '100%', overflow: 'auto' }}>

                    {this.renderMessages(this.state.messages)}
                    <div ref={(el) => { this.messagesEnd = el; }}
                        style={{ float: "left", clear: "both" }}>
                    </div>
                </div>
                <div className=" col s12" >
                    <input style={{ margin: 0 }} ref={(input) => { this.talkInput = input; }} placeholder="type a message:" onKeyPress={this._handleInputKeyPress} id="user_says" type="text" />
                </div>

            </div >
        );

    }
}

export default withRouter(Chatbot);