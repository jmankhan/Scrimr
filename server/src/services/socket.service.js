import { queryUser } from '../services';
import { SCRIMREQUEST_STATUS, SOCKET_EVENTS } from '../utils/constants';

export const notifyUser = (req, event, data) => {
  const io = req.app.get('io');

  switch (event) {
    case SOCKET_EVENTS.GET_SCRIM:
      getScrim(io, data);
      break;
    case SOCKET_EVENTS.JOIN_SCRIM:
      joinScrim(io, data.scrim, data.scrimRequest, Number(req.userId));
      break;
    case SOCKET_EVENTS.JOIN_SCRIM_APPROVE:
      joinScrimApprove(io, Number(data.id), Number(data.userId));
      break;
  }
};

// deliver latest scrim data to subscribed users
const getScrim = (io, scrim) => {
  // io.to(scrim.id).emit({ [SOCKET_EVENTS.GET_SCRIM]: { scrim } });
};

// alert scrim owner someone wants to join
const joinScrim = async (io, scrim, scrimRequest, userId) => {
  const user = await queryUser(userId);
  // io.sockets.emit(scrim.hostId, { [SOCKET_EVENTS.JOIN_SCRIM]: { request: { id: scrimRequest.id, user } } });
};

// alert requestor that their request was approved
const joinScrimApprove = async (io, scrimRequestId, userId) => {
  // io.to(userId).emit({
  //   [SOCKET_EVENTS.JOIN_SCRIM_APPROVE]: { requestId: scrimRequestId, status: SCRIMREQUEST_STATUS.APPROVE },
  // });
};
