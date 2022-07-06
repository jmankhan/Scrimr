import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button, Container, Icon, Loader, Message } from "semantic-ui-react";
import API from "../api";

const ConfirmCode = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const confirmCode = async (code) => {
      try {
        setLoading(true);
        await API.confirmCode(code);
        navigate("/");
      } catch (err) {
        setError("Invalid code.");
      } finally {
        setLoading(false);
      }
    };

    if (params.get("code")) {
      confirmCode(params.get("code"));
    } else {
      navigate("/");
    }
  }, []);

  return (
    <>
      {loading && <Loader active />}
      {!loading && error && (
        <Container style={{ marginTop: "3em" }}>
          <Message>{error}</Message>
          <Link to="/">
            <Button primary size="huge">
              Go Home
              <Icon name="right arrow" />
            </Button>
          </Link>
        </Container>
      )}
    </>
  );
};

export default ConfirmCode;
