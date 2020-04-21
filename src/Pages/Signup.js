import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, TextField, Button, Grid, CircularProgress } from '@material-ui/core/'
import { Link, Redirect } from 'react-router-dom';
import fire from '../firebase';
import 'firebase/auth'
import 'firebase/firestore'

const styles = {
    form: {
        textAlign: 'center'
    },
    pageTitle: {
        margin: '10px auto 10px auto',
        marginBottom: 50
    },
    textField: {
        margin: '10px auto 10px auto'
    },
    button: {
        marginTop: 20,
        position: 'relative'
    },
    customError: {
        color: 'red',
        fontSize: '0.8rem',
        marginTop: 10
    },
    progress: {
        position: 'absolute'
    }
}


class Signup extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            confirmPassword: '',
            // handle: '',
            userName: '',
            loading: false,
            authenticated: false,
            generalErrorMessage: null,
            emailErrorMessage: null,
            passwordErrorMessage: null,
            confirmPasswordErrorMessage: null,
            userNameErrorMessage: null
        }
    }

    handleSubmit = () => {
        this.setState({loading: true})
        const newUser = {
            email: this.state.email,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword,
            userName: this.state.userName
        }
        let userId;
        fire
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password)
            .then(data => {
                return data.user.updateProfile({
                    displayName: newUser.userName
                })
            })
            .then(() => {
                userId = fire.auth().currentUser.uid
                const userCredentials = {
                    userName: newUser.userName,
                    email: newUser.email,
                    createdAt: new Date().toISOString(),
                    userId: userId
                }
                fire.firestore()
                    .collection('users')
                    .doc(`${newUser.userName}`)
                    .set(userCredentials);
            })
            .catch(error => {
                if(this.state.email === '') {
                    this.setState({emailErrorMessage: 'Email must not be empty'})
                }  
                if(this.state.password === '') {
                    this.setState({passwordErrorMessage: 'Password must not be empty'})
                } 
                if(this.state.confirmPassword === '') {
                    this.setState({confirmPasswordErrorMessage: 'Password must not be empty'})
                }
                if(this.state.userName === '') {
                    this.setState({userNameErrorMessage: 'Handle must not be empty'})
                } 
                if(
                    this.state.email !== '' &&
                    this.state.password !== '' &&
                    this.state.confirmPassword !== '' &&
                    this.state.userName !== ''
                ) {
                    if(error.code === 'auth/invalid-email') {
                        this.setState({generalErrorMessage: 'Invalid email address'})
                    } else if(error.code === 'auth/weak-password') {
                        this.setState({generalErrorMessage: 'Your password must have at least 6 characters'})
                    } else {
                        this.setState({generalErrorMessage: error.code})
                    }
                }
                this.setState({loading: false})
            })
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
    
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    render() {
        const { classes } = this.props;
        const { 
            authenticated, 
            loading, 
            generalErrorMessage,
            emailErrorMessage,
            passwordErrorMessage,
            confirmPasswordErrorMessage,
            userNameErrorMessage
        } = this.state
        if(!authenticated) {
            return (
                <Grid container className={classes.form}>
                    <Grid item sm />
                    <Grid item sm>
                        <Typography variant='h2' className={classes.pageTitle}>
                            Signup
                        </Typography>
                            <TextField 
                                id='userName' 
                                name='userName' 
                                type='text' 
                                label='User Name' 
                                variant='outlined'
                                className={classes.textField} 
                                helperText={userNameErrorMessage}
                                error={userNameErrorMessage ? true : false}
                                value={this.state.userName}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField 
                                id='email' 
                                name='email' 
                                type='email' 
                                label='Email' 
                                variant='outlined'
                                className={classes.textField}
                                helperText={emailErrorMessage}
                                error={emailErrorMessage ? true : false}
                                value={this.state.email}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField
                                id='password'
                                name='password'
                                type='password'
                                label='Password'
                                variant='outlined'
                                className={classes.textField}
                                helperText={passwordErrorMessage}
                                error={passwordErrorMessage ? true : false}
                                value={this.state.password}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            <TextField 
                                id='confirmPassword' 
                                name='confirmPassword' 
                                type='password' 
                                label='Confirm Password' 
                                variant='outlined'
                                className={classes.textField}
                                helperText={confirmPasswordErrorMessage}
                                error={confirmPasswordErrorMessage ? true : false} 
                                value={this.state.confirmPassword}
                                onChange={this.handleChange}
                                fullWidth
                            />
                            {generalErrorMessage && (
                                <Typography variant='body2' className={classes.customError}>
                                    {generalErrorMessage}
                                </Typography>
                            )}
                            <Button 
                                onClick={this.handleSubmit}
                                disabled={loading}
                                variant='contained' 
                                color='primary' 
                                className={classes.button} 
                            >
                                Signup
                                {loading &&(
                                    <CircularProgress size={30} className={classes.progress} />
                                )}
                            </Button>
                            <br />
                            <small >
                                Have an account?  
                                <Link 
                                    to={{
                                        pathname: '/login',
                                        state: {authenticatedToPost: true}
                                    }} 
                                    style={{textDecoration: 'none', color: '#33c9dc'}}
                                >
                                    {` Login`}
                                </Link>
                            </small>
                    </Grid>
                    <Grid item sm />
                </Grid>
            )
        } else {
            return <Redirect to='/' />
        }
    }
}

export default (withStyles(styles)(Signup));
