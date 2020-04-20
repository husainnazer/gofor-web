import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, TextField, Button, Grid, CircularProgress } from '@material-ui/core/'
import { Link, Redirect } from 'react-router-dom';
import fire from '../firebase'
import 'firebase/auth'

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

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            loading: false,
            authenticated: false,
            generalErrorMessage: null,
            emailErrorMessage: null,
            passwordErrorMessage: null
        }
    }

    handleSubmit = () => {
        this.setState({loading: true})
        const { email, password } = this.state
        fire
            .auth()
            .signInWithEmailAndPassword(email, password)
            .catch(error => {
                if(this.state.email === '') {
                    this.setState({emailErrorMessage: 'Email must not be empty'})
                }  
                if(this.state.password === '') {
                    this.setState({passwordErrorMessage: 'Password must not be empty'})
                } 
                if(this.state.email !== '' && this.state.password !== '') {
                    if(error.code === 'auth/invalid-email') {
                        this.setState({generalErrorMessage: 'Invalid email address'})
                    } else if(error.code === 'auth/wrong-password') {
                        this.setState({generalErrorMessage: 'You entered the wrong password'})
                    } else {
                        this.setState({generalErrorMessage: 'User not registered'})
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
        });
    };
    render() {
        const { classes } = this.props;
        const { authenticated, generalErrorMessage, emailErrorMessage, passwordErrorMessage, loading } = this.state
        if(!authenticated) {
            return (
                <Grid container className={classes.form}>
                    <Grid item sm />
                    <Grid item sm>
                        <Typography variant='h2' className={classes.pageTitle}>
                            Login
                        </Typography>
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
                            error={passwordErrorMessage ? true : false}
                            helperText={passwordErrorMessage}
                            value={this.state.password}
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
                            Login
                            {loading &&(
                                <CircularProgress size={30} className={classes.progress} />
                            )}
                        </Button>
                        <br />
                        <small>Don't have an account? <Link to='/signup' >sign up</Link></small>
                    </Grid>
                    <Grid item sm />
                </Grid>
            )
        } else {
            return <Redirect to='/' />
        }
    }
}

export default (withStyles(styles)(Login));
