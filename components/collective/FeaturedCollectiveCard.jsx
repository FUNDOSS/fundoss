import React, { useState, useEffect } from 'react';
import Pluralize from 'pluralize';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Link from 'next/link';
import Cart, { cartEvents } from '../cart/Cart';
import Icons from '../icons';
import { formatAmountForDisplay } from '../../utils/currency';
import Qf from '../../utils/qf';

const FeaturedCollectiveCard = ({ collective }) => {
  const {
    name, description, imageUrl, slug, website, githubHandle, totals
  } = collective;
  const [inCart, setInCart] = useState(false);
  const [amount, setAmount] = useState(30);
  useEffect(() => {
    setInCart(Cart.collectives[collective._id]);
    cartEvents.on('cartChange', () => setInCart(Cart.collectives[collective._id]));
  }, []);

  return (
    <Card className="collective-card" id={`collective-${slug}`}>
      <Card.Header>
      <Row>
          <Col xs={2} md={3}>
            { imageUrl ? <Image src={imageUrl} roundedCircle fluid /> : null }
          </Col>
          <Col>
            <Card.Title style={{ maxHeight: '60px' }}><Link href={`/collective/${slug}`}>{name}</Link></Card.Title>
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

      </Card.Header>
      <Card.Body>
      <div className="text-center small" style={{margin:'-20px 0 20px'}}>
        {totals?.donations ? (
          <>
          Raised <span className="text-fat">{formatAmountForDisplay(totals.amount)}</span>&nbsp;
          from <span className="text-fat">{totals.donations}</span> {Pluralize('donor', totals.donations)}
          </>
        ) : null }

        </div>
              
        <Card.Text className="text-center" style={{ height: '100px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {description}
          <p>Every dollar you donate today is matched by a donation from our large-donor pool.</p>
        </Card.Text>
        
        <Row className="align-items-center">
            <Col xs={5}>
              <InputGroup className="cart-amount round text-fat text-success">
                <InputGroup.Prepend><InputGroup.Text>$</InputGroup.Text></InputGroup.Prepend>
                <Form.Control
                  size="lg"
                  value={amount}
                  type="number"
                  max={5000}
                  min={1}
                  onChange={(e) => {
                    const amt = e.currentTarget.value > 5000 ? 5000 : e.currentTarget.value;
                    setAmount(amt);
                  }}
                />
              </InputGroup>
            </Col>
            <Col className="text-center">
              <span className="lead">+</span>
            </Col>
            <Col xs={5} className="text-right">
              <div style={{ marginBottom: '-10px', fontSize: '1.8rem' }} className="text-fat text-success">
                {formatAmountForDisplay(Qf.calculate(amount), 'USD')}
              </div>
              <small>estimated match</small>
            </Col>
          </Row>
      </Card.Body>
      <Card.Footer>
        <Row className="no-gutters">
          <Col xs={7}>
            { !inCart ? (
              <Button block variant="outline-primary" onClick={() => Cart.addItem(collective, amount, true)}>
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

export default FeaturedCollectiveCard;
