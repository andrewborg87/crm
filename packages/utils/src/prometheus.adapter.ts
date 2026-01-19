import { Injectable } from '@nestjs/common';
import { HealthCheckResult, HealthCheckStatus, HealthIndicatorStatus } from '@nestjs/terminus';

@Injectable()
export class PrometheusAdapter {
  /**
   * Convert a HealthCheckResult to a string which Prometheus can understand
   * @see https://prometheus.io/docs/instrumenting/exposition_formats/
   * @param result The result of the health check to be converted
   */
  convert(result: HealthCheckResult): string {
    let conversion = '';

    conversion += `# TYPE status gauge\n`;
    conversion += `status ${this.#getStatus(result.status)}\n\n`;

    if (!result?.details) {
      return conversion;
    }

    const processedDocs = new Set<string>([]);

    const keys = Object.keys(result.details).sort();
    keys.forEach((key) => {
      let name = key;
      if (key.match(/^[\w\W]+:\d+$/)) {
        name = key.replace(/:\d+$/, '');
      }

      const k = name
        .replace(/ /g, '_')
        .replace(/[^a-zA-Z0-9_:-]/g, '')
        .replace(/[-,:]/g, '_')
        .replace(/_+/g, '_')
        .toLowerCase();

      if (!processedDocs.has(k)) {
        conversion += `# TYPE ${k} gauge\n`;
        processedDocs.add(k);
      }

      conversion += `${k}`;

      if (Object.keys(result.details[key]).length === 1) {
        conversion += ` ${this.#getStatus(result.details[key].status)}\n\n`;
        return;
      }

      conversion += '{';
      for (const [k, v] of Object.entries(result.details[key])) {
        if (k === 'status') {
          continue;
        }
        if ('object' === typeof v) {
          conversion += `${k}="${JSON.stringify(v).replace(/"/gm, "'")}",`;
          continue;
        }

        conversion += `${k}="${v}",`;
      }

      conversion = conversion.slice(0, -1);
      conversion += '}';
      conversion += ` ${this.#getStatus(result.details[key].status)}\n\n`;
    });

    return conversion;
  }

  #getStatus(status: HealthIndicatorStatus | HealthCheckStatus): number {
    if (status && ['up', 'ok'].includes(status)) {
      return 1;
    }
    if (status && 'timeout' === (status as any)) {
      return -1;
    }

    return 0;
  }
}
