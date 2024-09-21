export class SecUtil {
  static secToString(sec: number): string {
    let result = '';

    const totalMinutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    result = seconds.toString().padStart(2, '0');

    let hours = 0;
    if (totalMinutes > 0) {
      hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      result = minutes.toString().padStart(2, '0') + ':' + result;
    } else {
      return '0:00:' + result;
    }

    if (hours > 0) {
      result = hours + ':' + result;
    } else {
      return '0:' + result;
    }

    return result;
  }
}
