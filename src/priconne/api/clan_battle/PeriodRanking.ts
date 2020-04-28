/* eslint-disable @typescript-eslint/camelcase */
import { PcrResultNotOkError } from '../../Error';
import { ApiService, ApiResponseBase } from '../../ApiService';

import EndPoint from '../../EndPoint';
import Auth from '../../Auth';
import Host from '../../Host';

import pcrConfig from '../../../config/pcr.json';

export interface Request {
  clan_id: number;
  clan_battle_id: number;
  period: number;
  month: number;
  page: number;
  is_my_clan: number;
  is_first: number;
  viewer_id: string;
  kakao_player_id: string;
}

export interface Response {
  data: {
    my_clan_data: {
      clan_name: string;
      damage: number;
      emblem: {
        emblem_id: number;
        ex_value: number;
      };
      grade_rank: number;
      leader_favorite_unit: {
        id: number;
        promotion_level: number;
        skin_data: {
          icon_skin_id: number;
          sd_sikin_id: number;
          motion_id: number;
        };
        unit_rarity: number;
        unit_level: number;
      };
      leader_name: string;
      leader_viewer_id: number;
      member_num: number;
      rank: number;
    };
    period: number;
    period_ranking: [
      {
        clan_name: string;
        damage: number;
        emblem: {
          emblem_id: number;
          ex_value: number;
        };
        grade_rank: number;
        leader_favorite_unit: {
          id: number;
          promotion_level: number;
          skin_data: {
            icon_skin_id: number;
            sd_sikin_id: number;
            motion_id: number;
          };
          unit_rarity: number;
          unit_level: number;
        };
        leader_name: string;
        leader_viewer_id: number;
        member_num: number;
        rank: number;
      }
    ];
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
    clan_battle_id: obj.clanBattleId as number,
    period: obj.period as number,
    month: obj.month as number,
    page: obj.page as number,
    is_my_clan: obj.isMyClan as number,
    is_first: obj.isFirst as number,
    viewer_id: obj.viewerId as string,
    kakao_player_id: obj.playerId as string,
  }
}

export type PeriodRankingResp = Response & ApiResponseBase;

export async function PeriodRanking(auth: Auth, clanId: number, clanBattleId: number, period: number, month: number, page: number, isMyClan: number, isFirst: number): Promise<PeriodRankingResp> {
  const { viewerId, playerId } = auth;
  const url = Host.Live + EndPoint.ClanBattle_PeriodRanking;
  const request = makeRequest({ ...pcrConfig, clanId, clanBattleId, period, month, page, isMyClan, isFirst, viewerId, playerId });

  const response = await ApiService.Post<Request, Response, {}>(url, request, {}, auth);

  if (response.data_headers.result_code !== 1) {
    throw new PcrResultNotOkError(JSON.stringify(response));
  }

  auth.UpdateSID(response.data_headers.sid);

  return response;
}
