import React, { useState, useEffect } from 'react';
import Pluralize from 'pluralize';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Link from 'next/link';
import Cart, { cartEvents, getPreviousDonation } from '../cart/Cart';
import NominateBtn from './NominateBtn';
import Icons from '../icons';
import { formatAmountForDisplay } from '../../utils/currency';
import Qf from '../../utils/qf';
import Currency from '../Currency';

const CollectiveCard = ({
  collective, active, nominate, session, nominations, nominated, user, donateConfig, ended, 
}) => {
  const {
    name, description, imageUrl, slug, website, githubHandle, totals,
  } = collective;
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    setInCart(Cart.collectives ? Cart.collectives[collective._id] : 0);
    cartEvents.on('cartChange', () => setInCart(Cart.collectives[collective._id]));
  }, []);

  const truncate = (input, length) => (input.length > length ? `${input.substring(0, length)}...` : input);
  const disbursments = session?.disbursments ? session.disbursments[slug] : {matched:0, total:0, donations:0}; 
  return (
    <Card className="collective-card" id={`collective-${slug}`}>
      <Card.Header style={{ minHeight: '110px' }}>
        <Row className="align-items-center">
          <Col xs={2} md={3}>
            { imageUrl ? <Image width="50" height="50" src={imageUrl} roundedCircle fluid /> : null }
          </Col>
          <Col>
            <Card.Title>
              <Link href={`/collective/${slug}`}>{truncate(name, 20)}</Link>
            </Card.Title>
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
        <div className="text-center small" style={{ margin: '10px 0 -10px 0' }}>
          {(active && !ended) && totals?.donations?.length ? (
            <>
              Raised <span className="text-fat">{formatAmountForDisplay(totals.amount)}</span> + 
              est. <span className="match">{formatAmountForDisplay(totals.donations.reduce((total, amount) => total + Qf.calculate(amount), 0))}</span> match 
              from <span className="text-fat">{totals.donations.length}</span> {Pluralize('donor', totals.donations.length)}
            </>
          ) : null }  
  
          {nominate ? (
            <span>
              {nominations 
                ? (<b>{nominations} {Pluralize('nominations', nominations)} ❤️️</b>)
                : 'Be the first to nominate ❤️'}
            </span>
          ) : null}     
 
        </div>

      </Card.Header>
      <Card.Body>
        <Card.Text className="text-center" style={{ maxHeight: '80px', overflow: 'hidden' }}>
          {ended && totals.donations.length > 0 ? (
            <div className="text-center">
              <div>🎉
                <span className="match display-4">
                  <Currency value={disbursments.total} floor />
                </span>🎉
              </div>
              <b><Currency value={disbursments.donation} floor /></b> +&nbsp;
              <b className="text-success"><Currency value={disbursments.matched} floor /></b> match from&nbsp;
              <b>{totals.donations.length}</b> {Pluralize('donor', totals.donations.length)}

            </div>
          ) : description } 
        </Card.Text>

      </Card.Body>
      <Card.Footer>
        { active && getPreviousDonation(collective._id) ? (
          <div className="text-center small" style={{ margin: '-20px 0 5px 0' }}>
            You donated&nbsp;
            <span className="text-fat"> 
              {formatAmountForDisplay(Cart.previousDonations[collective._id])}
            </span>&nbsp;
            for a&nbsp;
            <span className="match"> 
              {formatAmountForDisplay(Qf.calculate(Cart.previousDonations[collective._id]))}
            </span> match
          </div>
        ) : null }

        <Row className="no-gutters">
          <Col xs={7}>
            {nominate ? (
              <NominateBtn
                mini
                block
                nominations={nominations} 
                user={user}
                session={session}
                collective={collective}
                nominated={nominated}
              />

            ) : null}
            {active ? (
              <>
                { !inCart ? (
                  <Button block variant="outline-primary" onClick={() => Cart.addItem(collective, donateConfig.def)}>
                    <Icons.Cart size={18} /> Add to cart
                  </Button>
                ) : (
                  <Button block variant="primary" onClick={() => Cart.show(collective._id)}>
                    <Badge className="round" variant="danger">{formatAmountForDisplay(inCart)}</Badge>&nbsp;
                    <span className="d-none d-sm-inline">Open</span> <Icons.Cart size={18} /> 
                  </Button>
                )}
              </>
            ) : null}
          </Col>
          <Col>
            <Link href={`/collective/${slug}`}>
              <Button block variant={active || nominate ? 'link' : 'outline-primary'}>read&nbsp;more</Button>
            </Link>
          </Col>
        </Row>

      </Card.Footer>
    </Card>
  );
};

export default CollectiveCard;
