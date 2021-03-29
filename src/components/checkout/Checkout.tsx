import {
  Box,
  Button,
  Hidden,
  Link,
  makeStyles,
  MobileStepper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import swishLogo from "../../assets/swish.png";
import cardLogo from "../../assets/card.png";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import PersonalDetails from "./PersonalDetails";
import DeliveryOptions from "./DeliveryOptions";
import PaymentMethod from "./PaymentMethod";
import { CartContext } from "../context/CartContext";
import { resolve } from "node:path";
import OrderComfirmation from "./OrderComfirmation";
import GroupedButtons from "../header/CartIncrementer";
import fallback from "../../assets/bags/fallback.png";
import { Img } from "react-image";

function getSteps() {
  return [
    "Shopping Cart",
    "Personal Details",
    "Payment Options",
    "Order Confirmation",
  ];
}

function Checkout() {
  //Step counter
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  //Form states (cst details)
  const [fullName, setFullName] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [adress, setAdress] = useState<string>();
  const [zipCode, setZipCode] = useState<string>();
  const [country, setCountry] = useState<string>();
  const [city, setCity] = useState<string>();
  const [deliveryOption, setDeliveryOption] = useState<string>();

  const isFormValid =
    fullName &&
    phoneNumber &&
    deliveryOption &&
    email &&
    adress &&
    zipCode &&
    country &&
    city;

  // Payment state
  const [paymentOption, setPaymentOption] = useState<string>();
  const [nameOnCard, setNameOnCard] = useState<string>();
  const [cardNumber, setCardNumber] = useState<string>();
  const [cvcNumber, setCvcNumber] = useState<string>();
  const [giftCard, setGiftCard] = useState<string>();
  const [swishNumber, setSwishNumber] = useState(phoneNumber);
  const [isLoading, setIsLoading] = useState(false);

  const isCardValid = nameOnCard && cardNumber && cvcNumber;
  const isPaymentValid =
    paymentOption && (isCardValid || giftCard || swishNumber);

  // value clearing for payment methods (when user swaps from one method to another)
  function clearValues() {
    setCardNumber(undefined);
    setSwishNumber(undefined);
    setCvcNumber(undefined);
    setGiftCard(undefined);
  }
  // Styling
  const classes = useStyles();

  //get content of cart from context/ls
  const { cart, clearCart } = useContext(CartContext);
  const total = cart.reduce(
    (ack: number, item) => ack + item.quantity * item.price,
    0
  );
  const [payedProducts, setPayedProducts] = useState<any[]>();
  const [totalPayed, setTotalPayed] = useState<number>();
  // let payedProducts = [''];

  // changes to the stepper
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    setActiveStep(0);
  };

  //promise for "awaiting" payment validation
  const paymentPromise = () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  async function makePayment() {
    setIsLoading(true);
    setPayedProducts(cart);
    setTotalPayed(total);
    await paymentPromise();
    clearCart();
    handleNext();
  }

  //Cases for stepper
  //Each case is one step on the stepper
  function getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <Typography variant="h5" className={classes.centerFlex}>
              Products in cart
            </Typography>
            <Typography variant="body1" className={classes.centerFlex}>
              Total: {total}kr
            </Typography>
            <Box className={classes.cartContentWrapper}>
              {cart.length === 0 ? (
                <Typography className={classes.centerFlex} variant="h6">
                  Cart is empty
                </Typography>
              ) : null}
              {cart.map((product: any) => (
                <Box className={classes.cartContent}>
                  <Link href={`/products/${product.name}`}>
                    <Img
                      src={[product.preview, fallback]}
                      width="100rem"
                      height="100rem"
                    />
                  </Link>
                  <div className={classes.productInfo}>
                    <Typography variant="body1">{product.name}</Typography>
                    <Typography variant="body2">
                      Price: {product.price}
                    </Typography>
                    <GroupedButtons product={product} />
                  </div>
                </Box>
              ))}
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <Box>
              <PersonalDetails
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
                adress={adress}
                setAdress={setAdress}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                zipCode={zipCode}
                setZipCode={setZipCode}
                country={country}
                setCountry={setCountry}
                city={city}
                setCity={setCity}
              />
              <Box>
                <DeliveryOptions
                  deliveryOption={deliveryOption}
                  setDeliveryOption={setDeliveryOption}
                />
              </Box>
            </Box>
          </>
        );
      case 2:
        return (
          <PaymentMethod
            deliveryOption={deliveryOption}
            setPaymentOption={setPaymentOption}
            setSwishNumber={setSwishNumber}
            setNameOnCard={setNameOnCard}
            setCardNumber={setCardNumber}
            setCvcNumber={setCvcNumber}
            setGiftCard={setGiftCard}
            paymentOption={paymentOption}
            phoneNumber={phoneNumber}
            fullName={fullName}
            total={total}
            clearValues={clearValues}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <OrderComfirmation
            name={fullName}
            adress={adress}
            phoneNumber={phoneNumber}
            zipCode={zipCode}
            country={country}
            city={city}
            email={email}
            payedProducts={payedProducts}
            deliveryOption={deliveryOption}
            total={totalPayed}
          />
        );
      default:
        return "Unknown stepIndex";
    }
  }

  return (
    <Box className={classes.root}>
      <Hidden only={"xs"}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Hidden>

      <Box>
        {activeStep === steps.length ? (
          <Box>
            <Typography>All steps completed</Typography>
            <Box className={classes.buttonWrapper}>
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box>{getStepContent(activeStep)}</Box>
            <Box className={classes.buttonWrapper}>
              <Button
                disabled={activeStep === 0 || activeStep === 3}
                onClick={handleBack}
              >
                Back
              </Button>
              {activeStep === 0 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={cart.length === 0}
                >
                  {activeStep === steps.length - 1 ? "Error" : "Next"}
                </Button>
              ) : null}
              {activeStep === 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isFormValid}
                >
                  {activeStep === steps.length - 1 ? "Error" : "Next"}
                </Button>
              ) : null}
              {activeStep === 2 ? (
                <Button
                  variant="contained"
                  onClick={makePayment}
                  disabled={!isPaymentValid}
                >
                  {activeStep === steps.length - 1 ? "Error" : "Next"}
                </Button>
              ) : null}
              {activeStep === 3 ? (
                <Link href="/#">
                  <Button variant="contained">
                    {activeStep === steps.length - 1
                      ? "Continue shopping"
                      : "Error"}
                  </Button>
                </Link>
              ) : null}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "0 10rem",
    marginTop: "8.5rem",
    height: "50rem",
    // border: "solid 2px black",
    position: "relative",
    [theme.breakpoints.down("md")]: {
      padding: 0,
      height: "auto",
    },
  },
  mobileStepper: {
    overflowX: "auto",
    width: "auto",
    margin: 0,
  },
  buttonWrapper: {
    position: "absolute",
    display: "flex",
    bottom: "-2rem",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      position: "relative",
      width: "auto",
      marginTop: "1rem",
    },
  },
  contentWrapper: {
    display: "flex",
    justifyContent: "center",
    margin: "3rem",
    flexDirection: "row",
  },
  flexColumn: {
    flexDirection: "column",
    display: "flex",
  },
  centerFlex: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentMethodWrapper: {
    width: "15rem",
    height: "8rem",
    border: "solid 1px black",
    margin: "1rem",
    padding: "2rem",
    borderRadius: 5,
  },
  paymentLogoSize: {
    width: "15rem",
    height: "8rem",
  },
  cartContentWrapper: {
    overflow: "auto",
    height: "30rem",
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey",
      border: " 4px solid transparent",
      borderRadius: "8px",
      backgroundClip: "padding-box",
    },
    [theme.breakpoints.down("md")]: {
      height: "100%",
    },
  },
  cartContent: {
    margin: "1rem 2rem",
    display: "flex",
  },
  productInfo: {
    marginLeft: "1rem",
  },
}));
export default Checkout;
