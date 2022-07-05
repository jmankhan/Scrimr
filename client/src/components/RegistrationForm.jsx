import React, { useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Message,
  Segment,
} from "semantic-ui-react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../contexts/Auth";
import { NotificationManager } from "react-notifications";

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handlePasswordReveal = () => {
    setShowPassword(!showPassword);
  };

  const handleInput = (e, eventData) => {
    setData({ ...data, [e.target.name]: eventData.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { email, summonerName, password } = data;
      if (!email || !summonerName || !password) {
        setMessage("All fields are required");
      } else {
        const message = await auth.register({ email, summonerName, password });
        NotificationManager.success(message);
        navigate("/");
      }
    } catch (err) {
      setMessage(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Grid textAlign="center" style={{ height: "80vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h1" textAlign="center">
          Sign Up
        </Header>
        <Form size="large" error={!!message}>
          <Segment stacked>
            <Form.Field>
              <Input
                fluid
                name="email"
                label="Email"
                type="email"
                onChange={handleInput}
              />
            </Form.Field>
            <Form.Field>
              <Input
                name="summonerName"
                fluid
                label="Summoner Name"
                onChange={handleInput}
              />
            </Form.Field>
            <Form.Field>
              <Input
                name="password"
                fluid
                icon={
                  <Icon
                    name={showPassword ? "eye" : "eye slash"}
                    link
                    onClick={handlePasswordReveal}
                  />
                }
                iconPosition="right"
                label="Password"
                type={showPassword ? "text" : "password"}
                onChange={handleInput}
              />
            </Form.Field>
            <Button
              primary
              fluid
              size="large"
              onClick={handleSubmit}
              loading={isLoading}
            >
              Register
            </Button>
            <Message error header="Error" content={message} />
          </Segment>
        </Form>
        <Message>
          <Link to="/login">Login Instead</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default RegistrationForm;
