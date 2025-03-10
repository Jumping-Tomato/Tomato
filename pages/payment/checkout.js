import Head from 'next/head'
import global from 'styles/Global.module.scss'
import { Topbar, Footer, CheckoutCard } from 'components'
import { StripeCheckout } from 'helpers/Stripe';
import { useSession } from 'next-auth/react';

export default function CheckoutPage() {
    const { data: session } = useSession();
    function handlePriceSelection(event){
        const amount_in_cents = event.target.value;
        const email = session.user.email;
        StripeCheckout(amount_in_cents,email);
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
            <div className='row p-5'>
              <div className="col-8">
                <h4>
                  Select a subscription below to continue:
                </h4>
              </div>
            </div>
            <div className='row'>
                <div className="col-3 text-center">
                    <CheckoutCard 
                        title={"$10/month"}
                        subtitle={"bill every month"}
                        text={"$10 in total"}
                        buttonText={"Select"}
                        accessLevel={1000}
                        handleClick={handlePriceSelection}
                    />
                </div>
                <div className="col-3 text-center">
                    <CheckoutCard 
                        title={"$7/month"}
                        subtitle={"bill every three months"}
                        text={"$21 in total"}
                        buttonText={"Select"}
                        accessLevel={2100}
                        handleClick={handlePriceSelection}
                    />
                </div>
                <div className="col-3 text-center">
                    <CheckoutCard 
                        title={"$5/month"}
                        subtitle={"bill every six months"}
                        text={"$30 in total"}
                        buttonText={"Select"}
                        accessLevel={3000}
                        handleClick={handlePriceSelection}
                    />
                </div>
                <div className="col-3 text-center">
                    <CheckoutCard 
                        title={"7-day trials"}
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
  