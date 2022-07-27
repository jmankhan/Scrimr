import { getUser } from '../services';
import { SOCKET_EVENTS } from '../utils/constants';

export const notifyUser = (req, event, data) => {
  const socket = req.app.get('socket');

  switch (event) {
    case SOCKET_EVENTS.GET_SCRIM:
      getScrim(socket, data);
    case SOCKET_EVENTS.JOIN_SCRIM:
      joinScrim(socket, data, req.userId);
  }
};

// deliver latest scrim data to subscribed users
const getScrim = (socket, scrim) => {
  socket.emit(scrim.id, { [SOCKET_EVENTS.GET_SCRIM]: { scrim } });
};

// alert scrim owner someone wants to join
const joinScrim = async (socket, scrim, userId) => {
  const user = await getUser(userId);
  socket.emit(scrim.hostId, { [SOCKET_EVENTS.JOIN_SCRIM]: { request: { user } } });
};
