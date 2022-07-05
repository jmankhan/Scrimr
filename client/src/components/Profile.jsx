import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import {
  Card,
  Container,
  Dropdown,
  Form,
  Header,
  Loader,
} from "semantic-ui-react";
import API from "../api";
import useAuth from "../contexts/Auth";

const roleOptions = [
  { text: "Top", value: "top" },
  { text: "Jungle", value: "jg" },
  { text: "Middle", value: "mid" },
  { text: "Marksman", value: "adc" },
  { text: "Support", value: "sup" },
  { text: "Fill", value: "fill" },
];
const Profile = () => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(auth.value.user);
  const [primaryRoleOptions, setPrimaryRoleOptions] = useState(roleOptions);
  const [secondaryRoleOptions, setSecondaryRoleOptions] = useState(
    roleOptions.filter((option) => option.value !== "fill")
  );

  useEffect(() => {
    setUser(auth.value.user);
    setLoading(false);
  }, [auth, auth.value]);

  const handleChangePassword = () => {
    NotificationManager.error("Error", "Coming soon", 5000);
  };

  const handleConnectSummoner = () => {};
  const handleDisconnectSummoner = () => {};

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await API.saveProfile(user);
      setUser(response.user);
      NotificationManager.success("Success", "Profile was saved");
    } catch (err) {
      NotificationManager.error("Error", err, 5000);
    } finally {
      setLoading(false);
    }
  };

  const recalculateRoleOptions = (primaryRole, secondaryRole) => {
    if (user) {
      setPrimaryRoleOptions(
        roleOptions.filter((role) => role.value !== secondaryRole)
      );
      setSecondaryRoleOptions(
        roleOptions.filter((role) => role.value !== primaryRole)
      );
    }
  };

  return (
    <div>
      {loading && <Loader />}
      {!loading && user && (
        <Container textAlign="left" style={{ marginTop: "5rem" }}>
          <Header textAlign="center">Profile</Header>
          <Form>
            <Card fluid>
              <Card.Content>
                <Card.Header>Contact</Card.Header>
                <Form.Input label="Email" value={user.email || ""} />
              </Card.Content>
            </Card>
            <Card fluid>
              <Card.Content>
                <Card.Header>Password</Card.Header>
                <Form.Button onClick={handleChangePassword}>
                  Change Password
                </Form.Button>
              </Card.Content>
            </Card>
            <Card fluid>
              <Card.Content>
                <Card.Header>Summoner</Card.Header>
                {user.summoner && (
                  <Form.Group>
                    <p style={{ marginTop: "auto" }}>{user.summoner.name}</p>
                    <Form.Button
                      label="&nbsp;"
                      variant="label-hidden"
                      onClick={handleDisconnectSummoner}
                    >
                      Disconnect
                    </Form.Button>
                  </Form.Group>
                )}
                {!user.summoner && (
                  <Form.Group>
                    <Form.Input label="Summoner" value={user.name ?? null} />
                    <Form.Button
                      label="&nbsp;"
                      variant="label-hidden"
                      onClick={handleConnectSummoner}
                    >
                      Connect
                    </Form.Button>
                  </Form.Group>
                )}
                <Form.Field>
                  <label>Roles</label>
                  <Dropdown
                    placeholder="Primary"
                    selection
                    options={primaryRoleOptions}
                    value={user.primaryRole}
                    onChange={(e, data) => {
                      setUser({ ...user, primaryRole: data.value });
                      recalculateRoleOptions(data.value, user.secondaryRole);
                    }}
                  />
                </Form.Field>
                <Form.Dropdown
                  placeholder="Secondary"
                  selection
                  options={secondaryRoleOptions}
                  value={user.secondaryRole}
                  onChange={(e, data) => {
                    setUser({ ...user, secondaryRole: data.value });
                    recalculateRoleOptions(user.primaryRole, data.value);
                  }}
                />
              </Card.Content>
            </Card>
            <Form.Button
              primary
              onClick={handleSave}
              style={{ float: "right" }}
            >
              Save
            </Form.Button>
          </Form>
        </Container>
      )}
    </div>
  );
};

export default Profile;
