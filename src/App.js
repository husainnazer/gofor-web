import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

//Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Post from "./Pages/Post/Post";
import Profile from "./Pages/Profile";
import ProductDetails from "./Pages/ProductDetails/ProductDetails";
import Chat from "./Pages/Chat/Chat";
import ChatList from "./Pages/ChatList";

class App extends Component {
    render() {
        return (
            <Router>
                <div className="container">
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/profile" component={Profile} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/signup" component={Signup} />
                        <Route exact path="/post" component={Post} />
                        <Route exact path="/chat/:chatId" component={Chat} />
                        <Route exact path="/chat" component={ChatList} />
                        <Route
                            exact
                            path="/product/:productId"
                            component={ProductDetails}
                        />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
