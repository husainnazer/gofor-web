import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import onClickOutside from 'react-onclickoutside'

//Material UI stuff
import { 
    AppBar, 
    Toolbar, 
    Button, 
    Typography,
    Menu,
    MenuItem
} from '@material-ui/core/'
import {Person} from '@material-ui/icons/';
import fire from '../firebase';
import 'firebase/auth'

class Navbar extends Component {
    constructor() {
        super()
        this.state = {
            authenticated: false,
            menuOpen: false,
            menuPosition: null
        }
    }

    onLogout = () => {
        fire.auth().signOut()
    }

    componentDidMount() {
        fire.auth().onAuthStateChanged(user => {
            if(user) {
                this.setState({authenticated: true})
            } else {
                this.setState({authenticated: false})
            }
        })
    }

    handleClickOutside = () => {
        this.setState({menuOpen: false})
    }

    handleMenuClick = (event) => {
        this.setState({menuOpen: true})
        this.setState({menuPosition: event.currentTarget})
    }

    render() {
        const { menuOpen, menuPosition } = this.state
        if(!this.state.authenticated) {
            return (
                <div>
                    <AppBar position='fixed'>
                        <Toolbar>
                            <Typography component={Link} to='/' className='title' variant='h4' color='inherit' >
                                GoFor
                            </Typography>
                            <div className='nav-container'>
                                <Button 
                                    color='inherit' 
                                    component={Link} 
                                    to={{
                                        pathname: '/login',
                                        state: {authenticatedToPost: true}
                                    }} 
                                >
                                    Login
                                </Button>
                                <Button 
                                    style={{marginLeft: 10}} 
                                    variant='outlined' 
                                    color='inherit' 
                                    component={Link} 
                                    to={{
                                        pathname: '/post',
                                        state: {authenticatedToPost: false}
                                    }}
                                >
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
                                <Button onClick={this.handleMenuClick} color='inherit' >
                                    <Person />
                                </Button>
                                <Menu
                                    id="simple-menu"
                                    anchorEl={menuPosition}
                                    keepMounted
                                    open={menuOpen ? true : false}
                                >
                                    <MenuItem >Profile</MenuItem>
                                    <MenuItem >My account</MenuItem>
                                    <MenuItem onClick={this.onLogout} component={Link} to='/' >Logout</MenuItem>
                                </Menu>
                                <Button 
                                    style={{marginLeft: 10}} 
                                    variant='outlined' 
                                    color='inherit' 
                                    component={Link} 
                                    to= {{
                                        pathname: '/post',
                                        state : {
                                            authenticatedToPost: true,
                                            authenticated: true
                                        }
                                    }}
                                >
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


export default onClickOutside(Navbar);
