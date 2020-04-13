/* eslint-disable @typescript-eslint/camelcase */
import EndPoint from '../../EndPoint';
import pcrConfig from '../../../config/pcr.json';
import { ApiService } from '../../ApiService';
import Auth from '../../Auth';
import Host from '../../Host';

interface Request {
  carrier: string;
  agreement_ver: number;
  policy_ver: number;
  zat: string;
  app_type: number;
  campaign_data: string;
  campaign_sign: string;
  campaign_user: number;
  viewer_id: string;
  kakao_player_id: string;
}

interface Response {
  data: {
    isSuccess: 'zattrue' | 'zatfalse';
    now_viewer_id: number;
    is_set_transition_password: boolean;
    now_name: string;
    now_team_level: number;
    now_tutorial: boolean;
    transition_account_data: string[];
  };
}

interface Headers {
  UDID?: string;
}

function makeRequest(obj: { [name: string]: string | number }): Request {
  return {
    carrier: obj.carrier as string,
    agreement_ver: 0,
    policy_ver: 0,
    zat: obj.zat as string,
    app_type: 0,
    campaign_data: '',
    campaign_sign: '',
    campaign_user: 0,
    viewer_id: '0',
    kakao_player_id: obj.playerId as string,
  }
}

function makeHeaders(obj: { [name: string]: string }): Headers {
  return {
    UDID: obj.UDID
  }
}

export async function Signup2(auth: Auth): Promise<Response> {
  const { playerId, zat, randUUID } = auth;
  const url = Host.Live + EndPoint.Tool_Signup2;
  const request = makeRequest({ ...pcrConfig, playerId, zat });
  const headers = makeHeaders({ UDID: randUUID });

  const response = await ApiService.Post<Request, Response, Headers>(url, request, headers, auth);

  if (!response.data.isSuccess) {
    throw new Error(JSON.stringify(response));
  }

  auth.UpdateSID(response.data_headers.sid);
  auth.UpdateViewerID(response.data.now_viewer_id.toString());
  auth.UpdateShortUDID(response.data_headers.short_udid);

  return response;
}
