/* eslint-disable @typescript-eslint/camelcase */
import { PcrResultNotOkError } from '../../Error';
import { ApiService, ApiResponseBase } from '../../ApiService';

import EndPoint from '../../EndPoint';
import Auth from '../../Auth';
import Host from '../../Host';

import pcrConfig from '../../../config/pcr.json';

export interface Request {
  clan_id: number;
  viewer_id: string;
  kakao_player_id: string;
}

export interface Response {
  data: {
    clan: {
      detail: {
        clan_id: number;
        leader_name: string;
        emblem: {
          emblem_id: number;
          ex_value: number;
        };
        leader_viewer_id: number;
        leader_favorite_unit: {
          id: number;
          unit_rarity: number;
          unit_level: number;
          promotion_level: number;
          skin_data: {
            icon_skin_id: number;
          };
        };
        clan_name: string;
        description: string;
        join_condition: number;
        activity: number;
        member_num: number;
        current_period_ranking: number;
        grade_rank: number;
      };
      member: [{
        viewer_id: number;
        name: string;
        emblem: {
          emblem_id: number;
          ex_value: number;
        };
        level: number;
        role: number;
        favorite_unit: {
          id: number;
          unit_rarity: number;
          unit_level: number;
          promotion_level: number;
          skin_data: {
            icon_skin_id: number;
          };
        };
        last_login_time: number;
        total_power: number;
        clan_point: number;
      }];
    };
    invite_id: number;
    server_error?: {
      status: number;
      title: string;
      message: string;
    };
  };
}

function makeRequest(obj: { [name: string]: string | number }): Request {
  return {
    clan_id: obj.clanId as number,
    viewer_id: obj.viewerId as string,
    kakao_player_id: obj.playerId as string,
  }
}

export type OthersInfoResp = Response & ApiResponseBase;

export async function OthersInfo(auth: Auth, clanId: number): Promise<OthersInfoResp> {
  const { viewerId, playerId } = auth;
  const url = Host.Live + EndPoint.Clan_OthersInfo;
  const request = makeRequest({ ...pcrConfig, clanId, viewerId, playerId });

  const response = await ApiService.Post<Request, Response, {}>(url, request, {}, auth);

  if (response.data_headers.result_code !== 1) {
    throw new PcrResultNotOkError(JSON.stringify(response));
  }

  auth.UpdateSID(response.data_headers.sid);

  return response;
}
