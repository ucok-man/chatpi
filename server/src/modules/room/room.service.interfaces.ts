export interface IRoomService {
  validateParticipantIds(ids: string[]): Promise<string[]>;
}
