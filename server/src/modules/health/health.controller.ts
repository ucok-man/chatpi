import { Config } from "../../config";

export class HealthController {
  constructor(private config: Config) {}

  ping() {
    return {
      status: "available",
      env: this.config.NODE_ENV,
      version: this.config.VERSION,
    };
  }
}
