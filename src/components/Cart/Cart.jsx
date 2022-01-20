import React from 'react'
import { Container, Typography, Button, Grid } from '@material-ui/core'
import useStyles from './styles';
import  CartItem  from './CartItem/CartItem';
import { Link } from 'react-router-dom';

const Cart = ({ cart , handleUpdateCartQty, handleRemoveFromCart, handleEmptyCart}) => {
    const classes = useStyles();
    console.log(cart)

    const EmptyCart = () => (
        <Typography variant="subtitle1">
            You have no items in your shopping cart, 
            <Link to="/" className={classes.link}>start adding some</Link>!
        </Typography>
    );

    const FilledCart = () => (
        <>
            <Grid container spacing={3}>
                {cart.line_items.map((item) => (
                    <Grid item xs={12} sm={4} key={item.id}>
                        {/* <div>{item.name}</div> */}
                        <CartItem item={item} handleUpdateCartQty={handleUpdateCartQty} handleRemoveFromCart={handleRemoveFromCart} />
                    </Grid>
                ))}
            </Grid>
            <div className={classes.cardDetails}>
                <Typography variant="h4">
                        {cart.subtotal.formatted_with_code}
                </Typography>
                <div>
                    <Button className={classes.emptyButton} size="large" type="button" variant="contained" color="secondary" onClick={handleEmptyCart}>Empty Cart</Button>
                    <Button component={Link} to="/checkout" className={classes.checkoutButton} size="large" type="button" variant="contained" color="primary">Checkout</Button>
                </div>
            </div>
        </>
    );

    if (!cart.line_items) return "Loading..."

    return (
       <Container>
           <div className={classes.toolbar} />
           <Typography className={classes.title} variant="h3" gutterBottom>Shopping Your Cart</Typography>
           { !cart.line_items.length ? <EmptyCart /> : <FilledCart /> }
       </Container>
    )
}

export default Cart