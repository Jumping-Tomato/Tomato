import Head from 'next/head'
import global from 'styles/Global.module.scss'
import { Topbar, Footer, PricingCard } from 'components'
import { StripeCheckout } from 'helpers/Stripe';
 

export default function CheckoutPage() {
    function handlePriceSelection(event){
        const accessLevel = event.target.value;
        StripeCheckout(accessLevel);
    }
    return (
      <>
        <Topbar />
        <div className={global.container}>
          <Head>
            <title>Checkout Page</title>
            <meta name="checkout" content="Checkout" />
            <link rel="icon" href="/media/images/logo.svg" />
          </Head>
  
          <main className={global.main}>
            <div className='row' style={{ marginTop: "10%"}}>
                <div className="col-3 text-center">
                    <PricingCard 
                        title={"$10/month"}
                        subtitle={"bill every month"}
                        text={"$10 in total"}
                        buttonText={"Select"}
                        accessLevel={1}
                        handleClick={handlePriceSelection}
                    />
                </div>
                <div className="col-3 text-center">
                    <PricingCard 
                        title={"$7/month"}
                        subtitle={"bill every three months"}
                        text={"$21 in total"}
                        buttonText={"Select"}
                        accessLevel={2}
                        handleClick={handlePriceSelection}
                    />
                </div>
                <div className="col-3 text-center">
                    <PricingCard 
                        title={"$5/month"}
                        subtitle={"bill every six months"}
                        text={"$30 in total"}
                        buttonText={"Select"}
                        accessLevel={1}
                        handleClick={handlePriceSelection}
                    />
                </div>
                <div className="col-3 text-center">
                    <PricingCard 
                        title={"7 days trials"}
                        subtitle={"Free"}
                        text={<>Please email sales: <b> support@jumpingtomato.com</b></>}
                    />
                </div>
            </div>
          </main>
        </div>
        <Footer />
      </>
    );
  }
  