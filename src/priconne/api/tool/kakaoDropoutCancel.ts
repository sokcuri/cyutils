/* eslint-disable @typescript-eslint/camelcase */
import { PcrZatFailedError, PcrResultNotOkError } from '../../Error';
import { ApiService, ApiResponseBase } from '../../ApiService';

import EndPoint from '../../EndPoint';
import Auth from '../../Auth';
import Host from '../../Host';

import pcrConfig from '../../../config/pcr.json';

interface Request {
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

function makeRequest(obj: { [name: string]: string | number }): Request {
  return {
    viewer_id: obj.viewerId as string,
    kakao_player_id: obj.playerId as string,
  }
}

export type KakaoDropoutCancelResp = Response & ApiResponseBase;

export async function KakaoDropoutCancel(auth: Auth): Promise<KakaoDropoutCancelResp> {
  const { viewerId, playerId } = auth;
  const url = Host.Live + EndPoint.Tool_KakaoDropoutCancel;
  const request = makeRequest({ ...pcrConfig, viewerId, playerId });

  const response = await ApiService.Post<Request, Response, {}>(url, request, {}, auth);

  if (response.data.isSuccess === 'zatfalse') {
    throw new PcrZatFailedError(JSON.stringify(response));
  }

  if (response.data_headers.result_code !== 1) {
    throw new PcrResultNotOkError(JSON.stringify(response));
  }

  auth.UpdateSID(response.data_headers.sid);

  return response;
}
