import React, { useState, useEffect, Fragment } from 'react'
import { commerce } from './lib/commerce'
import { Products, Navbar, Cart, Checkout } from './components'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [order, setOrder] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchProducts = async () => {
        const { data } = await commerce.products.list(); // or response may be without curlybrackets
      
        setProducts(data);
    }

    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve())
    }

    const handleAddToCart = async (productId, quantity) => {
        const { cart } = await commerce.cart.add(productId, quantity)
     
        setCart(cart)
    }

    const handleUpdateCartQty = async (productId, quantity) => {
        const { cart } = await commerce.cart.update(productId, { quantity })
    
        setCart(cart)
    }

    const handleRemoveFromCart = async (productId) => {
        const { cart } = await commerce.cart.remove(productId)
     
        setCart(cart)
    }

    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty();
      
        setCart(cart)
    }

    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
           
            setOrder(incomingOrder);
            refreshCart();
        } catch (error) {
            setErrorMessage(error.data.error.message)
        }
    }

    const refreshCart = async () => {
        const newCart = await commerce.cart.refresh();
     
        setCart(newCart);
    }

    useEffect(() => {
        fetchProducts();
        fetchCart();
    }, [])

    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items}/>
                <Routes>
                    <Route exact path='/'>
                        <Route exact path='/' element={
                            <Products 
                                products={products} 
                                onAddToCart={handleAddToCart}
                            />}
                        />
                    </Route>
                    <Route exact path='/cart'>
                        <Route exact path='/cart' element={
                            <Cart 
                                cart={cart}
                                handleUpdateCartQty={handleUpdateCartQty}
                                handleRemoveFromCart={handleRemoveFromCart}
                                handleEmptyCart={handleEmptyCart}
                            />
                        }/>     
                    </Route>
                    <Route exact path="/checkout" element={
                        <Checkout 
                            cart={cart} 
                            order={order} 
                            handleCaptureCheckout={handleCaptureCheckout} 
                            errorMessage={errorMessage} 
                        />}>
                    </Route>
                </Routes>
            </div>
        </Router>
    )
}

export default App
