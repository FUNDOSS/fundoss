import React, { useState, useEffect } from 'react';
import Pluralize from 'pluralize';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Link from 'next/link';
import Cart, { cartEvents } from '../cart/Cart';
import Icons from '../icons';
import { formatAmountForDisplay } from '../../utils/currency';
import Qf from '../../utils/qf';

const CollectiveCard = ({ collective }) => {
  const {
    name, description, imageUrl, slug, website, githubHandle, totals
  } = collective;
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    setInCart(Cart.collectives[collective._id]);
    cartEvents.on('cartChange', () => setInCart(Cart.collectives[collective._id]));
  }, []);

  return (
    <Card className="collective-card" id={`collective-${slug}`}>
      <Card.Header>
      <Row>
          <Col xs={2} md={3} style={{minHeight:'55px'}}>
            { imageUrl ? <Image src={imageUrl} roundedCircle fluid /> : null }
          </Col>
          <Col>
            <Card.Title><Link  href={`/collective/${slug}`}>{name}</Link></Card.Title>
            { website ? (
              <a variant="link" target="_blank" rel="noreferrer" href={website} style={{ marginRight: '10px' }}>
                <Icons.Globe size={15} /> website 
              </a>
            ) : null }
            <a variant="link" target="_blank" rel="noreferrer" href={`https://github.com/${githubHandle}`}>
              <Icons.Github size={15} /> github
            </a>
          </Col>
        </Row>
        <div className="text-center small" style={{margin:'10px 0 -20px'}}>
      {totals?.donations ? (
          <>
          Raised <span className="text-fat">{formatAmountForDisplay(totals.amount)}</span> + 
          est. <span className="text-fat text-success">{formatAmountForDisplay(Qf.calculate(totals.amount/totals.donations) * totals.donations )}</span> match 
          from <span className="text-fat">{totals.donations}</span> {Pluralize('donor', totals.donations)}
          </>
        ) : null }        
      </div>
      </Card.Header>
      <Card.Body style={{minHeight:'170px'}}>
        <Card.Text className="text-center" style={{maxHeight:'80px',overflow:'hidden'}}>
          {description}
        </Card.Text>

      </Card.Body>
      <Card.Footer>
        <Row className="no-gutters">
          <Col xs={7}>
            { !inCart ? (
              <Button block variant="outline-primary" onClick={() => Cart.addItem(collective, 20, true)}>
                <Icons.Cart size={18} /> Add to cart
              </Button>
            ) : (
              <Button block variant="primary" onClick={() => Cart.show(collective._id)}>
                <Icons.Check size={18} /> In cart <Badge variant="danger">{formatAmountForDisplay(inCart, 'USD')}</Badge>
              </Button>
            )}
          </Col>
          <Col>
            <Button block variant="link" href={`/collective/${slug}`}>Read more</Button>
          </Col>
        </Row>

      </Card.Footer>
    </Card>
  );
};

export default CollectiveCard;
