import Header from "./header/Header";
import Footer from "./footer/Footer";
import Hero from "./hero/Hero";
import Promotion from "./content/Promotion";
import Catalogue from "./catalogue/Catalogue";
import { Route } from 'react-router-dom';
import ProductView from './product/ProductView';
import {useState} from 'react';

function Layout() {

  const[productDetail,setProductDetail] = useState<object>()

  function productDetails(value: object){
      setProductDetail(value)
  }

    return (
      <div>
            <Route exact path="/">
              <Header />
              <Hero />
              <Promotion />
              <Catalogue 
                getProduct={productDetails}
              />
              <Footer />
            </Route>
            <Route path="/:name">
                <ProductView productView={productDetail}/>
            </Route>
      </div>
    );
}

export default Layout;


