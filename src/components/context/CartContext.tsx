import {Component, createContext} from 'react';

interface IState {
    cart: any[]
}
interface ContextValue extends IState {
    addToCart: (product: any) => void;
}

export const CartContext = createContext<ContextValue>({
    cart: [],
    addToCart: () => {}
})
class CartProvider extends Component<{},IState> {
    state: IState = {
        cart: [],
    }

    addProductToCart = (product: any) => {
        const updateCart = [...this.state.cart, product]
        this.setState({cart: updateCart})
    }

    componentDidMount() {
        let cart = JSON.parse(localStorage.getItem('cart') || "[]");
        this.setState({ cart });
    }

    componentDidUpdate() {
        localStorage.setItem('cart', JSON.stringify(this.state.cart))
    }

    render() {
        return (
            <CartContext.Provider value={{
                cart: this.state.cart,
                addToCart: this.addProductToCart
            }}>
                {this.props.children}
            </CartContext.Provider>
        )
    }
}


export const CartConsumer = CartContext.Consumer
export default CartProvider;