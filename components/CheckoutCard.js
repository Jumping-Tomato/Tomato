import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


export default function CheckoutCard({title, subtitle, text, buttonText, accessLevel, handleClick}) {
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
            <Button variant="primary" onClick={handleClick} value={accessLevel}>{buttonText}</Button> :
            <>
                <hr className='invisible'/>
            </>            
        }
      </Card.Body>
    </Card>
  );
}