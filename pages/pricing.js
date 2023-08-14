import Head from 'next/head'
import global from 'styles/Global.module.scss'
import { Topbar, Footer } from 'components'
import { Button, Card } from 'react-bootstrap';
export default function Pricing() {
  function handlePriceSelection(){

  }
  return (
    <>
      <Topbar />
      <div className={global.container}>
      <Head>
        <title>Pricing | Jumping Tomato</title>
        <meta name="description" content="Pricing Page" />
        <link rel="icon" href="/media/images/logo.svg" />
      </Head>

      <main className={global.main}>
        <div className='row mt-5'>
            <div className="col-3 text-center">
              <PriceCard 
                title={"$10/month"}
                subtitle={"bill every month"}
                text={"$10 in total"}
                buttonText={"GET STARTED"}
              />
            </div>
            <div className="col-3 text-center">
                <PriceCard 
                  title={"$7/month"}
                  subtitle={"bill every three months"}
                  text={"$21 in total"}
                  buttonText={"GET STARTED"}
              />
            </div>
            <div className="col-3 text-center">
                <PriceCard 
                  title={"$5/month"}
                  subtitle={"bill every six months"}
                  text={"$30 in total"}
                  buttonText={"GET STARTED"}
                />
            </div>
            <div className="col-3 text-center">
                <PriceCard 
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

function PriceCard({title, subtitle, text, buttonText, handleClick}) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>{ title }</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{ subtitle }</Card.Subtitle>
        <Card.Text>
          { text }
        </Card.Text>
        {
            buttonText ?  
            <Button variant="primary" href="/auth/register">{buttonText}</Button> :
            <>
                <hr className='invisible'/>
            </>            
        }
      </Card.Body>
    </Card>
  );
}