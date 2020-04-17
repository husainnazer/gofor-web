import React, { Component } from 'react'
import {Link} from 'react-router-dom';

//Material UI stuff
import { 
    AppBar, 
    Toolbar, 
    Button, 
    Typography,
} from '@material-ui/core/'
import fire from '../firebase';
import 'firebase/auth'

class Navbar extends Component {
    constructor() {
        super()
        this.state = {
            authenticated: false
        }
    }

    onLogout = () => {
        fire
            .auth()
            .signOut()
    }

    componentDidMount() {
        fire.auth().onAuthStateChanged(user => {
            if(user) {
                this.setState({authenticated: true})
            } else {
                this.setState({authenticated: false})
            }
        })
        console.log(this.state.authenticated)
    }

    render() {
        if(!this.state.authenticated) {
            return (
                <div>
                    <AppBar position='fixed'>
                        <Toolbar>
                            <Typography component={Link} to='/' className='title' variant='h4' color='inherit' >
                                GoFor
                            </Typography>
                            <div className='nav-container'>
                                <Button color='inherit' component={Link} to='/login' >
                                    Login
                                </Button>
                                <Button style={{marginLeft: 10}} variant='outlined' color='inherit' component={Link} to='/login' >
                                    Post
                                </Button>
                            </div>
                        </Toolbar>
                    </AppBar>
                </div>
            );
        } else {
            return (
                <div>
                    <AppBar position='fixed'>
                        <Toolbar>
                            <Typography component={Link} to='/' className='title' variant='h4' color='inherit' >
                                GoFor
                            </Typography>
                            <div className='nav-container'>
                                <Button onClick={this.onLogout} color='inherit' component={Link} to='/' >
                                    Logout
                                </Button>
                                <Button style={{marginLeft: 10}} variant='outlined' color='inherit' component={Link} to='/post' >
                                    Post
                                </Button>
                            </div>
                        </Toolbar>
                    </AppBar>
                </div>
            );
        }
    }
}


export default Navbar;
