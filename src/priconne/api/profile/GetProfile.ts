/* eslint-disable @typescript-eslint/camelcase */
import { PcrResultNotOkError } from '../../Error';
import { ApiService, ApiResponseBase } from '../../ApiService';

import EndPoint from '../../EndPoint';
import Auth from '../../Auth';
import Host from '../../Host';

import pcrConfig from '../../../config/pcr.json';

export interface Request {
  target_viewer_id: number;
  viewer_id: string;
  kakao_player_id: string;
}

export interface Response {
  data: {
    user_info: {
      viewer_id: number;
      user_name: string;
      user_comment: string;
      team_level: number;
      team_exp: number;
      emblem: {
        emblem_id: number;
        ex_value: number;
      };
      arena_rank: number;
      arena_group: number;
      arena_time: number;
      grand_arena_rank: number;
      grand_arena_group: number;
      grand_arena_time: number;
      open_story_num: number;
      unit_num: number;
      total_power: number;
      tower_cleared_ex_quest_count: number;
      tower_cleared_floor_num: number;
      kakaoplayerid: string;
    };
    quest_info: {
      normal_quest: number[];
      hard_quest: number[];
    };
    clan_name: string;
    favorite_unit: {
      id: number;
      unit_rarity: number;
      unit_level: number;
      promotion_level: number;
      skin_data: {
        icon_skin_id: number;
      };
    };
    server_error?: {
      status: number;
      title: string;
      message: string;
    };
  };
}

function makeRequest(obj: { [name: string]: string | number }): Request {
  return {
    target_viewer_id: obj.targetId as number,
    viewer_id: obj.viewerId as string,
    kakao_player_id: obj.playerId as string,
  }
}

export type GetProfileResp = Response & ApiResponseBase;

export async function GetProfile(auth: Auth, targetId: number): Promise<GetProfileResp> {
  const { viewerId, playerId } = auth;
  const url = Host.Live + EndPoint.Profile_GetProfile;
  const request = makeRequest({ ...pcrConfig, targetId, viewerId, playerId });

  const response = await ApiService.Post<Request, Response, {}>(url, request, {}, auth);

  if (response.data_headers.result_code !== 1) {
    throw new PcrResultNotOkError(JSON.stringify(response));
  }

  auth.UpdateSID(response.data_headers.sid);

  return response;
}
