import React, { Component } from 'react'
import { Grid, Card, CardMedia, CardContent, CardActionArea, Typography } from '@material-ui/core/'
import fire from '../firebase'
import 'firebase/firestore'
import { withStyles } from '@material-ui/styles'
import { Link } from 'react-router-dom'

const styles = {
    card: {
        maxWidth: 345,
        marginBottom: 30
    },
    image: {
        height: 140
    },
    content: {
        padding: 25,
        objectFit: 'cover'
    }
}

class Home extends Component {
    constructor() {
        super()
        this.state = {
            allProducts: []
        }
    }

    componentDidMount() {
        fire.firestore()
            .collection('products')
            .orderBy('createdAt', 'desc')
            .get()
            .then((data) => {
                let Products = []
                data.forEach((doc) => {
                    Products.push({
                        productId: doc.id,
                        title: doc.data().title,
                        userHandle: doc.data().userHandle,
                        price: doc.data().price,
                        location: doc.data().location,
                        imageUrl: doc.data().imageUrl,
                        createdAt: doc.data().createdAt
                    })
                })
                this.setState({allProducts: Products})
            })
    }

    render() {
        const { classes } = this.props
        const { allProducts } = this.state
        return (
            <Grid container spacing={1} style={{ padding: 24 }} >
                {allProducts.map(product => (
                    <Grid key={product.productId} item xs={12} sm={6} lg={4} xl={3} >
                        <Link to={`/product/${product.productId}`} style={{textDecoration: 'none'}}>
                            <Card className={ classes.card } >
                                <CardActionArea>
                                    <CardMedia 
                                        image={product.imageUrl}
                                        title="Profile Image"
                                        className={classes.image}
                                    />
                                    <CardContent className={classes.content}>
                                        <Typography gutterBottom variant='h5' >₹ {product.price}/-</Typography>
                                        <Typography variant='body1' color='textSecondary' >{product.title}</Typography>
                                        <Typography variant='body2' color='textSecondary' >{product.location}</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        )
            // return <h1>Hello</h1>
    }
}

export default withStyles(styles)(Home);