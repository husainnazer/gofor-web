import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles/";

//Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Post from "./Pages/Post/Post";
import Profile from "./Pages/Profile";
import MyAccount from "./Pages/MyAccount";
import ProductDetails from "./Pages/ProductDetails";

const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#33c9dc",
            main: "#00bcd4",
            dark: "#008394",
            contrastText: "#fff",
        },
        secondary: {
            light: "#ff6333",
            main: "#ff3d00",
            dark: "#b22a00",
            contrastText: "#fff",
        },
    },
});

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Router>
                    <div className="container">
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/profile" component={Profile} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/signup" component={Signup} />
                            <Route exact path="/post" component={Post} />
                            <Route
                                exact
                                path="/account"
                                component={MyAccount}
                            />
                            <Route
                                exact
                                path="/product/:productId"
                                component={ProductDetails}
                            />
                        </Switch>
                    </div>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default App;
