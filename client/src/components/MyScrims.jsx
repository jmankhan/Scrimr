import React, { useState, useEffect } from 'react';
import { NotificationManager } from 'react-notifications';
import { Card, Container, Loader } from 'semantic-ui-react';
import API from '../api';

const MyScrims = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getScrims = async () => {
      setLoading(true);
      const scrims = await API.getMyScrims();
      setData(scrims);
    };

    try {
      if (!data.length && !loading) {
        getScrims();
      }
    } catch (err) {
      NotificationManager.error('Error', err.response.data.error, 5000);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Container>
      {loading && <Loader />}
      {!loading &&
        data.length > 0 &&
        data.map((scrim) => (
          <Card>
            <Card.Content>
              <Card.Header>Scrim Name - {scrim.name}</Card.Header>
              <Card.Description>Scrim Content</Card.Description>
            </Card.Content>
          </Card>
        ))}
    </Container>
  );
};

export default MyScrims;
