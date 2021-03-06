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
import Cart, {
  cartEvents, calculateMatch, getPreviousDonation, getPreviousMatch, 
} from '../cart/Cart';
import Icons from '../icons';
import { formatAmountForDisplay } from '../../utils/currency';
import Qf from '../../utils/qf';
import DonationInput from '../cart/DonationInput';

const FeaturedCollectiveCard = ({ collective, active, session }) => {
  const {
    name, description, imageUrl, slug, website, githubHandle, totals,
  } = collective;

  if (session?.donateConfig) {
    const {
      min, max, def, choice, 
    } = session.donateConfig;
    const [inCart, setInCart] = useState(false);
    const [amount, setAmount] = useState(def);
    const previousDonation = getPreviousDonation(collective._id);
    
    useEffect(() => {
      setInCart(Cart.collectives[collective._id]);
      cartEvents.on('cartChange', () => setInCart(Cart.collectives[collective._id]));
    }, []);
  
    return (
      <Card className="collective-card" id={`collective-${slug}`}>
        <Card.Header>
          <Row>
            <Col xs={2} md={3}>
              { imageUrl ? <Image width="50" height="50" src={imageUrl} roundedCircle fluid /> : null }
            </Col>
            <Col>
              <Card.Title style={{ maxHeight: '60px' }}><Link href={`/collective/${slug}`}>{name}</Link></Card.Title>
              { website && website.indexOf('https://github.com') < 0 ? (
                <a variant="link" target="_blank" rel="noreferrer" href={website} style={{ marginRight: '10px' }}>
                  <Icons.Globe size={15} /> Website 
                </a>
              ) : null }
              { githubHandle ? (
                <a variant="link" target="_blank" rel="noreferrer" href={`https://github.com/${githubHandle}`}>
                  <Icons.Github size={15} /> Github
                </a>
              ) : null }
            </Col>
          </Row>
          <div className="text-center small" style={{ margin: '10px 0 -10px' }}>
            {totals?.donations?.length ? (
              <>
                Raised <span className="text-fat">{formatAmountForDisplay(totals.amount)}</span> + 
                est. <span className="match">{formatAmountForDisplay(totals.donations.reduce((total, amount) => total + Qf.calculate(amount), 0))}</span> match 
                from <span className="text-fat">{totals.donations.length}</span> {Pluralize('donor', totals.donations.length)}          
              </>
            ) : null }        
          </div>
        </Card.Header>
        <Card.Body>
                
          <Card.Text className="text-center">
            {description}
            
          </Card.Text>
          <p className="text-center">Every dollar you donate today is matched by a donation from our large-donor pool.</p>
          <Row className="align-items-center no-gutters">
            <Col xs={5}>
              <DonationInput 
                amount={amount}
                max={max}
                min={min}
                onChange={(amt) => setAmount(amt)}
              />
            </Col>
            <Col className="text-center">
              <span className="lead">+</span>
            </Col>
            <Col xs={5} className="text-right text-nowrap">
              <div style={{ marginBottom: '-10px' }} className="match big">
                {formatAmountForDisplay(calculateMatch(amount, collective._id))}
              </div>
              <small>estimated match</small> 
  
            </Col>
          </Row>
          { previousDonation ? (
            <div className="previous text-center">
              <div className="small">Your previous donations are taken into account for calculating this match</div>
              {formatAmountForDisplay(previousDonation)} + est.
              <span className="match">{formatAmountForDisplay(getPreviousMatch(collective._id))}</span> match
            </div>
          ) : null }
        </Card.Body>
        <Card.Footer>
          {active ? (
            <Row className="no-gutters">
              <Col xs={7}>
                {inCart != amount ? (
                  <Button block variant="outline-primary" onClick={() => Cart.addItem(collective, amount, false)}>
                    <Icons.Cart size={18} /> Add to cart
                  </Button>
                ) : (
                  <Button block variant="outline-primary" onClick={() => Cart.show(collective._id)}>
                    <Badge className="round" variant="danger">{formatAmountForDisplay(inCart)}</Badge>&nbsp;
                    <span className="d-none d-sm-inline">Open</span> <Icons.Cart size={18} /> 
                  </Button>
                )}
              </Col>
              <Col>
                <Button block variant="link"><Link href={`/collective/${slug}`}>Read more</Link></Button>
              </Col>
            </Row>
          ) : null }
        </Card.Footer>
      </Card>
    );
  }
  return ('no active session');
};

export default FeaturedCollectiveCard;
