import React, { Component } from 'react'
import fire from '../firebase'
import 'firebase/firestore'
import { Card, CardMedia, CardContent, Typography, Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/styles'

const styles = {
    form: {
        textAlign: 'center'
    },
    photoCard: {
        height: 500,
        maxWidth: 630
    },
    photoImage: {
        height: 500,
    },
    priceCard: {
        height: 240,
        maxWidth: 315
    },
    priceImage: {
        height: 250,
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
}

class ProductDetails extends Component {
    constructor() {
        super();
        this.state = {
            productId: '',
            title: '',
            price: '',
            imageUrl: '',
            userHandle: '',
            email: '',
        }
    }

    componentDidMount() {
        const {productId} = this.props.location.state
        this.setState({productId: productId})
        fire.firestore()
            .collection('products')
            .doc(productId)
            .get()
            .then(data => {
                this.setState({
                    title: data.data().title,
                    price: data.data().price,
                    description: data.data().description,
                    imageUrl: data.data().imageUrl,
                    userHandle: data.data().userHandle
                })
                // fire.firestore()
                //     .collection('users')
                //     .doc(data.data().userHandle)
                //     .get()
                //     .then(data => {
                //         this.setState({email: data.data().email})
                //     })
            })
            
    }

    render() {
        const { classes } = this.props
        return(
            <Grid container className={classes.form}>
                <Grid item sm >
                    <Card className={classes.photoCard}>
                        <CardMedia
                            className={classes.photoImage}
                            image={this.state.imageUrl}
                            title="Contemplative Reptile"
                        />
                    </Card>
                </Grid>
                <Grid item sm >
                    <Card className={classes.priceCard} style={{marginLeft: 30}}>
                        <CardContent>
                            <Typography color='textSecondary' variant='overline'>Product Details</Typography>
                            <Typography variant='h5' style={{marginTop: 10}}>{this.state.title}</Typography>
                            {/* <Typography>{this.state.description}</Typography> */}
                            <Typography gutterBottom variant="h4" style={{marginTop: 5}}>
                                {`₹ ${this.state.price}/-`}
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card className={classes.priceCard} style={{marginLeft: 30, marginTop: 20}}>
                        <CardContent>
                            <Typography color='textSecondary' variant='overline'>Seller Details</Typography>
                            <Typography variant='h5' style={{marginTop: 10}}>{this.state.userHandle}</Typography>
                            <Typography gutterBottom variant="h6" style={{marginTop: 5}}>
                                {this.state.email ? this.state.email : 'no email'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(ProductDetails)