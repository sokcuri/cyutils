/* eslint-disable @typescript-eslint/camelcase */
import { PcrResultNotOkError } from '../../Error';
import { ApiService, ApiResponseBase } from '../../ApiService';

import EndPoint from '../../EndPoint';
import Auth from '../../Auth';
import Host from '../../Host';

import pcrConfig from '../../../config/pcr.json';

interface Request {
  message_id: number;
  tips_id_list: number[];
  is_first: number;
  gold_history: number;
  viewer_id: string;
  kakao_player_id: string;
}

interface Response {
  data: {
    unread_message_list: number[];
    have_clan_battle_reward: number;
    missions: number[];
    season_pack: unknown[];
    daily_reset_time: number;
    user_clan: unknown;
    have_clan_invitation: number;
    quest_list: number[];
    training_quest_count: {
      gold_quest: number;
      exp_quest: number;
    };
    training_quest_max_count: {
      gold_quest: number;
      exp_quest: number;
    };
    training_quest_pack_end_time: number;
    dungeon_info: unknown;
  };
}

function makeRequest(obj: { [name: string]: string | number }): Request {
  return {
    message_id: 1,
    tips_id_list: [],
    is_first: 1,
    gold_history: 0,
    viewer_id: obj.viewerId as string,
    kakao_player_id: obj.playerId as string,
  }
}

export type HomeIndexResp = Response & ApiResponseBase;

export async function Index(auth: Auth): Promise<HomeIndexResp> {
  const { viewerId, playerId } = auth;
const url = Host.Live + EndPoint.Home;
  const request = makeRequest({ ...pcrConfig, viewerId, playerId });

  const response = await ApiService.Post<Request, Response, {}>(url, request, {}, auth);

  if (response.data_headers.result_code !== 1) {
    throw new PcrResultNotOkError(JSON.stringify(response));
  }

  auth.UpdateSID(response.data_headers.sid);

  return response;
}
