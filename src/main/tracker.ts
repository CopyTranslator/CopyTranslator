import { constants, isDebug } from "@/common/constant";
import { axios } from "@/common/translate/proxy";

// 1. 定义事件对象接口
interface AppEvent {
  type: string;
  key: string;
  version: string;
  count: number;
}

// 2. 配置项接口
interface TrackerConfig {
  endpoint: string; // 你的 Cloudflare Custom Domain 接口
  version: string;  // 当前软件版本
  syncInterval?: number; // 同步间隔（毫秒），默认 10 分钟
  threshold?: number;    // 累计多少条不同记录时触发同步，默认 50
}

export class UniversalTracker {
  private endpoint: string;
  private version: string;
  private syncInterval: number;
  private threshold: number;
  private buffer: Map<string, number>;
  private timer: NodeJS.Timeout | null = null;

  constructor(config: TrackerConfig) {
    this.endpoint = config.endpoint;
    this.version = config.version;
    this.syncInterval = config.syncInterval || 10 * 60 * 1000;
    this.threshold = config.threshold || 50;
    this.buffer = new Map<string, number>();

    this.init();
  }

  private init(): void {
    // 启动定时任务
    this.timer = setInterval(() => this.flush(), this.syncInterval);

    // 监听进程退出（仅限 Node 环境）
    process.on('beforeExit', () => this.flush());
  }

  /**
   * 核心追踪接口
   * @param type 事件类型，如 'translation', 'launch', 'heartbeat'
   * @param key 细分标识，如 'deepseek', 'startup'
   */
  public track(type: string, key: string = 'default'): void {
    const compositeKey = `${type}|${key}`;
    const currentCount = this.buffer.get(compositeKey) || 0;
    this.buffer.set(compositeKey, currentCount + 1);

    // 如果缓冲区条目过多，立即触发同步
    if (this.buffer.size >= this.threshold) {
      this.flush();
    }
  }

  /**
   * 手动或自动触发同步
   */
  public async flush(): Promise<void> {
    if (this.buffer.size === 0) return;

    // 拷贝并清空缓冲区
    const snapshot = Array.from(this.buffer.entries());
    this.buffer.clear();

    const events: AppEvent[] = snapshot.map(([compKey, count]) => {
      const [type, key] = compKey.split('|');
      return { type, key, version: this.version, count };
    });

    try {
      await this.sendRequest({ events });
    } catch (error) {
      // 这里的错误可以静默处理，或者尝试将数据重新塞回 buffer
      console.error('[Tracker] Sync failed:', error);
    }
  }

  private sendRequest(payload: { events: AppEvent[] }): Promise<void> {
    return axios
      .post(this.endpoint, payload, {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => undefined);
  }

  /**
   * 停止追踪器（清理定时器）
   */
  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

export const tracker = new UniversalTracker({
  endpoint: "https://analytics.hypercube.top",
  version: constants.version,
  syncInterval: isDebug ? 10 * 1000 : 5 * 60 * 1000, // 调试模式下 10 秒同步一次，正式环境 5 分钟同步一次
});
