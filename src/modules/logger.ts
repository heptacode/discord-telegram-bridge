import pc from 'picocolors';

export const log = {
  getTsp(): string {
    return new Date().toLocaleString('ko-KR', {
      timeZone: 'Asia/Seoul',
    });
  },
  // Error
  e(str: any): void {
    console.error(`[${this.getTsp()}] ${pc.red(str)}`);
  },
  // Warning
  w(str: any): void {
    console.warn(`[${this.getTsp()}] ${pc.yellow(str)}`);
  },
  // Info
  i(str: any): void {
    console.info(`[${this.getTsp()}] ${pc.cyan(str)}`);
  },
  // Success
  s(str: any): void {
    console.log(`[${this.getTsp()}] ${pc.green(str)}`);
  },
  // Verbose
  v(str: any): void {
    console.log(`[${this.getTsp()}] ${pc.white(str)}`);
  },
  // Debug
  d(str: any): void {
    console.debug(`[${this.getTsp()}] ${pc.blue(str)}`);
  },
};
