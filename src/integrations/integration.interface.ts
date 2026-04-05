export interface Integration {
  name: string;

  connect(config: any): Promise<void>;

  execute(action: string, payload: any): Promise<any>;
}
