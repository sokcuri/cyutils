import * as uuid from 'uuid';

export default class Auth {
  public randUUID: string;
  public udid: string;
  public shortUDID: number;
  public viewerId: string;
  public playerId: string;
  public sid: string;
  public zatExpiryTime: number;
  public zat: string;

  constructor(udid: string, playerId: string, zatExpiryTime: number, zat: string) {
    this.udid = udid;
    this.viewerId = '0';
    this.playerId = playerId;
    this.zatExpiryTime = zatExpiryTime;
    this.zat = zat;

    this.randUUID = uuid.v4();
    this.shortUDID = 0;
    this.sid = this.randUUID;
  }

  public UpdateSID(id: string): void {
    if (!id || id == '') return;
    this.sid = id;
  }

  public UpdateViewerID(id: string): void {
    if (!id || id == '') return;
    this.viewerId = id;
  }

  public UpdateShortUDID(id: number): void {
    if (!id) return;
    this.shortUDID = id;
  }
}
