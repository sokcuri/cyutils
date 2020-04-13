/* eslint-disable @typescript-eslint/camelcase */
import { PcrResultNotOkError } from '../../Error';
import { ApiService, ApiResponseBase } from '../../ApiService';

import EndPoint from '../../EndPoint';
import Auth from '../../Auth';
import Host from '../../Host';

import pcrConfig from '../../../config/pcr.json';

interface Request {
  carrier: string;
  viewer_id: string;
  kakao_player_id: string;
}

interface Response {
  data: {
    user_info: unknown;
    user_jewel: unknown;
    user_gold: unknown;
    user_list: unknown[];
    user_chara_info: unknown[];
    deck_list: unknown[];
    item_list: unknown[];
    user_equip: unknown[];
    shop: unknown;
    ini_setting: unknown;
    max_storage_num: number;
    campaign_list: number[];
    can_free_gacha: number;
    can_campaign_gacha: number;
    gacha_point_info: unknown;
    read_story_ids: number[];
    unlock_story_ids: number[];
    event_statuses: unknown[];
    sdg_start: number;
    sdg_end: number;
    user_my_party: number[];
    user_my_party_tab: number[];
    daily_reset_time: number;
    login_bonus_list: unknown;
    present_count: number;
    clan_like_count: number;
    dispatch_units: number[];
    clan_battle: unknown;
    voice: unknown[];
    qr: number;
    ddn: number;
    pa: number;
    as: number;
    gs: number;
    tq: number;
    sv: number;
    jb: number;
    tf: number;
    ue: number;
    em: number;
    bv: number;
    gl: number;
    ccb: number;
    pfm: number;
    tt: number;
  };
}

function makeRequest(obj: { [name: string]: string | number }): Request {
  return {
    carrier: obj.carrier as string,
    viewer_id: obj.viewerId as string,
    kakao_player_id: obj.playerId as string,
  }
}

export type LoadIndexResp = Response & ApiResponseBase;

export async function Index(auth: Auth): Promise<LoadIndexResp> {
  const { viewerId, playerId } = auth;
  const url = Host.Live + EndPoint.Load;
  const request = makeRequest({ ...pcrConfig, viewerId, playerId });

  const response = await ApiService.Post<Request, Response, {}>(url, request, {}, auth);

  if (response.data_headers.result_code !== 1) {
    throw new PcrResultNotOkError(JSON.stringify(response));
  }

  auth.UpdateSID(response.data_headers.sid);

  return response;
}
